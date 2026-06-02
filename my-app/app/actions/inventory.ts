'use server';

import { revalidatePath } from 'next/cache';
import { ApiResponse, ApiSuccessResponse, Stats } from '@/lib/definitions';
import { fileDB } from '@/lib/fileDB';

const PATHS_TO_REVALIDATE: string[] = [
  '/',
  '/bloc_1',
  '/bloc_2',
  '/bloc_3',
  '/bloc_4',
  '/bloc_5',
  '/bloc_6',
  '/bloc_7',
  '/bloc_8',
  '/bloc_9'
];

function revalidateInventoryPaths() {
  PATHS_TO_REVALIDATE.forEach((path: string) => revalidatePath(path));
}

// Server Action pour renommer une catégorie
export async function renameCategory(
  categoryId: string,
  newName: string
): Promise<ApiResponse | ApiSuccessResponse> {
  try {
    const result: ApiResponse = await fileDB.updateCategory(categoryId, newName);
    
    if (result.success) {
      revalidateInventoryPaths();
    }
    
    return result;
  } catch (error: unknown) {
    return { success: false, error: 'Erreur serveur' };
  }
}

// Server Action pour supprimer une catégorie
export async function deleteCategory(categoryId: string): Promise<ApiResponse | ApiSuccessResponse> {
  try {
    const result: ApiResponse = await fileDB.deleteCategory(categoryId);
    
    if (result.success) {
      revalidateInventoryPaths();
    }
    
    return result;
  } catch (error: unknown) {
    return { success: false, error: 'Erreur serveur' };
  }
}

// Server Action pour ajouter une catégorie
export async function addCategory(
  etageId: string,
  categoryName: string
): Promise<ApiResponse | ApiSuccessResponse> {
  try {
    const result: ApiResponse = await fileDB.addCategory(etageId, categoryName);
    
    if (result.success) {
      revalidateInventoryPaths();
    }
    
    return result;
  } catch (error: unknown) {
    return { success: false, error: 'Erreur serveur' };
  }
}

// Server Action pour modifier la quantité d'un modèle
export async function updateModeleQuantity(
  categoryId: string,
  modeleId: string,
  quantity: number
): Promise<ApiResponse | ApiSuccessResponse> {
  try {
    const result: ApiResponse = await fileDB.updateModele(categoryId, modeleId, quantity);
    
    if (result.success) {
      revalidateInventoryPaths();
    }
    
    return result;
  } catch (error: unknown) {
    return { success: false, error: 'Erreur serveur' };
  }
}

// Server Action pour ajouter un modèle
export async function addModele(
  categoryId: string,
  modeleName: string,
  quantity: number
): Promise<ApiResponse | ApiSuccessResponse> {
  try {
    const result: ApiResponse = await fileDB.addModele(categoryId, modeleName, quantity);
    
    if (result.success) {
      revalidateInventoryPaths();
    }
    
    return result;
  } catch (error: unknown) {
    return { success: false, error: 'Erreur serveur' };
  }
}

// Server Action pour supprimer un modèle
export async function deleteModele(
  categoryId: string,
  modeleId: string
): Promise<ApiResponse | ApiSuccessResponse> {
  try {
    const result: ApiResponse = await fileDB.deleteModele(categoryId, modeleId);
    
    if (result.success) {
      revalidateInventoryPaths();
    }
    
    return result;
  } catch (error: unknown) {
    return { success: false, error: 'Erreur serveur' };
  }
}

// Server Action pour créer un backup
export async function createBackup(): Promise<ApiResponse | ApiSuccessResponse | void> {
  try {
    const result: ApiResponse = await fileDB.createBackup();
    revalidateInventoryPaths();
    return result;
  } catch (error: unknown) {
    return { success: false, error: 'Erreur lors du backup' };
  }
}

// Server Action pour obtenir les stats
export async function getInventoryStats(): Promise<Stats | null | void> {
  try {
    return await fileDB.getStats();
  } catch (error: unknown) {
    return null;
  }
}