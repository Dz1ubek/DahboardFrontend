import React from 'react';
import { User } from '../types';
import { Box, LogIn, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  isBackendConnected: boolean;
  currentPage: 'home' | 'contact';
  onNavigate: (page: 'home' | 'contact', targetId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenLogin,
  onLogout,
  isBackendConnected,
  currentPage,
  onNavigate,
}) => {
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo i Nazwa Projektu */}
          <button 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Box className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  K1 MAX <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">PRINT HUB</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                  Online Service
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Nowoczesna platforma druku 3D na żądanie</p>
            </div>
          </button>

          {/* Menu linków */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors ${
                currentPage === 'home'
                  ? 'text-cyan-400 font-semibold'
                  : 'hover:text-cyan-400 text-slate-300'
              }`}
            >
              Strona Główna
            </button>
            <button
              onClick={() => onNavigate('home', 'order-section')}
              className="hover:text-cyan-400 transition-colors text-slate-300"
            >
              Złóż Zamówienie
            </button>
            <button
              onClick={() => onNavigate('home', 'printer-specs')}
              className="hover:text-cyan-400 transition-colors text-slate-300"
            >
              Creality K1 Max
            </button>
            <button
              onClick={() => onNavigate('home', 'materials')}
              className="hover:text-cyan-400 transition-colors text-slate-300"
            >
              Materiały
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`transition-colors px-3 py-1.5 rounded-lg border ${
                currentPage === 'contact'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-semibold shadow-sm shadow-cyan-500/20'
                  : 'border-transparent hover:text-cyan-400 text-slate-300 hover:border-slate-800'
              }`}
            >
              Kontakt
            </button>
          </div>

          {/* Prawa strona: wskaźnik API + przycisk logowania */}
          <div className="flex items-center gap-4">
            {/* Wskaźnik statusu urządzenia */}
            <div 
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                isBackendConnected
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-900 border-slate-700/80 text-slate-300'
              }`}
              title={isBackendConnected ? "Creality K1 Max podłączona i gotowa" : "Tryb demonstracyjny"}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Creality K1 Max: Gotowa</span>
            </div>

            {/* Przycisk Logowania / Profil */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="hidden lg:block text-left text-xs">
                    <p className="font-semibold text-slate-200">{user.name}</p>
                    <p className="text-slate-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Wyloguj się"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm shadow-md shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-200 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Zaloguj się</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};
