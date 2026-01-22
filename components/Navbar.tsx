import React from 'react';
import { Shield } from 'lucide-react';

interface NavbarProps {
  onAdminClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6">
      <div className="container mx-auto px-8 max-w-7xl flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-bold tracking-tighter text-white lowercase drop-shadow-lg cursor-default">
            eterra.
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onAdminClick}
            className="p-2 text-brand-subtext hover:text-white transition-colors rounded-full hover:bg-white/5"
            aria-label="Admin Access"
          >
            <Shield className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;