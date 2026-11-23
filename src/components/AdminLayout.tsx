import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHome } from './DashboardHome';
import { OrdersManager } from './OrdersManager';

export const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Boczne menu */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Główna treść panelu */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'home' && <DashboardHome />}
          {activeTab === 'orders' && <OrdersManager />}
          {activeTab === 'printer' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Status Drukarki</h2>
              <p className="text-slate-400 text-sm">Monitorowanie na żywo parametrów Creality K1 Max.</p>
              {/* Tutaj możesz wpiąć komponent statusu drukarki */}
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Ustawienia systemu</h2>
              <p className="text-slate-400 text-sm">Konfiguracja połączenia z API i parametrami druku.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};