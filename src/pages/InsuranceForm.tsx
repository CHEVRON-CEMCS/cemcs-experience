import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

interface PremiumItem {
  description: string;
  rate: string;
  value: number;
  premium: number;
  maxValue?: number;
  requiresItemization?: boolean;
}

const InsuranceForm = () => {
  const router = useRouter();
  const { memberDetails } = useAuthStore();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateValue = (item: PremiumItem, value: number, index: number) => {
    const newErrors = { ...errors };

    if (item.maxValue && value > item.maxValue) {
      newErrors[index] =
        `Maximum value allowed is ₦${item.maxValue.toLocaleString()}`;
    } else {
      delete newErrors[index];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    router.push("/insurance");
    return;
  };

  const handleSubmit = () => {
    if (!memberDetails?.membership_number) {
      router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }
  };

  return (
    <div className="w-full min-h-screen p-4 bg-gray-50">
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    placeholder="Enter your occupation"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Phone Number</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="Enter your phone number"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your address"
                    className="w-full"
                  />
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
                <Button className="w-full sm:w-auto">Submit Interest</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsuranceForm;
