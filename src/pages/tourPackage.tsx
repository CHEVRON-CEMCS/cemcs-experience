import React from 'react';
import { NavTravel } from '../../components/NavTravel';
import { TourSlider } from '../../components/TourSlider';
import { TourCard } from '../../components/TourCard';

const tourPackage = () => {
  return (
    <div>
      <NavTravel />
      <div className="max-w-7xl mx-auto px-4">
        <div>
          <TourSlider />
        </div>
        <div className="mt-7">
          <h1 className="text-2xl font-bold">Discover Travel Packages</h1>
        </div>
        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8 mt-8 mb-10">
          <TourCard />
          <TourCard />
          <TourCard />
          <TourCard />
        </div>
      </div>
    </div>
  );
};

export default tourPackage;
