// 📁 Chemin: /app/bloc_1/[id]/page.tsx
"use client";

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { FaHome, FaSave, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import styles from "../../styles/bloc.module.scss";
import inventoryData from '@/database/inventory.json';

// CORRECTION : Rendre toutes les propriétés optionnelles ou utiliser un index signature
interface MaterialValue {
  [key: string]: number; // Index signature pour accepter n'importe quelle clé
}

// Ou alternative avec des propriétés optionnelles :
// interface MaterialValue {
//   mat_1?: number;
//   mat_2?: number;
//   mat_3?: number;
//   [key: string]: number | undefined;
// }

interface ItemData {
  [itemKey: string]: MaterialValue;
}

interface EtageData {
  [etage: string]: ItemData;
}

interface StructureMateriaux {
  [key: string]: string[];
}

interface Structure {
  etages: number[];
  items: string[];
  materiaux: StructureMateriaux;
}

interface Metadata {
  lastUpdated: string;
  version: string;
  totalBlocks: number;
  totalEtages: number;
  totalItems: number;
}

interface InventoryData {
  structure: Structure;
  data: {
    [blockKey: string]: EtageData;
  };
  metadata: Metadata;
}

export default function BlocDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const selectedItem = searchParams.get('item') || 'item_1';
  const etageId = params.id as string;
  
  const [data, setData] = useState<MaterialValue | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<{ model: string; nombre: number } | null>(null);
  const [newMaterial, setNewMaterial] = useState({ matKey: '', model: '', nombre: 0 });
  const [itemDisplayName, setItemDisplayName] = useState('');

  useEffect(() => {
    const jsonData = inventoryData as unknown as InventoryData;
    const blockData = jsonData.data.block_1;
    const etageData = blockData[etageId];
    
    if (etageData && etageData[selectedItem]) {
      setData(etageData[selectedItem]);
      
      const itemNum = parseInt(selectedItem.split('_')[1]);
      const pattern = ((itemNum - 1) % 3);
      setItemDisplayName(jsonData.structure.items[pattern] || selectedItem);
    }
    
    setLoading(false);
  }, [etageId, selectedItem]);

  const getMaterialName = (matKey: string): string => {
    const jsonData = inventoryData as unknown as InventoryData;
    const itemNum = parseInt(selectedItem.split('_')[1]);
    const materialKey = `item_${itemNum}`;
    const materials = jsonData.structure.materiaux[materialKey];
    
    const matIndex = parseInt(matKey.split('_')[1]) - 1;
    
    if (materials && materials[matIndex]) {
      return materials[matIndex];
    }
    return `Matériel ${matIndex + 1}`;
  };

  const handleUpdateMaterial = async (matKey: string, newNombre: number) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block: 'block_1',
          etage: etageId,
          item: selectedItem,
          material: matKey,
          nombre: newNombre
        })
      });
      
      if (response.ok) {
        // CORRECTION : Créer un nouvel objet avec la mise à jour
        setData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            [matKey]: newNombre
          };
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
    setEditingMaterial(null);
    setEditValue(null);
  };

  const handleAddMaterial = async () => {
    if (!newMaterial.model) return;
    
    try {
      let nextIndex = 3;
      while (data && data[`mat_${nextIndex}`] !== undefined) {
        nextIndex++;
      }
      
      const matKey = `mat_${nextIndex}`;
      
      const response = await fetch('/api/inventory/material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block: 'block_1',
          etage: etageId,
          item: selectedItem,
          matKey: matKey,
          model: newMaterial.model,
          nombre: newMaterial.nombre
        })
      });
      
      if (response.ok) {
        // CORRECTION : Créer un nouvel objet avec l'ajout
        setData(prev => {
          if (!prev) return { [matKey]: newMaterial.nombre };
          return {
            ...prev,
            [matKey]: newMaterial.nombre
          };
        });
        setNewMaterial({ matKey: '', model: '', nombre: 0 });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

  const handleDeleteMaterial = async (matKey: string) => {
    if (confirm('Supprimer ce matériel ?')) {
      try {
        const response = await fetch('/api/inventory/material', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            block: 'block_1',
            etage: etageId,
            item: selectedItem,
            material: matKey
          })
        });
        
        if (response.ok) {
          // CORRECTION : Créer un nouvel objet sans la clé supprimée
          setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            delete newData[matKey];
            return newData;
          });
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.page_bloc}>
        <div className={styles.titleAndBtn}>
          <h1>Chargement...</h1>
          <button onClick={() => router.push("/bloc_1")} className={styles.btn_home}>
            <span><FaHome size={24} /></span>
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page_bloc}>
        <div className={styles.titleAndBtn}>
          <h1>Item non trouvé</h1>
          <button onClick={() => router.push("/bloc_1")} className={styles.btn_home}>
            <span><FaHome size={24} /></span>
          </button>
        </div>
        <div className={styles.container_bloc}>
          <p>L&apos;item {selectedItem} n&apos;existe pas pour l&apos;étage {etageId}</p>
        </div>
      </div>
    );
  }

  const materialEntries = Object.entries(data);

  return (
    <div className={styles.page_bloc}>
      <div className={styles.titleAndBtn}>
        <h1>Bloc 1 - Etage {etageId} - {itemDisplayName}</h1>
        <button onClick={() => router.push("/bloc_1")} className={styles.btn_home}>
          <span><FaHome size={24} /></span>
        </button>
      </div>

      <div className={styles.container_bloc}>
        <div className={styles.detail_card}>
          <h2>Détails des matériaux</h2>
          
          <div className={styles.materials_list}>
            {materialEntries.map(([matKey, nombre]) => {
              const materialName = getMaterialName(matKey);
              
              return (
                <div key={matKey} className={styles.material_item}>
                  {editingMaterial === matKey ? (
                    <div className={styles.edit_form}>
                      <span className={styles.material_name}>{materialName}</span>
                      <input
                        type="number"
                        value={editValue?.nombre || 0}
                        onChange={(e) => setEditValue(prev => ({ ...prev!, nombre: parseInt(e.target.value) || 0 }))}
                        placeholder="Quantité"
                        className={styles.input}
                      />
                      <button onClick={() => handleUpdateMaterial(matKey, editValue?.nombre || 0)}>
                        <FaSave />
                      </button>
                      <button onClick={() => setEditingMaterial(null)}>Annuler</button>
                    </div>
                  ) : (
                    <>
                      <div className={styles.material_info}>
                        <strong>{materialName}</strong>
                        <span>Quantité: {nombre}</span>
                      </div>
                      <div className={styles.material_actions}>
                        <button onClick={() => {
                          setEditingMaterial(matKey);
                          setEditValue({ model: materialName, nombre });
                        }}>
                          <FaEdit /> Modifier
                        </button>
                        <button onClick={() => handleDeleteMaterial(matKey)}>
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.add_material}>
            <h3>Ajouter un matériel</h3>
            <div className={styles.add_form}>
              <input
                type="text"
                placeholder="Nom du modèle"
                value={newMaterial.model}
                onChange={(e) => setNewMaterial(prev => ({ ...prev, model: e.target.value }))}
                className={styles.input}
              />
              <input
                type="number"
                placeholder="Quantité"
                value={newMaterial.nombre}
                onChange={(e) => setNewMaterial(prev => ({ ...prev, nombre: parseInt(e.target.value) || 0 }))}
                className={styles.input}
              />
              <button onClick={handleAddMaterial}>
                <FaPlus /> Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}