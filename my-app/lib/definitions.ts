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

export type Stats = {
  totalBlocks: number;
  totalEtages: number;
  totalItems: number;
  lastUpdated: string;
  version: string;
}

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