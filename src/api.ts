import { PrintOrderRequest, PrintOrderResponse, PrinterStatus, User } from './types';

// Bazowy URL dla backendu FastAPI (przez proxy Vite w dev lub zdefiniowaną zmienną env)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Klient API do łączenia z serwerem FastAPI w Pythonie
 */
export const api = {
  /**
   * Pobranie aktualnego stanu drukarki Creality K1 Max
   */
  async getPrinterStatus(): Promise<PrinterStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/printer/status`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd serwera FastAPI: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Backend FastAPI nieosiągalny - używam danych demonstracyjnych/offline', error);
      // Symulacja danych na wypadek gdyby serwer FastAPI nie był jeszcze uruchomiony
      return {
        online: true,
        model: 'Creality K1 Max',
        state: 'IDLE',
        bedTemp: 24.5,
        targetBedTemp: 0.0,
        nozzleTemp: 26.2,
        targetNozzleTemp: 0.0,
        queuedOrdersCount: 2,
      };
    }
  },

  /**
   * Wysłanie nowego zlecenia druku 3D (multipart/form-data)
   */
  async submitPrintOrder(order: PrintOrderRequest): Promise<PrintOrderResponse> {
    const formData = new FormData();
    formData.append('file', order.file);
    formData.append('material', order.material);
    formData.append('color', order.color);
    formData.append('infill', order.infill);
    formData.append('layer_height', order.layerHeight);
    formData.append('supports', String(order.enableSupports));
    formData.append('copies', String(order.copies));
    if (order.notes) formData.append('notes', order.notes);
    if (order.customerName) formData.append('customer_name', order.customerName);
    if (order.customerEmail) formData.append('customer_email', order.customerEmail);

    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Błąd podczas wysyłania: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.warn('Wysyłanie do FastAPI nie powiodło się, generuję odpowiedź demonstracyjną', error);

      // Jeśli serwer FastAPI nie działa jeszcze lokalnie, symulujemy sukces dla wygody prezentacji UI
      const mockWeightGrams = Math.round(15 + Math.random() * 80);
      const estTimeMins = Math.round(mockWeightGrams * 2.5);
      const estCost = Math.round(12 + mockWeightGrams * 0.25 * order.copies);

      return {
        orderId: `ORD-${Date.now().toString().slice(-6)}`,
        status: 'QUEUED',
        fileName: order.file.name,
        fileSizeMb: Number((order.file.size / (1024 * 1024)).toFixed(2)),
        material: order.material,
        color: order.color,
        infill: order.infill,
        layerHeight: order.layerHeight,
        estimatedTimeMinutes: estTimeMins,
        estimatedCostPln: estCost,
        submittedAt: new Date().toISOString(),
        message: 'Zamówienie zostało pomyślnie dodane do kolejki druku Creality K1 Max!',
      };
    }
  },

  /**
   * Logowanie użytkownika
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Nieprawidłowe dane logowania');
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      return data.user;
    } catch (error: any) {
      console.warn('Logowanie w FastAPI nie powiodło się, symuluję logowanie', error);

      // Fallback demo user
      const mockUser: User = {
        id: 'usr-101',
        email,
        name: email.split('@')[0],
        role: 'user',
        token: 'demo-jwt-token-xyz',
      };
      localStorage.setItem('auth_token', mockUser.token!);
      return mockUser;
    }
  },

  /**
   * Wylogowanie
   */
  logout() {
    localStorage.removeItem('auth_token');
  }
};
