"use client";

import type { BlocItem, CategorieItem, ModeleItem } from '@/lib/definitions';
import { useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import BtnHome from '@/app/components/btn-home';
import ArrowLeft from '@/app/components/arrow-left';
import EditModel from '@/app/components/edit-model';
import AddCategory from '@/app/components/add-category';
import ModelForm from '@/app/components/model-form';
import { FaTrash, FaEdit } from "react-icons/fa";
import styles from "@/app/styles/bloc.module.scss";

export default function CategoriePage_3() {

  //const router = useRouter();
  const params = useParams();
  const categorieId = params.id as string || undefined;
  
  const [categorie, setCategorie] = useState<CategorieItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingModele, setEditingModele] = useState<string | null>(null);
  const [newModeleName, setNewModeleName] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newModeleNameInput, setNewModeleNameInput] = useState<string>("");
  const [newModeleQuantity, setNewModeleQuantity] = useState<number>(0);

  useEffect(() => {
    fetchCategorie();
  }, [categorieId]);

  const fetchCategorie = async (): Promise<void> => {
    try {
      const response = await fetch('/api/inventory?blocId=bloc_3');
      const blocData = await response.json() as BlocItem;
      
      let categorieTrouvee = null;
      for (const etage of blocData.etages) {
        const found = etage.categories.find((cat) => cat.id === categorieId);
        if (found) {
          categorieTrouvee = found;
          break;
        }
      }
      setCategorie(categorieTrouvee);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erreur de chargement:', error.message);
      } else {
        console.error('Erreur de chargement:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Renommer un modèle
  const handleRenameModele = async (modeleId: string): Promise<void> => {
    if (!newModeleName.trim()) return;
    
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocId: 'bloc_3',
          categoryId: categorieId,
          modeleId: modeleId,
          newName: newModeleName,
          action: 'renameModele'
        })
      });
      
      if (response.ok) {
        await fetchCategorie();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erreur lors du renommage:', error.message);
      } else {
        console.error('Erreur lors du renommage:', error);
      }
    }
    
    setEditingModele(null);
    setNewModeleName("");
  };

  // Supprimer un modèle
  const handleDeleteModele = async (modeleId: string, modeleNom: string): Promise<void> => {
    if (confirm(`Supprimer le modèle "${modeleNom}" ?`)) {
      try {
        const response = await fetch('/api/inventory', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blocId: 'bloc_3',
            categoryId: categorieId,
            modeleId: modeleId,
            action: 'deleteModele'
          })
        });
        
        if (response.ok) {
          await fetchCategorie();
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Erreur lors de la suppression:", error.message);
        } else {
          console.error("Erreur lors de la suppression:", error);
        }
      }
    }
  };

  // Modifier la quantité d'un modèle
  const handleUpdateQuantity = async (modeleId: string, nouvelleQuantite: number): Promise<void> => {
    if (nouvelleQuantite < 0) {
      alert("La quantité ne peut pas être négative");
      return;
    }
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocId: 'bloc_3',
          categoryId: categorieId,
          modeleId: modeleId,
          nouvelleQuantite: nouvelleQuantite,
          action: 'updateQuantity'
        })
      });
      
      if (response.ok) {
        await fetchCategorie();
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de la modification:", error.message);
      } else {
        console.error("Erreur lors de la modification:", error);
      }
    }
  };

  // Ajouter un nouveau modèle
  const handleAddModele = async (): Promise<void> => {
    if (!newModeleNameInput.trim()) return;
    
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocId: 'bloc_3',
          categoryId: categorieId,
          newName: newModeleNameInput,
          nouvelleQuantite: newModeleQuantity,
          action: 'addModele'
        })
      });
      
      if (response.ok) {
        await fetchCategorie();
        setShowAddForm(false);
        setNewModeleNameInput("");
        setNewModeleQuantity(0);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de l\'ajout:", error.message);
      } else {
        console.error("Erreur lors de l\'ajout:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.page_bloc}>
        <div className={styles.titleAndBtn}>
          <ArrowLeft blocId={"/bloc_3"} />
          
          <h1>Chargement...</h1>

          <BtnHome />
        </div>
      </div>
    );
  }

  if (!categorie) {
    return (
      <div className={styles.page_bloc}>
        <div className={styles.titleAndBtn}>
          <ArrowLeft blocId={"/bloc_3"} />
          
          <h1>Catégorie non trouvée</h1>

          <BtnHome />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page_bloc}>
      <div className={styles.titleAndBtn}>
        <ArrowLeft blocId={"/bloc_3"} />
        
        <h1>{categorie.nom}</h1>

        <BtnHome />
      </div>

      <div className={styles.container_bloc}>
        <div className={styles.categorie_container}>
          {categorie.modeles.map((modele: ModeleItem) => {
            const isEditing = editingModele === modele.id;
            
            return (
              <div key={modele.id} className={styles.model_item_card}>
                {isEditing ? (
                  <EditModel 
                    newModeleName={newModeleName}
                    setNewModeleName={setNewModeleName}
                    modelName={modele.id}
                    modelId={modele.id}
                    handleRenameModele={() => handleRenameModele(modele.id)}
                    setEditingModele={() => setEditingModele(null)}
                  />
                ) : (
                  <div className={styles.model_content}>
                    <div className={styles.model_info}>
                      <span className={styles.model_name}>{modele.nom}</span>
                      <div className={styles.model_quantity}>
                        <span>Quantité: </span>
                        <input
                          type="number"
                          value={modele.quantite}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 0) {
                              handleUpdateQuantity(modele.id, value);
                            }
                          }}
                          className={styles.quantity_input}
                          min="0"
                        />
                      </div>
                    </div>
                    <div className={styles.model_actions}>
                      <button
                        onClick={() => {
                          setEditingModele(modele.id);
                          setNewModeleName(modele.nom);
                        }}
                        className={styles.btn_edit}
                      >
                        <FaEdit size={24} />
                      </button>
                      <button
                        onClick={() => handleDeleteModele(modele.id, modele.nom)}
                        className={styles.btn_delete}
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!showAddForm ? (
          <AddCategory
            setShowAddForm={() => setShowAddForm(true)}
            children="Ajouter un modèle"
          />
        ) : (
          <ModelForm
            newModeleNameInput={newModeleNameInput}
            setNewModeleNameInput={setNewModeleNameInput}
            newModeleQuantity={newModeleQuantity}
            setNewModeleQuantity={setNewModeleQuantity}
            handleAddModele={handleAddModele}
            setShowAddForm={setShowAddForm}
          />
        )}
      </div>
    </div>
  );
}