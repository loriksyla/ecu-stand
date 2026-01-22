import React from 'react';
import { Cpu } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-bg py-12 border-t border-brand-border/50">
      <div className="container mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-6 opacity-80">
          <Cpu className="w-5 h-5 text-brand-text" />
          <span className="text-base font-semibold text-brand-text tracking-tight">ECU Stand</span>
        </div>
        <div className="flex justify-center gap-8 mb-8 text-xs font-medium text-brand-subtext">
          <a href="#" className="hover:text-brand-text transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-text transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-brand-text transition-colors">Support</a>
        </div>
        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} ECU Stand Industries. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;