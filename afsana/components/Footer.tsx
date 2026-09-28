
import React from 'react';

interface FooterProps {
  onEnterCommand?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onEnterCommand }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 border-t border-white/5 pt-24 pb-12 overflow-hidden">
      {/* Background Decorative Branding */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <span className="text-[20vw] font-black outline-text opacity-[0.03] whitespace-nowrap italic">
          AFSANA.STUDIO
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-rose-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="font-black text-white text-xl italic">A</span>
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase italic">AFSANA<span className="text-rose-500">.</span></span>
            </div>
            
            <p className="text-slate-400 text-lg font-light leading-relaxed max-w-sm">
              Technical innovation for the modern nomad. Join the transmission for early access to Drop 05.
            </p>

            <form className="relative max-w-md group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="EMAIL@PROTOCOL.COM" 
                className="w-full bg-white/5 border border-white/10 p-5 pr-40 text-xs tracking-widest focus:border-rose-500 outline-none transition-all rounded-sm font-mono"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all rounded-sm">
                Subscribe
              </button>
            </form>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Collection</h4>
              <ul className="space-y-4">
                <li><a href="#shop" className="text-sm text-slate-400 hover:text-white transition-colors">Shop All Assets</a></li>
                <li><a href="#hoodies" className="text-sm text-slate-400 hover:text-white transition-colors">Outerwear</a></li>
                <li><a href="#tees" className="text-sm text-slate-400 hover:text-white transition-colors">Technical Knits</a></li>
                <li><a href="#dropshoulder" className="text-sm text-slate-400 hover:text-white transition-colors">Archival Pieces</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Intelligence</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">The Manifesto</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Sizing Matrix</a></li>
                <li><a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Logistics Track</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Connect</h4>
              <div className="flex gap-4">
                {['Instagram', 'X-Studio', 'Discord'].map((social) => (
                  <a 
                    key={social} 
                    href="#" 
                    className="w-10 h-10 glass border-white/10 rounded-sm flex items-center justify-center hover:border-rose-500 hover:bg-rose-500/10 transition-all text-slate-400 hover:text-white"
                    title={social}
                  >
                    <span className="text-[8px] font-black">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom HUD bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
            <span>© {currentYear} AFSANA CORP</span>
            <span className="hidden md:inline h-1 w-1 bg-slate-800 rounded-full"></span>
            <span className="hidden md:inline">SYSTEM STATUS: <span className="text-green-500">OPTIMAL</span></span>
          </div>

          <div className="flex items-center gap-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
            <span>COORD: 35.6764° N, 139.6500° E</span>
            <span className="hidden md:inline h-1 w-1 bg-slate-800 rounded-full"></span>
            <button className="hover:text-rose-500 transition-colors">Privacy Protocol</button>
            <button className="hover:text-rose-500 transition-colors">Terms of Access</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
