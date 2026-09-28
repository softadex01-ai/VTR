import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';

interface NavbarProps {
  onHome: () => void;
  onEnterCommand: () => void;
  onOpenCart: () => void;
  cartCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onHome, onEnterCommand, onOpenCart, cartCount, theme, onToggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-60 transition-all duration-700 ease-in-out ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10">
        <div className={`glass relative flex items-center justify-between px-6 py-3.5 sm:py-4 rounded-2xl overflow-hidden transition-all duration-700 ${isScrolled ? 'shadow-2xl shadow-rose-500/10' : 'border-transparent bg-transparent backdrop-blur-none shadow-none'}`}>
          
          {/* Logo Section */}
          <div onClick={() => { onHome(); setIsMenuOpen(false); }} className="flex items-center gap-3 group cursor-pointer relative z-70">
            <div className="w-10 h-10 bg-slate-950 dark:bg-white rounded-xl flex items-center justify-center group-hover:bg-rose-600 group-hover:scale-110 transition-all shadow-xl">
              <span className="font-black text-white dark:text-black text-xl italic group-hover:text-white transition-colors">A</span>
            </div>
            <div className="flex flex-col -gap-1">
              <span className="font-black text-xl sm:text-2xl tracking-tighter text-slate-950 dark:text-white leading-none">
                AFSANA<span className="text-rose-500">.</span>
              </span>
              <span className="text-[7px] font-bold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400 opacity-60">Technical Atelier</span>
            </div>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {NAV_ITEMS.map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-white transition-all relative group py-2"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Utility Controls */}
          <div className="flex items-center gap-2 sm:gap-6 relative z-70">
            <button 
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-900 dark:text-white"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>

            <button 
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-black hover:bg-rose-600 dark:hover:bg-rose-500 transition-all hover:scale-105 active:scale-95 group"
            >
              <svg className="w-5 h-5 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-950 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-950 dark:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`lg:hidden fixed inset-0 z-55 transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
          <div className={`absolute right-0 top-0 bottom-0 w-[80%] max-w-sm glass border-l border-white/10 p-10 flex flex-col justify-center gap-10 transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {NAV_ITEMS.map((item, idx) => (
              <a 
                key={item.label} 
                href={item.href} 
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl font-black italic tracking-tighter uppercase text-slate-400 hover:text-rose-500 dark:hover:text-white transition-all reveal-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {item.label}
              </a>
            ))}
            </div>
        </div>
      </div>
    </nav>
  );
};