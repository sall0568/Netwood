# 🎬 NetWood

**Plateforme de streaming de films et séries nigérians (Nollywood)**

NetWood est une application web moderne permettant de découvrir, rechercher et regarder des contenus Nollywood directement depuis YouTube. Elle offre une expérience de type Netflix avec des fonctionnalités de personnalisation avancées.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-blue?logo=tailwindcss)

---

## ✨ Fonctionnalités

### 🎥 Contenu

- **Catalogue automatisé** via l'API YouTube
- **Catégorisation intelligente** par genre (Romance, Action, Drame, Comédie, Thriller, Horreur)
- **Films tendances** et **recommandations personnalisées**
- **Recherche avancée** par titre, genre, langue

### 👤 Utilisateur

- **Authentification** (inscription, connexion, JWT)
- **Favoris** et **historique de visionnage**
- **Système de notation** (étoiles)
- **Commentaires** sur les films

### 🌍 Accessibilité

- **Multilingue** (Français / Anglais)
- **Mode sombre / clair**
- **Design responsive** (Mobile, Tablette, Desktop)
- **PWA** (Progressive Web App)

### 💰 Monétisation

- Intégration **Google AdSense** prête
- Tracking **Google Analytics 4**

---

## 🛠️ Stack Technique

| Composant           | Technologie                                       |
| ------------------- | ------------------------------------------------- |
| **Frontend**        | React 19, TailwindCSS, React Router, Lucide Icons |
| **Backend**         | Node.js, Express.js                               |
| **Base de données** | MongoDB Atlas                                     |
| **API externe**     | YouTube Data API v3                               |
| **Auth**            | JWT (JSON Web Tokens)                             |
| **Déploiement**     | Vercel (Frontend), Render (Backend)               |

---

## 📁 Structure du Projet

```
Netwood/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── config/          # Configuration (DB, Logger, YouTube)
│   │   ├── controllers/     # Logique métier
│   │   ├── middlewares/     # Auth, Error handling
│   │   ├── models/          # Schémas Mongoose
│   │   ├── routes/          # Routes API
│   │   ├── services/        # Services (contenu, cron)
│   │   └── server.js        # Point d'entrée
│   └── package.json
│
├── frontend/                # Application React
│   ├── public/
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── context/         # Auth, Theme, Language
│   │   ├── pages/           # Pages (Home, Movie, Search...)
│   │   └── services/        # Appels API
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Prérequis

- Node.js >= 16
- npm >= 8
- Compte MongoDB Atlas
- Clé API YouTube

### 1. Cloner le projet

```bash
git clone https://github.com/sall0568/Netwood.git
cd Netwood
```

### 2. Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` :

```env
MONGO_URI=mongodb+srv://...
YOUTUBE_API_KEY=votre_cle_youtube
JWT_SECRET=votre_secret_jwt
JWT_EXPIRE=7d
NODE_ENV=development
PORT=3000
```

Lancer le serveur :

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

L'application sera accessible sur `http://localhost:3001`

---

## 🌐 Déploiement

### Backend (Render)

1. Connecter le repo GitHub
2. Créer un Web Service
3. Variables d'environnement : `MONGO_URI`, `JWT_SECRET`, `YOUTUBE_API_KEY`, `NODE_ENV=production`, `CLIENT_URL`

### Frontend (Vercel)

1. Importer le projet depuis GitHub
2. Répertoire : `frontend`
3. Variable d'environnement : `REACT_APP_API_URL=https://votre-backend.onrender.com/api`

---

## 📚 API Endpoints

| Méthode           | Endpoint                  | Description          |
| ----------------- | ------------------------- | -------------------- |
| `GET`             | `/api/content/trending`   | Films tendances      |
| `GET`             | `/api/content/search`     | Recherche            |
| `GET`             | `/api/content/categories` | Liste des catégories |
| `GET`             | `/api/content/:id`        | Détails d'un film    |
| `POST`            | `/api/auth/register`      | Inscription          |
| `POST`            | `/api/auth/login`         | Connexion            |
| `GET/POST/DELETE` | `/api/favorites/:id`      | Gestion des favoris  |
| `GET/POST/DELETE` | `/api/comments/:id`       | Commentaires         |

Documentation complète : `backend/API_DOCUMENTATION.md`

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 👨‍💻 Auteur

Développé avec ❤️ pour la communauté Nollywood.
