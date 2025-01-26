import React from "react";
import { create } from "zustand";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Home, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import { InsuranceImageSlider } from "./InsuranceImageSlider";

interface PageStore {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const usePageStore = create<PageStore>((set) => ({
  currentPage: "home",
  setCurrentPage: (page) => set({ currentPage: page }),
}));

const HomePage = () => {
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = React.useState(0);
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);

  const insuranceTypes = [
    {
      title: "Vehicle Insurance",
      icon: <Car className="h-12 w-12 mb-4" />,
      description:
        "Comprehensive coverage for your vehicles including cars, motorcycles, and commercial vehicles. Protect against accidents, theft, and damage.",
      features: [
        "Collision Coverage",
        "Third-party Liability",
        "Personal Accident Cover",
        "24/7 Roadside Assistance",
      ],
      hasForm: true,
    },
    {
      title: "Property Insurance",
      icon: <Home className="h-12 w-12 mb-4" />,
      description:
        "Secure your home and belongings with our comprehensive property insurance. Coverage for natural disasters, theft, and structural damage.",
      features: [
        "Building Coverage",
        "Contents Protection",
        "Natural Disaster Protection",
        "Liability Coverage",
      ],
      hasForm: true, // Added to indicate this type has a form
    },
    {
      title: "Health Insurance",
      icon: <Heart className="h-12 w-12 mb-4" />,
      description:
        "Take care of your health with our comprehensive medical coverage. Including hospitalization, medications, and preventive care.",
      features: [
        "Hospital Coverage",
        "Prescription Benefits",
        "Preventive Care",
        "Specialist Consultations",
      ],
      hasForm: true,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % insuranceTypes.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + insuranceTypes.length) % insuranceTypes.length
    );
  };

  const handleContinue = (insuranceType: any) => {
    if (insuranceType.title === "Property Insurance") {
      router.push("/InsuranceForm");
    }

    if (insuranceType.title === "Vehicle Insurance") {
      router.push("/InsuranceForm");
    }

    if (insuranceType.title === "Health Insurance") {
      router.push("/InsuranceForm");
    }
  };

  return (
    <div className="">
      <div className=" ">
        <InsuranceImageSlider />
      </div>

      {/* Hero Section */}
      {/* <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-white p-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Protect What Matters Most
            </h1>
            <p className="text-xl">
              Comprehensive Insurance Solutions for Your Peace of Mind
            </p>
          </div>
        </div>
      </div> */}

      {/* Insurance Types Slider */}
      <div className="relative">
        <div className="overflow-hidden rounded-lg bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Our Insurance Services</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={prevSlide}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextSlide}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            className="transition-all duration-300"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <div className="flex">
              {insuranceTypes.map((insurance, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <Card className="p-6">
                    <div className="flex flex-col items-center text-center">
                      {insurance.icon}
                      <h3 className="text-xl font-bold mb-2">
                        {insurance.title}
                      </h3>
                      <p className="text-gray-800 mb-4">
                        {insurance.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 w-full mb-4">
                        {insurance.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 p-2 rounded-lg text-sm"
                          >
                            {feature}
                          </div>
                        ))}
                      </div>
                      {insurance.hasForm && (
                        <Button
                          className="w-full mt-4"
                          onClick={() => handleContinue(insurance)}
                        >
                          {/* {`Click to Insure ${insurance.title === "Property Insurance" ? "Property" : insurance.title || insurance.title === "Vehicle Insurance" ? "Vehicle" : null}`} */}
                          Click to indicate interest
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* Additional Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why Choose Us */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Why Choose Us</h2>
          <div className="space-y-4">
            <p className="text-gray-800">
              We provide comprehensive insurance solutions tailored to your
              needs. With decades of experience and a commitment to customer
              service, we ensure your peace of mind.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-800">
              <li>24/7 Customer Support</li>
              <li>Quick Claim Processing</li>
              <li>Competitive Rates</li>
              <li>Customizable Plans</li>
            </ul>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <p className="text-gray-800">
              Have questions about our insurance services? Our team is here to
              help you find the perfect coverage for your needs.
            </p>
            <div className="space-y-2">
              <p className="text-gray-800">
                📞 Call Goodluck: 0908-354-1575 | 62213
              </p>
              <p className="text-gray-800">
                📧 Email: cemcsinsurance@chevron.com
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Testimonials Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Customer Testimonials</h2>
        <div className="text-gray-600">
          <p>Content coming soon...</p>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
