import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavTravel } from "../../components/NavTravel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FlightBooking } from "../../types/flight";
// import { useToast } from "@/hooks/use-toast";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/router";
import { useAuthStore } from "../../store/authStore";
// import { LoginModal } from '../../components/LoginModal';

const Travel = () => {
  // const { toast } = useToast();
  const router = useRouter();
  const { memberDetails, loginUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [checkDeparture, setCheckDeparture] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    flyingFrom: "",
    flyingTo: "",
    tripType: "",
    adults: 1,
    children: 0,
    preferredAirline: "",
    departureDate: "",
    returnDate: "",
    additionalInfo: "",
    flightNumber: "123",
    returnFlightNumber: "456",
    dateOfBirth: "1920-01-01",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitBooking = async () => {
    if (!memberDetails?.membership_number) {
      // Redirect to signin page with return URL
      router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }

    if (loginUser?.userType === "erp") {
      toast.error("Not allowed");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const bookingData: FlightBooking = {
        booking_date: new Date().toISOString().split("T")[0],
        booking_status: "Draft",
        booking_type: formData.tripType,
        contact_email: formData.email,
        contact_phone: formData.phone,
        customer: memberDetails.membership_number,
        flight_segments: [
          {
            flight_number: formData.flightNumber,
            airline: formData.preferredAirline,
            from_city: formData.flyingFrom,
            to_city: formData.flyingTo,
            departure_date: formData.departureDate,
            departure_time: "00:00:00",
            arrival_date: formData.departureDate,
            arrival_time: "00:00:00",
            cabin_class: "Economy",
            segment_status: "Scheduled",
          },
        ],
        passengers: [
          {
            passenger_type: "Adult",
            title: "Mr",
            first_name: formData.firstName,
            last_name: formData.lastName,
            gender: "Male",
            dob: formData.dateOfBirth,
          },
        ],
        currency: "USD",
        base_fare: 0,
        taxes: 0,
        total_amount: 0,
        special_requests: formData.additionalInfo,
      };

      if (formData.tripType === "Round Trip" && formData.returnDate) {
        bookingData.flight_segments.push({
          flight_number: formData.returnFlightNumber,
          airline: formData.preferredAirline,
          from_city: formData.flyingTo,
          to_city: formData.flyingFrom,
          departure_date: formData.returnDate,
          departure_time: "00:00:00",
          arrival_date: formData.returnDate,
          arrival_time: "00:00:00",
          cabin_class: "Economy",
          segment_status: "Scheduled",
        });
      }

      const response = await axios.post("/api/flight-booking", bookingData);
      console.log("res:", response);

      toast.success("Flight booking request submitted successfully!");

      router.push("/flightSuccess");
    } catch (error: any) {
      console.error("Booking error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.exception ||
        "Failed to submit booking request. Please try again.";

      toast.error("Failed to submit booking request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBooking();
  };

  // const handleLoginSuccess = () => {
  //   setShowLoginModal(false);
  //   submitBooking();
  // };
  const today = new Date().toISOString().split("T")[0];

  const handleBack = () => {
    router.push("/reservations");
  };

  return (
    <div>
      <NavTravel />
      <div className="px-4 sm:px-6 xl:mx-auto mb-14 xl:max-w-7xl xl:px-10 mt-8">
        <div className="block md:hidden mb-2">
          <Button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-black-700 py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            ← Back
          </Button>
        </div>
        <div className="max-w-4xl mx-auto">
          <div>
            <h1 className="text-center mb-10 font-bold text-xl sm:text-3xl">
              BOOK FLIGHT
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row sm:space-x-5 w-full items-center">
              <div className="flex-1">
                <Label>First Name</Label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex-1 mt-4 sm:mt-0">
                <Label>Last Name</Label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <Label>Email Address</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Flying From</Label>
                <Input
                  name="flyingFrom"
                  value={formData.flyingFrom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Flying To</Label>
                <Input
                  name="flyingTo"
                  value={formData.flyingTo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Select Trip</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("tripType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Trip" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Round Trip">Round Trip</SelectItem>
                    <SelectItem value="One Way">One-Way Trip</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Departure Date</Label>
                <Input
                  name="departureDate"
                  type="date"
                  value={formData.departureDate}
                  onChange={handleChange}
                  required
                  min={today}
                />
              </div>

              {formData.tripType === "Round Trip" && (
                <div>
                  <Label>Return Date</Label>
                  <Input
                    name="returnDate"
                    type="date"
                    value={formData.returnDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div>
                <Label>Number of Adults</Label>
                <Input
                  name="adults"
                  type="number"
                  min="1"
                  value={formData.adults}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Number of Children (Optional)</Label>
                <Input
                  name="children"
                  type="number"
                  min="0"
                  value={formData.children}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Preferred Airline</Label>
                <Input
                  name="preferredAirline"
                  value={formData.preferredAirline}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Additional Information</Label>
                <Textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Any special requests or requirements?"
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-5"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Book Flight"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Toaster expand={true} richColors position="bottom-center" />
    </div>
  );
};

export default Travel;
