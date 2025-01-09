import React from "react";
import { Users, Building2, Award, Landmark } from "lucide-react";

const stats = [
  {
    icon: <Users className="h-8 w-8" />,
    value: "200,000+",
    label: "Members",
  },
  {
    icon: <Building2 className="h-8 w-8" />,
    value: "2",
    label: "Branches",
  },
  {
    icon: <Award className="h-8 w-8" />,
    value: "95%",
    label: "Satisfaction Rate",
  },
  {
    icon: <Landmark className="h-8 w-8" />,
    value: "₦5B+",
    label: "Assets Managed",
  },
];

export const StatsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
