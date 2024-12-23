import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  currentSlide: number;
  totalSlides: number;
}

export const SliderControls: React.FC<SliderControlsProps> = ({
  onPrevious,
  onNext,
  currentSlide,
  totalSlides,
}) => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-8">
      <button
        onClick={onPrevious}
        className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      
      <div className="flex gap-2">
        {[...Array(totalSlides)].map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-white w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};