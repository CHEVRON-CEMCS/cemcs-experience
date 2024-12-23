import React from 'react';
import { NavLanding } from '../../components/NavLanding';
import { HeroSlider } from '../../components/HeroSlider';
import { FeaturesGrid } from '../../components/FeaturesGrid';
import { ProductsSection } from '../../components/ProductsSection';
import { StatsSection } from '../../components/StatsSection';
import { CtaSection } from '../../components/CtaSection';
import { FooterSection } from '../../components/FooterSection';


function App() {
  return (
    <div className="min-h-screen">
      <NavLanding />
      <main>
        <HeroSlider />
        <FeaturesGrid />
        <ProductsSection />
        <StatsSection />
        <CtaSection />
      </main>
      <FooterSection />
    </div>
  );
}

export default App;