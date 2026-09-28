
import React, { useState } from 'react';

interface CheckoutPageProps {
  total: number;
  onOrderSubmit: (customer: any) => void;
  onBack: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ total, onOrderSubmit, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate logistics processing
    setTimeout(() => {
      setIsProcessing(false);
      onOrderSubmit(formData);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Logistics Form */}
        <div className="lg:col-span-7 reveal-up">
          <div className="flex items-center gap-4 mb-10">
            <button onClick={onBack} className="p-2 glass text-slate-500 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Fulfillment Protocol</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="glass p-8 border-white/5">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-rose-500">Logistics Address</p>
              <div className="grid grid-cols-2 gap-4">
                <input required name="name" value={formData.name} onChange={handleChange} className="col-span-2 bg-slate-900 border border-white/10 p-4 text-xs tracking-widest focus:border-rose-500 outline-none" placeholder="FULL NAME" />
                <input required name="email" value={formData.email} onChange={handleChange} className="col-span-2 bg-slate-900 border border-white/10 p-4 text-xs tracking-widest focus:border-rose-500 outline-none" placeholder="EMAIL ADDRESS" />
                <input required name="address" value={formData.address} onChange={handleChange} className="col-span-2 bg-slate-900 border border-white/10 p-4 text-xs tracking-widest focus:border-rose-500 outline-none" placeholder="SHIPPING ADDRESS" />
                <input required name="city" value={formData.city} onChange={handleChange} className="bg-slate-900 border border-white/10 p-4 text-xs tracking-widest focus:border-rose-500 outline-none" placeholder="CITY" />
                <input required name="postalCode" value={formData.postalCode} onChange={handleChange} className="bg-slate-900 border border-white/10 p-4 text-xs tracking-widest focus:border-rose-500 outline-none" placeholder="POSTAL CODE" />
              </div>
            </div>

            <div className="glass p-8 border-amber-500/20 bg-amber-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="text-[8px] font-black bg-amber-500 text-black px-2 py-0.5 rounded-sm tracking-widest">ACTIVE</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-amber-500">Payment: Cash on Delivery</p>
              <p className="text-slate-400 text-xs font-light leading-relaxed">
                Transaction finalized upon arrival. Please ensure you have <span className="text-white font-bold">${total.toFixed(2)}</span> ready for the logistics agent. No digital pre-payment required.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-sm shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-4"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Syncing Terminal...
                </>
              ) : `Confirm Delivery Request - $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Logic Summary */}
        <div className="lg:col-span-5 h-fit lg:sticky lg:top-32 reveal-up" style={{ animationDelay: '0.2s' }}>
           <div className="glass border-white/10 p-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10">Verification Preview</h3>
              <div className="space-y-6 mb-8">
                 <div className="flex justify-between text-[11px] font-bold tracking-widest text-slate-500">
                    <span>SECURITY STATUS</span>
                    <span className="text-green-500">VERIFIED</span>
                 </div>
                 <div className="flex justify-between text-[11px] font-bold tracking-widest text-slate-500">
                    <span>GATEWAY</span>
                    <span className="text-white">COD-PULSE-01</span>
                 </div>
                 <div className="flex justify-between text-[11px] font-bold tracking-widest text-slate-500">
                    <span>ETA</span>
                    <span className="text-white uppercase">3-5 LOGISTICS DAYS</span>
                 </div>
              </div>
              <div className="pt-8 border-t border-white/5">
                <p className="text-3xl font-black italic tracking-tighter text-right">${total.toFixed(2)}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
