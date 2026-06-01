"use client";

import type { BlocItem, CategorieItem, ModeleItem } from '@/lib/definitions';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import BtnHome from '@/app/components/btn-home';
import AddCategory from '@/app/components/add-category';
import { FaSave, FaBan, FaTrash, FaEdit, FaArrowLeft } from "react-icons/fa";
import styles from "../../styles/bloc.module.scss";

export default function CategoriePage_1() {

  const router = useRouter();
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
      const response = await fetch('/api/inventory?blocId=bloc_1');
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
          blocId: 'bloc_1',
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
            blocId: 'bloc_1',
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
          blocId: 'bloc_1',
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
          blocId: 'bloc_1',
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
          <button onClick={() => router.push("/bloc_1")} className={styles.btn_return}>
            <FaArrowLeft size={32} />
          </button>
          
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
          <button onClick={() => router.push("/bloc_1")} className={styles.btn_return}>
            <FaArrowLeft size={32} />
          </button>
          
          <h1>Catégorie non trouvée</h1>

          <BtnHome />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page_bloc}>
      <div className={styles.titleAndBtn}>
        <button onClick={() => router.push("/bloc_1")} className={styles.btn_return}>
          <FaArrowLeft size={32} />
        </button>
        
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
                  <div className={styles.edit_form}>
                    <input
                      type="text"
                      value={newModeleName}
                      onChange={(e) => setNewModeleName(e.target.value)}
                      placeholder={modele.nom}
                      autoFocus
                      className={styles.input}
                    />
                    <div>
                      <button
                        onClick={() => handleRenameModele(modele.id)}
                        className={styles.btn_save}
                      >
                        <FaSave size={24} />
                      </button>
                      <button
                        onClick={() => setEditingModele(null)}
                        className={styles.btn_cancel}
                      >
                        <FaBan size={24} />
                      </button>
                    </div>
                  </div>
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
          <div className={styles.add_modele_form}>
            <div className={styles.input_model}>
              <input
                type="text"
                value={newModeleNameInput}
                onChange={(e) => setNewModeleNameInput(e.target.value)}
                placeholder="Nom du modèle"
                className={styles.input}
              />
              <input
                type="number"
                value={newModeleQuantity}
                onChange={(e) => setNewModeleQuantity(parseInt(e.target.value) || 0)}
                placeholder="Quantité"
                className={styles.input_second}
                min="0"
              />
            </div>
            <div className={styles.box_btn_modele}>
              <button onClick={handleAddModele} className={styles.btn_save}>
                <FaSave size={24} />
              </button>
              <button onClick={() => setShowAddForm(false)} className={styles.btn_cancel}>
                <FaBan size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}