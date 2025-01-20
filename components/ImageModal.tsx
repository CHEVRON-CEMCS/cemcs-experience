import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageModalProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset currentImageIndex when modal is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        aria-label="Close modal"
      >
        <X size={24} />
      </button>

      {/* Navigation buttons */}
      <button 
        onClick={handlePrevious}
        className="absolute left-4 text-white hover:text-gray-300"
        aria-label="Previous image"
      >
        <ChevronLeft size={36} />
      </button>
      
      <button 
        onClick={handleNext}
        className="absolute right-4 text-white hover:text-gray-300"
        aria-label="Next image"
      >
        <ChevronRight size={36} />
      </button>

      {/* Image container */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4">
        <div className="relative w-full h-full">
          <Image
            src={images[currentImageIndex]}
            alt={`Hotel image ${currentImageIndex + 1}`}
            layout="fill"
            objectFit="contain"
            className="select-none"
            priority={true}
          />
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;