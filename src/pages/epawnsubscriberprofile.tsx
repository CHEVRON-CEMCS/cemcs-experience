// pages/app/profile.tsx
import React, { useEffect, useState } from 'react';
import { Navbar } from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuthStore } from "../../store/authStore";
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubscriberInfo {
  name: string;
  creation: string;
  employee_number: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  payment_receipt: string;
  status: string;
}

const SubscriberProfile: React.FC = () => {
  const { memberDetails } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [subscriberInfo, setSubscriberInfo] = useState<SubscriberInfo | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.chevroncemcs.com";

  useEffect(() => {
    const fetchSubscriberInfo = async () => {
      if (!memberDetails?.membership_number) return;

      try {
        // Extract the numeric part from membership_number (e.g., "SUB-20001R" -> "20001R")
        const memberId = memberDetails.membership_number.replace('SUB-', '');
        
        // Use your existing endpoint
        const response = await axios.get(`/api/Epawn Subscriber?id=${memberId}`);
        console.log('Subscriber data:', response.data);
        setSubscriberInfo(response.data.data);
      } catch (error) {
        console.error('Error fetching subscriber info:', error);
        toast.error("Failed to load subscriber information");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriberInfo();
  }, [memberDetails?.membership_number]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!subscriberInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600">No subscriber information found</h2>
            <p className="mt-2 text-gray-500">Please ensure you are registered as a subscriber.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Subscriber Profile</h1>

          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="font-medium">{subscriberInfo.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Employee Number</label>
                    <p className="font-medium">{subscriberInfo.employee_number}</p>
                  </div>
                  
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Subscriber Since</label>
                    <p className="font-medium">
                      {new Date(subscriberInfo.creation).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            
          </div>
        </div>
      </div>
      <Footer />
      <Toaster richColors position="bottom-center" />
    </div>
  );
};

export default SubscriberProfile;