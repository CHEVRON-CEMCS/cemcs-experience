import React from 'react';
import { Shield, Percent, CreditCard } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    Icon: Shield,
    title: 'Secure Banking',
    description: 'Your security is our top priority with advanced encryption and fraud protection.',
  },
  {
    Icon: Percent,
    title: 'Great Rates',
    description: 'Enjoy competitive rates on savings accounts and loans.',
  },
  {
    Icon: CreditCard,
    title: 'Digital Banking',
    description: 'Access your accounts anytime, anywhere with our digital banking solutions.',
  },
];

export const FeaturesGrid: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};