"use client";

import { BlocItem } from '@/lib/definitions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useInventoryFile } from '@/hooks/useInventoryFile';
import BtnHome from '../components/btn-home';
import AddCategory from '../components/add-category';
import { FaSave, FaBan, FaTrash, FaEdit } from "react-icons/fa";
import styles from "../styles/bloc.module.scss";
import CategoryForm from '../components/category-form';

export default function Bloc_9() {
  const router = useRouter();
  const [editingCategory, setEditingCategory] = useState<{ etageId: string; categoryId: string; categoryNom: string } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryNameInput, setNewCategoryNameInput] = useState("");
  const [selectedEtageId, setSelectedEtageId] = useState("");

  const { 
    data,
    loadingData,
    error,
    updateCategory,
    deleteCategory,
    addCategory,
    refreshData,
    setCurrentBlock
  } = useInventoryFile();

  useEffect(() => {
    setCurrentBlock(9);
  }, [setCurrentBlock]);

  const bloc: BlocItem | undefined = data?.blocs?.find((b) => b.id === 'bloc_9');

  // Renommer une catégorie
  const handleRenameCategory = async (categoryId: string) => {
    if (!newCategoryName.trim()) return;
    const success = await updateCategory(categoryId, newCategoryName);
    if (success) {
      await refreshData();
    }
    setEditingCategory(null);
    setNewCategoryName("");
  };

  // Supprimer une catégorie
  const handleDeleteCategory = async (categoryId: string, categoryNom: string) => {
    if (confirm(`Supprimer la catégorie "${categoryNom}" ?`)) {
      const success = await deleteCategory(categoryId);
      if (success) {
        await refreshData();
      }
    }
  };

  // Ajouter une nouvelle catégorie
  const handleAddCategory = async () => {
    if (!newCategoryNameInput.trim() || !selectedEtageId) return;
    
    const success = await addCategory(selectedEtageId, newCategoryNameInput);
    if (success) {
      await refreshData();
      setShowAddForm(false);
      setNewCategoryNameInput("");
      setSelectedEtageId("");
    }
  };

  if (loadingData) {
    return (
      <div className={styles.page_bloc}>
        <div className={styles.titleAndBtn}>
          <h1>Bloc 1</h1>
          <BtnHome />
        </div>
        <div className={styles.container_bloc}>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page_bloc}>
        <div className={styles.titleAndBtn}>
          <h1>Bloc 1</h1>
          <BtnHome />
        </div>
        <div className={styles.container_bloc}>
          <p className={styles.error}>Erreur : {error}</p>
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
          <p>Aucune donnée disponible pour le bloc 1</p>
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
                  onClick={() => router.push(`/bloc_9/${category.id}`)}
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
                        <h3>{category.nom}</h3>
                        <div className={styles.modeles_preview}>
                          {category.modeles.slice(0, 3).map((modele) => (
                            <span key={modele.id} className={styles.modele_tag}>
                              {modele.nom}: {modele.quantite}
                            </span>
                          ))}
                          {category.modeles.length > 3 && (
                            <span className={styles.modele_more}>+{category.modeles.length - 3}</span>
                          )}
                        </div>
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
            <hr className={styles.hr}/>
          </div>
        )).reverse()}
        
        {!showAddForm ? (
          <AddCategory
            setShowAddForm={() => setShowAddForm(true)}
            children="Ajouter une catégorie"
          />
        ) : (
          <CategoryForm
            selectedEtageId={selectedEtageId}
            setSelectedEtageId={setSelectedEtageId}
            bloc={bloc}
            newCategoryNameInput={newCategoryNameInput}
            setNewCategoryNameInput={setNewCategoryNameInput}
            handleAddCategory={handleAddCategory}
            setShowAddForm={setShowAddForm}
          />
        )}
      </div>
    </div>
  );
}