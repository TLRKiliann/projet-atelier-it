export type Modele = {
  id: string;
  nom: string;
  quantite: number;
}

export type Categorie = {
  id: string;
  nom: string;
  modeles: Modele[];
}

export type Etage = {
  id: string;
  nom: string;
  categories: Categorie[];
}

export type Bloc = {
  id: string;
  nom: string;
  etages: Etage[];
}

// CORRECTION : Ajouter l'index signature
export type MaterialValue = {
  [key: string]: number; // Index signature pour permettre l'accès dynamique
  mat_1: number;
  mat_2: number;
  mat_3: number;
}

// Alternative : Utiliser Record
// export type MaterialValue = Record<string, number>;

export type ItemData = {
  [itemKey: string]: MaterialValue;
}

export type EtageData = {
  [etage: string]: ItemData;
}

export type BlockData = {
  [blockKey: string]: EtageData;
}

export type StructureMateriaux = {
  [itemKey: string]: string[];
}

export type Structure = {
  etages: number[];
  items: string[];
  materiaux: StructureMateriaux;
}

export type Metadata = {
  lastUpdated: string;
  version: string;
  totalBlocks: number;
  totalEtages: number;
  totalItems: number;
}

export type InventoryData = {
  structure: Structure;
  data: BlockData;
  metadata: Metadata;
}

// Types pour les actions API
// export type ApiActionType = 'updateValue' | 'updateBlock' | 'backup';

// export type UpdateValueParams = {
//   action: 'updateValue';
//   blockId: number;
//   etage: number;
//   itemKey: string;
//   matKey: string;
//   value: number;
// }

// export type UpdateBlockParams = {
//   action: 'updateBlock';
//   blockId: number;
//   blockData: EtageData;
// }

// export type BackupParams = {
//   action: 'backup';
// }

// export type ApiActionParams = UpdateValueParams | UpdateBlockParams | BackupParams;

// Types pour les réponses
export type ApiSuccessResponse = {
  success: true;
  data?: unknown;
  backupPath?: string;
  message?: string;
}

export type ApiErrorResponse = {
  success: false;
  error: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// Types pour les statistiques
export type Stats = {
  totalBlocks: number;
  totalEtages: number;
  totalItems: number;
  lastUpdated: string;
  version: string;
}

// Types pour les props des composants
// export type BlockSelectorProps = {
//   currentBlock: number;
//   onBlockChange: (block: number) => void;
//   totalBlocks?: number;
//   disabled?: boolean;
// }

// export type InventoryItemProps = {
//   blockId: number;
//   etage: number;
//   itemKey: string;
//   matKey: string;
//   itemName: string;
//   materialName: string;
//   value: number;
//   onUpdate: (value: number) => Promise<void>;
//   isSaving?: boolean;
// }

// export type EtageCardProps = {
//   etageNumber: number;
//   blockId: number;
//   etageData: EtageData;
//   onUpdateValue: (itemKey: string, matKey: string, value: number) => Promise<void>;
//   getItemName: (itemKey: string) => string;
//   getMaterialName: (itemKey: string, matKey: string) => string;
// }