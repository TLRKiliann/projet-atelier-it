import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'database', 'inventory.json');

// GET: Récupérer les données d'un bloc spécifique
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blocId = searchParams.get('blocId');
    
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const jsonData = JSON.parse(data);
    
    if (blocId) {
      const bloc = jsonData.blocs.find((b: any) => b.id === blocId);
      if (bloc) {
        return NextResponse.json(bloc);
      }
      return NextResponse.json({ error: 'Bloc non trouvé' }, { status: 404 });
    }
    
    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Erreur de lecture' }, { status: 500 });
  }
}

// PUT: Mettre à jour les données
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received body:', body);
    
    const { blocId, etageId, categoryId, action, newName, modeleId, nouvelleQuantite } = body;
    
    // Lire le fichier actuel
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const jsonData = JSON.parse(data);
    
    // Trouver le bloc
    const bloc = jsonData.blocs.find((b: any) => b.id === blocId);
    if (!bloc) {
      return NextResponse.json({ error: 'Bloc non trouvé' }, { status: 404 });
    }
    
    // Action: Renommer une catégorie
    if (action === 'renameCategory') {
      let categoryTrouvee = false;
      
      for (const etage of bloc.etages) {
        const category = etage.categories.find((c: any) => c.id === categoryId);
        if (category) {
          category.nom = newName;
          categoryTrouvee = true;
          console.log(`Catégorie renommée en "${newName}"`);
          break;
        }
      }
      
      if (!categoryTrouvee) {
        return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 });
      }
    }
    // Action: Supprimer une catégorie
    else if (action === 'deleteCategory') {
      for (const etage of bloc.etages) {
        const index = etage.categories.findIndex((c: any) => c.id === categoryId);
        if (index !== -1) {
          etage.categories.splice(index, 1);
          console.log(`Catégorie supprimée`);
          break;
        }
      }
    }
    // Action: Modifier la quantité d'un modèle
    else if (action === 'updateQuantity') {
      let modeleTrouve = false;
      
      for (const etage of bloc.etages) {
        const category = etage.categories.find((c: any) => c.id === categoryId);
        if (category) {
          const modele = category.modeles.find((m: any) => m.id === modeleId);
          if (modele) {
            modele.quantite = nouvelleQuantite;
            modeleTrouve = true;
            console.log(`Quantité du modèle "${modele.nom}" modifiée à ${nouvelleQuantite}`);
            break;
          }
        }
      }
      
      if (!modeleTrouve) {
        return NextResponse.json({ error: 'Modèle non trouvé' }, { status: 404 });
      }
    }
    // Action: Ajouter une nouvelle catégorie
    else if (action === 'addCategory') {
      const etage = bloc.etages.find((e: any) => e.id === etageId);
      if (etage) {
        const nouvelleCategorie = {
          id: `${blocId}_${etageId}_cat_${Date.now()}`,
          nom: newName,
          modeles: [
            { id: `mod_${Date.now()}_1`, nom: "Nouveau modèle 1", quantite: 0 },
            { id: `mod_${Date.now()}_2`, nom: "Nouveau modèle 2", quantite: 0 },
            { id: `mod_${Date.now()}_3`, nom: "Nouveau modèle 3", quantite: 0 }
          ]
        };
        etage.categories.push(nouvelleCategorie);
        console.log(`Nouvelle catégorie "${newName}" ajoutée`);
      } else {
        return NextResponse.json({ error: 'Étage non trouvé' }, { status: 404 });
      }
    }
    // Action: Renommer un modèle
    else if (action === 'renameModele') {
      let modeleTrouve = false;
      
      for (const etage of bloc.etages) {
        const category = etage.categories.find((c: any) => c.id === categoryId);
        if (category) {
          const modele = category.modeles.find((m: any) => m.id === modeleId);
          if (modele) {
            modele.nom = newName;
            modeleTrouve = true;
            console.log(`Modèle renommé en "${newName}"`);
            break;
          }
        }
      }
      
      if (!modeleTrouve) {
        return NextResponse.json({ error: 'Modèle non trouvé' }, { status: 404 });
      }
    }
    // Action: Supprimer un modèle
    else if (action === 'deleteModele') {
      for (const etage of bloc.etages) {
        const category = etage.categories.find((c: any) => c.id === categoryId);
        if (category) {
          const index = category.modeles.findIndex((m: any) => m.id === modeleId);
          if (index !== -1) {
            category.modeles.splice(index, 1);
            console.log(`Modèle supprimé`);
            break;
          }
        }
      }
    }
    // Action: Ajouter un modèle
    else if (action === 'addModele') {
      for (const etage of bloc.etages) {
        const category = etage.categories.find((c: any) => c.id === categoryId);
        if (category) {
          const nouveauModele = {
            id: `mod_${Date.now()}`,
            nom: newName,
            quantite: nouvelleQuantite || 0
          };
          category.modeles.push(nouveauModele);
          console.log(`Nouveau modèle "${newName}" ajouté`);
          break;
        }
      }
    }
    else {
      return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
    }
    
    // Écrire dans le fichier
    await fs.writeFile(DB_PATH, JSON.stringify(jsonData, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: `Action '${action}' effectuée avec succès`
    });
    
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ 
      error: 'Erreur de mise à jour', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}