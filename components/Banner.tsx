import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export function ImageSlider() {
    const images = [
        "/image1.jpg",
        "/image2.jpg"
      ];

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMainImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  function handlePreviousClick() {
    setMainImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }

  function handleNextClick() {
    setMainImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }

  function handleImageClick(index: number) {
    setMainImageIndex(index);
  }

  useEffect(() => {
    if (thumbnailsRef.current) {
      const scrollPosition = mainImageIndex * 104; // 100px width + 4px gap
      thumbnailsRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [mainImageIndex]);

  return (
    <div className="grid gap-6 md:gap-3 items-start">
      <div className="relative overflow-hidden rounded-lg">
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${mainImageIndex * 100}%)` }}>
          {images.map((image, index) => (
            <Image
              key={index}
              width={1000}
              height={600}
              src={image}
              alt={`Product image ${index + 1}`}
              className="object-cover w-full h-[600px] flex-shrink-0"
            />
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button onClick={handlePreviousClick} variant="ghost" size="icon">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button onClick={handleNextClick} variant="ghost" size="icon">
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div 
          ref={thumbnailsRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {images.map((image, index) => (
            <div
              className={`flex-shrink-0 border ${
                index === mainImageIndex
                  ? "border-2 border-primary"
                  : "border-gray-200"
              } relative overflow-hidden rounded-lg cursor-pointer`}
              key={index}
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image}
                alt={`Product Image ${index + 1}`}
                width={100}
                height={100}
                className="object-cover w-[100px] h-[100px]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}