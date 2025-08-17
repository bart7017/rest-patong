# Structure du Projet Restaurant Patong QR Menu

```
restaurant-patong/
│
├── 📱 apps/
│   ├── client/                    # Menu QR pour clients (Next.js)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── [locale]/      # Routes multilingues (fr, en, th)
│   │   │   │   │   ├── menu/
│   │   │   │   │   ├── cart/
│   │   │   │   │   └── order/
│   │   │   │   └── api/           # API routes Next.js
│   │   │   ├── components/
│   │   │   │   ├── menu/
│   │   │   │   ├── cart/
│   │   │   │   ├── ui/
│   │   │   │   └── qr/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── types/
│   │   ├── public/
│   │   │   ├── locales/           # Fichiers de traduction
│   │   │   └── images/
│   │   └── package.json
│   │
│   └── admin/                     # Back-office admin (Next.js)
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/        # Pages de connexion
│       │   │   ├── (dashboard)/   # Tableau de bord
│       │   │   │   ├── menu/
│       │   │   │   ├── orders/
│       │   │   │   ├── analytics/
│       │   │   │   └── settings/
│       │   │   └── api/           # API routes admin
│       │   ├── components/
│       │   │   ├── dashboard/
│       │   │   ├── forms/
│       │   │   ├── tables/
│       │   │   └── charts/
│       │   └── lib/
│       └── package.json
│
├── 🔧 backend/                    # API Backend (Express + TypeScript)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── menu.controller.ts
│   │   │   ├── orders.controller.ts
│   │   │   └── analytics.controller.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Category.ts
│   │   │   ├── Dish.ts
│   │   │   └── Order.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── menu.routes.ts
│   │   │   └── orders.routes.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   └── upload.middleware.ts
│   │   ├── services/
│   │   │   ├── cloudinary.service.ts
│   │   │   ├── redis.service.ts
│   │   │   └── qr.service.ts
│   │   ├── utils/
│   │   ├── config/
│   │   └── server.ts
│   ├── uploads/
│   └── package.json
│
├── 📚 packages/                   # Packages partagés
│   ├── shared-types/              # Types TypeScript partagés
│   │   ├── src/
│   │   │   ├── api.types.ts
│   │   │   ├── menu.types.ts
│   │   │   └── order.types.ts
│   │   └── package.json
│   │
│   └── ui-components/             # Composants UI réutilisables
│       ├── src/
│       │   ├── Button/
│       │   ├── Modal/
│       │   ├── Form/
│       │   └── index.ts
│       └── package.json
│
├── 🗃️ database/
│   ├── seeders/                   # Données d'exemple
│   │   ├── categories.json
│   │   ├── dishes.json
│   │   └── seed.ts
│   └── migrations/                # Scripts de migration
│
├── 🐳 docker/
│   ├── Dockerfile.client
│   ├── Dockerfile.admin
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
├── 📋 docs/
│   ├── api.md                     # Documentation API
│   ├── deployment.md              # Guide de déploiement
│   └── user-guide.md              # Guide utilisateur
│
├── 🔧 scripts/
│   ├── build.sh
│   ├── deploy.sh
│   └── seed-db.sh
│
├── package.json                   # Root workspace
├── pnpm-workspace.yaml
├── .env.example
├── .gitignore
└── README.md
```

## Technologies par Module

### Frontend Client (Menu QR)
- **Next.js 14** (App Router, RSC)
- **TypeScript** 
- **Tailwind CSS** + **Framer Motion**
- **React Hook Form** + **Zod**
- **next-intl** (internationalisation)
- **PWA** (offline capability)

### Frontend Admin (Back-office)
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Chart.js** / **Recharts** (analytics)
- **React Table** (gestion données)

### Backend API
- **Node.js** + **Express**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT** + **bcrypt**
- **Multer** + **Cloudinary**
- **Redis** (cache)
- **Joi** (validation)
- **helmet** + **cors** (sécurité)

### DevOps
- **Docker** + **Docker Compose**
- **GitHub Actions** (CI/CD)
- **Vercel** (frontend) + **Railway** (backend)
- **MongoDB Atlas** (database cloud)