import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PrinterShowcase } from './components/PrinterShowcase';
import { OrderForm } from './components/OrderForm';
import { ContactPage } from './components/ContactPage';
import { LoginModal } from './components/LoginModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Footer } from './components/Footer';
import { User, PrinterStatus, PrintOrderResponse } from './types';
import { api } from './api';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'contact'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState<PrintOrderResponse | null>(null);
  const [printerStatus, setPrinterStatus] = useState<PrinterStatus | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Obsługa routingu po hashu (#contact / #order-section / ...)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#contact') {
        setCurrentPage('contact');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentPage('home');
        if (hash && hash !== '#') {
          const targetId = hash.replace('#', '');
          setTimeout(() => {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sprawdzanie statusu drukarki i połączenia z FastAPI
  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const status = await api.getPrinterStatus();
        if (isMounted) {
          setPrinterStatus(status);
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

  const handleNavigate = (page: 'home' | 'contact', targetId?: string) => {
    if (page === 'contact') {
      setCurrentPage('contact');
      window.location.hash = 'contact';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentPage('home');
      if (targetId) {
        window.location.hash = targetId;
        setTimeout(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        if (window.location.hash === '#contact') {
          window.history.pushState(null, '', window.location.pathname);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const scrollToOrder = () => {
    handleNavigate('home', 'order-section');
  };

  const scrollToSpecs = () => {
    handleNavigate('home', 'printer-specs');
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
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Główna zawartość */}
      <main className="flex-grow">
        {currentPage === 'contact' ? (
          <ContactPage onBackToHome={() => handleNavigate('home')} />
        ) : (
          <>
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
          </>
        )}
      </main>

      {/* Stopka */}
      <Footer 
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

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
