'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { ApiResponse, ApiSuccessResponse, NewInventoryData, Stats, UseInventoryFileReturn } from '@/lib/definitions';

import { createBackup, getInventoryStats } from '@/app/actions/inventory';

export const useInventoryFile = (): UseInventoryFileReturn => {
  const [data, setData] = useState<NewInventoryData | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBlock, setCurrentBlock] = useState<number>(1);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [statsData, inventoryResponse] = await Promise.all([
        getInventoryStats(),
        fetch('/api/inventory')
      ]);
      
      if (!inventoryResponse.ok) throw new Error('Erreur de chargement');
      
      const inventoryData = await inventoryResponse.json() as NewInventoryData;
      setData(inventoryData);
      
      if (statsData) {
        setStats(statsData);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur de chargement:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  // Fonctions pour la nouvelle structure
  const updateCategory = useCallback(async (categoryId: string, newName: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocId: `bloc_${currentBlock}`,
          categoryId,
          newName,
          action: 'renameCategory'
        })
      });
      
      if (response.ok) {
        await loadData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  }, [loadData, currentBlock]);

  const deleteCategory = useCallback(async (categoryId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocId: `bloc_${currentBlock}`,
          categoryId,
          action: 'deleteCategory'
        })
      });
      
      if (response.ok) {
        await loadData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  }, [loadData, currentBlock]);

  const addCategory = useCallback(async (etageId: string, categoryName: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocId: `bloc_${currentBlock}`,
          etageId,
          newName: categoryName,
          action: 'addCategory'
        })
      });
      
      if (response.ok) {
        await loadData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  }, [loadData, currentBlock]);

  const updateModele = useCallback(async (categoryId: string, modeleId: string, newQuantity: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocId: `bloc_${currentBlock}`,
          categoryId,
          modeleId,
          nouvelleQuantite: newQuantity,
          action: 'updateQuantity'
        })
      });
      
      if (response.ok) {
        await loadData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  }, [loadData, currentBlock]);

  const renameModele = useCallback(async (categoryId: string, modeleId: string, newName: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocId: `bloc_${currentBlock}`,
          categoryId,
          modeleId,
          newName,
          action: 'renameModele'
        })
      });
      
      if (response.ok) {
        await loadData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  }, [loadData, currentBlock]);

  const deleteModele = useCallback(async (categoryId: string, modeleId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocId: `bloc_${currentBlock}`,
          categoryId,
          modeleId,
          action: 'deleteModele'
        })
      });
      
      if (response.ok) {
        await loadData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  }, [loadData, currentBlock]);

  const addModele = useCallback(async (categoryId: string, modeleName: string, quantity: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocId: `bloc_${currentBlock}`,
          categoryId,
          newName: modeleName,
          nouvelleQuantite: quantity,
          action: 'addModele'
        })
      });
      
      if (response.ok) {
        await loadData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  }, [loadData, currentBlock]);

  const handleCreateBackup = useCallback(async (): Promise<void> => {
    try {
      const result = await createBackup();
      if (!result || !result.success) {
        throw new Error(result?.error || "Erreur lors de la création de la sauvegarde");
      }
      alert(`✅ ${result.message || 'Sauvegarde créée avec succès'}`);
    } catch (error: unknown) {
      alert(`❌ Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }, []);

  // const handleResetAll = async (): Promise<void> => {
  //   if (confirm('⚠️ Attention ! Cette action va réinitialiser TOUTES les données. Continuer ?')) {
  //     startTransition(async () => {
  //       try {
  //         const result = await resetInventory();
  //         if (result.success) {
  //           alert('✅ Données réinitialisées avec succès !');
  //           await loadData();
  //         } else {
  //           throw new Error(result.error);
  //         }
  //       } catch (err) {
  //         alert(`❌ Erreur lors de la réinitialisation: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
  //       }
  //     });
  //   }
  // };

  const getCurrentBlockData = () => {
    if (!data) return null;
    return data.blocs.find(b => b.id === `block_${currentBlock}`) || null;
  };

  // Fonctions non utilisées mais gardées pour compatibilité avec le type
  const updateValue = useCallback(async (): Promise<boolean> => false, []);
  const getItemName = useCallback((itemKey: string): string => itemKey, []);
  const getMaterialName = useCallback((itemKey: string, matKey: string): string => matKey, []);

  return {
    data: data,
    loadingData,
    error,
    stats,
    currentBlock,
    setCurrentBlock,
    getCurrentBlockData,
    getItemName,
    getMaterialName,
    updateValue,
    createBackup: handleCreateBackup,
    refreshData: loadData,
    // resetAllData: handleResetAll,
    isPending,
    updateCategory,
    deleteCategory,
    addCategory,
    updateModele,
    renameModele,
    deleteModele,
    addModele
  };
};