import React from 'react';
import { LayoutDashboard, ShoppingCart, Printer, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', label: 'Pulpit', icon: LayoutDashboard },
    { id: 'orders', label: 'Zamówienia 3D', icon: ShoppingCart },
    { id: 'printer', label: 'Status Drukarki', icon: Printer },
    { id: 'settings', label: 'Ustawienia', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800">
      <div>
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Printer className="text-blue-500" /> K1 Max Admin
          </h1>
          <p className="text-xs text-slate-500 mt-1">Panel zarządzania drukarką</p>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
        >
          <LogOut size={20} />
          Powrót do strony głównej
        </button>
      </div>
    </aside>
  );
};