import React from 'react';
import { Hammer, Move3d, Component } from 'lucide-react';
import { FeatureItem } from '../types';

const features: FeatureItem[] = [
  {
    title: "Durability",
    description: "Aerospace-grade 6061 aluminum with an anodized matte finish. Resistant to oil and heat.",
    icon: Hammer
  },
  {
    title: "Adjustability",
    description: "360° rotating base and 90° tilt mechanism. Find your perfect ergonomic angle.",
    icon: Move3d
  },
  {
    title: "Compatibility",
    description: "Adapts to any ECU form factor. Soft-touch silicone pads prevent scratching.",
    icon: Component
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-brand-surface">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-brand-text mb-4 tracking-tight">Engineered for perfection.</h2>
          <p className="text-brand-subtext max-w-2xl mx-auto text-lg">
            The standard used by master tuners worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-3xl bg-brand-bg hover:bg-white transition-all duration-500 hover:shadow-apple-hover"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-6 text-brand-accent">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-brand-text mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-brand-subtext leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;