// 📁 /app/api/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'database', 'inventory.json');

// GET: Récupérer les données
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const block = searchParams.get('block');
    
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

// PUT: Mettre à jour les données (renommer ou supprimer)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received body:', body);
    
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
      // Pour le renommage, comme votre structure n'a pas de champ 'displayName',
      // nous devons stocker le nom ailleurs ou modifier la clé
      
      // Option 1: Stocker le nom personnalisé dans un objet séparé (recommandé)
      if (!jsonData.customNames) {
        jsonData.customNames = {};
      }
      if (!jsonData.customNames[block]) {
        jsonData.customNames[block] = {};
      }
      if (!jsonData.customNames[block][etage]) {
        jsonData.customNames[block][etage] = {};
      }
      
      jsonData.customNames[block][etage][itemKey] = newName;
      console.log(`Item ${itemKey} renommé en ${newName}`);
    }
    else {
      return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
    }
    
    // Écrire dans le fichier (sans toucher aux métadonnées)
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