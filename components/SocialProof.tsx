import React from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    name: "Alex M.",
    role: "Lead Tuner",
    company: "Boost Logic",
    quote: "I've used generic holders before, but the ECU Stand is in a different league. Unmatched stability."
  },
  {
    name: "Sarah K.",
    role: "Electronics Specialist",
    company: "EuroTech",
    quote: "Finally, a stand that holds heavy EDC17 units without wobbling. The adjustable angles are essential."
  },
  {
    name: "David R.",
    role: "Manager",
    company: "JDM Legends",
    quote: "Industrial quality that matches the rest of our lab equipment. Essential kit."
  }
];

const SocialProof: React.FC = () => {
  return (
    <section id="reviews" className="py-24 bg-brand-bg">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col items-center mb-16 space-y-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 text-brand-text fill-brand-text" />
            ))}
          </div>
          <h2 className="text-3xl font-bold text-brand-text text-center tracking-tight">Trusted by Pros.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white shadow-apple border border-transparent hover:border-gray-100 transition-all duration-300">
              <p className="text-brand-text text-base leading-relaxed font-medium mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-brand-text text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-brand-text font-semibold text-sm">{t.name}</h4>
                  <p className="text-xs text-brand-subtext">{t.role}, {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Minimalist Logos */}
        <div className="mt-20 pt-10 border-t border-brand-border flex flex-wrap justify-center gap-12 opacity-30 grayscale">
          {['TUNE-LAB', 'DYNAMO', 'REMAP-PRO', 'ECU-MASTERS'].map((brand, i) => (
            <div key={i} className="text-lg font-bold text-brand-text tracking-widest uppercase">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;