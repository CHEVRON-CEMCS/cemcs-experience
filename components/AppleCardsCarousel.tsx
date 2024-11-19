"use client";
import Image from "next/image";
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

interface CardData {
    category: string;
    title: string;
    src: string;
    description: string;
  }
  
  export function AppleCardsCarouselDemo() {
    const cards = data.map((card, index) => ({
      ...card,
      content: <DummyContent cardData={card} />
    })).map((card, index) => (
      <Card key={card.src} card={card} index={index} />
    ));
  
    return (
      <div className="w-full h-full py-20">
        <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
          Discover So Much
        </h2>
        <Carousel items={cards} />
      </div>
    );
  }
  
  const DummyContent = ({ cardData }: { cardData: CardData }) => {
    return (
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            {cardData.title}
          </span>
          {" "}{cardData.description}
        </p>
        <div className="md:w-1/2 md:h-1/2 h-full w-full mx-auto relative aspect-square">
          <Image
            src={cardData.src}
            alt={cardData.title}
            fill
            className="object-contain"
          />
        </div>
      </div>
    );
  };

  const data: CardData[] = [
    {
      category: "Beach Paradise",
      title: "Tropical Getaways",
      src: "/card1.jpg",
      description: "Discover pristine beaches and crystal-clear waters in exotic locations.",
    },
    {
      category: "Mountain Adventure",
      title: "Peak Expeditions",
      src: "/card2.jpg",
      description: "Experience breathtaking mountain views and thrilling hiking trails.",
    },
    {
      category: "Cultural Tours",
      title: "Heritage Discovery",
      src: "/card3.jpg",
      description: "Immerse yourself in rich cultural traditions and historical landmarks.",
    },
    {
      category: "Safari Adventures",
      title: "Wildlife Encounters",
      src: "/card4.jpg",
      description: "Get up close with exotic wildlife in their natural habitats.",
    },
    {
      category: "City Breaks",
      title: "Urban Exploration",
      src: "/card5.jpg",
      description: "Experience vibrant city life and modern attractions.",
    },
    {
      category: "Island Hopping",
      title: "Paradise Islands",
      src: "/card6.jpg",
      description: "Journey through stunning island chains and hidden coves.",
    },
  ];