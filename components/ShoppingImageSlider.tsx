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

interface CarouselData {
  name: string;
  slides: Slide[];
}

export function ShoppingImageSlider() {
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
        const shoppingCarousel = carouselResponse.data.data.find(
          (carousel: { name: string }) => carousel.name === "CR-02283"
        );

        if (shoppingCarousel) {
          const detailsResponse = await axios.get(
            `/api/Carousel/${shoppingCarousel.name}`
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
      <div className="w-full h-[380px] md:h-[420px] bg-gray-200 animate-pulse rounded-lg" />
    );
  }

  if (error) {
    return (
      <div className="w-full h-[380px] md:h-[420px] flex items-center justify-center">
        Error loading carousel: {error}
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full h-[380px] md:h-[420px] flex items-center justify-center">
        No slides available
      </div>
    );
  }

  return (
    <div className="w-full grid gap-4 md:gap-6 items-start">
      <div className="relative w-full overflow-hidden rounded-lg aspect-[3/2] md:aspect-[3/1]">
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
                className="object-cover w-full h-[250px] md:h-[420px]"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-between px-2 md:px-4">
          <Button
            onClick={handlePreviousClick}
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white/90"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </Button>
          <Button
            onClick={handleNextClick}
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white/90"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </Button>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="relative">
          <div
            ref={thumbnailsRef}
            className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide"
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
                <div className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px]">
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

export default ShoppingImageSlider;
