/**
 * CONTENUS DU PORTFOLIO — ajoutez / supprimez un objet pour modifier une liste.
 *
 * video     : fichier local ("videos/mon-film.mp4"), lien YouTube ou Vimeo, ou "" (placeholder)
 * thumbnail : image 16:9 ("images/mon-film.jpg"). Si vide et que la vidéo est un MP4 local,
 *             la première image de la vidéo est utilisée comme miniature.
 * image     : affiche ("assets/affiches/affiche-01.jpg")
 */
window.SHOWREEL = {
  title: "Showreel",
  category: "Featured project",
  duration: "",
  thumbnail: "",
  alt: "Showreel — aperçu",
  video: "videos/presentation-stand-montage-gold.mp4",
};

/* 1 — Les vidéos qu'on propose */
window.PROJECTS = [
  {
    number: "01",
    category: "Événementiel",
    title: "Teaser",
    description: "Un format court et rythmé pour annoncer l’événement et créer l’attente.",
    duration: "",
    thumbnail: "images/teaser.jpg",
    alt: "Teaser Montage Gold — miniature",
    video: "videos/teaser-montage-gold.mp4",
  },
  {
    number: "02",
    category: "Motion design",
    title: "Vidéo animée",
    description: "Du motion design pour expliquer le projet et renforcer l’identité de marque.",
    duration: "",
    thumbnail: "images/video-animee.jpg",
    alt: "Vidéo animée Montage Gold — miniature",
    video: "videos/video-animee-montage-gold.mp4",
  },
  {
    number: "03",
    category: "Événementiel",
    title: "Présentation stand Montage Gold",
    description: "Une vidéo de présentation pensée pour accompagner le stand et valoriser l’expertise de Montage Gold.",
    duration: "",
    thumbnail: "images/stand.jpg",
    alt: "Présentation du stand Montage Gold — miniature",
    video: "videos/stand-montage-gold-hd.mp4",
  },
  {
    number: "04",
    category: "Réseaux sociaux",
    title: "Réseaux Sociaux",
    description: "Des contenus courts conçus pour les plateformes digitales.",
    duration: "",
    thumbnail: "images/showreel.jpg",
    alt: "Réseaux sociaux — miniature",
    video: "videos/presentation-stand-montage-gold.mp4",
  },
];

/* 2 — Les types d'affiches qu'on propose */
window.POSTERS = [
  { title: "Panneau publicitaire", description: "Affichage urbain grand format.", image: "assets/affiches/affiche-01.jpg" },
  { title: "Affiche imprimée", description: "Format A2 / A3 pour l’affichage sur site.", image: "assets/affiches/affiche-02.jpg" },
  { title: "Écran LED", description: "Diffusion sur écran géant.", image: "assets/affiches/affiche-03.jpg" },
  { title: "Kit presse", description: "Dossier de presse, carnet, badge et goodies.", image: "assets/affiches/affiche-04.jpg" },
  { title: "Visuel corporate", description: "Image de marque pour site web et rapports.", image: "assets/affiches/affiche-05.jpg" },
  { title: "Écran de conférence", description: "Habillage de scène et salle plénière.", image: "assets/affiches/affiche-06.jpg" },
  { title: "Brochure", description: "Dépliant trois volets.", image: "assets/affiches/affiche-07.jpg" },
  { title: "Bannière web", description: "Format paysage pour site et réseaux sociaux.", image: "assets/affiches/affiche-08.jpg" },
  { title: "Flyer", description: "Format A5 à distribuer.", image: "assets/affiches/affiche-09.jpg" },
  { title: "Panneau grand format", description: "Affichage extérieur 4×3.", image: "assets/affiches/affiche-10.jpg" },
  { title: "Stand d’exposition", description: "Habillage complet du stand.", image: "assets/affiches/affiche-11.jpg" },
  { title: "Visuel partenariat", description: "Communication institutionnelle et partenaires.", image: "assets/affiches/affiche-12.jpg" },
  { title: "Post réseaux sociaux", description: "Visuel pour LinkedIn et Facebook.", image: "assets/affiches/affiche-13.jpg" },
  { title: "Kit presse — vertical", description: "Déclinaison portrait du kit presse.", image: "assets/affiches/affiche-14.jpg" },
  { title: "Borne digitale", description: "Totem d’affichage pour halls et accueils.", image: "assets/affiches/affiche-15.jpg" },
];

/* 3 — Les vidéos déjà réalisées pour d'autres entreprises */
window.WORKS = [
  { client: "AXA", title: "Film AXA", thumbnail: "images/realisations/axa.jpg", video: "videos/realisations/film-axa.mp4" },
  { client: "Urbanik", title: "Film institutionnel Urbanik", thumbnail: "images/realisations/urbanik.jpg", video: "videos/realisations/film-urbanik.mp4" },
  { client: "MFFE", title: "Film MFFE", thumbnail: "images/realisations/mffe.jpg", video: "videos/realisations/film-mffe.mp4" },
  { client: "Sophos", title: "Présentation Sophos", thumbnail: "images/realisations/sophos.jpg", video: "videos/realisations/presentation-sophos.mp4" },
];
