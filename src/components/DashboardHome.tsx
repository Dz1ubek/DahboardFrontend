import React from 'react';
import { ShoppingCart, Printer, CheckCircle2, Clock } from 'lucide-react';

export const DashboardHome: React.FC = () => {
  const stats = [
    { title: 'Wszystkie zamówienia', value: '14', icon: ShoppingCart, color: 'text-blue-500 bg-blue-500/10' },
    { title: 'W trakcie druku', value: '2', icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
    { title: 'Ukończone dziś', value: '5', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    { title: 'Status K1 Max', value: 'Gotowa', icon: Printer, color: 'text-indigo-500 bg-indigo-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Pulpit administratora</h2>
        <p className="text-slate-400 text-sm">Witaj w panelu sterowania hubem druku 3D.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Ostatnia aktywność systemu</h3>
        <p className="text-slate-400 text-sm">Brak nowych zdarzeń w kolejce.</p>
      </div>
    </div>
  );
};