import React from "react";
import { NavLanding } from "../../components/NavLanding";
import { FooterSection } from "../../components/FooterSection";
import PrivacyPolicy from "../../components/PrivacyPolicy";

const privacy = () => {
  return (
    <div>
      <NavLanding />
      <PrivacyPolicy />
      <FooterSection />
    </div>
  );
};

export default privacy;
