import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import OrderForm from './components/OrderForm';
import AdminPanel from './components/AdminPanel';

function App() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-brand-bg flex flex-col font-sans text-brand-text selection:bg-white selection:text-black relative">
      <Navbar onAdminClick={() => setIsAdminOpen(true)} />
      
      <main className="flex-grow flex flex-col h-full">
        <Hero onOrderClick={() => setIsOrderOpen(true)} />
      </main>

      {/* Order Modal Overlay */}
      {isOrderOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOrderOpen(false)}
          ></div>
          <div className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in duration-300">
             <OrderForm onClose={() => setIsOrderOpen(false)} />
          </div>
        </div>
      )}

      {/* Admin Panel Overlay */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
            onClick={() => setIsAdminOpen(false)}
          ></div>
          <div className="relative z-10 w-full animate-in fade-in slide-in-from-bottom-10 duration-300">
             <AdminPanel onClose={() => setIsAdminOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;