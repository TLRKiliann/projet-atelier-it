"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import { FaHome, FaSave, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import styles from "../styles/bloc.module.scss";

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

interface Etage {
  id: string;
  nom: string;
  categories: Categorie[];
}

interface Bloc {
  id: string;
  nom: string;
  etages: Etage[];
}

export default function Bloc_3() {
  const router = useRouter();
  const [bloc, setBloc] = useState<Bloc | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<{ etageId: string; categoryId: string; categoryNom: string } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryNameInput, setNewCategoryNameInput] = useState("");
  const [selectedEtageId, setSelectedEtageId] = useState("");

  useEffect(() => {
    fetchBloc();
  }, []);

  const fetchBloc = async () => {
    try {
      const response = await fetch('/api/inventory?blocId=bloc_3');
      const data = await response.json();
      setBloc(data);
    } catch (error) {
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Renommer une catégorie
  const handleRenameCategory = async (categoryId: string) => {
    if (!newCategoryName.trim()) return;
    
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocId: 'bloc_3',
          categoryId: categoryId,
          newName: newCategoryName,
          action: 'renameCategory'
        })
      });
      
      if (response.ok) {
        await fetchBloc();
      }
    } catch (error) {
      console.error('Erreur lors du renommage:', error);
    }
    
    setEditingCategory(null);
    setNewCategoryName("");
  };

  // Supprimer une catégorie
  const handleDeleteCategory = async (categoryId: string, categoryNom: string) => {
    if (confirm(`Supprimer la catégorie "${categoryNom}" ?`)) {
      try {
        const response = await fetch('/api/inventory', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blocId: 'bloc_3',
            categoryId: categoryId,
            action: 'deleteCategory'
          })
        });
        
        if (response.ok) {
          await fetchBloc();
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // Ajouter une nouvelle catégorie
  const handleAddCategory = async () => {
    if (!newCategoryNameInput.trim() || !selectedEtageId) return;
    
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocId: 'bloc_3',
          etageId: selectedEtageId,
          newName: newCategoryNameInput,
          action: 'addCategory'
        })
      });
      
      if (response.ok) {
        await fetchBloc();
        setShowAddForm(false);
        setNewCategoryNameInput("");
        setSelectedEtageId("");
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.page_bloc}>
        <div className={styles.titleAndBtn}>
          <h1>Bloc 1</h1>
          <button onClick={() => router.push("/")} className={styles.btn_home}>
            <FaHome size={32} />
          </button>
        </div>
        <div className={styles.container_bloc}>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!bloc) {
    return (
      <div className={styles.page_bloc}>
        <div className={styles.titleAndBtn}>
          <h1>Bloc 1</h1>
          <button onClick={() => router.push("/")} className={styles.btn_home}>
            <FaHome size={32} />
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
        <h1>{bloc.nom}</h1>
        <button onClick={() => router.push("/")} className={styles.btn_home}>
          <FaHome size={32} />
        </button>
      </div>

      <div className={styles.container_bloc}>
        {bloc.etages.map((etage) => (
          <div key={etage.id} className={styles.etage_section}>
            <h2 className={styles.etage_title}>{etage.nom}</h2>
            
            {etage.categories.map((category) => {
              const isEditing = editingCategory?.categoryId === category.id;
              
              return (
                <div 
                  key={category.id} 
                  onClick={() => router.push(`/bloc_3/${category.id}`)}
                  className={styles.items_bloc_design}
                >
                  <div className={styles.items_bloc}>
                    {isEditing ? (
                      <div onClick={(e) => e.stopPropagation()} className={styles.edit_form}>
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder={category.nom}
                          autoFocus
                          className={styles.input}
                        />
                        <div>
                          <button
                            onClick={() => handleRenameCategory(category.id)}
                            className={styles.btn_save}
                          >
                            <FaSave size={18} />
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className={styles.btn_cancel}
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.category_content}>
                        <h3>
                          {category.nom}
                        </h3>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className={styles.btn_bloc}>
                      <button
                        onClick={(e) => {
                          setEditingCategory({
                            etageId: etage.id,
                            categoryId: category.id,
                            categoryNom: category.nom
                          });
                          setNewCategoryName(category.nom);
                          e.stopPropagation();
                        }}
                        className={styles.btn_change_block}
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          handleDeleteCategory(category.id, category.nom);
                          e.stopPropagation();
                        }}
                        className={styles.btn_del_bloc}
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            <hr />
          </div>
        ))}
        
        {/* Bouton pour ajouter une catégorie */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className={styles.btn_add_modele}
          >
            <FaPlus /> Ajouter une catégorie
          </button>
        ) : (
          <div className={styles.add_modele_form}>
            <select
              value={selectedEtageId}
              onChange={(e) => setSelectedEtageId(e.target.value)}
              className={styles.select}
            >
              <option value="">Choisir un étage</option>
              {bloc.etages.map((etage) => (
                <option key={etage.id} value={etage.id}>{etage.nom}</option>
              ))}
            </select>
            <div>
              <input
                type="text"
                value={newCategoryNameInput}
                onChange={(e) => setNewCategoryNameInput(e.target.value)}
                placeholder="Nom de la catégorie"
                className={styles.input}
              />
              <button onClick={handleAddCategory} className={styles.btn_save}>
                <FaSave size={18} />
              </button>
              <button onClick={() => setShowAddForm(false)} className={styles.btn_cancel}>
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}