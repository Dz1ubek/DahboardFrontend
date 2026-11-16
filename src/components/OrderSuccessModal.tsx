import React from 'react';
import { CheckCircle2, X, ArrowRight } from 'lucide-react';
import { PrintOrderResponse } from '../types';

interface OrderSuccessModalProps {
  order: PrintOrderResponse | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Przycisk zamknięcia */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sukces - ikona */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Zamówienie przyjęte do druku!
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Plik został zarejestrowany i skierowany do kolejki produkcyjnej Creality K1 Max.
          </p>
        </div>

        {/* Informacje o zleceniu */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-400">Numer zlecenia:</span>
            <span className="font-mono font-bold text-cyan-400 text-sm">{order.orderId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Nazwa pliku:</span>
            <span className="font-medium text-white truncate max-w-[200px]">{order.fileName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Rozmiar pliku:</span>
            <span className="font-medium text-white">{order.fileSizeMb} MB</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Materiał i kolor:</span>
            <span className="font-medium text-white">{order.material} ({order.color})</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Wypełnienie / Warstwa:</span>
            <span className="font-medium text-white">{order.infill} / {order.layerHeight}</span>
          </div>

          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Szacowany czas</span>
              <span className="font-bold text-sm text-cyan-400">~{order.estimatedTimeMinutes} min</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Szacowany koszt</span>
              <span className="font-bold text-sm text-emerald-400">{order.estimatedCostPln} PLN</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
        >
          <span>Wróć do strony głównej</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
