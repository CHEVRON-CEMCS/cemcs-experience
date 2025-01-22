import React, { useState } from "react";
import { create } from "zustand";
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

interface InsuranceStore {
  items: PremiumItem[];
  totalPremium: number;
  setValue: (index: number, value: number) => void;
  calculatePremiums: () => void;
}

const useInsuranceStore = create<InsuranceStore>((set) => ({
  items: [
    { description: "Building", rate: "0.155", value: 0, premium: 0 },
    {
      description: "Contents",
      rate: "0.65",
      value: 0,
      premium: 0,
      requiresItemization: true,
    },
    { description: "Generators", rate: "0.215", value: 0, premium: 0 },
    {
      description: "Cash",
      rate: "0.65",
      value: 0,
      premium: 0,
      maxValue: 100000,
    },
    { description: "Loss of Rent", rate: "0.215", value: 0, premium: 0 },
    { description: "Jewelries", rate: "3.5", value: 0, premium: 0 },
    {
      description: "Personal Liability Extension",
      rate: "0.1",
      value: 0,
      premium: 0,
    },
  ],
  totalPremium: 0,
  setValue: (index: number, value: number) =>
    set((state) => {
      const newItems = [...state.items];
      newItems[index] = { ...newItems[index], value };
      return { items: newItems };
    }),
  calculatePremiums: () =>
    set((state) => {
      const newItems = state.items.map((item) => ({
        ...item,
        premium: (item.value * parseFloat(item.rate)) / 100,
      }));
      const total = newItems.reduce((sum, item) => sum + item.premium, 0);
      return { items: newItems, totalPremium: total };
    }),
}));

const PropertyInsuranceForm = () => {
  const router = useRouter();
  const { memberDetails } = useAuthStore();
  const { items, totalPremium, setValue, calculatePremiums } =
    useInsuranceStore();
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

  const handleValueChange = (index: number, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    const item = items[index];

    if (validateValue(item, numValue, index)) {
      setValue(index, numValue);
      calculatePremiums();
    }
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
              House/Building Insurance Application Form
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    Please note that mobile phones are not covered under this
                    insurance policy.
                  </li>
                  <li>
                    For contents coverage, please provide a detailed itemization
                    of all items to be covered.
                  </li>
                  <li>Cash coverage is limited to a maximum of ₦100,000.</li>
                </ul>
              </AlertDescription>
            </Alert>

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
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="propertyLocation">
                    Location of Property to be Insured
                  </Label>
                  <Input
                    id="propertyLocation"
                    placeholder="Enter property location"
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2">
                  <div className="space-y-2">
                    <Label htmlFor="transactionDate">Transaction Date</Label>
                    <Input
                      id="transactionDate"
                      type="date"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chequeNumber">Cheque/R/N</Label>
                    <Input
                      id="chequeNumber"
                      placeholder="Enter number"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Items Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Premium Items
              </h3>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                            Item Description
                          </th>
                          <th className="px-3 py-4 text-right text-sm font-semibold text-gray-900">
                            Value
                          </th>
                          <th className="px-3 py-4 text-right text-sm font-semibold text-gray-900">
                            Rate (%)
                          </th>
                          <th className="px-3 py-4 text-right text-sm font-semibold text-gray-900">
                            Premium Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {items.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-4 text-sm text-gray-900">
                              {item.description}
                              {item.requiresItemization && (
                                <span className="text-blue-600 text-xs block">
                                  *Requires itemization
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-4">
                              <div className="space-y-1">
                                <Input
                                  type="number"
                                  className={`w-full text-right ${errors[index] ? "border-red-500" : ""}`}
                                  placeholder="0.00"
                                  value={item.value || ""}
                                  onChange={(e) =>
                                    handleValueChange(index, e.target.value)
                                  }
                                />
                                {errors[index] && (
                                  <span className="text-red-500 text-xs block">
                                    {errors[index]}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-4 text-right text-sm text-gray-900">
                              {item.rate}%
                            </td>
                            <td className="px-3 py-4 text-right text-sm text-gray-900">
                              {item.premium.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-semibold">
                          <td
                            colSpan={3}
                            className="px-3 py-4 text-right text-sm text-gray-900"
                          >
                            Total Premium
                          </td>
                          <td className="px-3 py-4 text-right text-sm text-gray-900">
                            {totalPremium.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Input type="checkbox" id="terms" className="w-4 h-4" />
                <Label htmlFor="terms" className="text-sm">
                  I have read and agree with the terms of this policy
                </Label>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button className="w-full sm:w-auto">Submit Application</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyInsuranceForm;
