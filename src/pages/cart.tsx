import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCartStore } from "../../store/cartStore";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import AddPaymentMethod from "../../components/cpay-checkout";
// import { LoginModal } from "../../components/LoginModal";

interface PaymentMethod {
  title: string;
  description: string;
  content: JSX.Element;
}

interface PaymentMethods {
  [key: string]: PaymentMethod;
}

interface CartItem {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  pro_image: string;
}

const Cart = () => {
  const { items, removeItem, increaseQuantity, decreaseQuantity, clearCart } =
    useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { memberDetails, loginUser } = useAuthStore();
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState("");
  const [isGiftCardApplied, setIsGiftCardApplied] = useState(false);

  // Add these new state variables
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherAmount, setVoucherAmount] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [voucherBalance, setVoucherBalance] = useState<number | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [receipt, setReceipt] = useState<File | null>(null);

  const router = useRouter();
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.chevroncemcs.com";

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const transactionFee = 100;
  const total = subtotal + transactionFee - voucherDiscount; // Modified this line

  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

  const handleGiftCardApply = () => {
    // Add validation logic here
    setIsGiftCardApplied(true);
    toast.success("Gift card applied successfully");
  };

  const paymentMethods: PaymentMethods = {
    "Bank Transfer": {
      title: "Bank Transfer Details",
      description: "Transfer to the following account:",
      content: (
        <div className="space-y-4">
          <p>Bank: GTBANK</p>
          <p>Account Name: CEMCS Limited</p>
          <p>Account Number: 0106829409</p>
          <p>Your order will not ship until we receive payment.</p>
        </div>
      ),
    },
    CPay: {
      title: "CPay Payment",
      description: "For Chevron Nigeria Limited Employees Only",
      content: (
        <div className="space-y-4">
          <p>
            Shop up to MAXIMUM OF N2,000,000 and pay interest free over 6 months
          </p>
          <p>No top-up shopping allowed. Settle one cycle before another.</p>
          <p>Does not apply to vehicles</p>
          <p>Your order will not ship until confirmed</p>
        </div>
      ),
    },
    "Special Deposit": {
      title: "Special Deposit",
      description: "For CNL Customers Only",
      content: (
        <div className="space-y-4">
          <p>
            Your purchase will be deducted from your special deposit wallet.
          </p>
          <p>Please put your employee number in the comment section.</p>
          <p>Your order has been received thanks.</p>
        </div>
      ),
    },
    "Cash on Delivery": {
      title: "Cash on Delivery",
      description: "Pay when you receive your items",
      content: (
        <div className="space-y-4">
          <p>Payment will be collected upon delivery</p>
          <p>Please have exact amount ready</p>
        </div>
      ),
    },
    "CEMCS Purchase Scheme": {
      title: "CEMCS Purchase Scheme",
      description: "For CEMCS Customers Only",
      content: (
        <div className="space-y-4">
          <p>This option is for CEMCS staff only.</p>
          <p>Amount will be deducted from your next pay slip.</p>
          <p>
            Your order has been taken, you will get notified when it is
            confirmed
          </p>
        </div>
      ),
    },
  };

  const [formData, setFormData] = useState<{
    image: File | null;
  }>({
    image: null,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClear = () => {
    setFormData({
      image: null,
    });
    setReceipt(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Manually reset the file input
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Whenever the receipt changes, update formData
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const checkVoucherBalance = async () => {
    if (!voucherCode) {
      toast.error("Please enter a voucher code");
      return;
    }

    setIsChecking(true);
    try {
      const response = await axios.post("/api/check-voucher", {
        code: voucherCode,
      });

      console.log("Response:", response.data);

      if (response.data.Response === "00") {
        const balance = Number(response.data.AmountToUse);
        setVoucherBalance(balance);
        toast.success(`Available balance: ${formatPrice(balance)}`);
      } else {
        toast.error("Invalid voucher code");
        setVoucherBalance(null);
      }
    } catch (error) {
      console.error("Voucher check error:", error);
      toast.error("Error checking voucher balance");
      setVoucherBalance(null);
    } finally {
      setIsChecking(false);
    }
  };

  const applyVoucher = async () => {
    if (!voucherCode || !voucherAmount) {
      toast.error("Please enter both voucher code and amount");
      return;
    }

    const amount = parseFloat(voucherAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > total) {
      toast.error("Voucher amount cannot be greater than total");
      return;
    }

    if (voucherBalance && amount > voucherBalance) {
      toast.error("Amount exceeds voucher balance");
      return;
    }

    setIsRedeeming(true);
    try {
      const response = await axios({
        method: "post",
        url: "https://c-integration.azurewebsites.net/suregift/redeem",
        headers: {
          apikey: "5fb808d57871fcacd36e2dd7ed9efe23",
        },
        data: {
          code: voucherCode,
          amount: amount,
        },
      });

      if (response.data.Response === "00") {
        setIsApplied(true);
        setVoucherDiscount(amount);
        toast.success("Voucher applied successfully");
      } else {
        toast.error("Failed to apply voucher");
      }
    } catch (error) {
      console.error("Voucher redeem error:", error);
      toast.error("Error applying voucher");
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleCheckout = async () => {
    // Check if user is authenticated
    if (!memberDetails?.membership_number) {
      router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }

    if (selectedPayment === "CPay") {
      if (loginUser?.userType === "erp") {
        toast.error("Not allowed");
        return;
      }
      setShowModal(true);
      return;
    }
    if (selectedPayment === "Special Deposit") {
      if (loginUser?.userType === "erp") {
        toast.error("Not allowed");
        return;
      }
    }

    if (selectedPayment === "Bank Transfer" && !formData.image) {
      console.log("Please attach receipt");
      toast.error("Please attach receipt");
      return;
    }

    setIsCheckingOut(true); // Start loading

    try {
      let imageUrl = "";
      if (formData.image) {
        // First, upload the image
        const formDataImage = new FormData();
        formDataImage.append("file", formData.image);

        const uploadResponse = await axios.post("/api/upload", formDataImage);
        imageUrl = uploadResponse.data.file_url;
        console.log("Image uploaded:", imageUrl);
      }

      const orderData = {
        doctype: "Product Order",
        order_date: new Date().toISOString().split("T")[0],
        customer: memberDetails.membership_number,
        billing_address: "123 Main Street",
        shipping_address: "123 Main Street",
        payment_method: selectedPayment,
        payment_status: "Pending",
        currency: "NGN",
        items: items.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          amount: item.price * item.quantity,
        })),
        subtotal: subtotal,
        shipping_fee: transactionFee,
        tax_amount: 0,
        total_amount: total,
        payment_receipt: imageUrl,
      };

      console.log("Order Data:", orderData);
      const response = await axios.post("/api/product-order", orderData);
      console.log("Checkout Response:", response.data);
      localStorage.setItem("productOrder_id", response.data.data.name);

      // Only clear cart after successful navigation
      const orderDetails = {
        id: response.data.name,
        payment_method: selectedPayment,
        items: items,
        subtotal: subtotal,
        shipping_fee: transactionFee,
        total_amount: total,
        payment_status: "Pending",
      };

      await router.push({
        pathname: "/thankyou",
        query: { orderData: JSON.stringify(orderDetails) },
      });

      // Clear cart after successful navigation
      clearCart();
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to complete checkout");
      setIsCheckingOut(false); // Reset loading state on error
    }
  };

  // const handleLoginSuccess = () => {
  //   setShowLoginModal(false);
  //   handleCheckout();
  // };

  if (items.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col items-center">
            <div className="relative h-60 w-60">
              <Image
                fill
                src="/empty-cart.png"
                alt="Empty cart"
                className="object-contain"
              />
            </div>
            <h2 className="mt-8 text-2xl font-bold">Your cart is empty</h2>
            <Link href="/shop">
              <Button className="mt-4">Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBack = () => {
    router.push("/shop");
  };

  return (
    <div>
      <Navbar />
      <div className="bg-white max-w-7xl mx-auto">
        <div className="block md:hidden mb-2 ml-4">
          <Button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-medium text-black-700 py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            ← Back
          </Button>
        </div>
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>

          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            {/* Cart Items Section */}
            <div className="lg:col-span-7">
              <ul className="divide-y divide-gray-200 border-b border-t border-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24">
                        <Image
                          fill
                          src={
                            item.pro_image?.startsWith("http")
                              ? item.pro_image
                              : item.pro_image
                                ? `${baseUrl}${item.pro_image}`
                                : "/shop-cap.jpg"
                          }
                          alt={item.product_name}
                          className="h-full w-full rounded-md object-cover object-center"
                        />
                      </div>
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                href={`/productdetails/${item.id}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {item.product_name}
                              </Link>
                            </h3>
                          </div>

                          <div className="mt-1 flex text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center border rounded-md">
                                <button
                                  onClick={() => decreaseQuantity(item.id)}
                                  className="px-3 py-1 border-r hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="px-4">{item.quantity}</span>
                                <button
                                  onClick={() => increaseQuantity(item.id)}
                                  className="px-3 py-1 border-l hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                          <Button
                            aria-label="remove product"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-5 w-5" aria-hidden="true" />
                          </Button>
                        </div>
                      </div>

                      <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                        <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>In stock</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Summary Section */}
            <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
              <h2 className="text-lg font-medium text-gray-900">
                Order summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(subtotal)}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Transaction Fee</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(transactionFee)}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="text-base font-medium text-gray-900">
                    Order Total
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {voucherDiscount > 0 && (
                      <>
                        <div className="text-sm text-gray-500">
                          <span className="line-through">
                            {formatPrice(subtotal + transactionFee)}
                          </span>
                        </div>
                        <div className="text-sm text-green-600">
                          - {formatPrice(voucherDiscount)} voucher applied
                        </div>
                      </>
                    )}
                    <div
                      className={`text-base font-medium ${voucherDiscount > 0 ? "text-green-600" : "text-gray-900"}`}
                    >
                      Final Price: {formatPrice(total)}
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium mb-1">Voucher</h3>
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Enter voucher code"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        disabled={isApplied}
                        className="mb-2"
                      />
                      <Button
                        onClick={checkVoucherBalance}
                        disabled={!voucherCode || isChecking || isApplied}
                        variant="outline"
                        className="w-full"
                      >
                        {isChecking ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            Checking...
                          </>
                        ) : (
                          "Check Balance"
                        )}
                      </Button>
                    </div>

                    {/* Add this section to show the balance */}
                    {voucherBalance !== null && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-600">
                          Available Balance:{" "}
                          <span className="font-semibold">
                            {formatPrice(voucherBalance)}
                          </span>
                        </p>
                      </div>
                    )}

                    {voucherBalance !== null && (
                      <div>
                        <Input
                          type="number"
                          placeholder="Enter amount to redeem (₦)"
                          value={voucherAmount}
                          onChange={(e) => setVoucherAmount(e.target.value)}
                          disabled={isApplied}
                          className="mb-2"
                          max={voucherBalance}
                        />
                        <Button
                          onClick={applyVoucher}
                          disabled={
                            !voucherAmount ||
                            isRedeeming ||
                            isApplied ||
                            parseFloat(voucherAmount) > voucherBalance
                          }
                          className="w-full"
                        >
                          {isRedeeming ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                              Applying...
                            </>
                          ) : (
                            "Apply Voucher"
                          )}
                        </Button>
                      </div>
                    )}

                    {isApplied && (
                      <div className="flex items-center text-sm text-green-600">
                        <Check className="mr-2 h-4 w-4" />
                        Voucher applied successfully
                      </div>
                    )}
                  </div>
                </div>

                {/* Add this to show voucher discount in the order summary */}
                {voucherDiscount > 0 && (
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-green-600">
                    <div className="flex items-center text-sm">
                      <span>Voucher Discount</span>
                    </div>
                    <div className="text-sm font-medium">
                      - {formatPrice(voucherDiscount)}
                    </div>
                  </div>
                )}

                {/* Payment Methods Section */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium mb-4">
                    Select Payment Method
                  </h3>
                  <RadioGroup
                    onValueChange={setSelectedPayment}
                    value={selectedPayment}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Bank Transfer" id="bank" />
                        <Label htmlFor="bank">
                          Bank Transfer (All Customers)
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="CPay" id="cpay" />
                        <Label htmlFor="cpay">CPay (CNL Customers Only)</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Special Deposit" id="special" />
                        <Label htmlFor="special">
                          Special Deposit (CNL Customers Only)
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Cash on Delivery" id="cod" />
                        <Label htmlFor="cod">Cash on Delivery</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="CEMCS Purchase Scheme"
                          id="scheme"
                        />
                        <Label htmlFor="scheme">
                          CEMCS Purchase Scheme (CEMCS Customers Only)
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {selectedPayment && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full mt-4"
                        onClick={() => setShowModal(true)}
                      >
                        View Payment Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {paymentMethods[selectedPayment]?.title}
                        </DialogTitle>
                        <DialogDescription>
                          {paymentMethods[selectedPayment]?.description}
                        </DialogDescription>
                      </DialogHeader>
                      {paymentMethods[selectedPayment]?.content}
                    </DialogContent>
                  </Dialog>
                )}
                {selectedPayment === "Bank Transfer" && (
                  <div className="mt-4 space-y-2">
                    <label
                      htmlFor="receipt-upload"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Upload Payment Receipt
                    </label>
                    <input
                      ref={fileInputRef} // Attach the ref here
                      id="receipt-upload"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.image && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-green-600">
                          Receipt Uploaded: {formData.image.name}
                        </p>
                        <button
                          type="button"
                          onClick={handleClear}
                          className="ml-2 text-sm font-medium text-red-600 hover:text-red-500"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  className="w-full bg-blue-500 mt-4"
                  size="lg"
                  disabled={!selectedPayment || isCheckingOut}
                  onClick={handleCheckout}
                >
                  {isCheckingOut ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </div>
                  ) : selectedPayment === "CPay" ? (
                    "Continue Checkout"
                  ) : (
                    "Complete Checkout"
                  )}
                </Button>
                {showModal && (
                  <AddPaymentMethod
                    amount={total}
                    onclose={() => setShowModal(false)}
                  />
                )}
                <Toaster expand={true} richColors position="bottom-center" />
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* <LoginModal 
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      onSuccess={handleLoginSuccess}
    /> */}
      <Footer />
    </div>
  );
};

export default Cart;
