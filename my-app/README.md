This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

# Goals:

- Page printer à faire !
- Bloc => corbeille en rouge
- ID => revoir le style
- API !!!

J'ai un problème dans mon projet nextjs 16.2.6 avec mes requêtes pour écrire dans mon fichier app/database/inventory.json

    avec le boutton Save et le boutton Delete qui se trouve dans le fichier : "app/bloc_1/page.tsx"
    voici le script : ...

    ça me retourne en console pour le boutton "Save" et pour le boutton "Delete" :
    PUT /api/inventory 404 in 171ms (next.js: 140ms, application-code: 31ms)
    PUT /api/inventory 404 in 117ms (next.js: 93ms, application-code: 24ms)

    script du fichier qui se trouve dans : "app/api/inventory/route.ts"
    voici le contenu du script : ...


    A voir avec ANNULER :
    avec annuler ???
    et bloc_1 + sass ??? 




- Page d'accueil couleurs
- styles SASS
- fonts + variables