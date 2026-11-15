import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PrinterShowcase } from './components/PrinterShowcase';
import { OrderForm } from './components/OrderForm';
import { LoginModal } from './components/LoginModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Footer } from './components/Footer';
import { User, PrinterStatus, PrintOrderResponse } from './types';
import { api } from './api';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState<PrintOrderResponse | null>(null);
  const [printerStatus, setPrinterStatus] = useState<PrinterStatus | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Sprawdzanie statusu drukarki i połączenia z FastAPI
  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const status = await api.getPrinterStatus();
        if (isMounted) {
          setPrinterStatus(status);
          // Jeśli odpowiedź przyszła z prawdziwego serwera lub demo
          setIsBackendConnected(true);
        }
      } catch (err) {
        if (isMounted) {
          setIsBackendConnected(false);
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 15000); // Odświeżaj status co 15 sekund

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const scrollToOrder = () => {
    document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSpecs = () => {
    document.getElementById('printer-specs')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Pasek nawigacyjny */}
      <Navbar
        user={user}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        isBackendConnected={isBackendConnected}
      />

      {/* Główna zawartość Landing Page */}
      <main className="flex-grow">
        {/* Sekcja Hero */}
        <Hero
          onScrollToOrder={scrollToOrder}
          onScrollToSpecs={scrollToSpecs}
        />

        {/* Prezentacja Creality K1 Max */}
        <PrinterShowcase status={printerStatus} />

        {/* Formularz zamówienia z uploadem plików */}
        <OrderForm
          user={user}
          onOrderSuccess={(order) => setSuccessOrder(order)}
        />
      </main>

      {/* Stopka */}
      <Footer />

      {/* Modal Logowania */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(loggedUser) => setUser(loggedUser)}
      />

      {/* Modal Potwierdzenia Złożonego Zamówienia */}
      <OrderSuccessModal
        order={successOrder}
        onClose={() => setSuccessOrder(null)}
      />
    </div>
  );
};

export default App;
