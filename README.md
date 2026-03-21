# 🚀 LLM Trading Bot Discovery API

Une API ultra-optimisée pour alimenter des agents de trading LLM avec les données de marchés de prédiction Polymarket. Conçue pour minimiser la consommation de tokens tout en maximisant la pertinence des opportunités.

## 🛠 Stack Technique

- **Monorepo** : [Turborepo](https://turbo.build/) + [pnpm](https://pnpm.io/)
- **Runtime** : Node.js avec TypeScript
- **API** : Express
- **Validation/Types** : [Zod](https://zod.dev/)
- **Qualité** : [Biome](https://biomejs.dev/) (Linting & Formatting ultra-rapide)

---

## 🏗 Installation & Setup

### 1. Prérequis

- [pnpm](https://pnpm.io/installation) installé.
- Node.js v18+.

### 2. Installation des dépendances

```bash
pnpm install
```

### 3. Build du projet

Compile l'ensemble des packages partagés et l'application API.

```bash
pnpm build
```

### 4. Lancer l'API

```bash
pnpm dev
```

L'API sera disponible sur **`http://localhost:3001`**.

---

## 📡 Endpoints "LLM-Ready"

Tous les endpoints renvoient un JSON ultra-compact conçu pour économiser les tokens de vos prompts.

### 1. 🔥 Get Trending Markets

Récupère les 20 opportunités les plus "chaudes" (combinaison de liquidité élevée et volume récent) dans les segments trading (Crypto, Finance, Macro).

**Endpoint** : `GET /trending`

**Usage** :

```bash
curl http://localhost:3001/trending
```

### 2. 📊 List Trading Markets

Explore les marchés par catégorie de trading spécifique.

**Endpoint** : `GET /markets`

**Paramètres (Query)** :

- `tag` : Filtrer par tag spécifique (`crypto`, `finance`, `economy`, `business`, `stocks`, `macro`). Par défaut : tous.
- `limit` : Nombre de résultats (défaut: 50).
- `orderByDate` : Trier par date de fin (`asc` ou `desc`). Remplace le tri par liquidité par défaut.

**Usage** :

```bash
# Uniquement l'économie, trié par les échéances les plus proches
curl "http://localhost:3001/markets?tag=economy&orderByDate=asc&limit=10"
```

---

## 🧠 Format de donnée (Optimisé pour Agent)

Chaque objet marché est structuré ainsi :

```json
{
  "id": "0x...", // Condition ID (Requis pour exécuter le trade sur le CLOB)
  "q": "Question ?", // Contexte court
  "liq": 125000, // Liquidité (Confiance dans le prix)
  "vol": 15000, // Volume (Activité récente)
  "ends": "2025-12-31", // Date d'expiration
  "choices": {
    // Mapping direct Outcome -> Prix & Token
    "Yes": {
      "p": 0.55, // Probabilité (Prix entre 0 et 1)
      "t": "734..." // Token ID (Requis pour l'achat via SDK)
    },
    "No": {
      "p": 0.45,
      "t": "563..."
    }
  }
}
```

---

## 🧼 Qualité du Code

Le projet impose des standards de qualité stricts via Biome.

- **Vérification de la qualité (Lint test)** :
  ```bash
  pnpm test:lint
  ```
- **Formatage automatique** :
  ```bash
  pnpm format
  ```

---

## 📁 Structure du Monorepo

- `apps/api` : L'application Express principale.
- `packages/types` : Schémas Zod et types TypeScript partagés (Contrat de données LLM).
- `packages/config-biome` : Configuration centralisée du linter et formatter.
- `packages/typescript-config` : Config TS partagée.
