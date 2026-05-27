# Projet Atelier IT

Cette application fonctionne en local grâce à la base de données au format JSON. Elle a pour but de répertorier les différents matériaux qui se trouvent sur les 3 étagères de chaque bloque de l'atelier informatique.

Il y a 9 bloques sur la page d'accueil. Lorsqu'on click sur l'un des bloques, on est amené sur la page des 3 étages qui montrent les catégories. En cliquant sur l'une de ces catégories, on arrive sur les items qu'elle contient.

Les actions de l'application:

- ajouter/supprimer des catégories par étage.
- ajouter/supprimer des items par catégorie.
- changer le nom de la catégorie et/ou des items.
- changer la quantité de chaque item.
- downloader le fichier de la base de données, aux formats xls, csv ou json.

## Installation

`git clone https://github.com/TLRKiliann/projet-atelier-it.git`

`cd my-app`

`pnpm install`

## Lancer l'application

```
# En mode dev
pnpm dev

# En mode prod
pnpm build
```

## Features

- nextjs 16.2.6
- TypeScript
- Sass
- lading des data de la database (json) avant display
- server actions
- API GET & PUT

Enjoy ! :koala: