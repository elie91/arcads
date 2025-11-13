# Dynamic Arcads Real Estate

Application fullstack de gestion et reporting de transactions immobilières, développée avec NestJS (backend) et Next.js (frontend).

## Architecture

```
arcads/
├── arcads-api/          # Backend NestJS
├── arcads-web/          # Frontend Next.js
├── docker-compose.yml   # Configuration PostgreSQL
└── Makefile            # Commandes pour gérer le projet
```

## Technologies

### Backend (arcads-api)

- **NestJS** - Framework Node.js
- **Prisma** - ORM pour PostgreSQL
- **PostgreSQL** - Base de données
- **TypeScript** - Langage

### Frontend (arcads-web)

- **Next.js 16** - Framework React
- **React 19** - Bibliothèque UI
- **TanStack Query** - Gestion des requêtes API
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Composants UI
- **TypeScript** - Langage

## Prérequis

- **Node.js** >= 18.x
- **npm** ou **yarn**
- **Docker** et **Docker Compose** v2
- **Make** (optionnel mais recommandé)

## Installation

### Option 1 : Setup complet avec Make (Recommandé)

```bash
# Setup complet : installation + DB + migrations
make setup

# Démarrer l'environnement de développement (API + Web + DB)
make dev
```

### Option 2 : Setup manuel

```bash
# 1. Installer les dépendances
cd arcads-api && npm install
cd ../arcads-web && npm install
cd ..

# 2. Démarrer PostgreSQL
docker compose up -d postgres

# 3. Créer les migrations Prisma
cd arcads-api
npx prisma migrate dev
npx prisma generate

# 4. Démarrer l'API (port 3001)
npm run start:dev

# 5. Dans un autre terminal, démarrer le frontend (port 3000)
cd ../arcads-web
npm run dev
```

## Configuration

### Variables d'environnement

#### Backend (arcads-api/.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/arcads"
PORT=3001
NODE_ENV=development
```

#### Frontend (arcads-web/.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Commandes Make disponibles

### Développement

```bash
make dev          # Démarrer API + Web + DB
make api-dev      # Démarrer uniquement l'API
make web-dev      # Démarrer uniquement le Web
```

### Base de données

```bash
make db-up        # Démarrer PostgreSQL
make db-down      # Arrêter PostgreSQL
make db-migrate   # Créer/appliquer les migrations
make db-generate  # Générer le client Prisma
make db-reset     # Réinitialiser la DB (⚠️ supprime toutes les données)
make db-studio    # Ouvrir Prisma Studio (interface graphique)
```

### Build & Production

```bash
make build        # Build API + Web
make api-build    # Build API uniquement
make web-build    # Build Web uniquement
make start        # Démarrer en mode production
```

### Maintenance

```bash
make install      # Installer les dépendances
make lint         # Linter le code
make format       # Formatter le code
make test         # Lancer les tests API
make stop         # Arrêter tous les services
make clean        # Nettoyer (node_modules, build, docker)
make help         # Afficher toutes les commandes
```

## Troubleshooting

### Port déjà utilisé

```bash
# Libérer le port 3001 (API)
lsof -ti:3001 | xargs kill -9

# Libérer le port 3000 (Web)
lsof -ti:3000 | xargs kill -9
```

### Erreur de connexion DB

```bash
# Vérifier que PostgreSQL tourne
docker ps

# Redémarrer la DB
make db-down && make db-up

# Vérifier les logs
docker logs arcads-postgres
```

### Prisma Client non généré

```bash
cd arcads-api
npx prisma generate
```
