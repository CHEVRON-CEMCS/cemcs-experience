import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Navbar } from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "../../../store/authStore";
import BidHistoryTable from "../../../components/BidHistoryTable";

interface Bid {
    name: string;
    name1: string;
    price: number;
    email: string;
    phone: string;
    status: string;
    creation: string;  
    product: string;
    member_id: string;
    doctype: string;
  }

  interface Product {
    name: string;
    product_name: string;
    price: number;
    image: string;
    status: string;
    description: string;
    owner_name: string;
    subscriber_id: string;  

    member_id: string;  
  }

  interface UpdateStatusRequest {
    bidId: string;
    newStatus: string;
    product: string;
    updated_by: string;
  }
  
  interface UpdateStatusResponse {
    data: {
      name: string;
      bid_id: string;
      new_status: string;
      product: string;
      creation: string;
    };
  }

const BiddingProductDetails: React.FC = () => {
  const router = useRouter();
  const { memberDetails } = useAuthStore();

  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [bidderName, setBidderName] = useState("");
  const [bidderEmail, setBidderEmail] = useState("");
  const [bidderPhone, setBidderPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.chevroncemcs.com";

  interface UpdateStatusResponse {
    data: {
      status: string;

    };
  }
  
  const handleStatusUpdate = async (bidId: string, newStatus: string): Promise<UpdateStatusResponse> => {
    try {
      console.log('Updating status:', {
        bidId,
        newStatus,
        subscriber_id: memberDetails?.membership_number,
      });
  
      
      const currentBid = bids.find(bid => bid.name === bidId);
      if (!currentBid) throw new Error('Bid not found');
  
      const response = await axios.post('/api/epawn-bid-status-update', {
        bidId,
        newStatus,
        product: product?.name,
        previous_status: currentBid.status,
        subscriber_id: memberDetails?.membership_number
      });
  
      // Refresh bids after update
      const bidsRes = await axios.get(`/api/Epawn Biddings?product_id=${product?.name}`);
      setBids(bidsRes.data.data || []);
  
      return response.data;
    } catch (error) {
      console.error('Error updating bid status:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchProductAndBids = async () => {
      if (!id) return;
  
      try {
        const [productRes, bidsRes] = await Promise.all([
          axios.get(`/api/Epawn Products?id=${id}`),
          axios.get(`/api/Epawn Biddings?product_id=${id}`)
        ]);
  
        console.log('Product response:', productRes.data.data); 
        setProduct(productRes.data.data);
        setBids(bidsRes.data.data || []);
      } catch (error) {
        console.error('Error:', error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProductAndBids();
  }, [id]);

  

  interface BidRequestData {
    doctype: string;
    name1: string;
    price: number;
    email: string;
    phone: string;
    status: string;
    product: string;
    member_id: string;
  }
  
  interface BidResponseData {
    data: {
      name: string;
      owner: string;
      creation: string;
      modified: string;
      modified_by: string;
      docstatus: number;
      idx: number;
      name1: string;
      price: number;
      email: string;
      phone: string;
      status: string;
      product: string;
      member_id: string;
      doctype: string;
    };
  }

  
  
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      if (!product || !memberDetails) {
        toast.error("Missing product or member details");
        return;
      }
  
      // Validate bid amount
      const parsedBidAmount = parseFloat(bidAmount);
      if (isNaN(parsedBidAmount) || parsedBidAmount < product.price) {
        toast.error("Bid amount must be greater than or equal to the starting price");
        return;
      }
  
      const bidData: BidRequestData = {
        doctype: "Epawn Biddings",
        name1: bidderName,
        price: parsedBidAmount,
        email: bidderEmail,
        phone: bidderPhone,
        status: "0",
        product: product.name,
        member_id: memberDetails.membership_number
      };
  
      const response = await axios.post<BidResponseData>(
        "/api/epawn-biddings",
        bidData
      );
      console.log("Response:", response.data);

  
      toast.success("Bid placed successfully!");
      setDialogOpen(false);
      
      // Refresh bids
      const bidsRes = await axios.get(`/api/Epawn Biddings?product_id=${product.name}`);
      setBids(bidsRes.data.data || []);
      
      // Clear form
      setBidAmount("");
      setBidderName("");
      setBidderEmail("");
      setBidderPhone("");
    } catch (error: any) {
      console.error('Error placing bid:', error);
      toast.error(error.response?.data?.message || "Failed to place bid");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-600">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = product.image?.startsWith("http")
  ? product.image
  : product.image
  ? `${baseUrl}/${product.image}` 
  : "/placeholder.jpg";

  const getStatusText = (status: string) => {
    switch (status) {
      case "0": return "Open for Bidding";
      case "1": return "Bid Accepted";
      case "2": return "Closed";
      default: return "Unknown";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square w-full">
            <Image
              src={imageUrl}
              alt={product.product_name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.product_name}</h1>
              <p className="text-gray-600 mt-2">Posted by: {product.owner_name}</p>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-semibold">Starting Price:</p>
              <p className="text-3xl font-bold text-primary">
                ₦{product.price?.toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-semibold">Status:</p>
              <span className="inline-flex items-center rounded-md px-2 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                {getStatusText(product.status)}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-semibold">Description:</p>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {product.status === "0" && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Place Bid</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Place Your Bid</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleBidSubmit} className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium">Your Name</label>
                      <Input
                        required
                        value={bidderName}
                        onChange={(e) => setBidderName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bid Amount (₦)</label>
                      <Input
                        required
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Enter bid amount"
                        min={product.price}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        required
                        type="email"
                        value={bidderEmail}
                        onChange={(e) => setBidderEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        required
                        value={bidderPhone}
                        onChange={(e) => setBidderPhone(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Bid"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Bids Table */}
<div className="mt-12">
  <h2 className="text-2xl font-bold mb-4">Bid History</h2>
  
  <BidHistoryTable 
    bids={bids}
    onUpdateStatus={handleStatusUpdate}
    product={product}
    isOwner={Boolean(memberDetails?.membership_number === product.member_id)}
  />
</div>
      </div>
      <Footer />
      <Toaster expand={true} richColors position="bottom-center" />
    </div>
  );
};

export default BiddingProductDetails;