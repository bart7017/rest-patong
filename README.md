# 🍽️ Restaurant Patong - Système Menu QR Complet

## Vue d'ensemble
Système complet de menu QR avec back-office pour restaurant à Patong, optimisé pour clientèle touristique internationale. **Architecture moderne Next.js 15** avec Server Components et optimisations performance.

## 🎯 **Spécificités Fonctionnelles**

### 📱 **Menu Client (Consultation uniquement)**
- **QR Code** → Accès direct au menu
- **5 langues** : 🇫🇷 FR / 🇬🇧 EN / 🇹🇭 TH / 🇷🇺 RU / 🇩🇪 DE
- **Interface simplifiée** : Pas de commande en ligne
- **Bouton "Appeler serveur"** proéminent
- **PWA** avec mode hors-ligne
- **Filtres avancés** : végétarien, allergènes, nouveautés, promos
- **Photos HD** optimisées avec Next.js Image

### 🎛️ **Back-office Admin (FR/EN uniquement)**
- **Dashboard analytics** temps réel
- **Gestion CRUD** complète (Catégories, Plats, Commandes)
- **Interface multilingue** pour saisie des contenus (5 langues)
- **Upload d'images** via Cloudinary
- **Génération QR codes** par table
- **Rapports de vente** et analytics

## 🚀 **Architecture Technique**

### **Stack Principal**
- **Backend** : Node.js + Express + MongoDB + TypeScript
- **Frontend Client** : Next.js 15 + Server Components + PWA
- **Frontend Admin** : Next.js 15 + Dashboard complet
- **Images** : Cloudinary avec optimisation automatique
- **Temps réel** : Socket.IO pour commandes
- **Sécurité** : JWT + Rate limiting + Validation

### **Fonctionnalités Next.js 15**
- ⚡ **App Router** avec Server Components
- 🖼️ **Image optimization** native
- 🌍 **Internationalisation** next-intl
- 📱 **PWA** pour mode hors-ligne
- 🎯 **TypeScript** complet
- 🔄 **React Query** pour cache optimisé

```
rest-patong/
├── backend/                 # API Node.js + Express + MongoDB
│   ├── src/
│   │   ├── controllers/     # Logique métier
│   │   ├── models/         # Modèles Mongoose (5 langues)
│   │   ├── routes/         # Routes Express
│   │   ├── middleware/     # Auth, validation, sécurité
│   │   └── config/         # Configuration DB, Cloudinary
│   └── uploads/            # Stockage temporaire
├── frontend/
│   ├── client/             # Menu client Next.js 15 (5 langues)
│   └── admin/              # Back-office Next.js 15 (FR/EN)
├── shared/                 # Types TypeScript partagés
└── docs/                   # Documentation
```

## 📊 **APIs Disponibles**

### **Backend Routes**
- `POST /api/auth/login` - Connexion admin
- `GET /api/categories` - Liste catégories (public)
- `GET /api/menu` - Liste plats avec filtres (public)
- `POST /api/orders` - Créer commande (public)
- `GET /api/qr/generate` - Générer QR codes (admin)
- `GET /api/analytics/overview` - Statistiques (admin)

### **Fonctionnalités Temps Réel**
- Nouvelles commandes → Notification admin
- Changement statut → Mise à jour interface
- Analytics live → Dashboard temps réel

## 🌍 **Support Multilingue**

**Menu Client (5 langues) :**
- Sélecteur langue avec drapeaux
- URLs localisées (`/fr/menu`, `/en/menu`, etc.)
- Détection automatique langue navigateur

**Admin Interface (FR/EN) :**
- Saisie contenus en 5 langues simultanément
- Interface admin simplifiée (2 langues)

## 🔧 **Installation & Démarrage**

### **Prérequis**
- Node.js 18+
- MongoDB 6+
- Compte Cloudinary

### **Configuration**
```bash
# 1. Cloner le projet
git clone <repo>
cd rest-patong

# 2. Backend
cd backend
cp .env.example .env
# Configurer MongoDB + Cloudinary + JWT
npm install
npm run dev

# 3. Frontend Client
cd ../frontend/client
npm install
npm run dev  # Port 3000

# 4. Frontend Admin  
cd ../frontend/admin
npm install
npm run dev  # Port 3001
```

### **Variables d'environnement**
```bash
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/restaurant-patong
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📱 **URLs d'accès**

- **Menu Client** : http://localhost:3000 (ou scan QR)
- **Admin** : http://localhost:3001
- **API** : http://localhost:5000

## 🎨 **Fonctionnalités Clés**

### **Pour les Clients**
✅ Scan QR → Menu instantané  
✅ Interface mobile optimisée  
✅ 5 langues avec drapeaux  
✅ Filtres intelligents  
✅ Photos HD des plats  
✅ Mode hors-ligne (PWA)  
✅ Bouton "Appeler serveur"  

### **Pour le Restaurant**
✅ Dashboard analytics temps réel  
✅ Gestion menu multilingue  
✅ Upload photos automatique  
✅ Génération QR par table  
✅ Suivi commandes live  
✅ Rapports de vente  
✅ Interface admin moderne  

## 🏆 **Avantages vs Solutions Existantes**

| **Fonctionnalité** | **Notre Solution** | **Menulux/Autres** |
|---------------------|-------------------|---------------------|
| Langues supportées | 5 langues complètes | Limité |
| Personnalisation | 100% customisable | SaaS limité |
| Performance | Next.js 15 optimisé | Variable |
| Mode hors-ligne | PWA native | Rare |
| Coûts | Open source | Abonnement mensuel |
| Analytics | Intégrés avancés | Basiques |

## 🚀 **Prêt pour Production**

Le système est **entièrement fonctionnel** avec :
- Backend API complet et sécurisé
- Frontend optimisé Next.js 15
- Base de données structurée
- Gestion d'images professionnelle
- Interface admin complète

**Prochaines étapes :** Déploiement et ajout données réelles !

---

*🤖 Généré avec Next.js 15 + TypeScript + MongoDB*