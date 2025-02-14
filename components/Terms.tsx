import React from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/authStore";

interface TermsModalProps {
  isOpen: boolean;
  onClose: (accepted: boolean) => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { memberDetails, loginUser } = useAuthStore();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative">
        {/* Close button */}
        <button
          onClick={() => onClose(false)}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>

          <div className="prose prose-sm max-w-none space-y-4 mb-6">
            <p>
              I,{" "}
              <span className="font-bold">
                {loginUser?.full_name} {memberDetails?.membership_number}
              </span>{" "}
              hereby acknowledge and confirm that I have uploaded this product
              to CEMCS and certify that all information provided is true,
              accurate, and complete to the best of my knowledge.
            </p>

            <p>I understand and agree that by uploading this product:</p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                All product descriptions, specifications, and images are
                accurate and truthful.
              </li>
              <li>
                The information provided does not infringe upon any third-party
                rights.
              </li>
            </ul>

            <p>
              I will indemnify and hold CEMCS harmless from any claims, damages,
              losses, liabilities, costs, and expenses (including attorney's
              fees) arising from:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>Any inaccurate or misleading product information.</li>
              <li>False or incorrect product descriptions.</li>
              <li>
                Any misrepresentation of the product's features or capabilities.
              </li>
              <li>Any violation of applicable laws or regulations.</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => onClose(false)} // Return false when canceling
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onClose(true)} // Return true when accepting
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              I Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
