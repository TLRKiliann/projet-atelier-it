'use server';

import { revalidatePath } from 'next/cache';
import { fileDB } from '@/lib/fileDB';

// Server Action pour renommer une catégorie
export async function renameCategory(
  categoryId: string,
  newName: string
) {
  try {
    const result = await fileDB.updateCategory(categoryId, newName);
    
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/bloc_1');
      revalidatePath('/bloc_2');
    }
    
    return result;
  } catch (error) {
    return { success: false, error: 'Erreur serveur' };
  }
}

// Server Action pour supprimer une catégorie
export async function deleteCategory(categoryId: string) {
  try {
    const result = await fileDB.deleteCategory(categoryId);
    
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/bloc_1');
      revalidatePath('/bloc_2');
    }
    
    return result;
  } catch (error) {
    return { success: false, error: 'Erreur serveur' };
  }
}

// Server Action pour ajouter une catégorie
export async function addCategory(etageId: string, categoryName: string) {
  try {
    const result = await fileDB.addCategory(etageId, categoryName);
    
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/bloc_1');
      revalidatePath('/bloc_2');
    }
    
    return result;
  } catch (error) {
    return { success: false, error: 'Erreur serveur' };
  }
}

// Server Action pour modifier la quantité d'un modèle
export async function updateModeleQuantity(
  categoryId: string,
  modeleId: string,
  quantity: number
) {
  try {
    const result = await fileDB.updateModele(categoryId, modeleId, quantity);
    
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/bloc_1');
      revalidatePath('/bloc_2');
    }
    
    return result;
  } catch (error) {
    return { success: false, error: 'Erreur serveur' };
  }
}

// Server Action pour ajouter un modèle
export async function addModele(
  categoryId: string,
  modeleName: string,
  quantity: number
) {
  try {
    const result = await fileDB.addModele(categoryId, modeleName, quantity);
    
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/bloc_1');
      revalidatePath('/bloc_2');
    }
    
    return result;
  } catch (error) {
    return { success: false, error: 'Erreur serveur' };
  }
}

// Server Action pour supprimer un modèle
export async function deleteModele(categoryId: string, modeleId: string) {
  try {
    const result = await fileDB.deleteModele(categoryId, modeleId);
    
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/bloc_1');
      revalidatePath('/bloc_2');
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
    revalidatePath('/');
    revalidatePath('/bloc_1');
    revalidatePath('/bloc_2');
    return result;
  } catch (error) {
    return { success: false, error: 'Erreur lors du backup' };
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
// // Server Action pour réinitialiser les données d'un bloc spécifique
// export async function resetInventory(blocId?: string) {
//   try {
//     // Si vous avez une méthode reset dans fileDB, utilisez-la
//     // Sinon, créez une fonction de réinitialisation
//     const result = await fileDB.resetAll(blocId);
//     revalidatePath('/');
//     revalidatePath('/bloc_1');
//     revalidatePath('/bloc_2');
//     return result;
//   } catch (error) {
//     return { success: false, error: 'Erreur lors de la réinitialisation' };
//   }
// }