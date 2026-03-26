# Team Topology Classifier

> **Par [Collaboration Solved](https://collaborationsolved.com)** — Pierre-Cyril Denant

Un outil self-service pour classifier vos équipes selon les Team Topologies, identifier les gaps Current → Target, et mapper votre écosystème de directorate.

## Le problème

Les leaders IT connaissent les 4 types de Team Topologies mais n'arrivent pas à classifier leurs propres équipes. Les outils existants sont soit trop lourds (TeamForm), soit trop superficiels (auto-classification Caroli.org), soit des funnels commerciaux (TT Assessment officiel).

## Ce que fait cet outil

- **18 questions comportementales** (pas théoriques) par équipe — impossible à "gamer"
- **Distribution par type** (pas un label binaire) — ex: 55% Stream / 25% Platform / 15% Enabling / 5% CS
- **Indice de Clarté** — le concept central : à quel point l'identité de l'équipe est claire
- **Current vs Target** — chaque question répondue deux fois (aujourd'hui / idéalement)
- **Plan 80/20** automatisé — 3 actions à plus fort levier par transition de type
- **Vue écosystème** — carte de mouvement, alertes de cohérence, dépendances, plan d'action directorate
- **Export Markdown** — prêt à coller dans Confluence/Notion
- **Export/Import JSON** — pour partager la progression avec un collègue

## Déploiement

### Vercel (recommandé)

1. Push sur GitHub
2. Connecter le repo à [Vercel](https://vercel.com)
3. Framework Preset : **Vite**
4. Deploy

### Local

```bash
npm install
npm run dev
```

## Stack

- React 18 + Vite
- Zéro dépendance runtime externe
- Persistance via localStorage
- Pas de backend

## Basé sur

- [Team Topologies](https://teamtopologies.com) par Matthew Skelton & Manuel Pais
- 4 types d'équipe : Stream-aligned, Platform, Enabling, Complicated Subsystem
- 3 modes d'interaction : X-as-a-Service, Collaboration, Facilitation

## Documentation

Voir [PRD complet](./docs/PRD.md) pour le détail du questionnaire, la logique de scoring, les anti-patterns détectables, et les spécifications.

## Licence

MIT
