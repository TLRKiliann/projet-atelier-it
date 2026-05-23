// 📁 Chemin: /app/actions/inventory.ts
'use server';

import { revalidatePath } from 'next/cache';
import { fileDB } from '@/lib/fileDB';
//import { EtageData } from '@/lib/definitions';

// Server Action pour mettre à jour une valeur
export async function updateInventoryValue(
  blockId: number,
  etage: number,
  itemKey: string,
  matKey: string,
  value: number
) {
  try {
    const result = await fileDB.updateValue(blockId, etage, itemKey, matKey, value);
    
    if (result.success) {
      // Revalider le chemin pour rafraîchir l'UI
      revalidatePath('/inventory');
    }
    
    return result;
  } catch (error) {
    return { success: false, error: 'Erreur serveur' };
  }
}

// Server Action pour créer un backup
export async function createBackup() {
  try {
    const result = await fileDB.createBackup();
    revalidatePath('/inventory');
    return result;
  } catch (error) {
    return { success: false, error: 'Erreur lors du backup' };
  }
}

// Server Action pour réinitialiser
export async function resetInventory() {
  try {
    const result = await fileDB.resetAll();
    revalidatePath('/inventory');
    return result;
  } catch (error) {
    return { success: false, error: 'Erreur lors de la réinitialisation' };
  }
}

// Server Action pour obtenir les stats
export async function getInventoryStats() {
  try {
    return await fileDB.getStats();
  } catch (error) {
    return null;
  }
}