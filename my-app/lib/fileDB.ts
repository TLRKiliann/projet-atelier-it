// 📁 Chemin: /lib/fileDB.ts
import fs from 'fs/promises';
import path from 'path';
import { InventoryData, EtageData, ApiResponse, Stats } from './definitions';

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
  private cache: InventoryData | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_TTL = 5000; // 5 secondes

  async readAll(useCache: boolean = true): Promise<InventoryData> {
    // Cache pour réduire les lectures disque
    if (useCache && this.cache && (Date.now() - this.cacheTimestamp) < this.CACHE_TTL) {
      return this.cache;
    }

    try {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      this.cache = JSON.parse(data) as InventoryData;
      this.cacheTimestamp = Date.now();
      return this.cache;
    } catch (error) {
      console.error('Erreur de lecture:', error);
      throw new Error('Impossible de lire la base de données');
    }
  }

  async writeAll(data: InventoryData): Promise<ApiResponse> {
    try {
      // Mettre à jour les métadonnées
      data.metadata = {
        ...data.metadata,
        lastUpdated: new Date().toISOString()
      };
      
      // Écrire dans le fichier
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
      
      // Mettre à jour le cache
      this.cache = data;
      this.cacheTimestamp = Date.now();
      
      return { success: true, message: 'Données sauvegardées' };
    } catch (error) {
      console.error('Erreur d\'écriture:', error);
      return { success: false, error: 'Impossible d\'écrire dans la base de données' };
    }
  }

  async getBlock(blockId: number): Promise<EtageData | null> {
    const data = await this.readAll();
    return data.data[`block_${blockId}`] || null;
  }

  async updateValue(
    blockId: number, 
    etage: number, 
    itemKey: string, 
    matKey: string, 
    value: number
  ): Promise<ApiResponse> {
    const data = await this.readAll();
    const blockKey = `block_${blockId}`;
    const etageKey = etage.toString();
    
    if (data.data[blockKey]?.[etageKey]?.[itemKey]) {
      data.data[blockKey][etageKey][itemKey][matKey] = value;
      return await this.writeAll(data);
    }
    
    return { success: false, error: 'Chemin invalide' };
  }

  async updateBlock(blockId: number, blockData: EtageData): Promise<ApiResponse> {
    const data = await this.readAll();
    data.data[`block_${blockId}`] = blockData;
    return await this.writeAll(data);
  }

  async createBackup(): Promise<ApiResponse & { backupPath?: string }> {
    try {
      await ensureBackupDir();
      const data = await this.readAll(false); // Ignorer cache pour backup
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(BACKUP_DIR, `backup_${timestamp}.json`);
      await fs.writeFile(backupPath, JSON.stringify(data, null, 2));
      return { success: true, backupPath, message: `Backup créé: ${backupPath}` };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la création du backup' };
    }
  }

  async listBackups(): Promise<string[]> {
    try {
      await ensureBackupDir();
      const files = await fs.readdir(BACKUP_DIR);
      return files.filter(f => f.startsWith('backup_')).sort().reverse();
    } catch {
      return [];
    }
  }

  async restoreFromBackup(backupFileName: string): Promise<ApiResponse> {
    try {
      const backupPath = path.join(BACKUP_DIR, backupFileName);
      const backupData = await fs.readFile(backupPath, 'utf-8');
      const parsedData = JSON.parse(backupData) as InventoryData;
      return await this.writeAll(parsedData);
    } catch (error) {
      return { success: false, error: 'Impossible de restaurer le backup' };
    }
  }

  async getStats(): Promise<Stats> {
    const data = await this.readAll();
    return {
      totalBlocks: data.metadata.totalBlocks,
      totalEtages: data.metadata.totalEtages,
      totalItems: data.metadata.totalItems,
      lastUpdated: data.metadata.lastUpdated,
      version: data.metadata.version
    };
  }

  async resetAll(): Promise<ApiResponse> {
    // Créer un backup automatique avant réinitialisation
    await this.createBackup();
    
    const data = await this.readAll();
    
    // Réinitialiser toutes les valeurs à 0
    for (const blockKey in data.data) {
      for (const etage in data.data[blockKey]) {
        for (const itemKey in data.data[blockKey][etage]) {
          data.data[blockKey][etage][itemKey] = {
            mat_1: 0,
            mat_2: 0,
            mat_3: 0
          };
        }
      }
    }
    
    return await this.writeAll(data);
  }

  // Invalider le cache (utile après des modifications externes)
  invalidateCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
  }
}

export const fileDB = new FileDatabase();