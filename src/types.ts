export type MaterialType = 'PLA' | 'PETG' | 'ABS' | 'TPU' | 'ASA' | 'PC';

export type InfillType = '15%' | '20%' | '40%' | '70%' | '100%';

export type LayerHeightType = '0.12mm (Ultra Detal)' | '0.20mm (Standard)' | '0.28mm (Szybki)';

export interface PrintOrderRequest {
  file: File;
  material: MaterialType;
  color: string;
  infill: InfillType;
  layerHeight: LayerHeightType;
  enableSupports: boolean;
  copies: number;
  notes?: string;
  customerName?: string;
  customerEmail?: string;
}

export interface PrintOrderResponse {
  orderId: string;
  status: 'PENDING' | 'QUEUED' | 'PRINTING' | 'COMPLETED' | 'REJECTED';
  fileName: string;
  fileSizeMb: number;
  material: MaterialType;
  color: string;
  infill: string;
  layerHeight: string;
  estimatedTimeMinutes: number;
  estimatedCostPln: number;
  submittedAt: string;
  message?: string;
}

export interface PrinterStatus {
  online: boolean;
  model: string;
  state: 'IDLE' | 'PRINTING' | 'PAUSED' | 'CALIBRATING' | 'ERROR';
  bedTemp: number;
  targetBedTemp: number;
  nozzleTemp: number;
  targetNozzleTemp: number;
  currentJob?: {
    jobName: string;
    progressPercentage: number;
    remainingMinutes: number;
  };
  queuedOrdersCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'business' | 'admin';
  token?: string;
}
