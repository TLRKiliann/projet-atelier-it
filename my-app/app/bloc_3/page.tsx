"use client";

import { BlocItem } from '@/lib/definitions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useInventoryFile } from '@/hooks/useInventoryFile';
import BtnHome from '../components/btn-home';
import ShowHideCategory from '../components/show-hide-category';
import EditCategory from '../components/edit-category';
import ItemsByCategory from '../components/items-by-category';
import AddCategory from '../components/add-category';
import CategoryForm from '../components/category-form';
import styles from "../styles/bloc.module.scss";

export default function Bloc_3() {

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
      const response = await fetch('/api/inventory?blocId=bloc_3');
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
          blocId: 'bloc_3',
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
            blocId: 'bloc_3',
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
                  onClick={() => router.push(`/bloc_3/${category.id}`)}
                  className={styles.items_bloc_design}
                >

                  <div className={styles.items_bloc}>
                    {isEditing ? (
                      <EditCategory 
                        newCategoryName={newCategoryName}
                        setNewCategoryName={setNewCategoryName}
                        category={category}
                        setEditingCategory={() => setEditingCategory(null)}
                        handleRenameCategory={() => handleRenameCategory(category.id)}
                      />
                    ) : (
                      <ItemsByCategory
                        categoryName={category.nom}
                        category={category}
                      />
                    )}
                  </div>

                  {!isEditing && (
                    <ShowHideCategory 
                      setEditingCategory={() => setEditingCategory({
                        etageId: etage.id,
                        categoryId: category.id,
                        categoryNom: category.nom
                      })}
                      setNewCategoryName={() => setNewCategoryName(category.nom)}
                      handleDeleteCategory={() => handleDeleteCategory(category.id, category.nom)}
                    />
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