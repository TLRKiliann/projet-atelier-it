// 📁 Chemin: /hooks/useInventoryFile.ts
'use client';
import { useState, useEffect, useCallback, useOptimistic, useTransition } from 'react';
import { InventoryData, EtageData, Stats, ApiResponse } from '@/lib/definitions';
import { updateInventoryValue, createBackup, resetInventory, getInventoryStats } from '@/app/actions/inventory';

interface UseInventoryFileReturn {
  data: InventoryData | null;
  loading: boolean;
  error: string | null;
  stats: Stats | null;
  currentBlock: number;
  setCurrentBlock: (block: number) => void;
  getCurrentBlockData: () => EtageData | null;
  getItemName: (itemKey: string) => string;
  getMaterialName: (itemKey: string, matKey: string) => string;
  updateValue: (blockId: number, etage: number, itemKey: string, matKey: string, value: number) => Promise<boolean>;
  createBackup: () => Promise<void>;
  refreshData: () => Promise<void>;
  resetAllData: () => Promise<void>;
  isPending: boolean;
}

export const useInventoryFile = (): UseInventoryFileReturn => {
  const [data, setData] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBlock, setCurrentBlock] = useState<number>(1);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isPending, startTransition] = useTransition();

  // Optimistic update
  const [optimisticData, addOptimisticUpdate] = useOptimistic(
    data,
    (state: InventoryData | null, update: { blockId: number; etage: number; itemKey: string; matKey: string; value: number }) => {
      if (!state) return state;
      
      const newState = { ...state };
      const blockKey = `block_${update.blockId}`;
      const etageKey = update.etage.toString();
      
      if (newState.data[blockKey]?.[etageKey]?.[update.itemKey]) {
        (newState.data[blockKey][etageKey][update.itemKey] as any)[update.matKey] = update.value;
      }
      
      return newState;
    }
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, inventoryResponse] = await Promise.all([
        getInventoryStats(),
        fetch('/api/inventory')
      ]);
      
      if (!inventoryResponse.ok) throw new Error('Erreur de chargement');
      
      const inventoryData = await inventoryResponse.json() as InventoryData;
      setData(inventoryData);
      
      if (statsData) {
        setStats(statsData);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur de chargement:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateValue = useCallback(async (
    blockId: number,
    etage: number,
    itemKey: string,
    matKey: string,
    value: number
  ): Promise<boolean> => {
    addOptimisticUpdate({ blockId, etage, itemKey, matKey, value });
    
    try {
      const result = await updateInventoryValue(blockId, etage, itemKey, matKey, value);
      
      if (!result.success) {
        await loadData();
        return false;
      }
      
      return true;
    } catch (err) {
      await loadData();
      return false;
    }
  }, [addOptimisticUpdate, loadData]);

  // CORRECTION : Gérer correctement le type de retour
  const handleCreateBackup = async (): Promise<void> => {
    startTransition(async () => {
      try {
        const result = await createBackup();
        
        // Vérifier si la propriété message existe
        if (result.success) {
          const message = 'message' in result ? result.message : 'Sauvegarde créée avec succès';
          alert(`✅ ${message}`);
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        alert(`❌ Erreur lors de la sauvegarde: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    });
  };

  const handleResetAll = async (): Promise<void> => {
    if (confirm('⚠️ Attention ! Cette action va réinitialiser TOUTES les données à 0. Un backup automatique sera créé. Continuer ?')) {
      startTransition(async () => {
        try {
          const result = await resetInventory();
          if (result.success) {
            alert('✅ Données réinitialisées avec succès !');
            await loadData();
          } else {
            throw new Error(result.error);
          }
        } catch (err) {
          alert(`❌ Erreur lors de la réinitialisation: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
        }
      });
    }
  };

  const getCurrentBlockData = (): EtageData | null => {
    const currentData = optimisticData || data;
    if (!currentData) return null;
    return currentData.data[`block_${currentBlock}`] || null;
  };

  const getItemName = (itemKey: string): string => {
    const itemNames: Record<number, string> = {
      1: 'Ecran', 2: 'Souris', 3: 'G1, G2, G3',
      4: 'Ecran', 5: 'Souris', 6: 'G1, G2, G3'
    };
    
    const num = parseInt(itemKey.split('_')[1]);
    const pattern = ((num - 1) % 3) + 1;
    return itemNames[pattern] || `Item ${num}`;
  };

  const getMaterialName = (itemKey: string, matKey: string): string => {
    const currentData = optimisticData || data;
    if (!currentData) return '';
    
    const num = parseInt(itemKey.split('_')[1]);
    const pattern = ((num - 1) % 3) + 1;
    const materials = currentData.structure.materiaux[`item_${pattern}`];
    const matIndex = parseInt(matKey.split('_')[1]) - 1;
    
    return materials?.[matIndex] || `Matériel ${matKey}`;
  };

  return {
    data: optimisticData || data,
    loading,
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
    resetAllData: handleResetAll,
    isPending
  };
};