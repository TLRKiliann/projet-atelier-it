# Goals:

- TS API routes
- bloc_2 => bloc_9 page + ID
- styles SASS (title) + fonts + variables

---

## Tests

eslint

`pnpm lint`

prod

`pnpm build`

---

## API actions

```
Action                  Description
--------------------------------------------------------
renameCategory          Renommer une catégorie
deleteCategory          Supprimer une catégorie
updateQuantity          Modifier la quantité d'un modèle
addCategory             Ajouter une nouvelle catégorie
renameModele            Renommer un modèle
deleteModele            Supprimer un modèle
addModele               Ajouter un nouveau modèle
```

## Fonctionnement de l'app

```
Composant React (client)
       ↓
   useInventoryFile (hook)
       ↓
   action/inventory.ts (Server Action - s'exécute sur le serveur)
       ↓
   fileDB.ts (lit/écrit dans le fichier JSON)
       ↓
   inventory.json (fichier de données)
       ↓
   revalidatePath() (rafraîchit l'UI)
       ↓
   Le composant affiche les nouvelles données
```