# 🚀 LLM Trading Bot Discovery API & Dashboard

Une solution complète pour la découverte et l'analyse de marchés Polymarket, optimisée pour les agents de trading LLM.

## 🌟 Fonctionnalités

- **API Unifiée** : Un seul endpoint pour la découverte, le tri (liquidité, volume, échéance) et le filtrage.
- **Payload LLM-Optimized** : Données ultra-compactes pour réduire la consommation de tokens.
- **Trading Tags** : Focus automatique sur les segments porteurs (Crypto, Finance, Macro).
- **Dashboard Premium** : Interface visuelle en Dark Mode avec Shadcn UI pour monitorer les opportunités.

---

## 🛠 Installation Rapide (Plug & Play)

### 1. Prérequis

- [pnpm](https://pnpm.io/installation) installé (`npm install -g pnpm`).
- Node.js v18 ou plus.

### 2. Démarrage en une commande

À la racine du projet, lancez :

```bash
pnpm install && pnpm dev
```

Cette commande installe les dépendances et lance simultanément :

- **Frontend** : `http://localhost:3000`
- **API** : `http://localhost:3001`

---

## 📡 Endpoints pour votre Agent

### Discovery & Trading Data

**Endpoint** : `GET http://localhost:3001/markets`

**Paramètres Query :**

- `tagIds` : Liste d'IDs de catégories (ex: `21` pour Crypto).
- `sortBy` : `liq` (défaut), `vol` (volume), `date` (échéance), `trending` (hot).
- `order` : `asc` | `desc`.
- `limit` : Nombre de marchés à retourner (défaut: 50).

**Exemple curl :**

```bash
# Récupérer les marchés crypto les plus liquides
curl "http://localhost:3001/markets?tagIds=21&sortBy=liq"
```

---

## 💻 Structure du Projet

```text
├── apps
│   ├── api          # API Express (Discovery Service)
│   └── web          # Dashboard Next.js (Trading Desk)
├── packages
│   ├── types        # Schémas Zod partagés (Le contrat de données)
│   └── config-biome # Linter & Formatter ultra-rapide
└── turbo.json       # Orchestration du monorepo
```

---

## 🧼 Commandes de Maintenance

- **Vérifier la qualité du code** : `pnpm test:lint`
- **Reformatter tout le projet** : `pnpm format`
- **Rebuilder le monorepo** : `pnpm build`

---

## 💡 Pourquoi utiliser cette API ?

Les APIs classiques de Polymarket renvoient des milliers de lignes de JSON inutiles (URLs d'images, métadonnées sociales). Cette API filtre tout pour ne garder que **le Condition ID, le Question text, la Liquidité et les Token IDs**.

Votre LLM reçoit 10x plus de marchés dans le même contexte qu'avec l'API standard.
