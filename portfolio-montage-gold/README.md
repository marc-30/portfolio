# Portfolio créatif — Montage Gold

Site statique (HTML / CSS / JS), aucune installation requise.

## Ouvrir
- VS Code : installer l’extension **Live Server**, clic droit sur `index.html` → *Open with Live Server*.
- Ou double-cliquer sur `index.html`.

## Structure
```
index.html
data/projects.js    ← SHOWREEL, PROJECTS (vidéos proposées), POSTERS (affiches), WORKS (réalisations)
data/site.js        ← textes et coordonnées
assets/css/styles.css  ← tokens couleurs en haut (:root)
assets/js/main.js
assets/affiches/    ← affiches (affiche-01.jpg … affiche-15.jpg)
videos/             ← fichiers MP4
images/             ← miniatures 16:9 (optionnel)
```

## Ajouter une vidéo
1. Déposer le fichier dans `videos/` (ou utiliser un lien YouTube / Vimeo).
2. Ajouter un objet dans la bonne liste de `data/projects.js` (`PROJECTS`, `POSTERS` ou `WORKS`).
3. Miniature optionnelle : sans `thumbnail`, une image de la vidéo MP4 est utilisée.

## Mise en ligne
Glisser le dossier sur Netlify, Vercel ou GitHub Pages. Compresser les MP4 (H.264, ~1080p) pour un chargement rapide.
