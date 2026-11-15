import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileBox, 
  Trash2, 
  Layers, 
  DollarSign, 
  Clock, 
  Send, 
  AlertCircle, 
  Loader2, 
  Check, 
  Settings2,
  FileText
} from 'lucide-react';
import { MaterialType, InfillType, LayerHeightType, PrintOrderRequest, PrintOrderResponse, User } from '../types';
import { api } from '../api';

interface OrderFormProps {
  user: User | null;
  onOrderSuccess: (order: PrintOrderResponse) => void;
}

const MATERIALS: { id: MaterialType; name: string; desc: string; badge: string }[] = [
  { id: 'PLA', name: 'PLA (Standard)', desc: 'Ekologiczny, łatwy w druku, wysoka precyzja', badge: 'Najpopularniejszy' },
  { id: 'PETG', name: 'PETG (Trwały)', desc: 'Wysoka odporność mechaniczna i na wilgoć', badge: 'Funkcjonalny' },
  { id: 'ABS', name: 'ABS (Techniczny)', desc: 'Odporny na wysokie temperatury i uderzenia', badge: 'K1 Max Enclosure' },
  { id: 'TPU', name: 'TPU (Elastyczny)', desc: 'Gumopodobny, giętki, odporny na ścieranie', badge: 'Elastyczny' },
  { id: 'ASA', name: 'ASA (Odporny UV)', desc: 'Idealny do zastosowań zewnętrznych', badge: 'Odporny UV' },
  { id: 'PC', name: 'Poliwęglan (PC)', desc: 'Ekstremalna wytrzymałość i odporność termiczna', badge: 'Zaawansowany' },
];

const COLORS = [
  { name: 'Czarny', hex: '#0f172a' },
  { name: 'Biały', hex: '#f8fafc' },
  { name: 'Szary / Stalowy', hex: '#64748b' },
  { name: 'Niebieski Królewski', hex: '#2563eb' },
  { name: 'Czerwony Ogniowy', hex: '#dc2626' },
  { name: 'Pomarańczowy Prusa', hex: '#ea580c' },
  { name: 'Zielony Neon', hex: '#16a34a' },
];

const INFILLS: InfillType[] = ['15%', '20%', '40%', '70%', '100%'];

const LAYER_HEIGHTS: LayerHeightType[] = [
  '0.12mm (Ultra Detal)',
  '0.20mm (Standard)',
  '0.28mm (Szybki)',
];

export const OrderForm: React.FC<OrderFormProps> = ({ user, onOrderSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [material, setMaterial] = useState<MaterialType>('PLA');
  const [color, setColor] = useState<string>('Czarny');
  const [infill, setInfill] = useState<InfillType>('20%');
  const [layerHeight, setLayerHeight] = useState<LayerHeightType>('0.20mm (Standard)');
  const [enableSupports, setEnableSupports] = useState<boolean>(true);
  const [copies, setCopies] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  
  // Dane kontaktowe gdy niezalogowany
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Obsługa przeciągania plików
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = ['.stl', '.obj', '.3mf', '.gcode', '.step'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      setErrorMessage('Dozwolone są wyłącznie pliki modeli 3D: .STL, .OBJ, .3MF, .GCODE, .STEP');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrorMessage('Maksymalny dopuszczalny rozmiar pliku wynosi 100 MB.');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Dynamiczne szacowanie kosztu i czasu druku
  const calculateEstimates = () => {
    const baseWeight = selectedFile ? Math.max(10, Math.round(selectedFile.size / (1024 * 25))) : 30;
    const infillFactor = parseInt(infill) / 20;
    const layerFactor = layerHeight.includes('0.12') ? 1.6 : layerHeight.includes('0.28') ? 0.75 : 1.0;
    const materialCostFactor = material === 'PC' ? 2.2 : material === 'TPU' ? 1.7 : material === 'ABS' ? 1.3 : 1.0;
    
    // Szacowany czas w minutach (K1 Max jest szybka!)
    const estMinutes = Math.round((baseWeight * 1.8 * infillFactor * layerFactor) * copies);
    const estHours = (estMinutes / 60).toFixed(1);

    // Szacowany koszt w PLN
    const estCost = Math.round((8 + baseWeight * 0.18 * materialCostFactor * infillFactor) * copies);

    return { estMinutes, estHours, estCost };
  };

  const { estHours, estCost } = calculateEstimates();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Proszę najpierw wgrać plik modelu 3D (.stl, .obj, .3mf)!');
      return;
    }

    if (!user && (!guestName.trim() || !guestEmail.trim())) {
      setErrorMessage('Proszę podać imię oraz adres e-mail do kontaktu w sprawie zlecenia.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const orderPayload: PrintOrderRequest = {
      file: selectedFile,
      material,
      color,
      infill,
      layerHeight,
      enableSupports,
      copies,
      notes,
      customerName: user ? user.name : guestName,
      customerEmail: user ? user.email : guestEmail,
    };

    try {
      const response = await api.submitPrintOrder(orderPayload);
      setIsLoading(false);
      onOrderSuccess(response);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Wystąpił błąd podczas wysyłania do serwera FastAPI.');
    }
  };

  return (
    <section id="order-section" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Nagłówek sekcji */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Formularz Zlecenia Druku
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Skonfiguruj i wyślij zamówienie
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Wgraj swój plik geometrii, dostosuj parametry slicera i prześlij zamówienie do realizacji.
          </p>
        </div>

        {errorMessage && (
          <div className="max-w-4xl mx-auto mb-8 p-4 rounded-xl bg-red-950/50 border border-red-500/30 text-red-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEWA KOLUMNA: Wgrywanie pliku i ustawienia slicingu */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* KARTA WGRYWANIA PLIKU (DROPZONE) */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <FileBox className="w-5 h-5 text-cyan-400" />
                1. Plik modelu 3D
              </h3>

              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-950/20 scale-[0.99]'
                      : 'border-slate-700 hover:border-slate-500 bg-slate-950/50 hover:bg-slate-900/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".stl,.obj,.3mf,.gcode,.step"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-cyan-400">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="text-base font-semibold text-slate-200">
                    Przeciągnij i upuść plik 3D tutaj, lub <span className="text-cyan-400 underline underline-offset-4">wybierz z dysku</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Obsługiwane formaty: <strong>.STL, .OBJ, .3MF, .GCODE, .STEP</strong> (maks. 100 MB)
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white truncate max-w-[240px] sm:max-w-sm">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Gotowy do przetworzenia
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Usuń plik"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* KARTA WYBORU MATERIAŁU I KOLORU */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                2. Materiał i Kolor Filamentu
              </h3>

              {/* Siatka materiałów */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Typ materiału
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MATERIALS.map((mat) => (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => setMaterial(mat.id)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        material === mat.id
                          ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{mat.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {mat.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{mat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wybór koloru */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Kolor filamentu: <span className="text-cyan-400 font-bold">{color}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                        color === c.name
                          ? 'border-cyan-400 bg-cyan-950/30 text-white ring-1 ring-cyan-400'
                          : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-600 shadow-sm"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* KARTA PARAMETRÓW DRUKU (SLICER) */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-indigo-400" />
                3. Parametry Druku
              </h3>

              {/* Gęstość wypełnienia */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Gęstość wypełnienia (Infill)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {INFILLS.map((inf) => (
                    <button
                      key={inf}
                      type="button"
                      onClick={() => setInfill(inf)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                        infill === inf
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                          : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {inf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wysokość warstwy */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Wysokość warstwy (Dokładność)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {LAYER_HEIGHTS.map((layer) => (
                    <button
                      key={layer}
                      type="button"
                      onClick={() => setLayerHeight(layer)}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                        layerHeight === layer
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                          : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {layer}
                    </button>
                  ))}
                </div>
              </div>

              {/* Podpory i ilość kopii */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableSupports}
                    onChange={(e) => setEnableSupports(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-white block">Generuj podpory (Supports)</span>
                    <span className="text-xs text-slate-400">Dla wiszących elementów geometrii</span>
                  </div>
                </label>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Liczba sztuk:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCopies(Math.max(1, copies - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-white">{copies}</span>
                    <button
                      type="button"
                      onClick={() => setCopies(Math.min(20, copies + 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Uwagi do druku */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Dodatkowe uwagi dla operatora (opcjonalnie)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="np. zależy mi na gładkiej podstawie, proszę o usunięcie podpór przed odbiorem..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

            </div>

          </div>

          {/* PRAWA KOLUMNA: Podsumowanie kosztów, dane zamawiającego i przycisk wysyłki */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* KARTA PODSUMOWANIA (Sticky) */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-28 space-y-6">
              
              <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                Kalkulator i Podsumowanie
              </h3>

              {/* Wskaźniki estymacji */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-medium mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Szacowany czas</span>
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    ~{estHours} godz.
                  </div>
                  <span className="text-[10px] text-slate-400">Na Creality K1 Max</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Szacowany koszt</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {estCost} PLN
                  </div>
                  <span className="text-[10px] text-slate-400">Zawiera materiał + zużycie</span>
                </div>
              </div>

              {/* Lista wybranych parametrów */}
              <div className="space-y-2 text-xs border-y border-slate-800/80 py-4 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Drukarka docelowa:</span>
                  <span className="font-semibold text-white">Creality K1 Max (CoreXY)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Materiał:</span>
                  <span className="font-semibold text-white">{material} ({color})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wypełnienie:</span>
                  <span className="font-semibold text-white">{infill}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wysokość warstwy:</span>
                  <span className="font-semibold text-white">{layerHeight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Podpory:</span>
                  <span className="font-semibold text-white">{enableSupports ? 'Włączone (Drzewiaste)' : 'Brak'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Liczba sztuk:</span>
                  <span className="font-semibold text-white">{copies} szt.</span>
                </div>
              </div>

              {/* Dane kontaktowe, jeśli niezalogowany */}
              {!user && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Dane Zamawiającego (Gość)
                    </span>
                    <span className="text-[10px] text-blue-400 font-medium">Lub zaloguj się</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Imię i Nazwisko / Nazwa firmy"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Adres e-mail do kontaktu"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {user && (
                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-center gap-3">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium text-slate-200">Zalogowano jako: <strong>{user.name}</strong></p>
                    <p className="text-slate-400">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Przycisk wysyłki */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group active:scale-98"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Przesyłanie zamówienia...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    <span>Wyślij zamówienie do druku</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-500 leading-tight">
                Po zatwierdzeniu plik trafi do kolejki slicera Creality K1 Max. Otrzymasz potwierdzenie z numerem zlecenia.
              </p>

            </div>

          </div>

        </form>

      </div>
    </section>
  );
};
