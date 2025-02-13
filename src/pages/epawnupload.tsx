import React, { useState, ChangeEvent } from "react";
import { EPawnNav } from "../../components/EPawnNav";
import Footer from "../../components/Footer";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useAuthStore } from "../../store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import TermsModal from "../../components/Terms";
import { useRouter } from "next/router";

interface ProductFormData {
  product_name: string;
  price: string;
  description: string;
  images: (File | null)[];
}

const ProductUpload: React.FC = () => {
  const router = useRouter();
  const { memberDetails } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    product_name: "",
    price: "",
    description: "",
    images: [null, null, null, null],
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const updatedImages = [...formData.images];
      updatedImages[index] = e.target.files[0];

      setFormData((prev) => ({
        ...prev,
        images: updatedImages,
      }));
    }
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, ""); // Remove commas

    if (rawValue === "") {
      setFormData((prev) => ({
        ...prev,
        price: "",
      }));
    } else if (!isNaN(Number(rawValue))) {
      const numericValue = Number(rawValue);
      setFormData((prev) => ({
        ...prev,
        price: numericValue.toLocaleString("en-US"), // Format before storing
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberDetails) {
      toast.error("Please login to upload a product");
      return;
    }

    // Validate form data
    if (!formData.product_name || !formData.price || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    // Open the terms modal before proceeding
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = async (accepted: boolean) => {
    setIsModalOpen(false);

    if (!accepted) {
      toast.error("You must accept the terms to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedImages: string[] = [];

      for (let i = 0; i < formData.images.length; i++) {
        if (formData.images[i]) {
          const formDataImage = new FormData();
          formDataImage.append("file", formData.images[i]!);

          const uploadResponse = await axios.post("/api/upload", formDataImage);
          uploadedImages.push(uploadResponse.data.file_url);
        } else {
          uploadedImages.push(""); // Placeholder if no image is uploaded
        }
      }

      // Create product data
      const productData = {
        subscriber_id: `SUB-${memberDetails?.membership_number}`,
        owner_name: memberDetails?.member_name,
        member_id: memberDetails?.membership_number,
        image: uploadedImages[0], // Main image
        image_2: uploadedImages[1] || null, // Extra images
        image_3: uploadedImages[2] || null,
        image_4: uploadedImages[3] || null,
        product_name: formData.product_name,
        price: parseFloat(formData.price.replace(/,/g, "")),
        description: formData.description,
      };

      const response = await axios.post("/api/epawn-products", productData);
      console.log("Product created:", response.data);

      toast.success("Product uploaded successfully!");
      router.push("/biddingproducts");
    } catch (error: any) {
      console.error("Error uploading product:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to upload product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <EPawnNav />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Upload Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name *
              </label>
              <Input
                required
                value={formData.product_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    product_name: e.target.value,
                  }))
                }
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Price (₦) *
              </label>
              <Input
                required
                type="text"
                value={formData.price}
                onChange={handlePriceChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Product Images
              </label>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="mb-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)} // Pass index to track each image
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                  />
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload Product"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
      <Toaster richColors position="bottom-center" />
      <TermsModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
};

export default ProductUpload;
