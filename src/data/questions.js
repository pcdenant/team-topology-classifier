export const BA = [
  { id: "A1", text: "Cette équipe est dédiée à un flux de valeur clair et identifié, destiné à un client ou utilisateur final.", sig: "SA" },
  { id: "A2", text: "D'autres équipes utilisent ce que cette équipe produit (outil, service, API) en libre-service, sans nous solliciter.", sig: "PL" },
  { id: "A3", text: "Cette équipe consacre du temps à aider d'autres équipes à monter en compétence sur un sujet qu'elles ne maîtrisent pas encore.", sig: "EN" },
  { id: "A4", text: "Le domaine de cette équipe exige une expertise profonde que les autres équipes ne pourraient pas développer en quelques semaines.", sig: "CS" },
  { id: "A5", text: "Si cette équipe arrêtait de livrer pendant 2 semaines, un client ou utilisateur externe le remarquerait.", sig: "SA" },
  { id: "A6", text: "D'autres équipes soumettent des demandes à cette équipe pour des changements ou améliorations qu'elles ne peuvent pas faire seules.", sig: "PL_CS" },
  { id: "A7", text: "Quand cette équipe aide une autre équipe, l'engagement a une fin claire — on se retire une fois le besoin comblé.", sig: "EN" },
  { id: "A8", text: "Le travail de cette équipe est piloté par les besoins du business ou des utilisateurs, pas par les demandes d'autres équipes internes.", sig: "SA" },
  { id: "A9", text: "D'autres équipes développent leurs propres solutions au lieu d'utiliser ce que cette équipe offre.", sig: "flag", flag: "contradiction" },
  { id: "A10", text: "Cette équipe pourrait continuer à livrer efficacement pendant une semaine sans aucune interaction avec les autres équipes.", sig: "flag", flag: "contradiction" },
];

export const BB = [
  { id: "B1", text: "Les équipes qui dépendent de nous se servent de ce qu'on produit de façon autonome, sans coordination au quotidien.", sig: "XaaS" },
  { id: "B2", text: "Cette équipe mène des efforts conjoints avec d'autres équipes sur des objectifs communs, pour une durée définie.", sig: "Collab" },
  { id: "B3", text: "Cette équipe aide d'autres équipes à trouver leurs propres solutions, plutôt que de faire le travail à leur place.", sig: "Facil" },
  { id: "B4", text: "Quand une autre équipe a besoin de quelque chose de nous, elle soumet une demande et attend que nous la traitions.", sig: "flag", flag: "anti-pattern" },
  { id: "B5", text: "La façon dont cette équipe travaille avec les autres évolue au fil du temps — par exemple, d'un mode projet conjoint vers un mode libre-service.", sig: "flag", flag: "maturité", hasIDK: true },
];

export const C1O = [
  { v: "SA", l: "\"C'est l'équipe qui livre le produit X\"" },
  { v: "PL", l: "\"C'est l'équipe qui fournit la plateforme / les outils\"" },
  { v: "EN", l: "\"C'est l'équipe qui aide les autres à monter en compétence\"" },
  { v: "CS", l: "\"C'est l'équipe qui gère le composant complexe Y\"" },
  { v: "unknown", l: "\"Je ne sais pas\"" },
];

export const C3O = [
  { v: "SA", l: "Compréhension du domaine business et du client" },
  { v: "PL", l: "Developer experience et outils internes" },
  { v: "EN", l: "Coaching et formation technique" },
  { v: "CS", l: "Expertise pointue dans le domaine technique" },
];

export const IMP = [
  { v: "ok", l: "Ça roule", c: "#059669", bg: "#ecfdf5" },
  { v: "friction", l: "Ça frotte", c: "#d97706", bg: "#fffbeb" },
  { v: "blocked", l: "Ça bloque", c: "#dc2626", bg: "#fef2f2" },
];
