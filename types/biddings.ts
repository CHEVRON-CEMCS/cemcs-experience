// types/bidding.ts
export interface BiddingProduct {
    name: string;
    product_name: string;
    price: number;
    image: string;
    description: string;
    owner_name: string;
    status: string;
    subscriber_id: string;
    member_id: string;
  }
  
  export interface Bid {
    name: string;
    name1: string;
    price: number;
    email: string;
    phone: string;
    status: string;
    product: string;
    member_id: string;
  }
  
  export interface Subscriber {
    name: string;
    full_name: string;
    employee_number: string;
    member_id: string;
    fees: number;
    account_name: string;
    account_number: string;
    bank_name: string;
    payment_receipt: string;
    i_accept: boolean;
  }

  // types/bidding.ts
export interface Bid {
    name: string;
    name1: string; // This will be member_name
    price: number;
    email: string;
    phone: string;
    status: string;
    product: string;
    member_id: string;
  }