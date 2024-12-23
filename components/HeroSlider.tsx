import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { sliderData } from './SliderData';
import { SliderControls } from './SliderControls';

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {sliderData.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            transform: `translateX(${(index - currentSlide) * 100}%)`,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-6">{slide.title}</h1>
              <p className="text-xl mb-8">{slide.description}</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center">
                {slide.cta} <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <SliderControls
        onPrevious={handlePrevious}
        onNext={handleNext}
        currentSlide={currentSlide}
        totalSlides={sliderData.length}
      />
    </div>
  );
};