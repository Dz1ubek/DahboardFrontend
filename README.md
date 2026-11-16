# K1 Max Print Hub - Platforma Druku 3D na Żądanie

Nowoczesny landing page dla serwisu druku 3D opartego na drukarce **Creality K1 Max**, przeznaczony dla wszystkich użytkowników (twórców, majsterkowiczów, firm i inżynierów).

Projekt jest w pełni samowystarczalny po stronie frontendu (**React + TypeScript + Vite + Tailwind CSS**), a wszystkie interakcje (upload plików, kalkulator kosztów, logowanie, telemetria) działają od ręki w przeglądarce.

---

## 🚀 Główne funkcjonalności

1. **Wysyłanie zamówień na druk 3D:**
   - Strefa **Drag & Drop** dla plików 3D (`.STL`, `.OBJ`, `.3MF`, `.GCODE`, `.STEP`) z walidacją formatu i rozmiaru do 100 MB.
   - Konfiguracja parametrów druku:
     - Wybór materiału (**PLA, PETG, ABS, TPU, ASA, PC**) z opisami właściwości,
     - Wybór koloru filamentu (paleta barw),
     - Gęstość wypełnienia (*Infill*: 15%, 20%, 40%, 70%, 100%),
     - Wysokość warstwy (0.12mm Ultra Detal, 0.20mm Standard, 0.28mm Szybki),
     - Przełącznik podpór (drzewiaste) oraz liczba sztuk.
   - **Kalkulator na żywo:** dynamiczne szacowanie orientacyjnego czasu druku i ceny w PLN.

2. **Dedykowana prezentacja Creality K1 Max:**
   - Zdjęcie urządzenia,
   - Wskaźniki telemetrii (temperatura głowicy, stołu, gotowość urządzenia),
   - Dane technologiczne: pole robocze **300 × 300 × 300 mm**, prędkość do **600 mm/s**, skaner AI LiDAR, zamknięta komora.

3. **Panel i przycisk logowania:**
   - Przycisk w pasku nawigacyjnym z modale logowania.
   - Szybkie logowanie jednym kliknięciem ("Konto demonstracyjne").
   - Możliwość zamawiania jako zalogowany użytkownik lub jako gość.

---

## 🛠️ Uruchomienie projektu (Frontend)

Wymagany jest wyłącznie **Node.js** (wersja 18+ lub 20+).

```powershell
# 1. Instalacja zależności
npm install

# 2. Uruchomienie serwera deweloperskiego
npm run dev
```

Aplikacja uruchomi się pod adresem: **`http://localhost:5173`**

---

## 🔌 Gotowość do integracji z zewnętrznym backendem

Architektura jest przygotowana tak, aby osoba tworząca backend mogła bez problemu spiąć swoje API:
- Klient zapytań znajduje się w [src/api.ts](file:///c:/Users/user/OneDrive/Dokumenty/Studia/Semestr%20V/ProjektDrukarkaFront/src/api.ts).
- Bazowy adres API można w każdej chwili zmienić zmienną środowiskową `VITE_API_URL` lub skonfigurować proxy w [vite.config.ts](file:///c:/Users/user/OneDrive/Dokumenty/Studia/Semestr%20V/ProjektDrukarkaFront/vite.config.ts).
- Do czasu podłączenia zewnętrznego serwera, aplikacja automatycznie obsługuje wszystkie akcje w trybie offline/demo.
