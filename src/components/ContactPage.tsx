import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Clock,
  Headphones,
  Building2,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  ArrowLeft,
  Sparkles,
  Send,
  HelpCircle,
  FileCheck,
  Users
} from 'lucide-react';

interface ContactPageProps {
  onBackToHome: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBackToHome }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [formSent, setFormSent] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    department: 'support',
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey(null);
      }, 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Symulacja wysyłki wiadomości
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSent(true);
      setFormData({
        department: 'support',
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 800);
  };

  // SVG ikona Discorda
  const DiscordIcon = () => (
    <svg
      className="w-6 h-6 fill-current"
      viewBox="0 0 127.14 96.36"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
  );

  return (
    <div className="relative overflow-hidden py-12 lg:py-20 min-h-[calc(100vh-80px)]">
      {/* Tło ambient glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-cyan-400/15 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[250px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Przycisk powrotu do strony głównej */}
        <div className="mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all text-sm font-medium group active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Powrót do strony głównej</span>
          </button>
        </div>

        {/* Nagłówek strony kontaktowej */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-inner mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs sm:text-sm font-medium text-slate-300">
              Centrum Pomocy & Kontaktu <span className="text-cyan-400 font-semibold">K1 Max Print Hub</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Skontaktuj się z nami.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              Jesteśmy do Twojej dyspozycji.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed">
            Masz pytania dotyczące wydruku na Creality K1 Max, potrzebujesz indywidualnej wyceny lub pomocy technicznej? 
            Wybierz właściwy dział lub dołącz do naszej aktywnej społeczności drukarzy 3D na Discordzie.
          </p>
        </div>

        {/* Trzy główne klocki kontaktowe: Wsparcie, Administracja, Discord */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Karta 1: Customer Support (Wsparcie Klienta) */}
          <div className="relative group rounded-3xl bg-slate-900/60 border border-slate-800/90 p-8 backdrop-blur-xl hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Ikona + Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                  <Headphones className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Support Online
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Wsparcie Klienta
              </h2>
              <p className="text-xs text-cyan-400 font-medium tracking-wide uppercase mb-4">
                Customer Support & Helpdesk
              </p>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Dedykowana pomoc przy zamówieniach, doborze filamentów (PLA, PETG, ABS, PC, TPU), parametrach krojnika (slicer) oraz sprawdzaniu modeli 3D.
              </p>

              {/* Informacje kontaktowe */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                {/* E-mail */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 group/item">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 font-medium">E-mail wsparcia</p>
                      <a
                        href="mailto:support@k1max-hub.pl"
                        className="text-sm font-semibold text-slate-200 hover:text-cyan-400 transition-colors truncate block"
                      >
                        support@k1max-hub.pl
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('support@k1max-hub.pl', 'sup-email')}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all shrink-0"
                    title="Kopiuj adres e-mail"
                  >
                    {copiedKey === 'sup-email' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Telefon */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 group/item">
                  <div className="flex items-center gap-3 min-w-0">
                    <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 font-medium">Infolinia / Telefon</p>
                      <a
                        href="tel:+48123456789"
                        className="text-sm font-semibold text-slate-200 hover:text-cyan-400 transition-colors truncate block"
                      >
                        +48 123 456 789
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('+48 123 456 789', 'sup-phone')}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all shrink-0"
                    title="Kopiuj numer telefonu"
                  >
                    {copiedKey === 'sup-phone' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Godziny pracy */}
                <div className="flex items-start gap-2.5 px-3 py-2 text-xs text-slate-400">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-300 font-medium">Godziny pracy:</span> Pn - Pt 8:00 - 18:00, Sob 9:00 - 14:00
                    <p className="text-[11px] text-slate-500 mt-0.5">Średni czas reakcji: poniżej 2 godzin</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <a
                href="mailto:support@k1max-hub.pl"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium text-sm transition-all shadow-sm active:scale-98"
              >
                <Mail className="w-4 h-4" />
                <span>Napisz do Wsparcia Klienta</span>
              </a>
            </div>
          </div>

          {/* Karta 2: Administration (Administracja) */}
          <div className="relative group rounded-3xl bg-slate-900/60 border border-slate-800/90 p-8 backdrop-blur-xl hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Ikona + Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                  <Building2 className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Biuro & B2B
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Administracja
              </h2>
              <p className="text-xs text-blue-400 font-medium tracking-wide uppercase mb-4">
                Administration & Operations
              </p>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Kwestie formalne, fakturowanie VAT, umowy ramowe dla firm (B2B), partnerstwa technologiczne i zarządzanie parkiem maszynowym.
              </p>

              {/* Informacje kontaktowe */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                {/* E-mail */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 group/item">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 font-medium">E-mail administracji</p>
                      <a
                        href="mailto:admin@k1max-hub.pl"
                        className="text-sm font-semibold text-slate-200 hover:text-blue-400 transition-colors truncate block"
                      >
                        admin@k1max-hub.pl
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('admin@k1max-hub.pl', 'adm-email')}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all shrink-0"
                    title="Kopiuj adres e-mail"
                  >
                    {copiedKey === 'adm-email' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Telefon */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 group/item">
                  <div className="flex items-center gap-3 min-w-0">
                    <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 font-medium">Telefon biurowy</p>
                      <a
                        href="tel:+48987654321"
                        className="text-sm font-semibold text-slate-200 hover:text-blue-400 transition-colors truncate block"
                      >
                        +48 987 654 321
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('+48 987 654 321', 'adm-phone')}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all shrink-0"
                    title="Kopiuj numer telefonu"
                  >
                    {copiedKey === 'adm-phone' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Godziny pracy */}
                <div className="flex items-start gap-2.5 px-3 py-2 text-xs text-slate-400">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-300 font-medium">Godziny pracy:</span> Pn - Pt 9:00 - 16:00
                    <p className="text-[11px] text-slate-500 mt-0.5">Dział rozliczeń i administracji technicznej</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <a
                href="mailto:admin@k1max-hub.pl"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border border-blue-500/30 font-medium text-sm transition-all shadow-sm active:scale-98"
              >
                <Mail className="w-4 h-4" />
                <span>Napisz do Administracji</span>
              </a>
            </div>
          </div>

          {/* Karta 3: Discord Server (Społeczność Discord) */}
          <div className="relative group rounded-3xl bg-slate-900/60 border border-slate-800/90 p-8 backdrop-blur-xl hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div>
              {/* Ikona + Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                  <DiscordIcon />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                  <Users className="w-3.5 h-3.5" />
                  1,200+ Członków
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Społeczność Discord
              </h2>
              <p className="text-xs text-indigo-400 font-medium tracking-wide uppercase mb-4">
                Official Discord Server
              </p>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Dołącz do naszego oficjalnego serwera Discord! Dyskutuj o projektach, pobieraj profile slicera dla K1 Max i rozmawiaj bezpośrednio z operatorami.
              </p>

              {/* Zalety społeczności Discord */}
              <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Szybkie porady dot. slicingu i orientacji modeli</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <FileCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Kanał #status-druku i powiadomienia live</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dyskusje o filamentach i testach wytrzymałości</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <a
                href="https://discord.gg/k1maxhub"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-300 active:scale-95 group/btn"
              >
                <DiscordIcon />
                <span>Dołącz do serwera Discord</span>
                <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* Dodatkowa sekcja: Formularz bezpośredniego zapytania oraz FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Formularz kontaktowy online */}
          <div className="lg:col-span-7 rounded-3xl bg-slate-900/60 border border-slate-800 p-8 backdrop-blur-xl relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Wyślij szybką wiadomość</h3>
                <p className="text-xs text-slate-400">Nasz zespół odpowie najszybciej jak to możliwe</p>
              </div>
            </div>

            {formSent ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Wiadomość została wysłana!</h4>
                <p className="text-sm text-slate-300 mt-2">
                  Dziękujemy za kontakt. Potwierdzenie zostało zarejestrowane, a nasz konsultant skontaktuje się z Tobą na podany adres e-mail.
                </p>
                <button
                  onClick={() => setFormSent(false)}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Wyślij kolejną wiadomość
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Dział docelowy
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, department: 'support' })}
                      className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all text-left flex items-center gap-2 ${
                        formData.department === 'support'
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/20'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <Headphones className="w-4 h-4 shrink-0" />
                      <span>Wsparcie Klienta</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, department: 'admin' })}
                      className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all text-left flex items-center gap-2 ${
                        formData.department === 'admin'
                          ? 'bg-blue-500/15 border-blue-500/50 text-blue-300 shadow-sm shadow-blue-500/20'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span>Administracja</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Twoje Imię i Nazwisko
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="np. Jan Kowalski"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Adres E-mail
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="np. jan@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Temat wiadomości / Nr zamówienia
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="np. Pytanie o dobór materiału ABS lub zlecenie #ORD-1234"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Treść wiadomości
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Opisz swoje zapytanie lub wymagania techniczne dotyczące projektu..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-md shadow-blue-600/30 transition-all active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Wysyłanie...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Wyślij zapytanie</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Szybkie FAQ / Pomocne wskazówki */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 backdrop-blur-xl">
              <div className="flex items-center gap-2.5 mb-5 text-slate-200">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-lg">Częste pytania (FAQ)</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <p className="font-semibold text-slate-200 mb-1">Jakie pliki mogę przesłać do wyceny?</p>
                  <p className="text-slate-400 leading-relaxed">
                    Obsługujemy pliki .STL, .OBJ oraz .3MF. Nasz algorytm automatycznie szacuje wagę filamentu i czas druku na Creality K1 Max.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <p className="font-semibold text-slate-200 mb-1">Kiedy skontaktować się z Administracją?</p>
                  <p className="text-slate-400 leading-relaxed">
                    W przypadku zamówień hurtowych, zapotrzebowania na fakturę VAT z odroczonym terminem płatności lub stałej współpracy instytucjonalnej.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <p className="font-semibold text-slate-200 mb-1">Dlaczego warto dołączyć do Discorda?</p>
                  <p className="text-slate-400 leading-relaxed">
                    To najszybsza droga do konsultacji ze społecznością i bezpośredniej dyskusji nad krojeniem skomplikowanych brył geometrycznych.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
