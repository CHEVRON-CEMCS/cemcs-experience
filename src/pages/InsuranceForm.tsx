import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
// import { toast } from "@/hooks/use-toast";
import { Toaster, toast } from "sonner";
// import
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FormErrors {
  fullName?: string;
  occupation?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  insuranceType?: string;
}

const InsuranceForm = ({ cancelRedirectRoute = "/insurance" }) => {
  const router = useRouter();
  const { memberDetails, loginUser } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    occupation: "",
    email: "",
    phone_number: "",
    address: "",
    insuranceType: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = "";
    if (!value.trim()) {
      error = "This field is required";
    } else if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Invalid email address";
    } else if (name === "phone_number" && !/^\d+$/.test(value)) {
      error = "Phone number must contain only numbers";
    }
    return error;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    router.push(cancelRedirectRoute);
  };

  const handleSubmit = async () => {
    if (!memberDetails?.membership_number) {
      router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }
    if (loginUser?.userType === "erp") {
      toast.error("Not allowed");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
    }

    setIsSubmitting(true);

    try {
      const insuranceForm = {
        doctype: "Insurance Indicator",
        full_name: formData.fullName,
        occupation: formData.occupation,
        address: formData.address,
        email: formData.email,
        phone_number: formData.phone_number,
        insurance_type: formData.insuranceType,
      };

      const response = await axios.post(
        "/api/insurance-indicator",
        insuranceForm
      );

      if (response.status === 200) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Try again later");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 bg-gray-50">
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form Submitted Successfully!</DialogTitle>
            <DialogDescription>
              Your insurance indicator form has been received. We will contact
              you shortly.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                handleBack();
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto relative">
        <Button
          variant="ghost"
          className="absolute left-0 -top-12 md:left-4 md:top-4"
          onClick={handleBack}
        >
          ← Back
        </Button>

        <Card className="w-full mt-8 md:mt-0">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl md:text-2xl text-center">
              Insurance Indicator Form
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Personal Data Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">
                Personal Data
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    className="w-full"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formData.fullName}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    placeholder="Enter your occupation"
                    className="w-full"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formData.occupation}
                  />
                  {errors.occupation && (
                    <p className="text-sm text-red-500">{errors.occupation}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="Enter your phone number"
                    className="w-full"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formData.phone_number}
                  />
                  {errors.phone_number && (
                    <p className="text-sm text-red-500">
                      {errors.phone_number}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full"
                    value={formData.email}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your address"
                    className="w-full"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formData.address}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceType">Select Insurance Type</Label>
                  <select
                    id="insuranceType"
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-400"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formData.insuranceType}
                  >
                    <option value="">Select an option</option>
                    <option value="vehicle">Vehicle Insurance</option>
                    <option value="health">Health Insurance</option>
                    <option value="property">Property Insurance</option>
                  </select>
                  {errors.insuranceType && (
                    <p className="text-sm text-red-500">
                      {errors.insuranceType}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={handleBack}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Interest"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster expand={true} richColors position="bottom-center" />
    </div>
  );
};

export default InsuranceForm;
