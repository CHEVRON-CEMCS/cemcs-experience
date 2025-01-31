import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useAuthStore } from "../../store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/router";

interface ProductFormData {
  product_name: string;
  price: string;
  description: string;
  image: File | null;
}

const ProductUpload: React.FC = () => {
  const router = useRouter();
  const { memberDetails } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    product_name: "",
    price: "",
    description: "",
    image: null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!memberDetails) {
        toast.error("Please login to upload a product");
        return;
      }

      // Validate form data
      if (!formData.product_name || !formData.price || !formData.description) {
        toast.error("Please fill all required fields");
        return;
      }

      let imageUrl = "";
      if (formData.image) {
        // First, upload the image
        const formDataImage = new FormData();
        formDataImage.append("file", formData.image);

        const uploadResponse = await axios.post("/api/upload", formDataImage);
        imageUrl = uploadResponse.data.file_url;
        console.log("Image uploaded:", imageUrl);
      }

      // Create product data
      const productData = {
        subscriber_id: `SUB-${memberDetails.membership_number}`,
        owner_name: memberDetails.member_name,
        member_id: memberDetails.membership_number,
        image: imageUrl, // Use the uploaded image URL
        product_name: formData.product_name,
        price: parseFloat(formData.price),
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
      <Navbar />
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
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
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
                Product Image
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload Product"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
      <Toaster richColors position="bottom-center" />
    </div>
  );
};

export default ProductUpload;
