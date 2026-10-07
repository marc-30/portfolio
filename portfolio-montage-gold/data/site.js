/**
 * INFORMATIONS DU SITE — textes principaux et coordonnées.
 * Laissez une valeur vide ("") pour afficher le placeholder.
 */
window.SITE = {
  name: "Portfolio créatif",
  client: "Montage Gold",
  hero: {
    label: "Portfolio créatif",
    titleLine1: "Présentation",
    titleLine2: "Créative",
    subtitle: "Sélection de contenus vidéo",
    description: "Une proposition audiovisuelle pensée pour valoriser l’image, les projets et les engagements de Montage Gold.",
    cta: "Découvrir les vidéos",
  },
  intro: {
    titleLine1: "Une communication",
    titleLine2: "en mouvement.",
    text: "Une sélection de créations vidéo pensées pour valoriser l’image, les projets et les engagements de Montage Gold.",
  },
  /**
   * ÉCRAN DE CHARGEMENT — logo de l'agence, logo du client, puis poignée de main.
   * logo : chemin vers un fichier (SVG ou PNG transparent conseillé),
   *        ex. "assets/logos/sophos.svg". Vide = logo typographique animé.
   */
  preloader: {
    enabled: true,
    oncePerSession: false, // true = ne se rejoue pas si on recharge la page dans le même onglet
    agency: { name: "SOPHOS", tagline: "Côte d’Ivoire", logo: "" },
    client: { name: "Montage Gold", tagline: "", logo: "" },
    caption: "Accord conclu",
  },
  contact: {
    name: "SOPHOS CÔTE D’IVOIRE",
    email: "info@sophosstudio.com",
    phone: "+225 07 16 119 095",
    social: "https://sophoscotedivoire.com",
  },
};
