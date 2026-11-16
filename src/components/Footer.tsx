import React from 'react';
import { Box, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">K1 Max Print Hub</p>
              <p className="text-[11px] text-slate-500">Profesjonalne usługi druku 3D FDM na żądanie</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <a href="#order-section" className="hover:text-cyan-400 transition-colors">Zamówienie</a>
            <a href="#printer-specs" className="hover:text-cyan-400 transition-colors">Creality K1 Max</a>
            <a href="https://www.creality.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1">
              <span>Specyfikacja Creality K1 Max</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-center md:text-right text-slate-500 text-[11px]">
            <p>Druk wysokotemperaturowy i techniczny do 300°C</p>
            <p className="mt-1">Dedykowane dla twórców, inżynierów i entuzjastów druku</p>
          </div>

        </div>
      </div>
    </footer>
  );
};
