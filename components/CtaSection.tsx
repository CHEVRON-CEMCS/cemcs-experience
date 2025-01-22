import React from "react";
import { ArrowRight } from "lucide-react";

export const CtaSection: React.FC = () => {
  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Join Our Credit Union?
            </h2>
            <p className="text-lg opacity-90">
              Experience the difference of member-owned banking with competitive
              rates and personalized service.
            </p>
          </div>
          <div className="flex gap-4">
            <a href="https://member.chevroncemcs.com/registration">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Open an Account
              </button>
            </a>
            {/* <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center hover:bg-blue-400 transition-colors">
              Learn More <ArrowRight className="ml-2 h-5 w-5" />
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
};
