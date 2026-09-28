import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { getAiFitAnalysis, FitSizeReport } from '../services/geminiService';

interface FitCalibratorProps {
  product: Product;
  selectedSize: string;
  onSizeSelect?: (size: string) => void;
  compactOnly?: boolean; // For when we only want display and no heavy controls
}

export const FitCalibrator: React.FC<FitCalibratorProps> = ({ 
  product, 
  selectedSize,
  onSizeSelect,
  compactOnly = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Shared user biometric state loaded from and saved to localStorage
  const [height, setHeight] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('afs_wearer_height')) || 178;
    } catch {
      return 178;
    }
  });
  const [weight, setWeight] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('afs_wearer_weight')) || 74;
    } catch {
      return 74;
    }
  });
  const [fitPref, setFitPref] = useState<'slim' | 'regular' | 'oversized'>(() => {
    try {
      return (localStorage.getItem('afs_wearer_pref') as 'slim' | 'regular' | 'oversized') || 'oversized';
    } catch {
      return 'oversized';
    }
  });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<FitSizeReport | null>(null);

  // Sync back to local storage
  useEffect(() => {
    try {
      localStorage.setItem('afs_wearer_height', String(height));
      localStorage.setItem('afs_wearer_weight', String(weight));
      localStorage.setItem('afs_wearer_pref', fitPref);
    } catch (e) {
      // ignore
    }
  }, [height, weight, fitPref]);

  // Algorithmic estimation for instant reactive visual feedback
  const calculateLocalRecommendation = () => {
    const isBottoms = product.category.toLowerCase().includes('pant') || product.category.toLowerCase().includes('cargo');
    const sizes = product.sizes;
    if (sizes.length === 0) return '';

    let recommended = sizes[1] || sizes[0];

    if (isBottoms) {
      if (weight < 65) recommended = sizes.includes('30') ? '30' : sizes[0];
      else if (weight < 75) recommended = sizes.includes('32') ? '32' : (sizes[1] || sizes[0]);
      else if (weight < 87) recommended = sizes.includes('34') ? '34' : (sizes[2] || sizes[1] || sizes[0]);
      else recommended = sizes.includes('36') ? '36' : (sizes[sizes.length - 1]);
    } else {
      // Tops
      if (height < 168) {
        recommended = sizes.includes('S') ? 'S' : sizes[0];
      } else if (height < 178) {
        recommended = sizes.includes('M') ? 'M' : (sizes[1] || sizes[0]);
      } else if (height < 186) {
        recommended = sizes.includes('L') ? 'L' : (sizes[2] || sizes[1] || sizes[0]);
      } else {
        recommended = sizes.includes('XL') ? 'XL' : (sizes[sizes.length - 1]);
      }
    }

    // Shift based on fit preference
    const idx = sizes.indexOf(recommended);
    if (idx !== -1) {
      if (fitPref === 'slim' && idx > 0) recommended = sizes[idx - 1];
      if (fitPref === 'oversized' && idx < sizes.length - 1) recommended = sizes[idx + 1];
    }

    return recommended;
  };

  const calculatedRec = calculateLocalRecommendation();

  // Reset report if inputs change to ensure accuracy
  useEffect(() => {
    setReport(null);
  }, [height, weight, fitPref]);

  const runAiAnalysis = async () => {
    setLoading(true);
    try {
      const result = await getAiFitAnalysis(
        product.title,
        product.category,
        product.sizes,
        height,
        weight,
        fitPref,
        selectedSize || calculatedRec
      );
      setReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Determine size difference analysis for selected vs recommended
  const getSelectedSizeFeedback = () => {
    if (!selectedSize) return "SELECT A SIZE ABOVE FOR BIOMETRIC SCAN";
    const sizes = product.sizes;
    const selIdx = sizes.indexOf(selectedSize);
    const recIdx = sizes.indexOf(calculatedRec);

    if (selIdx === -1 || recIdx === -1) return "SILHOUETTE LOCK COMPLETE";

    if (selIdx === recIdx) {
      return `SIZE ${selectedSize} FITS IDEALLY FOR YOUR ${fitPref.toUpperCase()} STATS (${height}CM, ${weight}KG). SLOUCHY & DRAPED PROPERLY.`;
    } else if (selIdx < recIdx) {
      return `WARNING: SIZE ${selectedSize} WILL BE TOO TIGHT / SHORT (Chota padega) FOR YOUR ${height}CM ASSEMBLY. **SIZE ${calculatedRec} IS RECOMMENDED**.`;
    } else {
      return `WARNING: SIZE ${selectedSize} WILL BE EXTREMELY BAGGY / LOOSE ON {${weight}KG}. IF YOU WANT ULTRA-SLOUCH, ROCK IT. OTHERWISE **SIZE ${calculatedRec}** FITS BETTER.`;
    }
  };

  const isIdealMatch = selectedSize === calculatedRec;

  // Render a beautifully minimalist layout that is extremely slim and high-end
  return (
    <div className="w-full font-sans transition-all duration-300 select-none text-slate-900 dark:text-white bg-slate-900/10 dark:bg-white/2 border border-slate-200 dark:border-white/5 p-4 rounded-sm">
      {/* Short quick-read bar always visible */}
      <div 
        onClick={() => !compactOnly && setIsOpen(!isOpen)} 
        className={`flex justify-between items-center ${!compactOnly ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-1.5 rounded-full ${isIdealMatch ? 'bg-emerald-500' : 'bg-amber-400'} animate-pulse`}></div>
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400 block leading-tight">Biometric Fit Check</span>
            <span className="text-xs font-black uppercase tracking-wider block">
              {selectedSize ? `TRYING SIZE ${selectedSize} — ` : "RELIABLE DRAPE VERDICT: "}
              <span className={isIdealMatch ? "text-emerald-500" : "text-amber-400"}>
                {isIdealMatch ? "Ideal Drape Match" : `RECOMMEND SIZE ${calculatedRec}`}
              </span>
            </span>
          </div>
        </div>

        {!compactOnly && (
          <button className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 flex items-center gap-1.5 border border-slate-200 dark:border-white/10 px-2 py-1 bg-white/5 hover:bg-white/10 transition-colors">
            {isOpen ? 'Close Params' : 'Calibrate / BIOMETRICS'}
          </button>
        )}
      </div>

      {/* Accordion view */}
      {isOpen && !compactOnly && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 space-y-4 reveal-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Height Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-black tracking-widest uppercase text-slate-400">
                <span>Height</span>
                <span className="text-slate-900 dark:text-white">{height} CM</span>
              </div>
              <input 
                type="range" 
                min="150" 
                max="210" 
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-200 dark:bg-white/10 h-1 rounded-sm appearance-none cursor-pointer"
              />
            </div>

            {/* Weight Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-black tracking-widest uppercase text-slate-400">
                <span>Weight</span>
                <span className="text-slate-900 dark:text-white">{weight} KG</span>
              </div>
              <input 
                type="range" 
                min="40" 
                max="120" 
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-200 dark:bg-white/10 h-1 rounded-sm appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Fit Preferences */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-black tracking-widest uppercase text-slate-400 block">Drape Cut Intent</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['slim', 'regular', 'oversized'] as const).map((pref) => (
                <button
                  key={pref}
                  onClick={() => setFitPref(pref)}
                  className={`py-1.5 text-[8px] font-black uppercase tracking-widest border transition-all rounded-sm ${
                    fitPref === pref 
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-black border-transparent' 
                      : 'border-slate-200 dark:border-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100/30 dark:bg-white/5'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* Instant feedback on selected size compared to recommended */}
          <div className="p-3 bg-slate-100/50 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-[10px] uppercase font-bold tracking-wider leading-relaxed text-slate-600 dark:text-slate-300">
            {getSelectedSizeFeedback()}
          </div>

          {/* Gemini AI Stylist */}
          <div className="space-y-2">
            <button
              onClick={runAiAnalysis}
              disabled={loading}
              className="w-full py-2.5 border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/2 text-slate-900 dark:text-white hover:bg-rose-600 hover:text-white hover:border-transparent text-[8px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border border-slate-400 border-t-transparent dark:border-slate-500 dark:border-t-transparent rounded-full animate-spin"></div>
                  Querying Sizing Intelligence...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get AI Sizing Analysis (Hinglish Urdu Stylist)
                </>
              )}
            </button>

            {/* Stylist feedback */}
            {report && (
              <div className="border border-rose-500/20 bg-rose-500/2 p-3 rounded-sm relative reveal-up text-left">
                <div className="text-[7px] font-black tracking-widest text-rose-500 uppercase bg-rose-500/10 px-1 py-0.5 absolute top-2 right-2">LIVE ANALYSIS</div>
                <span className="text-[8px] font-extrabold text-slate-400 tracking-widest uppercase block mb-1">STYLING DIRECTIVE</span>
                <p className="text-[11px] leading-relaxed text-slate-800 dark:text-slate-200 font-light italic bg-white/5">
                  "{report.narrative}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
