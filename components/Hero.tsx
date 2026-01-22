import React from 'react';

interface HeroProps {
  onOrderClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOrderClick }) => {
  return (
    <section className="relative h-full w-full overflow-hidden bg-brand-bg">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/background.png" 
          alt="ECU Stand Background" 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-black/80"></div>
      </div>
      
      <div className="container mx-auto px-6 h-full relative z-10 flex items-center justify-end">
        {/* Text Content - Aligned to the Right */}
        <div className="w-full md:w-1/2 flex flex-col items-end text-right space-y-4 pr-4 md:pr-12 pt-10">
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter drop-shadow-2xl">
            ECU <br/> stand
          </h1>
          
          <p className="text-xl md:text-2xl font-light text-white/90 tracking-widest lowercase mb-10 drop-shadow-xl">
            fits all models
          </p>
          
          <div className="pt-6">
             <button 
               onClick={onOrderClick}
               className="bg-black/70 backdrop-blur-md text-white border border-white/20 px-12 py-4 rounded-full uppercase tracking-[0.2em] text-sm font-semibold hover:bg-white hover:text-black transition-all duration-300 shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
             >
               Order
             </button>
          </div>

        </div>
      </div>

      {/* Copyright Footer */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <p className="text-[10px] md:text-xs text-brand-subtext/50 uppercase tracking-widest">
          © 2026 eterrabespoke. all rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Hero;