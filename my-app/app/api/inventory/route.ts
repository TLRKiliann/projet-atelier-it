// 📁 /app/api/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Correction du chemin - le fichier est dans app/database/
const DB_PATH = path.join(process.cwd(), 'database', 'inventory.json');
// GET: Récupérer les données
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const block = searchParams.get('block');
    
    // Vérifier si le fichier existe
    try {
      await fs.access(DB_PATH);
    } catch {
      // Créer une structure par défaut si le fichier n'existe pas
      const defaultStructure = {
        structure: {
          etages: [1, 2, 3],
          items: ["Ordinateur", "Clavier", "Souris"],
          materiaux: {}
        },
        data: {
          block_1: {}
        },
        metadata: {
          lastUpdated: new Date().toISOString(),
          version: "1.0",
          totalBlocks: 1,
          totalEtages: 3,
          totalItems: 3
        }
      };
      await fs.writeFile(DB_PATH, JSON.stringify(defaultStructure, null, 2));
    }
    
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const jsonData = JSON.parse(data);
    
    if (block && jsonData.data && jsonData.data[block]) {
      return NextResponse.json(jsonData.data[block]);
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
    console.log('Received body:', body); // Debug
    
    const { block, etage, itemKey, action, newName } = body;
    
    // Lire le fichier actuel
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const jsonData = JSON.parse(data);
    
    // Vérifier si le bloc existe
    if (!block || !jsonData.data || !jsonData.data[block]) {
      return NextResponse.json({ error: 'Bloc non trouvé' }, { status: 404 });
    }
    
    const blockData = jsonData.data[block];
    
    // Vérifier si l'étage existe
    if (!blockData[etage]) {
      return NextResponse.json({ error: 'Étage non trouvé' }, { status: 404 });
    }
    
    const etageData = blockData[etage];
    
    // Traiter l'action
    if (action === 'delete') {
      // Supprimer l'item
      if (etageData[itemKey]) {
        delete etageData[itemKey];
        console.log(`Item ${itemKey} supprimé de l'étage ${etage}`);
      } else {
        return NextResponse.json({ error: 'Item non trouvé' }, { status: 404 });
      }
    } 
    else if (action === 'rename') {
      // Renommer l'item
      if (etageData[itemKey]) {
        // Pour le renommage, vous devez stocker le nouveau nom quelque part
        // Soit en modifiant la clé, soit en ajoutant une propriété 'displayName'
        // Je vous propose d'ajouter une propriété displayName
        if (typeof etageData[itemKey] === 'object' && etageData[itemKey] !== null) {
          etageData[itemKey].displayName = newName;
        } else {
          // Si c'est une valeur simple, on la transforme en objet
          const oldValue = etageData[itemKey];
          etageData[itemKey] = {
            value: oldValue,
            displayName: newName
          };
        }
        console.log(`Item ${itemKey} renommé en ${newName}`);
      } else {
        return NextResponse.json({ error: 'Item non trouvé' }, { status: 404 });
      }
    }
    else {
      return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
    }
    
    // Mettre à jour les métadonnées
    jsonData.metadata.lastUpdated = new Date().toISOString();
    
    // Écrire dans le fichier
    await fs.writeFile(DB_PATH, JSON.stringify(jsonData, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: `Action '${action}' effectuée avec succès`,
      updatedData: blockData
    });
    
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ 
      error: 'Erreur de mise à jour', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// DELETE: Supprimer des données (optionnel)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { block, etage, itemKey } = body;
    
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const jsonData = JSON.parse(data);
    
    if (!block || !jsonData.data || !jsonData.data[block]) {
      return NextResponse.json({ error: 'Bloc non trouvé' }, { status: 404 });
    }
    
    if (!jsonData.data[block][etage]) {
      return NextResponse.json({ error: 'Étage non trouvé' }, { status: 404 });
    }
    
    if (jsonData.data[block][etage][itemKey]) {
      delete jsonData.data[block][etage][itemKey];
      jsonData.metadata.lastUpdated = new Date().toISOString();
      await fs.writeFile(DB_PATH, JSON.stringify(jsonData, null, 2));
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Item non trouvé' }, { status: 404 });
    
  } catch (error) {
    return NextResponse.json({ error: 'Erreur de suppression' }, { status: 500 });
  }
}