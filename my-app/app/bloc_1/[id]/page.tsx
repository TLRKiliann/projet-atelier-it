"use client";

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { FaHome, FaSave, FaTrash, FaEdit, FaArrowLeft, FaPlus } from "react-icons/fa";
import styles from "../../styles/bloc.module.scss";

interface Modele {
  id: string;
  nom: string;
  quantite: number;
}

interface Categorie {
  id: string;
  nom: string;
  modeles: Modele[];
}

interface Bloc {
  id: string;
  nom: string;
  etages: any[];
}

export default function CategoriePage() {
  const router = useRouter();
  const params = useParams();
  const categorieId = params.id as string;
  
  const [categorie, setCategorie] = useState<Categorie | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingModele, setEditingModele] = useState<string | null>(null);
  const [newModeleName, setNewModeleName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newModeleNameInput, setNewModeleNameInput] = useState("");
  const [newModeleQuantity, setNewModeleQuantity] = useState(0);

  useEffect(() => {
    fetchCategorie();
  }, [categorieId]);

  const fetchCategorie = async () => {
    try {
      const response = await fetch('/api/inventory?blocId=bloc_1');
      const blocData = await response.json();
      
      // Parcourir tous les étages pour trouver la catégorie avec l'ID correspondant
      let categorieTrouvee = null;
      for (const etage of blocData.etages) {
        const found = etage.categories.find((c: Categorie) => c.id === categorieId);
        if (found) {
          categorieTrouvee = found;
          break;
        }
      }
      setCategorie(categorieTrouvee);
    } catch (error) {
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Renommer un modèle
  const handleRenameModele = async (modeleId: string) => {
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
    } catch (error) {
      console.error('Erreur lors du renommage:', error);
    }
    
    setEditingModele(null);
    setNewModeleName("");
  };

  // Supprimer un modèle
  const handleDeleteModele = async (modeleId: string, modeleNom: string) => {
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
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // Modifier la quantité d'un modèle
  const handleUpdateQuantity = async (modeleId: string, nouvelleQuantite: number) => {
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
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
    }
  };

  // Ajouter un nouveau modèle
  const handleAddModele = async () => {
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
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.page_bloc}>
        <div className={styles.titleAndBtn}>
          <button onClick={() => router.push("/bloc_1")} className={styles.btn_return}>
            <FaArrowLeft size={24} />
          </button>
          <h1>Chargement...</h1>
          <button onClick={() => router.push("/")} className={styles.btn_home}>
            <FaHome size={24} />
          </button>
        </div>
      </div>
    );
  }

  if (!categorie) {
    return (
      <div className={styles.page_bloc}>
        <div className={styles.titleAndBtn}>
          <button onClick={() => router.push("/bloc_1")} className={styles.btn_return}>
            <FaArrowLeft size={24} />
          </button>
          <h1>Catégorie non trouvée</h1>
          <button onClick={() => router.push("/")} className={styles.btn_home}>
            <FaHome size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page_bloc}>
      <div className={styles.titleAndBtn}>
        <button onClick={() => router.push("/bloc_1")} className={styles.btn_return}>
          <FaArrowLeft size={24} />
        </button>
        <h1>{categorie.nom}</h1>
        <button onClick={() => router.push("/")} className={styles.btn_home}>
          <FaHome size={24} />
        </button>
      </div>

      <div className={styles.container_bloc}>
        <div className={styles.categorie_container}>
          {categorie.modeles.map((modele) => {
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
                    <button
                      onClick={() => handleRenameModele(modele.id)}
                      className={styles.btn_save}
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      onClick={() => setEditingModele(null)}
                      className={styles.btn_cancel}
                    >
                      Annuler
                    </button>
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
                          onChange={(e) => handleUpdateQuantity(modele.id, parseInt(e.target.value) || 0)}
                          className={styles.quantity_input}
                        />
                      </div>
                    </div>
                    <div className={styles.model_actions}>
                      <button
                        onClick={() => {
                          setEditingModele(modele.id);
                          setNewModeleName(modele.nom);
                        }}
                        className={styles.btn_change_block}
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteModele(modele.id, modele.nom)}
                        className={styles.btn_del_bloc}
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

        {/* Bouton pour ajouter un modèle */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className={styles.btn_add_modele}
          >
            <FaPlus /> Ajouter un modèle
          </button>
        ) : (
          <div className={styles.add_modele_form}>
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
              className={styles.input}
            />
            <button onClick={handleAddModele} className={styles.btn_save}>
              Ajouter
            </button>
            <button onClick={() => setShowAddForm(false)} className={styles.btn_cancel}>
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  );
}