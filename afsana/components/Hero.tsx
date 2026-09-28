import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_HERO } from '../constants';
import { generateHeroHook } from '../services/geminiService';

export const Hero: React.FC = () => {
  const [content, setContent] = useState(INITIAL_HERO);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleRefreshHook = async () => {
    setIsLoading(true);
    const themes = ['cyber-urban', 'brutalist minimalism', 'heritage tech', 'tokyo street night', 'asymmetrical aesthetics'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const newContent = await generateHeroHook(randomTheme);
    setContent(newContent);
    setIsLoading(false);
  };

  const ActionButtons = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col sm:flex-row items-center gap-6 reveal-up ${className}`} style={{ animationDelay: '0.4s' }}>
      <button className="group relative w-full sm:w-auto px-12 py-6 bg-slate-950 dark:bg-white text-white dark:text-black overflow-hidden rounded-sm font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:shadow-[0_0_50px_rgba(244,63,94,0.2)]">
        <span className="relative z-10 group-hover:text-white dark:group-hover:text-black transition-colors">Launch Catalog</span>
        <div className="absolute inset-0 bg-rose-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 cubic-bezier(0.19, 1, 0.22, 1)"></div>
      </button>
      
      <button 
        onClick={handleRefreshHook}
        disabled={isLoading}
        className="flex items-center gap-4 text-slate-950 dark:text-white text-[10px] font-black uppercase tracking-[0.3em] hover:text-rose-500 transition-colors group"
      >
        <div className="w-14 h-14 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:border-rose-500 transition-all bg-black/5 dark:bg-white/5 backdrop-blur-xl group-hover:scale-110">
          <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        Recalibrate Vision
      </button>
    </div>
  );

  return (
    <section className="relative min-h-[110vh] flex flex-col justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.1] dark:opacity-[0.15] pointer-events-none" 
             style={{ 
               backgroundImage: `radial-gradient(circle at 1px 1px, #f43f5e 1px, transparent 0)`, 
               backgroundSize: '60px 60px' 
             }}>
        </div>

        {/* Floating Brand Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div 
            className="absolute top-[10%] right-[-5%] text-[25vw] font-black italic outline-text opacity-5 dark:opacity-10 leading-none whitespace-nowrap"
            style={{ transform: `translateX(${scrollY * 0.1}px)` }}
          >
            ATELIER
          </div>
          <div 
            className="absolute bottom-[5%] left-[-10%] text-[20vw] font-black italic text-rose-500/5 leading-none whitespace-nowrap"
            style={{ transform: `translateX(${scrollY * -0.05}px)` }}
          >
            AFSANA
          </div>
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-slate-50 dark:from-slate-950 via-transparent to-slate-50 dark:to-slate-950"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 flex flex-col lg:grid lg:grid-cols-12 gap-8 sm:gap-12 items-center py-24 sm:py-32">
        
        {/* Left Column: Typography */}
        <div className="lg:col-span-7 text-left order-1">
          <div className="reveal-up inline-flex items-center gap-4 mb-8" style={{ animationDelay: '0s' }}>
            <span className="w-12 h-0.5 bg-rose-500"></span>
            <span className="text-xs font-black uppercase tracking-[0.5em] text-slate-500 dark:text-slate-400 italic">EST. 2024 / DROP 04</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter mb-12 italic uppercase select-none">
            <span className="block text-slate-900 dark:text-white reveal-up" style={{ animationDelay: '0.1s' }}>TECHNICAL</span>
            <span className="text-gradient block reveal-up" style={{ animationDelay: '0.2s' }}>ATELIER</span>
          </h1>

          <div className="max-w-xl mb-12 transition-all duration-700 reveal-up" style={{ animationDelay: '0.3s' }}>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                <div className="h-4 bg-black/5 dark:bg-white/5 w-full rounded animate-pulse"></div>
                <div className="h-4 bg-black/5 dark:bg-white/5 w-4/5 rounded animate-pulse"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase italic flex items-center gap-4">
                  {content.headline}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl leading-relaxed font-light border-l-2 border-rose-500 pl-6">
                  {content.subheadline}
                </p>
              </div>
            )}
          </div>

          <ActionButtons className="hidden lg:flex" />
        </div>

        {/* Right Column: Visual Component */}
        <div className="lg:col-span-5 relative order-2 w-full h-125 sm:h-175 flex items-center justify-center">
          <div 
            className="relative z-30 group w-full max-w-md"
            style={{ 
              transform: `perspective(2000px) rotateX(${-mousePos.y * 0.3}deg) rotateY(${mousePos.x * 0.3}deg) translateY(${scrollY * 0.05}px)`
            }}
          >
            {/* Main Glass Image Frame */}
            <div className="relative glass p-2 rounded-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="relative overflow-hidden rounded-xl">
                <img 
                  src="/image3.jfif" 
                  alt="High Tech Streetwear" 
                  className="w-full h-100 sm:h-150 object-cover contrast-125 brightness-110 grayscale hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                />
                
                {/* Floating HUD on Image */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                  <div className="flex justify-between items-start">
                    <div className="glass px-3 py-1.5 rounded-lg border-white/10 bg-black/40 backdrop-blur-md">
                      <span className="text-[8px] font-black text-white uppercase tracking-widest">Live Visual Rendering</span>
                    </div>
                    <div className="w-10 h-10 glass rounded-full flex items-center justify-center border-white/20">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                    </div>
                  </div>

                  <div className="glass p-6 border-white/10 bg-black/40 backdrop-blur-lg rounded-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-rose-500 uppercase tracking-[0.3em]">Asset Protocol</span>
                        <h4 className="text-xl font-black italic uppercase text-white tracking-tighter">ESSENTIAL TEE 01</h4>
                      </div>
                      <span className="text-sm font-mono text-white opacity-60">$22.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decorative Frame */}
            <div className="absolute -inset-10 border border-rose-500/20 rounded-[40px] pointer-events-none -z-10 animate-pulse-slow"></div>
          </div>
        </div>

        {/* Mobile Buttons */}
        <div className="order-3 w-full flex lg:hidden">
          <ActionButtons className="w-full mt-4" />
        </div>
      </div>
    </section>
  );
};