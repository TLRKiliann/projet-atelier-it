# Projet Atelier IT

Cette application fonctionne en local grâce à la base de données au format JSON. Elle a pour but de répertorier les différents matériaux qui se trouvent sur les 3 étagères de chaque bloque de l'atelier informatique.

Il y a 9 bloques sur la page d'accueil. Lorsqu'on click sur l'un des bloques, on est amené sur la page des 3 étages qui montrent les catégories. En cliquant sur l'une de ces catégories, on arrive sur les items qu'elle contient.

## Les actions de l'application:

- ajouter/supprimer des catégories par étage.
- ajouter/supprimer des items par catégorie.
- changer le nom de la catégorie et/ou des items.
- changer la quantité de chaque item.
- mode clair et sombre.
- downloader le fichier de la base de données, aux formats xls, csv ou json.

## Installation

1) Installer nodejs et pnpm sur le site officiel de NodeJs et définir les options:

https://nodejs.org/en/download

Une fois avoir choisi les options adaptées, ça devrait donner ce qui suit:

```
# Download and install Chocolatey:
$ powershell -c "irm https://community.chocolatey.org/install.ps1|iex"

# Download and install Node.js:
$ choco install nodejs --version="24.16.0"

# Verify the Node.js version:
$ node -v # Should print "v24.16.0".

# Download and install pnpm:
$ corepack enable pnpm

# Verify pnpm version:
$ pnpm -v
```

2) Installer git

```
# Se rendre sur la page de la documentation officielle:
https://git-scm.com/install/windows

# Choisir le download adapté à l'architecture, exemple:
Git for Windows/x64 Setup
```

3) Télécharger l'application sur GitHub depuis le terminal:

```
# Créer un nom de dossier "exemple_mon_dossier"
$ mkdir exemple_mon_dossier

# Se rendre dans mon dossier:
$ cd exemple_mon_dossier

# Initialiser git pour le projet
$ git init

# Téllécharger le repository (projet)
$ git clone https://github.com/TLRKiliann/projet-atelier-it.git

# Une fois télécharger se rendre dans l'app:
$ cd my-app

# Installer les dépendances:
$ pnpm install

# Lancer l'application

# En mode dev:
$ pnpm dev

# En mode prod:
$ pnpm build

# Stopper l'app
Dans le terminal dans lequel l'app a été lancée => Ctrl+c
```

4) Pour désinstaller le projet:

Il faut que l'app soit arrêtée !

Se rendre dans le répertoire qui contient `exemple_mon_dossier`

Je ne suis pas sûr que sur Windows ça soit cette commande. Sinon click droit sur "exemple_mon_dossier" et supprimer.

`$ rm -rf example_mon_dossier`

## Features

- nextjs 16.2.6
- TypeScript
- Sass
- react-icons
- loading des data de la database (json) avant display
- server actions
- API GET & PUT

Enjoy ! :koala: