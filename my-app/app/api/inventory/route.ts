// 📁 Chemin: /app/api/inventory/route.ts
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
    
    if (block && jsonData[block]) {
      return NextResponse.json(jsonData[block]);
    }
    
    return NextResponse.json(jsonData);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur de lecture' }, { status: 500 });
  }
}

// PUT: Mettre à jour les données
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { block, id, etage, item, material, model, nombre, itemKey, value } = body;
    
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const jsonData = JSON.parse(data);
    
    if (block && jsonData[block]) {
      const blockData = jsonData[block];
      const itemIndex = blockData.findIndex((b: any) => b.id === id);
      
      if (itemIndex !== -1) {
        if (itemKey) {
          // Modification du nom de l'item
          const etageKey = `etage_${id}`;
          if (blockData[itemIndex][etageKey] && blockData[itemIndex][etageKey][itemKey]) {
            blockData[itemIndex][etageKey][itemKey].name = value;
          }
        } else if (material) {
          // Modification d'un matériel
          const etageKey = `etage_${etage}`;
          if (blockData[itemIndex][etageKey] && blockData[itemIndex][etageKey][item]) {
            blockData[itemIndex][etageKey][item][material] = {
              model: model,
              nombre: nombre
            };
          }
        }
      }
      
      await fs.writeFile(DB_PATH, JSON.stringify(jsonData, null, 2));
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Bloc non trouvé' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur de mise à jour' }, { status: 500 });
  }
}