import React from 'react';
import { PrinterStatus } from '../types';
import { 
  Flame, 
  Layers, 
  Eye, 
  Wind, 
  Maximize2, 
  Clock, 
  CheckCircle2, 
  Sliders, 
  Activity 
} from 'lucide-react';

interface PrinterShowcaseProps {
  status: PrinterStatus | null;
}

export const PrinterShowcase: React.FC<PrinterShowcaseProps> = ({ status }) => {
  // Wysokiej jakości oficjalne zdjęcie Creality K1 Max
  const crealityK1MaxImageUrl = "https://img.creality.com/creality-eu-banner/K1_Max_3D_Printer_1.png";

  return (
    <section id="printer-specs" className="py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Nagłówek sekcji */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Hardware & Ekosystem
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Creality K1 Max
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Flagowa drukarka 3D z zamkniętą komorą, prędkością druku do 600 mm/s i zaawansowanym systemem inspekcji pierwszej warstwy opartym na sztucznej inteligencji.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Kolumna po lewej: Karta ze zdjęciem drukarki Creality K1 Max */}
          <div className="lg:col-span-7 relative group">
            
            {/* Ozdobny neon glow w tle */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />
            
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
              
              {/* Badge statusu urządzenia */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
                    Status: {status?.state === 'PRINTING' ? 'Druk w toku' : 'Gotowa do druku (IDLE)'}
                  </span>
                </div>
                <div className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-cyan-400 font-mono border border-slate-700">
                  Model: Creality K1 Max
                </div>
              </div>

              {/* Zdjęcie Creality K1 Max */}
              <div className="relative aspect-square max-h-[460px] mx-auto flex items-center justify-center p-4">
                <img
                  src={crealityK1MaxImageUrl}
                  alt="Drukarka 3D Creality K1 Max"
                  className="max-h-full w-auto object-contain drop-shadow-[0_20px_35px_rgba(37,99,235,0.25)] group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback gdyby serwer Creality zablokował hotlink
                    (e.target as HTMLImageElement).src = "https://raw.githubusercontent.com/CrealityOfficial/K1_Series_Klipper/main/k1_max_preview.png";
                  }}
                />
              </div>

              {/* Telemetria na żywo (odczytyana z FastAPI) */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Głowica (Nozzle)</div>
                    <div className="text-sm font-bold text-white font-mono">
                      {status?.nozzleTemp ?? 26.2}°C
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Stół (Bed)</div>
                    <div className="text-sm font-bold text-white font-mono">
                      {status?.bedTemp ?? 24.0}°C
                    </div>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Kolejka zleceń</div>
                    <div className="text-sm font-bold text-white font-mono">
                      {status?.queuedOrdersCount ?? 0} oczekujących
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Kolumna po prawej: Parametry techniczne i przewagi K1 Max */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Maximize2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Ogromna komora robocza</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Pole o wymiarach <strong className="text-slate-200">300 × 300 × 300 mm</strong> pozwala na druk dużych prototypów w jednym kawałku bez konieczności klejenia.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Prędkość 600 mm/s i CoreXY</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Przyspieszenie do <strong className="text-slate-200">20 000 mm/s²</strong>. Modele drukują się nawet do 12 razy szybciej niż na tradycyjnych drukarkach kartezjańskich.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Skaner AI LiDAR & Kamera AI</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Laserowy sensor z dokładnością 1 μm bada pierwszą warstwę. Kamera AI automatycznie zatrzymuje wydruk w przypadku wykrycia błędu lub ciała obcego.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Wind className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Zamknięta komora i filtr węgla</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Stabilna temperatura do druku wymagających filamentów inżynieryjnych (ABS, ASA, PC) z aktywnym oczyszczaniem powietrza.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
