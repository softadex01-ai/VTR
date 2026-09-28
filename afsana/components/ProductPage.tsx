
import React, { useState } from 'react';
import { Product } from '../types';
import { TryOnModal } from './TryOnModal';
import { FitCalibrator } from './FitCalibrator';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (size: string) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ product, onBack, onAddToCart }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      try {
        alert("Please select a size");
      } catch (e) {
        console.warn("Please select a size");
      }
      return;
    }
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(selectedSize);
      setIsAdding(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto reveal-up">
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-slate-500 hover:text-white mb-12 transition-colors group">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Return to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 grid grid-cols-12 gap-6 h-fit">
          <div className="col-span-2 flex flex-col gap-4">
            {product.images.map((img, idx) => (
              <button key={idx} onClick={() => setActiveImageIndex(idx)} className={`relative aspect-3/4 glass p-1 transition-all duration-700 overflow-hidden rounded-sm group ${activeImageIndex === idx ? 'border-rose-500 ring-2 ring-rose-500/20 opacity-100' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}>
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </button>
            ))}
          </div>
          <div className="col-span-10 relative group glass p-2 rounded-sm overflow-hidden bg-slate-900 shadow-2xl">
            <div className="aspect-3/4 overflow-hidden relative">
              <img key={activeImageIndex} src={product.images[activeImageIndex]} alt={product.title} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
            </div>
            <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
              <span className="bg-white text-black px-4 py-1.5 text-[10px] font-black italic shadow-2xl tracking-widest uppercase">Angle 0{activeImageIndex + 1}</span>
            </div>
            {/* Try-On Trigger Overlay */}
            <button 
              onClick={() => setShowTryOn(true)}
              className="absolute bottom-6 left-6 glass px-6 py-3 border-rose-500/50 flex items-center gap-3 group/btn hover:bg-rose-600 transition-all hover:border-transparent"
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse group-hover/btn:bg-white"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Initialize Virtual Try-On</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
          <div className="reveal-up">
            <p className="text-rose-500 font-black text-xs tracking-[0.5em] uppercase mb-4">{product.category}</p>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase leading-[0.8]">{product.title}</h1>
            <p className="text-3xl font-light text-slate-200 mb-8 italic opacity-80">{product.price}</p>
            <p className="text-slate-400 leading-relaxed mb-10 font-light text-lg">{product.description}</p>
            <div className="mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-6">Select Drape Size</span>
              <div className="flex flex-wrap gap-4 mb-6">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`flex-1 min-w-[70px] h-[70px] flex items-center justify-center glass text-sm font-black transition-all rounded-sm ${selectedSize === size ? 'bg-white text-black scale-105 shadow-xl shadow-white/10 ring-2 ring-white' : 'hover:border-rose-500 text-slate-400 hover:text-white'}`}>{size}</button>
                ))}
              </div>
              
              {/* Sizing and Fit Biometrics Integrations */}
              <FitCalibrator 
                product={product} 
                selectedSize={selectedSize} 
                onSizeSelect={(size) => setSelectedSize(size)} 
              />
            </div>
            <div className="flex flex-col gap-4 relative">
              {addedSuccess && <div className="absolute -top-12 left-0 right-0 glass border-rose-500/50 p-2 text-center rounded-sm reveal-up"><span className="text-[10px] font-black text-rose-500 tracking-widest uppercase">Asset Secured</span></div>}
              <button onClick={handleAddToCart} disabled={isAdding} className="group relative w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-sm overflow-hidden transition-all transform active:scale-95 disabled:opacity-50">
                <span className="relative z-10">{isAdding ? 'Securing Item...' : 'Acquire Piece'}</span>
                <div className="absolute inset-0 bg-rose-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showTryOn && <TryOnModal product={product} onClose={() => setShowTryOn(false)} />}
    </div>
  );
};
