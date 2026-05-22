"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import { FaHome, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import styles from "../styles/bloc.module.scss";
import inventoryData from '@/database/inventory.json';

// Types
interface MaterialValue {
  mat_1: number;
  mat_2: number;
  mat_3: number;
}

interface ItemData {
  [itemKey: string]: MaterialValue;
}

interface EtageData {
  [etage: string]: ItemData;
}

interface InventoryDataType {
  structure: {
    etages: number[];
    items: string[];
    materiaux: {
      [key: string]: string[];
    };
  };
  data: {
    [blockKey: string]: EtageData;
  };
  metadata: {
    lastUpdated: string;
    version: string;
    totalBlocks: number;
    totalEtages: number;
    totalItems: number;
  };
}

export default function Bloc_1() {
  const router = useRouter();
  const [data, setData] = useState<EtageData | null>(null);
  const [newValue, setNewValue] = useState<string>("");
  const [switchToChange, setSwitchToChange] = useState<boolean>(false);
  const [currentEdit, setCurrentEdit] = useState<{ etage: string; itemKey: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const getItemName = (etage: string, itemKey: string): string => {
    const jsonData = inventoryData as any;
    
    // Vérifier si un nom personnalisé existe
    if (jsonData.customNames?.block_1?.[etage]?.[itemKey]) {
      return jsonData.customNames.block_1[etage][itemKey];
    }
    
    // Sinon, utiliser le nom par défaut
    const itemNum = parseInt(itemKey.split('_')[1]);
    const patterns = ["Ecran", "Souris", "G1, G2, G3"];
    const index = (itemNum - 1) % patterns.length;
    return patterns[index];
  };

  useEffect(() => {
    const jsonData = inventoryData as unknown as InventoryDataType;
    const blockData = jsonData.data.block_1;
    setData(blockData);
    setLoading(false);
  }, []);

  const handleModify = (etage: string, itemKey: string, currentValue: string): void => {
    setCurrentEdit({ etage, itemKey });
    setNewValue(currentValue);
    setSwitchToChange(() => !switchToChange);
  };

  const handleDelete = async (etage: string, itemKey: string): Promise<void> => {
    if (confirm(`Supprimer cet item ?`)) {
      try {
        const response = await fetch('/api/inventory', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            block: 'block_1',
            etage,
            itemKey,
            action: 'delete'
          })
        });
        
        if (response.ok) {
          const updatedData = await fetch('/api/inventory?block=block_1').then(r => r.json());
          setData(updatedData);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleSave = async (etage: string, itemKey: string): Promise<void> => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block: 'block_1',
          etage,
          itemKey,
          action: 'rename',
          newName: newValue
        })
      });
      
      if (response.ok) {
        const updatedData = await fetch('/api/inventory?block=block_1').then(r => r.json());
        setData(updatedData);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
    
    setSwitchToChange(false);
    setCurrentEdit(null);
    setNewValue("");
  };

  const handleSwitch = (): void => {
    setSwitchToChange(false);
    setCurrentEdit(null);
    setNewValue("");
  };

  if (loading) {
    return (
      <div className={styles.page_bloc}>
        <div className={styles.titleAndBtn}>
          <h1>Bloc 1</h1>
          <button onClick={() => router.push("/")} className={styles.btn_home}>
            <span><FaHome size={24} /></span>
          </button>
        </div>
        <div className={styles.container_bloc}>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page_bloc}>
        <div className={styles.titleAndBtn}>
          <h1>Bloc 1</h1>
          <button onClick={() => router.push("/")} className={styles.btn_home}>
            <span><FaHome size={24} /></span>
          </button>
        </div>
        <div className={styles.container_bloc}>
          <p>Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page_bloc}>
      <div className={styles.titleAndBtn}>
        <h1>Bloc 1</h1>
        <button onClick={() => router.push("/")} className={styles.btn_home}>
          <span><FaHome size={24} /></span>
        </button>
      </div>

      <div className={styles.container_bloc}>
        {Object.entries(data).map(([etage, etageData]) => (
          <div key={etage} className={styles.item_div}>

            <div className={styles.titleOfStack}>
              <h2>Etage {etage}</h2>
            </div>

            {Object.entries(etageData).map(([itemKey]) => {
              const itemName = getItemName(etage, itemKey);
              const isEditing = switchToChange && currentEdit?.etage === etage && currentEdit?.itemKey === itemKey;
              
              return (
                <div key={itemKey} className={styles.items_bloc_design}>

                  <span 
                    onClick={() => router.push(`/bloc_1/${etage}?item=${itemKey}`)} 
                    className={styles.items_bloc}
                  >

                    <div>
                      {isEditing ? (
                        <span onClick={(e) => e.stopPropagation()}>

                          <input 
                            type="text" 
                            value={newValue} 
                            onChange={(e) => setNewValue(e.target.value)}
                            placeholder={itemName}
                            autoFocus
                            className={styles.input}
                          />

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSave(etage, itemKey);
                            }}
                            className={styles.btn_save}
                          >
                            <FaSave />&nbsp;Save
                          </button>

                          <button
                            onClick={() => setSwitchToChange(() => !switchToChange)}
                            className={styles.btn_cancel}
                          >
                            Annuler
                          </button>

                        </span>
                      ) : (
                        <p>{itemName === "" ? "Vide" : itemName}</p>
                      )}
                    </div>
                  </span>

                  <div className={styles.btn_block}>

                    <button 
                      onClick={() => handleModify(etage, itemKey, itemName)} 
                      className={styles.btn_change_block}
                    >
                      <FaEdit size={24} />
                    </button>

                    <button 
                      onClick={() => handleDelete(etage, itemKey)} 
                      className={styles.btn_del_bloc}
                    >
                      <FaTrash size={24} />
                    </button>

                  </div>
                </div>
              );
            })}
            <hr />
          </div>
        ))}
      </div>
      
      {switchToChange && (
        <div className={styles.modal_overlay} onClick={handleSwitch}>
          <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>

            <button onClick={handleSwitch} className={styles.close_btn}>
              Annuler
            </button>
          
          </div>
        </div>
      )}
    </div>
  );
}