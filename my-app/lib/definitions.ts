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

export type MaterialValue = {
  [key: string]: number;
  mat_1: number;
  mat_2: number;
  mat_3: number;
}

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

export type New = {
  structure: Structure;
  data: BlockData;
  metadata: Metadata;
}

export type PutRequestBody = {
  blocId: string;
  etageId: string;
  categoryId: string;
  action: string;
  newName: string;
  modeleId: string;
  nouvelleQuantite: number;
}

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

export type ModeleItem = {
  id: string;
  nom: string;
  quantite: number;
}

export type CategorieItem = {
  id: string;
  nom: string;
  modeles: ModeleItem[];
}

export type EtageItem = {
  id: string;
  nom: string;
  categories: CategorieItem[];
}

export type BlocItem = {
  id: string;
  nom: string;
  etages: EtageItem[];
}

export type NewInventoryData = {
  blocs: BlocItem[];
}

export type UseInventoryFileReturn = {
  data: NewInventoryData | null;
  loadingData: boolean;
  error: string | null;
  stats: Stats | null;
  currentBlock: number;
  setCurrentBlock: (block: number) => void;
  getCurrentBlockData: () => BlocItem | null;
  getItemName: (itemKey: string) => string;
  getMaterialName: (itemKey: string, matKey: string) => string;
  updateValue: (blockId: number, etage: number, itemKey: string, matKey: string, value: number) => Promise<boolean>;
  createBackup: () => Promise<void>;
  refreshData: () => Promise<void>;
  // resetAllData: () => Promise<void>;
  isPending: boolean;
  updateCategory: (categoryId: string, newName: string) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;
  addCategory: (etageId: string, categoryName: string) => Promise<boolean>;
  updateModele: (categoryId: string, modeleId: string, newQuantity: number) => Promise<boolean>;
  renameModele: (categoryId: string, modeleId: string, newName: string) => Promise<boolean>;
  deleteModele: (categoryId: string, modeleId: string) => Promise<boolean>;
  addModele: (categoryId: string, modeleName: string, quantity: number) => Promise<boolean>;
};