# 🏝️ Restaurant Patong - QR Menu System

Un système de menu QR complet pour le Restaurant Patong à Phuket, Thaïlande.

## 🌟 Fonctionnalités

- **Menu QR multilingue** (Français, Anglais, Thaï, Russe, Allemand)
- **Interface mobile-first** optimisée pour smartphones
- **Dashboard administrateur** pour gestion du menu
- **Analytics en temps réel** des consultations
- **Design moderne** et responsive

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- pnpm
- MongoDB

### Installation

```bash
# Cloner le projet
git clone <repo-url>
cd rest-patong

# Installer les dépendances
pnpm install

# Configurer la base de données
# Démarrer MongoDB localement ou utiliser Docker
docker run --name mongodb -d -p 27017:27017 mongo:latest

# Lancer tous les services
pnpm dev
```

## 📱 Applications

### Client Menu (Port 3000)
Interface publique du menu QR pour les clients
- **URL**: http://localhost:3000
- **Langues**: /fr, /en, /th, /ru, /de

### Admin Dashboard (Port 3001)  
Interface d'administration pour la gestion
- **URL**: http://localhost:3001
- **Analytics**: http://localhost:3001/analytics

### Backend API (Port 3001)
API REST pour les données et analytics
- **Health**: http://localhost:3001/health
- **Analytics**: http://localhost:3001/api/analytics

## 🛠️ Structure du projet

```
rest-patong/
├── apps/
│   ├── client/          # Menu QR client (Next.js)
│   └── admin/           # Dashboard admin (Next.js)
├── backend/             # API serveur (Express + MongoDB)
├── architecture-*.md   # Documentation architecture
└── package.json        # Configuration workspace
```

## 🌍 Support multilingue

Le système supporte 5 langues :
- 🇫🇷 Français (fr)
- 🇬🇧 English (en)  
- 🇹🇭 ไทย (th)
- 🇷🇺 Русский (ru)
- 🇩🇪 Deutsch (de)

## 📊 Analytics

Le système track automatiquement :
- Consultations par plat
- Langues préférées des clients
- Heures de pointe
- Termes de recherche populaires
- Engagement utilisateur

## 🔧 Configuration

### Variables d'environnement

Copier `/backend/.env.example` vers `/backend/.env` et configurer :

```env
MONGODB_URI=mongodb://localhost:27017/restaurant-patong
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

## 📝 Scripts disponibles

```bash
# Développement (tous les services)
pnpm dev

# Services individuels
pnpm dev:client    # Menu client uniquement
pnpm dev:admin     # Dashboard admin uniquement  
pnpm dev:backend   # API backend uniquement

# Build production
pnpm build

# Linting
pnpm lint
```

## 🎯 Utilisation

1. **Scan QR Code** → Ouverture automatique du menu
2. **Sélection langue** → Interface adaptée
3. **Navigation menu** → Recherche, filtres, favoris
4. **Consultation plats** → Photos, prix, descriptions
5. **Appel serveuse** → Pour commander

## 🏗️ Architecture

Système modulaire avec :
- **Frontend** : Next.js 14 + Tailwind CSS
- **Backend** : Express.js + TypeScript  
- **Database** : MongoDB + Mongoose
- **Analytics** : Tracking temps réel
- **Deployment** : Prêt pour Vercel/Railway

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements  
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 License

Projet privé - Restaurant Patong © 2024