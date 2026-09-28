
import React from 'react';
import { CartItem } from '../types';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, size: string, delta: number) => void;
  onRemove: (id: string, size: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ items, onUpdateQuantity, onRemove, onCheckout, onContinueShopping }) => {
  const subtotal = items.reduce((sum, item) => {
    const priceNum = parseFloat(item.product.price.replace('$', ''));
    return sum + priceNum * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto reveal-up">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left: Items List */}
        <div className="lg:col-span-8 flex-1">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Your Wardrobe</h1>
            <button onClick={onContinueShopping} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors">Return to Floor</button>
          </div>

          {items.length === 0 ? (
            <div className="glass p-20 text-center border-dashed border-white/10">
              <p className="text-slate-500 uppercase tracking-widest text-sm font-bold mb-8 italic">No Assets Secured Yet</p>
              <button onClick={onContinueShopping} className="bg-white text-black px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Start Collection</button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, idx) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="glass p-4 flex gap-6 group relative">
                  <div className="w-24 h-32 bg-slate-900 rounded-sm overflow-hidden shrink-0">
                    <img src={item.product.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={item.product.title} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-black italic uppercase text-lg tracking-tight group-hover:text-rose-500 transition-colors">{item.product.title}</h3>
                        <button onClick={() => onRemove(item.product.id, item.selectedSize)} className="text-slate-600 hover:text-rose-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Size: {item.selectedSize}</p>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-4 glass bg-white/5 px-3 py-1 rounded-sm">
                        <button onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, -1)} className="text-slate-400 hover:text-white">-</button>
                        <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, 1)} className="text-slate-400 hover:text-white">+</button>
                      </div>
                      <p className="font-mono text-sm">${(parseFloat(item.product.price.replace('$', '')) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="lg:w-[400px]">
          <div className="glass p-8 lg:sticky lg:top-32 border-rose-500/20">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-10 text-rose-500">Order Intelligence</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                <span>Global Logistics</span>
                <span className="text-white font-mono">${shipping.toFixed(2)}</span>
              </div>
              <div className="h-px bg-white/5"></div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Total</span>
                <span className="text-3xl font-black italic tracking-tighter">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={onCheckout}
              disabled={items.length === 0}
              className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-xs hover:bg-rose-600 hover:text-white transition-all transform active:scale-95 disabled:opacity-30"
            >
              Secure Protocol
            </button>
            
            <p className="text-[8px] text-slate-600 font-bold uppercase text-center mt-6 tracking-widest leading-relaxed">
              * Secure encrypted transactions handled through the AFSANA proprietary gateway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};