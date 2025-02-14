import React, { useState, useEffect } from "react";
import { EPawnNav } from "../../components/EPawnNav";
import Footer from "../../components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuthStore } from "../../store/authStore";

const SubscriberRegistration: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { memberDetails, loginUser } = useAuthStore();

  const [formData, setFormData] = useState({
    full_name: "",
    employee_number: memberDetails?.membership_number,
    member_id: ``,
    fees: "",
    account_name: "",
    account_number: "",
    bank_name: "",
    payment_receipt: null as File | null,
    i_accept: false,
  });

  useEffect(() => {
    if (memberDetails?.membership_number) {
      setFormData((prev) => ({
        ...prev,
        employee_number: memberDetails.membership_number,
      }));
    }
  }, [memberDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "file" && files
          ? files[0]
          : type === "checkbox"
            ? checked
            : value,
    }));

    if (name === "employee_number" && memberDetails?.membership_number) {
      setFormData((prev) => ({
        ...prev,
        employee_number: memberDetails.membership_number,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!memberDetails?.membership_number) {
      router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }
    if (loginUser?.userType === "erp") {
      toast.error("Not allowed");
      setLoading(false);
      return;
    }
    try {
      if (!formData.i_accept) {
        toast.error("Please accept the Undertaking");
        return;
      }

      // First, upload the image if it exists
      let payment_receipt_url = "";
      if (formData.payment_receipt) {
        const formDataFile = new FormData();
        formDataFile.append("employee_number", memberDetails.membership_number);
        formDataFile.append("file", formData.payment_receipt);
        const uploadResponse = await axios.post("/api/upload", formDataFile);
        payment_receipt_url = uploadResponse.data.file_url;
      }

      // Then submit the form
      const submissionData = {
        ...formData,
        payment_receipt: payment_receipt_url,
        doctype: "Epawn Subscriber",
        docstatus: 0,
      };

      await axios.post("/api/epawn-subscriber", submissionData);

      toast.success("Registration successful!");
      router.push("/biddingproducts");
    } catch (error) {
      toast.error("Failed to register. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <EPawnNav />
      <div className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Subscriber Registration</CardTitle>
            <CardDescription>
              Register as a seller to list your products for bidding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    required
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Employee Number</label>
                  <Input
                    required
                    name="employee_number"
                    value={memberDetails?.membership_number}
                    onChange={handleInputChange}
                    placeholder="Enter your employee number"
                    readOnly
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Member ID</label>
                  <Input
                    required
                    name="member_id"
                    value={formData.member_id}
                    onChange={handleInputChange}
                    placeholder="Enter your member ID"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Fees</label>
                  <Input
                    required
                    type="number"
                    name="fees"
                    value={formData.fees}
                    onChange={handleInputChange}
                    placeholder="Enter fees amount"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Account Name</label>
                  <Input
                    required
                    name="account_name"
                    value={formData.account_name}
                    onChange={handleInputChange}
                    placeholder="Enter account name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Account Number</label>
                  <Input
                    required
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Bank Name</label>
                  <Input
                    required
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleInputChange}
                    placeholder="Enter bank name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Payment Receipt</label>
                  <Input
                    required
                    type="file"
                    name="payment_receipt"
                    onChange={handleInputChange}
                    accept="image/*"
                  />
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold">Undertaking</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>I will only sell items belonging to me</li>
                      <li>
                        I will never sell any illegal contraband or banned items
                      </li>
                      <li>
                        Any purchase of any of my item is solely my
                        responsibility to facilitate
                      </li>
                      <li>I will not sell any damaged item</li>
                      <li>
                        I am solely responsible for delivering my item to its
                        buyer
                      </li>
                    </ol>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      name="i_accept"
                      checked={formData.i_accept}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          i_accept: checked as boolean,
                        }))
                      }
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I understand and accept the above undertaking
                    </label>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
      <Toaster expand={true} richColors position="bottom-center" />
    </div>
  );
};

export default SubscriberRegistration;
