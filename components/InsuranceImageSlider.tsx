import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import axios from "axios";

interface Slide {
  name: string;
  heading: string;
  image: string;
}

export function InsuranceImageSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging.chevroncemcs.com";

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const carouselResponse = await axios.get("/api/Carousel");
        // Find the carousel with name "Travels"
        const travelsCarousel = carouselResponse.data.data.find(
          (carousel: { name: string }) => carousel.name === "CR-04645"
        );

        if (travelsCarousel) {
          const detailsResponse = await axios.get(
            `/api/Carousel/${travelsCarousel.name}`
          );
          setSlides(detailsResponse.data.data.slides);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch carousel data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setMainImageIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [slides.length]);

  function handlePreviousClick() {
    setMainImageIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  }

  function handleNextClick() {
    setMainImageIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  }

  function handleImageClick(index: number) {
    setMainImageIndex(index);
  }

  useEffect(() => {
    if (thumbnailsRef.current) {
      const scrollPosition = mainImageIndex * 104;
      thumbnailsRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [mainImageIndex]);

  if (loading) {
    return (
      <div className="w-full h-[380px] bg-gray-200 animate-pulse rounded-lg" />
    );
  }

  if (error) {
    return (
      <div className="w-full h-[380px] flex items-center justify-center">
        Error loading carousel: {error}
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full h-[380px] flex items-center justify-center">
        No slides available
      </div>
    );
  }

  return (
    <div className="w-full grid gap-6 md:gap-3 items-start">
      <div className="relative w-full overflow-hidden rounded-lg aspect-[3/1]">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${mainImageIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.name} className="relative w-full flex-shrink-0">
              <Image
                src={`${baseUrl}${slide.image}`}
                alt={slide.heading}
                width={1280}
                height={427}
                priority={index === 0}
                className="object-cover w-full h-[410px]"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button
            onClick={handlePreviousClick}
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white/90"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            onClick={handleNextClick}
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white/90"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="relative hidden">
          <div
            ref={thumbnailsRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            {slides.map((slide, index) => (
              <div
                className={`flex-shrink-0 border ${
                  index === mainImageIndex
                    ? "border-2 border-primary"
                    : "border-gray-200"
                } relative overflow-hidden rounded-lg cursor-pointer`}
                key={slide.name}
                onClick={() => handleImageClick(index)}
              >
                <div className="relative w-[100px] h-[100px]">
                  <Image
                    src={`${baseUrl}${slide.image}`}
                    alt={slide.heading}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
