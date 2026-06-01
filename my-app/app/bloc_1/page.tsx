"use client";

import type { BlocItem } from '@/lib/definitions';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import BtnHome from '../components/btn-home';
import AddCategory from '../components/add-category';
import { FaSave, FaBan, FaTrash, FaEdit } from "react-icons/fa";
import styles from "../styles/bloc.module.scss";

export default function Bloc_1() {

  const router = useRouter();
  const [bloc, setBloc] = useState<BlocItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCategory, setEditingCategory] = useState<{
    etageId: string; 
    categoryId: string;
    categoryNom: string;
  } | null>(null);

  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newCategoryNameInput, setNewCategoryNameInput] = useState<string>("");
  const [selectedEtageId, setSelectedEtageId] = useState<string>("");

  useEffect(() => {
    fetchBloc();
  }, []);

  const fetchBloc = async (): Promise<void> => {
    try {
      const response = await fetch('/api/inventory?blocId=bloc_1');
      const data = await response.json() as BlocItem;
      setBloc(data);
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

  // Renommer une catégorie
  const handleRenameCategory = async (categoryId: string): Promise<void> => {
    if (!newCategoryName.trim()) return;
    
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocId: 'bloc_1',
          categoryId: categoryId,
          newName: newCategoryName,
          action: 'renameCategory'
        })
      });
      
      if (response.ok) {
        await fetchBloc();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erreur lors du renommage:', error.message);
      } else {
        console.error('Erreur lors du renommage:', error);
      }
    }
    
    setEditingCategory(null);
    setNewCategoryName("");
  };

  // Supprimer une catégorie
  const handleDeleteCategory = async (categoryId: string, categoryNom: string): Promise<void> => {
    if (confirm(`Supprimer la catégorie "${categoryNom}" ?`)) {
      try {
        const response = await fetch('/api/inventory', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blocId: 'bloc_1',
            categoryId: categoryId,
            action: 'deleteCategory'
          })
        });
        
        if (response.ok) {
          await fetchBloc();
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Erreur lors de la suppression:', error.message);
        } else {
          console.error('Erreur lors de la suppression:', error);
        }
      }
    }
  };

  // Ajouter une nouvelle catégorie
  const handleAddCategory = async (): Promise<void> => {
    if (!newCategoryNameInput.trim() || !selectedEtageId) return;
    
    try {
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocId: 'bloc_1',
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
          <h1>Bloc 1</h1>
          <BtnHome />
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
          <BtnHome />
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
        <BtnHome />
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
                  onClick={() => router.push(`/bloc_1/${category.id}`)}
                  className={styles.items_bloc_design}
                >

                  <div className={styles.items_bloc}>
                    {isEditing ? (
                      <div className={styles.edit_form} onClick={(e) => e.stopPropagation()}>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenameCategory(category.id);
                            }}
                            className={styles.btn_save}
                          >
                            <FaSave size={24} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCategory(null);
                            }}
                            className={styles.btn_cancel}
                          >
                            <FaBan size={24} />
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
                    <div className={styles.btn_bloc} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategory({
                            etageId: etage.id,
                            categoryId: category.id,
                            categoryNom: category.nom
                          });
                          setNewCategoryName(category.nom);
                        }}
                        className={styles.btn_edit}
                      >
                        <FaEdit size={24} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id, category.nom);
                        }}
                        className={styles.btn_delete}
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            <hr className={styles.hr} />
          </div>
        )).reverse()}

        {!showAddForm ? (
          <AddCategory
            setShowAddForm={() => setShowAddForm(true)}
            children="Ajouter une catégorie"
          />
        ) : (
          <div className={styles.add_modele_form}>
            <div className={styles.input_model}>
              <select
                value={selectedEtageId}
                onChange={(e) => setSelectedEtageId(e.target.value)}
                className={styles.select}
              >
                <option value="">Choisir un étage</option>
                {bloc.etages.map((etage) => (
                  <option key={etage.id} value={etage.id}>{etage.nom}</option>
                )).reverse()}
              </select>
              <input
                type="text"
                value={newCategoryNameInput}
                onChange={(e) => setNewCategoryNameInput(e.target.value)}
                placeholder="Nom de la catégorie"
                className={styles.input}
              />
            </div>
            <div>

            </div>
              <button onClick={handleAddCategory} className={styles.btn_save}>
                <FaSave size={24} />
              </button>
              <button onClick={() => setShowAddForm(false)} className={styles.btn_cancel}>
                <FaBan size={24} />
              </button>
          </div>
        )}
      </div>
    </div>
  );
}