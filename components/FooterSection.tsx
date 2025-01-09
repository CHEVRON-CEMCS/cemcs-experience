import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const footerLinks = {
  products: ["Loans", "Investments", "Credit Cards", "Real Estate"],
  services: [
    "E-commerce Store",
    "Travels",
    "Retiree Platform",
    "Member Platform",
  ],
  company: ["About Us", "Blog"],
  support: ["Contact Us", "FAQs", "Help Center", "Report Fraud", "Feedback"],
};

export const FooterSection: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 py-16">
          {/* Contact Information */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-6">CEMCS</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span>Udeco Medical Rd, Chevy View Estate, Lekki, Lagos</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span>1-800-123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span>contact@cemcs.com</span>
              </div>
            </div>
            {/* <div className="flex gap-4 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div> */}
          </div>

          {/* Quick Links */}
          {/* <div>
            <h4 className="text-lg font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8 text-sm text-center">
          <p>© {new Date().getFullYear()} CEMCS. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-blue-400">
              Privacy Policy
            </a>
            {" • "}
            <a href="#" className="hover:text-blue-400">
              Terms of Service
            </a>
            {" • "}
            <a href="#" className="hover:text-blue-400">
              Sitemap
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
