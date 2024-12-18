import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TbGridDots } from "react-icons/tb";
import { GiRoundStar } from "react-icons/gi";
import { DatePickerWithRange } from "../../../components/DatePick";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NavTravel } from "../../../components/NavTravel";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";
import { useAuthStore } from "../../../store/authStore";
import { LoginModal } from "../../../components/LoginModal";

interface BookingDetails {
    name: string;
    package_name: string;
    description: string;
    inclusions: string;
    terms_conditions: string;
    duration: number;
  }
  
  const TourDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const { memberDetails } = useAuthStore();
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Booking form state
    const [formData, setFormData] = useState({
      start_date: "",
      end_date: "",
      total_adults: 1,
      total_children: 0,
      customer_name: "",
      email: "",
      phone: "",
    });
  
    const [travelers, setTravelers] = useState([
      { traveler_type: "Adult", full_name: "", gender: "Male", dob: "" },
    ]);
  
    useEffect(() => {
      const fetchTourDetails = async () => {
        if (!id) return;
  
        try {
          const response = await axios.get(`/api/Tour Package/${id}`);
          setBooking(response.data.data);
        } catch (err) {
          console.error("API Error:", err);
          setError("Failed to load tour details");
        } finally {
          setLoading(false);
        }
      };
  
      fetchTourDetails();
    }, [id]);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleTravelerChange = (
      index: number,
      field: string,
      value: string
    ) => {
      const updatedTravelers = [...travelers];
      updatedTravelers[index] = { ...updatedTravelers[index], [field]: value };
      setTravelers(updatedTravelers);
    };
  
    const addTraveler = () => {
      setTravelers((prev) => [
        ...prev,
        { traveler_type: "Adult", full_name: "", gender: "Male", dob: "2024-12-03" },
      ]);
    };
  
    const removeTraveler = (index: number) => {
      setTravelers((prev) => prev.filter((_, i) => i !== index));
    };
  
    const submitBooking = async () => {
      if (!memberDetails?.membership_number) {
        setShowLoginModal(true);
        return;
      }
  
      const payload = {
        tour_package: id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        total_adults: formData.total_adults,
        total_children: formData.total_children,
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
        customer: memberDetails.membership_number,
        travelers,
      };
  
      try {
        const response = await axios.post('/api/tour-booking', payload);
        console.log("Booking created:", response);
        console.log("Booking Payload:", payload);
        router.push('/tourSuccess');
      } catch (err) {
        console.error("Error creating booking:", err);
        alert("Failed to create booking.");
      }
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      submitBooking();
    };
  
    const handleLoginSuccess = () => {
      setShowLoginModal(false);
      submitBooking();
    };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <NavTravel />
      <div className="xl:mx-auto mb-14 xl:max-w-7xl xl:px-10 mt-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-sora">
            {booking?.package_name}
          </h1>
        </div>
        <div className="mt-9">
          <div className="h-[32.5rem] w-full">
            <div className="relative w-full h-full">
              <Image
                src="/tourPackage1.png"
                alt="Tour Package Image"
                className="absolute h-full w-full rounded-[10px]"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
        <div className="mt-8 font-sora">
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between w-full mt-4">
            <div className="w-full xl:w-2/3">
              <div className="w-11/12">
                <h1 className="mb-4 text-lg font-bold text-gray-800">
                  Tour Description
                </h1>
                <div
                  className="text-sm text-justify font-normal leading-6 text-gray-600"
                  dangerouslySetInnerHTML={{ __html: booking?.description || "" }}
                />
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-800">
                  Inclusions
                </h2>
                <div
                  className="text-sm font-normal leading-6 text-gray-600"
                  dangerouslySetInnerHTML={{ __html: booking?.inclusions || "" }}
                />
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-800">
                  Terms and Conditions
                </h2>
                <div
                  className="text-sm font-normal leading-6 text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: booking?.terms_conditions || "",
                  }}
                />
              </div>
            </div>
            <div className="sticky top-5 mt-6 xl:mt-0 flex flex-col w-full xl:w-1/2 bg-white rounded-md border-black drop-shadow-xl">
              <div className="self-end p-6 border border-gray-200 rounded-lg w-full">
                {/* <div className="flex items-center justify-between">
                  <h1 className="text-sm font-normal">
                    ₦ 150,000 / {booking?.duration} days
                  </h1>
                  <div className="flex items-center space-x-2">
                    <GiRoundStar className="w-4 h-4 text-primary" />
                    <h1 className="text-sm font-medium text-black">5.0</h1>
                    <div className="w-1 h-1 rounded-full bg-secondary"></div>
                    <h1 className="text-sm font-medium text-black text-opacity-60">
                      50 reviews
                    </h1>
                  </div>
                </div> */}
                <div className="mt-5">
                  {/* <DatePickerWithRange /> */}
                </div>
                {/* <div className="mt-5">
                  <div className="flex items-center justify-center w-full border border-gray-200 rounded-md">
                    <div className="relative w-full" ref={dropdownRef}>
                      <button
                        className="text-gray-700 font-semibold py-4 px-2 xl:px-4 w-full rounded inline-flex items-center"
                        onClick={handleGuestClick}
                      >
                        <span className="mr-1">{numGuests} Guests</span>
                        <svg
                          className={`fill-current ml-48 xl:ml-40 h-4 w-4 ${
                            showDropdown ? "transform rotate-180" : ""
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M15 7l-5 5-5-5 1-1 4 4 4-4 1 1z" />
                        </svg>
                      </button>
                      {showDropdown && (
                        <div className="absolute z-10 mt-1 w-full rounded-md py-3 bg-white drop-shadow-md">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h1 className="font-bold text-black ml-2">
                                  Guest No.
                                </h1>
                              </div>
                              <div className="flex space-x-5 justify-center items-center mr-2">
                                <button
                                  className="block px-4 py-2 text-xl font-bold border rounded-full hover:border-black text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                  role="menuitem"
                                  onClick={handleDecrement}
                                >
                                  -
                                </button>
                                <span className="text-black">{numGuests}</span>
                                <button
                                  className="block px-4 py-2 text-xl font-bold text-gray-700 border hover:border-black rounded-full hover:bg-gray-100 hover:text-gray-900"
                                  role="menuitem"
                                  onClick={handleIncrement}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div> */}
                {/* <div>
                  <div className="mt-5 mb-2">
                    <Label>First and Last Name</Label>
                  </div>
                  <Input />
                  <Button className="mt-5 w-full">Book</Button>
                </div> */}
                <form className="mt-8" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-xl font-bold">Booking Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Total Adults</Label>
                <Input
                  type="number"
                  name="total_adults"
                  value={formData.total_adults}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Total Children</Label>
                <Input
                  type="number"
                  name="total_children"
                  value={formData.total_children}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Customer Name</Label>
                <Input
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold">Guest Information</h2>
            {travelers.map((traveler, index) => (
                <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <Label>Full Name</Label>
                    <Input
                    placeholder="Full Name"
                    value={traveler.full_name}
                    onChange={(e) =>
                        handleTravelerChange(index, "full_name", e.target.value)
                    }
                    required
                    />
                </div>
                <div>
                    <Label>Traveler Type</Label>
                    <select
                    value={traveler.traveler_type}
                    onChange={(e) =>
                        handleTravelerChange(index, "traveler_type", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                    >
                    <option value="Adult">Adult</option>
                    <option value="Child">Child</option>
                    </select>
                </div>
                <div>
                    <Label>Gender</Label>
                    <select
                  value={traveler.gender}
                  onChange={(e) =>
                    handleTravelerChange(index, "gender", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                </div>
                <div>
                    <Label>Date of Birth</Label>
                    <Input
                    type="date"
                    value={traveler.dob}
                    onChange={(e) =>
                        handleTravelerChange(index, "dob", e.target.value)
                    }
                    required
                    />
                </div>
                
            </div>
            <Button
                  type="button"
                  onClick={() => removeTraveler(index)}
                  className="col-span-4 mt-5"
                >
                  Remove Traveler
                </Button>
            </>
            ))}
            
            
          </div>
          <Button type="button" onClick={addTraveler} className="mt-4 w-full">
              Add Traveler
            </Button>
          <Button type="submit" className="mt-6 w-full">
            Submit Booking
          </Button>
        </form>
              </div>
            </div>
          </div>
        </div>
        <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
      </div>
    </div>
  );
};

export default TourDetails;
