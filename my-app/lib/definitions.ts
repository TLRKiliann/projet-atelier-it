// 📁 Chemin: /lib/definitions.ts
import { ReactNode } from 'react';

// CORRECTION : Ajouter l'index signature
export interface MaterialValue {
  [key: string]: number; // Index signature pour permettre l'accès dynamique
  mat_1: number;
  mat_2: number;
  mat_3: number;
}

// Alternative : Utiliser Record
// export type MaterialValue = Record<string, number>;

export interface ItemData {
  [itemKey: string]: MaterialValue;
}

export interface EtageData {
  [etage: string]: ItemData;
}

export interface BlockData {
  [blockKey: string]: EtageData;
}

export interface StructureMateriaux {
  [itemKey: string]: string[];
}

export interface Structure {
  etages: number[];
  items: string[];
  materiaux: StructureMateriaux;
}

export interface Metadata {
  lastUpdated: string;
  version: string;
  totalBlocks: number;
  totalEtages: number;
  totalItems: number;
}

export interface InventoryData {
  structure: Structure;
  data: BlockData;
  metadata: Metadata;
}

// Types pour les actions API
export type ApiActionType = 'updateValue' | 'updateBlock' | 'backup';

export interface UpdateValueParams {
  action: 'updateValue';
  blockId: number;
  etage: number;
  itemKey: string;
  matKey: string;
  value: number;
}

export interface UpdateBlockParams {
  action: 'updateBlock';
  blockId: number;
  blockData: EtageData;
}

export interface BackupParams {
  action: 'backup';
}

export type ApiActionParams = UpdateValueParams | UpdateBlockParams | BackupParams;

// Types pour les réponses
export interface ApiSuccessResponse {
  success: true;
  data?: unknown;
  backupPath?: string;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// Types pour les statistiques
export interface Stats {
  totalBlocks: number;
  totalEtages: number;
  totalItems: number;
  lastUpdated: string;
  version: string;
}

// Types pour les props des composants
export interface BlockSelectorProps {
  currentBlock: number;
  onBlockChange: (block: number) => void;
  totalBlocks?: number;
  disabled?: boolean;
}

export interface InventoryItemProps {
  blockId: number;
  etage: number;
  itemKey: string;
  matKey: string;
  itemName: string;
  materialName: string;
  value: number;
  onUpdate: (value: number) => Promise<void>;
  isSaving?: boolean;
}

export interface EtageCardProps {
  etageNumber: number;
  blockId: number;
  etageData: EtageData;
  onUpdateValue: (itemKey: string, matKey: string, value: number) => Promise<void>;
  getItemName: (itemKey: string) => string;
  getMaterialName: (itemKey: string, matKey: string) => string;
}