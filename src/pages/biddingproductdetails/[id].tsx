import React, { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { EPawnNav } from "../../../components/EPawnNav";
import Footer from "../../../components/Footer";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
import { Trash } from "lucide-react";
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
  is_deleted: number;
  member_id: string;
  image_2: string;
  image_3: string;
  image_4: string;
  dimension: string;
  specifications: string;
  weight: string;
  color: string;
  condition: string;
  brand: string;
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
  const { memberDetails, loginUser } = useAuthStore();

  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [bidderName, setBidderName] = useState("");
  const [bidderEmail, setBidderEmail] = useState("");
  const [bidderPhone, setBidderPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [modalImage, setModalImage] = useState<string | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.chevroncemcs.com";

  interface UpdateStatusResponse {
    data: {
      status: string;
    };
  }

  const handleDelete = async () => {
    if (product?.status === "1") {
      alert("❌ Cannot delete. A bid has already been accepted.");
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this EPawn Product?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await axios.put(`/api/delete-product/${id}`);

      const data = await response.data;

      if (response.status != 200) {
        console.log(response);
        throw new Error(data.message || "Failed to delete product");
      }

      toast.success("Product deleted successfully");
      alert("Product deleted successfully");
      setTimeout(() => {
        console.log("routing");
        router.replace("/myepawnproducts");
      }, 500);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting product");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    bidId: string,
    newStatus: string
  ): Promise<UpdateStatusResponse> => {
    try {
      console.log("Updating status:", {
        bidId,
        newStatus,
        subscriber_id: memberDetails?.membership_number,
      });

      const currentBid = bids.find((bid) => bid.name === bidId);
      if (!currentBid) throw new Error("Bid not found");

      const response = await axios.put(`/api/epawn-bid-status-update`, {
        bidId,
        newStatus,
        product: product?.name,
        previous_status: currentBid.status,
        subscriber_id: memberDetails?.membership_number,
      });

      const productUpdate = await axios.put("/api/epawn-product-update", {
        product_id: product?.name,
        newStatus,
      });

      setStatus(productUpdate.data.data.status);
      console.log(productUpdate.data.data.status);

      // Refresh bids after update
      const bidsRes = await axios.get(
        `/api/Epawn Biddings?product_id=${product?.name}`
      );
      setBids(bidsRes.data.data || []);

      return response.data;
    } catch (error) {
      console.error("Error updating bid status:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchProductAndBids = async () => {
      if (!id) return;

      try {
        const [productRes, bidsRes] = await Promise.all([
          axios.get(`/api/Epawn Products?id=${id}`),
          axios.get(`/api/Epawn Biddings?product_id=${id}`),
        ]);

        console.log("product res:", productRes.data.data);
        setStatus(productRes.data.data.status);
        const product = productRes.data.data;
        if (product.is_deleted !== 1) {
          setProduct(productRes.data.data);
        }
        setBids(bidsRes.data.data || []);
      } catch (error) {
        console.error("Error:", error);
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

  const handleBidChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");

    if (rawValue === "") {
      setBidAmount("");
    } else if (!isNaN(Number(rawValue))) {
      const numericValue = Number(rawValue);
      setBidAmount(numericValue.toLocaleString("en-US"));
    }
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!memberDetails?.membership_number) {
      router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }
    if (!loginUser?.email) {
      router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }
    if (loginUser.userType === "erp") {
      toast.error("Not allowed");
      setIsSubmitting(false);
      return;
    }
    try {
      if (!product || !memberDetails) {
        toast.error("Missing product or member details");
        return;
      }

      // Validate bid amount
      // const parsedBidAmount = parseFloat(bidAmount);
      // if (isNaN(parsedBidAmount) || parsedBidAmount < product.price) {
      //   toast.error(
      //     "Bid amount must be greater than or equal to the starting price"
      //   );
      //   return;
      // }

      const bidData: BidRequestData = {
        doctype: "Epawn Biddings",
        name1: loginUser?.full_name,
        price: parseFloat(bidAmount.replace(/,/g, "")),
        email: bidderEmail,
        phone: bidderPhone,
        status: "0",
        product: product.name,
        member_id: memberDetails.membership_number,
      };

      const response = await axios.post<BidResponseData>(
        "/api/epawn-biddings",
        bidData
      );
      console.log("biddings:", response.data);

      toast.success("Bid placed successfully!");
      setDialogOpen(false);

      // Refresh bids
      const bidsRes = await axios.get(
        `/api/Epawn Biddings?product_id=${product.name}`
      );
      console.log("product endpoint:", bidsRes.data.data.status);
      setBids(bidsRes.data.data || []);

      // Clear form
      setBidAmount("");
      setBidderName("");
      setBidderEmail("");
      setBidderPhone("");
    } catch (error: any) {
      console.error("Error placing bid:", error);
      toast.error(error.response?.data?.message || "Failed to place bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <EPawnNav />
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
        <EPawnNav />
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
      case "0":
        return "Open for Bidding";
      case "1":
        return "Bid Accepted";
      case "2":
        return "Closed";
      default:
        return "Unknown";
    }
  };

  const images = [
    product.image,
    product.image_2,
    product.image_3,
    product.image_4,
  ].filter(Boolean);

  const getGridClass = (imageCount: number) => {
    switch (imageCount) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2 md:grid-cols-3";
      default:
        return "grid-cols-2";
    }
  };

  const handleBack = () => {
    router.push("/myepawnproducts");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <EPawnNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow py-8 w-full">
        <Button
          variant="ghost"
          className="mb-4 flex items-center gap-2"
          onClick={handleBack}
        >
          ← Back
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative w-full h-[400px]">
            {memberDetails?.membership_number === product.member_id && (
              <button
                onClick={handleDelete}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition z-10"
                disabled={loading}
              >
                <Trash className="w-5 h-5" />
              </button>
            )}
            {/* Image Wrapper to prevent overlay issues */}
            <div className="flex flex-col md:flex-row h-auto md:h-[32.5rem] w-full">
              <div
                className={`grid ${getGridClass(images.length)} md:mb-28 gap-4 w-full`}
              >
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-gray-300 ${
                      images.length === 1 ? "aspect-video" : "aspect-square"
                    }`}
                    onClick={() =>
                      setModalImage(
                        img ? `${baseUrl}${img}` : `/home${index + 2}.jpg`
                      )
                    }
                  >
                    <Image
                      src={img ? `${baseUrl}${img}` : `/home${index + 2}.jpg`}
                      alt={`${product.name} image ${index + 1}`}
                      fill
                      className={`${images.length === 1 ? "object-contain" : "object-cover"} transition-transform duration-300 hover:scale-105`}
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-opacity duration-300" />
                  </div>
                ))}
              </div>

              {modalImage && (
                <div
                  className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                  onClick={() => setModalImage(null)}
                >
                  <div className="relative w-full max-w-4xl max-h-[90vh] aspect-square">
                    <button
                      onClick={() => setModalImage(null)}
                      className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                    >
                      <X size={24} />
                    </button>
                    <Image
                      src={modalImage}
                      alt="Enlarged product image"
                      fill
                      className="object-contain"
                      sizes="(max-width: 1536px) 100vw, 1536px"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.product_name}</h1>
              <p className="text-gray-600 mt-2">
                Posted by: {product.subscriber_id}
              </p>
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
                {getStatusText(status)}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-semibold">Description:</p>
              <div className="border border-gray-300 p-2 rounded-md w-full h-24 overflow-y-auto">
                <p className="text-gray-600 break-words whitespace-normal">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-lg font-semibold">Brand:</p>
                <p className="text-gray-700">{product.brand || "N/A"}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">Weight:</p>
                <p className="text-gray-700">{product.weight || "N/A"}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">Dimensions:</p>
                <p className="text-gray-700">{product.dimension || "N/A"}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">Condition:</p>
                <p className="text-gray-700">{product.condition || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-lg font-semibold">Color:</p>
                <p className="text-gray-700">{product.color || "N/A"}</p>
              </div>
            </div>

            {/* Optional Specifications */}
            {product.specifications && (
              <div className="mt-4">
                <p className="text-lg font-semibold">Specifications:</p>
                <div className="border border-gray-300 p-2 rounded-md w-full overflow-y-auto">
                  <p className="text-gray-600 break-words whitespace-normal">
                    {product.specifications}
                  </p>
                </div>
              </div>
            )}

            {product.status === "0" &&
              memberDetails?.membership_number !== product.member_id && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">Place Bid</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Place Your Bid</DialogTitle>
                    </DialogHeader>
                    <div
                      className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
                      role="alert"
                    >
                      <p className="font-bold">Important Notice</p>
                      <p>
                        Seller may not be able to contact you if contact
                        information is not available
                      </p>
                    </div>
                    <form onSubmit={handleBidSubmit} className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm font-medium">Bidder Id</label>
                        <Input
                          required
                          value={memberDetails?.membership_number}
                          onChange={(e) => setBidderName(e.target.value)}
                          placeholder={
                            memberDetails?.membership_number ||
                            "Please enter your name"
                          }
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Bid Amount (₦)
                        </label>
                        <Input
                          required
                          type="text"
                          value={bidAmount}
                          onChange={handleBidChange}
                          placeholder="Enter bid amount"
                          // min={product.price}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Email (Optional)
                        </label>
                        <Input
                          required
                          type="email"
                          value={bidderEmail}
                          onChange={(e) => setBidderEmail(e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Phone (Optional)
                        </label>
                        <Input
                          required
                          type="tel"
                          value={bidderPhone}
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^\d+]/g, "");

                            if (value.startsWith("+234")) {
                              if (value.length > 14) return;
                            } else {
                              if (value.length > 11) return;
                            }

                            setBidderPhone(value);
                          }}
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

          {Boolean(memberDetails?.membership_number) && (
            <BidHistoryTable
              bids={bids.filter(
                (bid) =>
                  memberDetails?.membership_number === product.member_id ||
                  bid.member_id === memberDetails?.membership_number
              )}
              onUpdateStatus={handleStatusUpdate}
              product={product}
              isOwner={Boolean(
                memberDetails?.membership_number === product.member_id
              )}
            />
          )}
        </div>
      </div>
      <Footer />
      <Toaster expand={true} richColors position="bottom-center" />
    </div>
  );
};

export default BiddingProductDetails;
