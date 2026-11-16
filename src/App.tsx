import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHome } from './components/DashboardHome';
import { OrdersManager } from './components/OrdersManager';

export function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex h-screen bg-slate-950 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'home' && <DashboardHome />}
        {activeTab === 'orders' && <OrdersManager />}
        {activeTab === 'printer' && (
          <div className="text-white">
            <h2 className="text-2xl font-bold">Status Drukarki K1 Max</h2>
            <p className="text-slate-400 mt-2">Tutaj pojawi się podgląd parametrów i sterowanie na żywo.</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-white">
            <h2 className="text-2xl font-bold">Ustawienia panelu</h2>
            <p className="text-slate-400 mt-2">Konfiguracja API i uprawnień.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;