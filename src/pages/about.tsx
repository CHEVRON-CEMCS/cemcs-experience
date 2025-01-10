import React from "react";
import { NavLanding } from "../../components/NavLanding";
import { FooterSection } from "../../components/FooterSection";
import AboutUs from "../../components/AboutUs";

const about: React.FC = () => {
  return (
    <div>
      <NavLanding />
      <AboutUs />
      <FooterSection />
    </div>
  );
};

export default about;
