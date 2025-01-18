import React, { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useRouter } from "next/router";
import { AlertCircle, CreditCard, Wallet, DollarSign, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LoadingUi from "@/components/ui/loadingUi";
import axios from "axios";

interface CPayProps {
  amount: number;
  onclose: () => void;
}

const AddPaymentMethod: React.FC<CPayProps> = ({ amount, onclose }) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [tenure, setTenure] = useState(0);
  const { memberDetails } = useAuthStore();
  const { items, clearCart } = useCartStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const transactionFee = 100;
  const total = subtotal + transactionFee;

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "Payroll":
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case "Special Deposit":
        return <Wallet className="h-5 w-5 text-purple-500" />;
      case "Cash":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    setError(null);
    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      setError("Please select a payment method");
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (tenure <= 0 || tenure > 6) {
      setError("Tenure must be between 1 and 6 months");
      toast.error("Tenure must be between 1 and 6 months.");
      return;
    }

    if (!memberDetails?.membership_number) {
      router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }

    if (items.length <= 0) {
      // console.log("no items in cart");
      setError("NO ITEMS IN CART");
      return;
    }

    const orderData = {
      doctype: "Product Order",
      order_date: new Date().toISOString().split("T")[0],
      customer: memberDetails.membership_number,
      billing_address: "123 Main Street",
      shipping_address: "123 Main Street",
      payment_method: "CPay",
      payment_status: "Pending",
      currency: "NGN",
      items: items.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        amount: item.price * item.quantity,
      })),
      subtotal: subtotal,
      shipping_fee: transactionFee,
      tax_amount: 0,
      total_amount: amount,
    };

    setIsLoading(true);
    try {
      const loanResponse = await axios.post("/api/check-loan-status", {
        empno: memberDetails.membership_number,
      });

      console.log(loanResponse);

      const response = await axios.post("/api/c-pay", {
        empno: memberDetails?.membership_number,
        amount: total,
        tenor: tenure,
        payment_mode: paymentMethod,
      });

      if (response.data.message.Error === false) {
        const orderResponse = await axios.post("/api/product-order", orderData);
        if (orderResponse) {
          const orderDetails = {
            id: response.data.name,
            payment_method: orderData.payment_method,
            items: items,
            subtotal: subtotal,
            shipping_fee: transactionFee,
            total_amount: total,
            payment_status: "Pending",
          };
          setIsLoading(false);
          toast.success("Payment processed successfully!");
          await router.push({
            pathname: "/thankyou",
            query: { orderData: JSON.stringify(orderDetails) },
          });
          clearCart();
        } else {
          setIsLoading(false);
          console.log("Error");
        }
      } else {
        const fullErrorMessage = response?.data?.message?.Message;
        const userFriendlyMessage = fullErrorMessage.split(":")[0];
        toast.error(userFriendlyMessage);
        setError(userFriendlyMessage);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setError("Error processing payment");
      console.error(error);
    }
  };

  return (
    <>
      {/* Full-screen overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onclose}
      />

      {/* Modal container with improved mobile handling */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md mx-auto shadow-xl animate-in fade-in duration-300">
          {isLoading && <LoadingUi />}
          <CardHeader className="relative border-b px-4 py-4 sm:px-6">
            <button
              onClick={onclose}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <CardTitle className="text-xl sm:text-2xl font-bold">
              Add Payment Method
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            {error && (
              <Alert variant="destructive" className="mb-4 sm:mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 1 ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-1 sm:space-y-2">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                    Select Payment Method
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Choose your preferred payment method from the options below
                  </p>
                </div>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-2 sm:space-y-3"
                >
                  {["Payroll", "Special Deposit", "Cash"].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer
                        ${paymentMethod === method ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <RadioGroupItem value={method} className="sr-only" />
                      <div className="flex items-center space-x-3 flex-1">
                        {getMethodIcon(method)}
                        <span className="text-sm sm:text-base font-medium">
                          {method}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border-2 ml-2 flex items-center justify-center
                        ${paymentMethod === method ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}
                      >
                        {paymentMethod === method && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </label>
                  ))}
                </RadioGroup>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={onclose}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!paymentMethod}
                    className={`px-4 sm:px-6 py-2 rounded-lg text-white text-sm sm:text-base transition-colors
                      ${paymentMethod ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-1 sm:space-y-2">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                    Select Payment Tenure
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Choose a tenure period between 1 to 6 months
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tenure (Months)
                  </label>
                  <input
                    type="number"
                    value={tenure || ""}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter tenure (1-6)"
                    min={1}
                    max={6}
                  />
                  {tenure > 6 && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">
                      Tenure cannot exceed 6 months
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={handleBack}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!tenure || tenure > 6}
                    className={`px-4 sm:px-6 py-2 rounded-lg text-white text-sm sm:text-base transition-colors
                      ${tenure && tenure <= 6 ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"}`}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AddPaymentMethod;
