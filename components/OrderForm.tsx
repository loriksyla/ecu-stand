import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, X, MapPin, Truck, Minus, Plus } from 'lucide-react';
import Button from './Button';
import { OrderFormData, Order } from '../types';

interface OrderFormProps {
  onClose?: () => void;
}

const COUNTRIES_DATA: Record<string, string[]> = {
  'Kosovë': [
    'Prishtinë', 'Prizren', 'Pejë', 'Gjakovë', 'Gjilan', 'Ferizaj', 'Mitrovicë', 
    'Vushtrri', 'Podujevë', 'Suharekë', 'Rahovec', 'Lipjan', 'Drenas', 'Klinë', 'Skenderaj'
  ],
  'Shqipëri': [
    'Tiranë', 'Durrës', 'Vlorë', 'Shkodër', 'Elbasan', 'Fier', 'Korçë', 
    'Berat', 'Lushnje', 'Kavajë', 'Gjirokastër', 'Sarandë', 'Lezhë', 'Kukës', 'Peshkopi'
  ],
  'Maqedoni e Veriut': [
    'Shkup', 'Tetovë', 'Kumanovë', 'Gostivar', 'Manastir', 'Strugë', 
    'Ohër', 'Dibër', 'Kërçovë', 'Veles', 'Stip'
  ]
};

const PHONE_CODES = [
  { country: 'Kosovë', code: '+383', flag: '🇽🇰' },
  { country: 'Shqipëri', code: '+355', flag: '🇦🇱' },
  { country: 'Maqedoni e Veriut', code: '+389', flag: '🇲🇰' }
];

const OrderForm: React.FC<OrderFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<OrderFormData>({
    firstName: '',
    lastName: '',
    country: '',
    city: '',
    address: '',
    phoneNumber: '',
    email: '',
    quantity: 1
  });

  const [quantityInput, setQuantityInput] = useState(formData.quantity.toString());
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [phonePrefix, setPhonePrefix] = useState('+383');

  // Sync local input state with formData.quantity (for when buttons update it)
  useEffect(() => {
    setQuantityInput(formData.quantity.toString());
  }, [formData.quantity]);

  // Auto-select phone prefix when country changes
  useEffect(() => {
    if (formData.country === 'Kosovë') setPhonePrefix('+383');
    else if (formData.country === 'Shqipëri') setPhonePrefix('+355');
    else if (formData.country === 'Maqedoni e Veriut') setPhonePrefix('+389');
  }, [formData.country]);

  // Calculate pricing
  const basePrice = 14.99;
  const quantity = formData.quantity || 1;
  const shippingCost = (formData.country === 'Shqipëri' || formData.country === 'Maqedoni e Veriut') ? 5.00 : 0;
  const totalPrice = (basePrice * quantity) + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'country') {
      // Reset city when country changes
      setFormData(prev => ({ ...prev, country: value, city: '' }));
      setIsCustomCity(false);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleQuantityChange = (delta: number) => {
    setFormData(prev => {
      const newQuantity = Math.max(1, (prev.quantity || 1) + delta);
      return { ...prev, quantity: newQuantity };
    });
  };

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'OTHER_CUSTOM') {
      setIsCustomCity(true);
      setFormData(prev => ({ ...prev, city: '' }));
    } else {
      setFormData(prev => ({ ...prev, city: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("submitting");

  try {
    const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
    const url = `${base}/api/order`;

    const orderPayload = {
      ...formData,
      phoneNumber: `${phonePrefix} ${formData.phoneNumber}`,
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: orderPayload }),
    });

    const raw = await resp.text();
    let data: any = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = {};
    }

    if (!resp.ok) throw new Error(data?.error || `API error (${resp.status})`);

    const newOrder: any = {
      ...orderPayload,
      id: (data?.orderId || Math.random().toString(36).slice(2, 11).toUpperCase()).toString(),
      date: data?.createdAt || new Date().toISOString(),
      status: "Pending",
    };

    try {
      const existingRaw = localStorage.getItem("ecu_orders");
      let existing: any[] = [];
      try {
        existing = existingRaw ? JSON.parse(existingRaw) : [];
        if (!Array.isArray(existing)) existing = [];
      } catch {
        existing = [];
      }
      localStorage.setItem("ecu_orders", JSON.stringify([newOrder, ...existing]));
    } catch {
      // ignore localStorage issues
    }

    setStatus("success");
  } catch (err) {
    console.error(err);
    setStatus("error");
  }
};

      const resp = await fetch(`${apiUrl}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: orderPayload })
      });

      if (!resp.ok) throw new Error('API error');
      const data = await resp.json();

      // 2) Also save locally so your Admin Panel continues to work
      const newOrder: Order = {
        ...orderPayload,
        id: (data?.orderId || Math.random().toString(36).substr(2, 9).toUpperCase()).toString(),
        date: data?.createdAt || new Date().toISOString(),
        status: 'Pending'
      };

      const existingOrders = JSON.parse(localStorage.getItem('ecu_orders') || '[]');
      localStorage.setItem('ecu_orders', JSON.stringify([newOrder, ...existingOrders]));

      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-brand-surface p-8 rounded-3xl shadow-2xl border border-brand-border text-center relative w-full max-w-lg mx-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-subtext hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Porosia u Konfirmua</h3>
        <p className="text-brand-subtext mb-8">
          Ne do t'ju kontaktojmë së shpejti në {formData.email}.
        </p>
        <Button onClick={onClose} fullWidth variant="outline">
          Mbyll
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-brand-surface p-8 rounded-3xl shadow-2xl border border-brand-border relative w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
      <button onClick={onClose} className="absolute top-4 right-4 text-brand-subtext hover:text-white transition-colors z-10">
        <X className="w-6 h-6" />
      </button>

      <div className="mb-6 text-center">
        <h3 className="text-xl font-medium text-brand-subtext mb-2">Total</h3>
        <div className="flex flex-col items-center justify-center">
          <span className="text-6xl font-black text-white tracking-tighter drop-shadow-lg">
            {totalPrice.toFixed(2)}€
          </span>
          
          {shippingCost > 0 && (
            <div className="mt-2 flex items-center gap-2 text-brand-subtext text-xs font-medium animate-in fade-in slide-in-from-top-1">
              <Truck className="w-3 h-3" />
              <span>+ 5.00€ Transport</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Quantity Selector */}
      <div className="flex items-center justify-center gap-4 mb-8">
         <button 
           type="button" 
           onClick={() => handleQuantityChange(-1)}
           disabled={formData.quantity <= 1}
           className="w-10 h-10 rounded-full bg-black/30 border border-brand-border flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
         >
           <Minus className="w-4 h-4" />
         </button>
         <div className="flex flex-col items-center w-20">
            <input 
              type="number" 
              min="1"
              value={quantityInput} 
              onChange={(e) => {
                const val = e.target.value;
                setQuantityInput(val);
                const parsed = parseInt(val);
                if (!isNaN(parsed) && parsed >= 1) {
                  setFormData(prev => ({ ...prev, quantity: parsed }));
                }
              }}
              onBlur={() => {
                // Restore valid value if empty or invalid on blur
                if (quantityInput === '' || isNaN(parseInt(quantityInput)) || parseInt(quantityInput) < 1) {
                  setQuantityInput(formData.quantity.toString());
                } else {
                  // Re-format valid number
                  setQuantityInput(formData.quantity.toString());
                }
              }}
              onFocus={(e) => e.target.select()}
              className="w-full bg-transparent text-2xl font-bold text-white text-center focus:outline-none focus:ring-0 border-none p-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-[10px] text-brand-subtext uppercase tracking-wider">Copë</span>
         </div>
         <button 
           type="button" 
           onClick={() => handleQuantityChange(1)}
           className="w-10 h-10 rounded-full bg-black/30 border border-brand-border flex items-center justify-center text-white hover:bg-white/10 transition-colors"
         >
           <Plus className="w-4 h-4" />
         </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full bg-black/30 border border-brand-border rounded-xl px-4 py-3 text-white placeholder-brand-subtext focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm"
            placeholder="Emri"
          />
          <input
            required
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full bg-black/30 border border-brand-border rounded-xl px-4 py-3 text-white placeholder-brand-subtext focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm"
            placeholder="Mbiemri"
          />
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <select
              required
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full bg-black/30 border border-brand-border rounded-xl px-4 py-3 text-white placeholder-brand-subtext focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="" disabled className="text-brand-subtext">Shteti</option>
              {Object.keys(COUNTRIES_DATA).map(country => (
                <option key={country} value={country} className="bg-brand-surface text-white">
                  {country}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-subtext">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          <div className="relative">
            {isCustomCity ? (
               <div className="relative">
                  <input
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-brand-border rounded-xl px-4 py-3 text-white placeholder-brand-subtext focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm pr-8"
                    placeholder="Shkruaj Qytetin..."
                    autoFocus
                  />
                  <button 
                    type="button" 
                    onClick={() => { setIsCustomCity(false); setFormData(prev => ({...prev, city: ''}))}}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-subtext hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
               </div>
            ) : (
              <>
                <select
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleCitySelect}
                  disabled={!formData.country}
                  className="w-full bg-black/30 border border-brand-border rounded-xl px-4 py-3 text-white placeholder-brand-subtext focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled className="text-brand-subtext">Qyteti</option>
                  {formData.country && COUNTRIES_DATA[formData.country].map(city => (
                    <option key={city} value={city} className="bg-brand-surface text-white">
                      {city}
                    </option>
                  ))}
                  {formData.country && (
                     <option value="OTHER_CUSTOM" className="bg-brand-surface text-brand-accent font-semibold">
                       + Tjetër (Shkruaj manualisht)
                     </option>
                  )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-subtext">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Address Field */}
        <div className="relative">
          <input
            required
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-black/30 border border-brand-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-brand-subtext focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm"
            placeholder="Adresa (Rruga, Nr, Hyrja...)"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-subtext">
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        {/* Phone Number Field with Dropdown */}
        <div className="flex gap-3">
          <div className="relative w-36">
             <select
                value={phonePrefix}
                onChange={(e) => setPhonePrefix(e.target.value)}
                className="w-full bg-black/30 border border-brand-border rounded-xl pl-3 pr-8 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm appearance-none cursor-pointer"
             >
                {PHONE_CODES.map(item => (
                   <option key={item.code} value={item.code} className="bg-brand-surface text-white">
                      {item.flag} {item.code}
                   </option>
                ))}
             </select>
             <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-subtext">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
             </div>
          </div>

          <input
            required
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="flex-1 bg-black/30 border border-brand-border rounded-xl px-4 py-3 text-white placeholder-brand-subtext focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm"
            placeholder="Numri (Pa prefix)"
          />
        </div>

        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-black/30 border border-brand-border rounded-xl px-4 py-3 text-white placeholder-brand-subtext focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm"
          placeholder="Adresa Email"
        />

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="w-full bg-white text-black font-bold uppercase tracking-wider py-4 rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg hover:shadow-white/20"
          >
            {status === 'submitting' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Përfundo Porosinë'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
