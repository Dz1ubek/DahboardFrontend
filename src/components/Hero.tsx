import React from 'react';
import { Sparkles, ArrowRight, UploadCloud, Cpu, Zap, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onScrollToOrder: () => void;
  onScrollToSpecs: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToOrder, onScrollToSpecs }) => {
  return (
    <div className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Tło - ambient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-cyan-400/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge informacyjny */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-inner mb-8">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs sm:text-sm font-medium text-slate-300">
            Drukarka 3D nowej generacji: <span className="text-cyan-400 font-semibold">Creality K1 Max (600 mm/s)</span>
          </span>
        </div>

        {/* Główny nagłówek */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
          Prześlij swój model 3D.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
            Wydrukujemy go błyskawicznie.
          </span>
        </h1>

        {/* Podtytuł */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Wgraj plik <span className="text-slate-200 font-semibold">.STL, .OBJ lub .3MF</span>, wybierz materiał, a nasze API połączone z Creality K1 Max zajmie się resztą. Monitoruj stan i parametry druku na żywo.
        </p>

        {/* Przyciski akcji (CTA) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onScrollToOrder}
            className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform active:scale-95"
          >
            <UploadCloud className="w-5 h-5 text-cyan-300 group-hover:-translate-y-0.5 transition-transform" />
            <span>Wgraj plik i zamów wydruk</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onScrollToSpecs}
            className="flex items-center gap-2 px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-base border border-slate-700/80 transition-all active:scale-95"
          >
            <Cpu className="w-5 h-5 text-slate-400" />
            <span>Zobacz specyfikację K1 Max</span>
          </button>
        </div>

        {/* Kluczowe atuty - paski metryk */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-cyan-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xl font-bold">600 mm/s</span>
            </div>
            <p className="text-xs text-slate-400">Prędkość drukowania</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
              <span className="text-xl font-bold">300×300×300</span>
            </div>
            <p className="text-xs text-slate-400">Pole robocze (mm)</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-indigo-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xl font-bold">AI LiDAR</span>
            </div>
            <p className="text-xs text-slate-400">Automatyczna kalibracja</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
              <Cpu className="w-4 h-4" />
              <span className="text-xl font-bold">24/7</span>
            </div>
            <p className="text-xs text-slate-400">Automatyczna kolejka</p>
          </div>
        </div>

      </div>
    </div>
  );
};
