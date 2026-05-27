import fs from 'fs/promises';
import path from 'path';
import { NewInventoryData, Stats, ApiResponse, CategorieItem, BlocItem, ModeleItem, EtageItem } from '@/lib/definitions';

const DB_PATH = path.join(process.cwd(), 'database', 'inventory.json');
const BACKUP_DIR = path.join(process.cwd(), 'database', 'backups');

// Créer le dossier de backups s'il n'existe pas
async function ensureBackupDir() {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }
}

export class FileDatabase {
  private cache: NewInventoryData | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_TTL = 5000;

  async readAll(useCache: boolean = true): Promise<NewInventoryData> {
    if (useCache && this.cache && (Date.now() - this.cacheTimestamp) < this.CACHE_TTL) {
      return this.cache;
    }

    try {
      const data: string = await fs.readFile(DB_PATH, 'utf-8');
      this.cache = JSON.parse(data) as NewInventoryData;
      this.cacheTimestamp = Date.now();
      return this.cache;
    } catch (error: unknown) {
      console.error('Erreur de lecture:', error);
      throw new Error('Impossible de lire la base de données');
    }
  }

  async writeAll(data: NewInventoryData): Promise<ApiResponse> {
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
      this.cache = data;
      this.cacheTimestamp = Date.now();
      return { success: true, message: 'Données sauvegardées' };
    } catch (error: unknown) {
      console.error('Erreur d\'écriture:', error);
      return { success: false, error: 'Impossible d\'écrire dans la base de données' };
    }
  }

  async getBloc(blocId: string): Promise<any | null> {
    const data: NewInventoryData = await this.readAll();
    return data.blocs.find((b: BlocItem) => b.id === blocId) || null;
  }

  async updateCategory(categoryId: string, newName: string): Promise<ApiResponse> {
    const data: NewInventoryData = await this.readAll();
    
    for (const bloc of data.blocs) {
      for (const etage of bloc.etages) {
        const category: CategorieItem | undefined = etage.categories.find((c: CategorieItem) => c.id === categoryId);
        if (category) {
          category.nom = newName;
          return await this.writeAll(data);
        }
      }
    }
    return { success: false, error: 'Catégorie non trouvée' };
  }

  async deleteCategory(categoryId: string): Promise<ApiResponse> {
    const data: NewInventoryData = await this.readAll();
    
    for (const bloc of data.blocs) {
      for (const etage of bloc.etages) {
        const index: number = etage.categories.findIndex((c: CategorieItem) => c.id === categoryId);
        if (index !== -1) {
          etage.categories.splice(index, 1);
          return await this.writeAll(data);
        }
      }
    }
    return { success: false, error: 'Catégorie non trouvée' };
  }

  async addCategory(etageId: string, categoryName: string): Promise<ApiResponse> {
    const data: NewInventoryData = await this.readAll();
    
    for (const bloc of data.blocs) {
      for (const etage of bloc.etages) {
        if (etage.id === etageId) {
          const newCategory = {
            id: `${etageId}_cat_${Date.now()}`,
            nom: categoryName,
            modeles: []
          };
          etage.categories.push(newCategory);
          return await this.writeAll(data);
        }
      }
    }
    return { success: false, error: 'Étage non trouvé' };
  }

  async updateModele(categoryId: string, modeleId: string, newQuantity: number): Promise<ApiResponse> {
    const data: NewInventoryData = await this.readAll();
    
    for (const bloc of data.blocs) {
      for (const etage of bloc.etages) {
        const category = etage.categories.find((c: CategorieItem) => c.id === categoryId);
        if (category) {
          const modele: ModeleItem | undefined = category.modeles.find((m: ModeleItem) => m.id === modeleId);
          if (modele) {
            modele.quantite = newQuantity;
            return await this.writeAll(data);
          }
        }
      }
    }
    return { success: false, error: 'Modèle non trouvé' };
  }

  async addModele(categoryId: string, modeleName: string, quantity: number): Promise<ApiResponse> {
    const data: NewInventoryData = await this.readAll();
    
    for (const bloc of data.blocs) {
      for (const etage of bloc.etages) {
        const category = etage.categories.find((c: CategorieItem) => c.id === categoryId);
        if (category) {
          const newModele = {
            id: `mod_${Date.now()}`,
            nom: modeleName,
            quantite: quantity
          };
          category.modeles.push(newModele);
          return await this.writeAll(data);
        }
      }
    }
    return { success: false, error: 'Catégorie non trouvée' };
  }

  async deleteModele(categoryId: string, modeleId: string): Promise<ApiResponse> {
    const data: NewInventoryData = await this.readAll();
    
    for (const bloc of data.blocs) {
      for (const etage of bloc.etages) {
        const category: CategorieItem | undefined = etage.categories.find((c: CategorieItem) => c.id === categoryId);
        if (category) {
          const index: number = category.modeles.findIndex((m: ModeleItem) => m.id === modeleId);
          if (index !== -1) {
            category.modeles.splice(index, 1);
            return await this.writeAll(data);
          }
        }
      }
    }
    return { success: false, error: 'Modèle non trouvé' };
  }

  async createBackup(): Promise<ApiResponse & { backupPath?: string }> {
    try {
      await ensureBackupDir();
      const data: NewInventoryData = await this.readAll(false);
      const timestamp: string = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath: string = path.join(BACKUP_DIR, `backup_${timestamp}.json`);
      await fs.writeFile(backupPath, JSON.stringify(data, null, 2));
      return { success: true, backupPath, message: `Backup créé: ${backupPath}` };
    } catch (error: unknown) {
      return { success: false, error: 'Erreur lors de la création du backup' };
    }
  }

  async getStats(): Promise<Stats> {
    const data: NewInventoryData = await this.readAll();
    const totalBlocs: number = data.blocs.length;
    const totalEtages: number = data.blocs.reduce((acc: number, bloc: BlocItem) => acc + bloc.etages.length, 0);
    const totalCategories: number = data.blocs.reduce((acc: number, bloc: BlocItem) => 
      acc + bloc.etages.reduce((acc2: number, etage: EtageItem) => acc2 + etage.categories.length, 0), 0);
    
    return {
      totalBlocks: totalBlocs,
      totalEtages: totalEtages,
      totalItems: totalCategories,
      lastUpdated: new Date().toISOString(),
      version: "1.0"
    };
  }

  invalidateCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
  }
}

export const fileDB = new FileDatabase();