export interface FlightBooking {
    booking_date: string;
    booking_status: string;
    booking_type: string;
    contact_email: string;
    contact_phone: string;
    customer: string;
    flight_segments: FlightSegment[];
    passengers: Passenger[];
    currency: string;
    base_fare: number;
    taxes: number;
    total_amount: number;
    meal_preferences?: string;
    special_requests?: string;
  }
  
  export interface FlightSegment {
    flight_number: string;
    airline: string;
    from_city: string;
    to_city: string;
    departure_date: string;
    departure_time: string;
    arrival_date: string;
    arrival_time: string;
    cabin_class: string;
    segment_status: string;
  }
  
  export interface Passenger {
    passenger_type: string;
    title: string;
    first_name: string;
    last_name: string;
    gender: string;
    dob: string;
    nationality?: string;
    passport_number?: string;
    passport_expiry?: string;
  }
  