import React from "react";
import { NavLanding } from "../../components/NavLanding";
import { HeroSlider } from "../../components/HeroSlider";
import { FeaturesGrid } from "../../components/FeaturesGrid";
import { ProductsSection } from "../../components/ProductsSection";
import { ServiceSection } from "../../components/ServiceSection";
import { StatsSection } from "../../components/StatsSection";
import { CtaSection } from "../../components/CtaSection";
import { FooterSection } from "../../components/FooterSection";
import { ImagePopupModal } from "../../components/ImagePopupModal";

function App() {
  return (
    <div className="min-h-screen">
      <NavLanding />
      <main>
        <HeroSlider />
        <ProductsSection />
        <FeaturesGrid />
        <ServiceSection />
        {/* <ProductsSection /> */}
        {/* <StatsSection /> */}
        <CtaSection />
      </main>
      <FooterSection />
      <ImagePopupModal />
    </div>
  );
}

export default App;
