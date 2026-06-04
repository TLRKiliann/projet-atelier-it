"use client";

import type { CategorieItem, ModeleItem } from '@/lib/definitions';
import { useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { useInventoryFile } from '@/hooks/useInventoryFile';
import MainTitle from '@/app/components/main-title';
import BtnHome from '@/app/components/btn-home';
import ArrowLeft from '@/app/components/arrow-left';
import EditModel from '@/app/components/edit-model';
import EditQuantity from '@/app/components/edit-quantity';
import BtnEditTrashId from '@/app/components/btn-edit-trash-id';
import AddCategory from '@/app/components/add-category';
import ModelForm from '@/app/components/model-form';
import styles from "@/app/styles/bloc.module.scss";

export default function CategoriePage_4() {

  const params = useParams();
  const categorieId = params.id as string;
  
  const [editingModele, setEditingModele] = useState<string | null>(null);
  const [newModeleName, setNewModeleName] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newModeleNameInput, setNewModeleNameInput] = useState<string>("");
  const [newModeleQuantity, setNewModeleQuantity] = useState<number>(0);

  const { 
    data,
    loadingData,
    error,
    addModele,
    deleteModele,
    updateModele,
    renameModele,
    setCurrentBlock
  } = useInventoryFile();

  useEffect(() => {
    setCurrentBlock(4);
  }, [setCurrentBlock]);

  const categorie: CategorieItem | null = data?.blocs.find(b => b.id === 'bloc_4')
    ?.etages.flatMap(e => e.categories).find(c => c.id === categorieId) || null;

  const loading = loadingData;

  // Supprimer un modèle
  const handleDeleteModele = async (modeleId: string, modeleNom: string): Promise<void> => {
    if (confirm(`Supprimer le modèle "${modeleNom}" ?`)) {
      const success = await deleteModele(categorieId, modeleId) as boolean;
      if (!success) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  // Ajouter un nouveau modèle
  const handleAddModele = async (): Promise<void> => {
    if (!newModeleNameInput.trim()) return;
    
    const success = await addModele(categorieId, newModeleNameInput, newModeleQuantity) as boolean;
    if (success) {
      setShowAddForm(false);
      setNewModeleNameInput("");
      setNewModeleQuantity(0);
    }
  };

  // Renomer le modèle
  const handleRenameModele = async (modeleId: string): Promise<void> => {
    if (!newModeleName.trim()) return;
    
    const result = await renameModele(categorieId, modeleId, newModeleName) as boolean;
    if (result) {
      setEditingModele(null);
      setNewModeleName("");
    }
  }

  // Changer la quantity du modèle
  const handleUpdateQuantity = async (modeleId: string, nouvelleQuantite: number): Promise<void> => {
    if (nouvelleQuantite < 0) {
      alert("La quantité ne peut pas être négative");
      return;
    }
    const success = await updateModele(categorieId, modeleId, nouvelleQuantite) as boolean;
    if (!success) {
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) {
    return (
      <MainTitle phrase={"Chargement..."}/>
    );
  }

  if (error) {
    return (
      <MainTitle phrase={"Aucune donnée disponible pour cette catégorie"}/>
    );
  }

  if (!categorie) {
    return (
      <MainTitle phrase={"Catégorie non trouvée"}/>
    );
  }

  return (
    <div className={styles.page_bloc}>
      <div className={styles.titleAndBtnId}>
        <ArrowLeft blocId={"/bloc_4"} />
        
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

                    <EditQuantity 
                      modelId={modele.id}
                      modelName={modele.nom}
                      modelQuantite={modele.quantite}
                      handleUpdateQuantity={handleUpdateQuantity}                    
                    />

                    <BtnEditTrashId 
                      modelId={modele.id}
                      modelName={modele.nom}
                      setEditingModele={setEditingModele}
                      setNewModeleName={setNewModeleName}
                      handleDeleteModele={handleDeleteModele}
                    />

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