# 📅 BookEasy - Système de Réservation en Ligne

> Une application moderne de réservation pour les professionnels indépendants.

![BookEasy](https://img.shields.io/badge/BookEasy-v1.0.0-0ea5e9?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square)

## 🎯 Présentation

BookEasy est une solution complète de réservation en ligne permettant :
- **Aux clients** : de réserver des créneaux en quelques clics, 24h/24
- **Aux professionnels** : de gérer leurs réservations, services et disponibilités

### ✨ Démo Story (2 minutes)

> *"Imaginez : vous êtes coach, thérapeute ou gérez un salon. Vos clients peuvent maintenant réserver directement depuis votre site, à n'importe quelle heure. Plus d'appels manqués, plus d'agenda papier.*
>
> *Le client choisit un service, une date, un créneau disponible, et confirme. C'est fait en 30 secondes.*
>
> *De votre côté, vous avez un tableau de bord complet : réservations du jour, statistiques, gestion des services et des horaires. Vous pouvez confirmer, annuler, ajouter des notes... et même exporter vos données en CSV.*
>
> *BookEasy, c'est simple, moderne, et ça marche."*

---

## 🚀 Lancement Rapide (5 minutes)

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# 1. Cloner et installer
git clone <repo-url>
cd bookeasy
npm install

# 2. Configuration
cp .env.example .env
# Éditer .env si nécessaire (optionnel pour dev)

# 3. Base de données
npm run db:migrate
npm run db:seed

# 4. Lancer l'application
npm run dev
```

### Accès

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:3000 |
| 🔌 API | http://localhost:3001 |
| 📚 Swagger | http://localhost:3001/docs |

### Compte Admin Démo
- **Email** : `admin@bookeasy.com`
- **Mot de passe** : `admin123`

---

## 📁 Structure du Projet

```
bookeasy/
├── apps/
│   ├── web/                    # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/           # Pages (App Router)
│   │   │   ├── components/    # Composants React
│   │   │   ├── lib/           # Utilitaires & stores
│   │   │   └── tests/         # Tests Vitest
│   │   └── ...
│   │
│   └── api/                    # Backend Express
│       ├── src/
│       │   ├── controllers/   # Contrôleurs
│       │   ├── routes/        # Routes API
│       │   ├── services/      # Logique métier
│       │   ├── middleware/    # Auth, validation, erreurs
│       │   └── tests/         # Tests Jest
│       └── prisma/            # Schéma & migrations
│
└── packages/
    └── shared/                # Types & validateurs partagés
```

---

## 🛠 Stack Technique

### Frontend
- **Next.js 14** (App Router, TypeScript)
- **TailwindCSS** (UI moderne, responsive)
- **Zustand** (State management)
- **React Hot Toast** (Notifications)
- **Lucide React** (Icônes)

### Backend
- **Express.js** (TypeScript)
- **Prisma** (ORM) + **SQLite**
- **JWT** (Authentification)
- **Zod** (Validation)
- **Swagger** (Documentation API)

### Qualité
- **ESLint** + **Prettier**
- **Jest** (Tests backend)
- **Vitest** (Tests frontend)
- **Monorepo** avec workspaces npm

---

## 📋 Fonctionnalités

### 👤 Côté Client (Public)

#### Landing Page
- Hero avec CTA clair
- Sections : Fonctionnalités, Comment ça marche, Tarifs, FAQ
- Design moderne et responsive

#### Parcours de Réservation
1. **Choix du service** - Liste des prestations avec prix et durée
2. **Sélection date/heure** - Calendrier avec créneaux disponibles
3. **Informations client** - Formulaire avec validation
4. **Confirmation** - Récapitulatif + numéro de réservation

### 🔐 Côté Admin (Protégé)

#### Dashboard
- KPIs : réservations aujourd'hui, semaine, mois
- Réservations en attente
- Liste des dernières réservations

#### Gestion des Réservations
- Liste avec filtres (statut, service, date, recherche)
- Pagination et tri
- Détail avec changement de statut
- Notes internes
- Annulation avec notification
- **Export CSV**

#### Gestion des Services
- CRUD complet
- Nom, durée, prix, description
- Activation/désactivation

#### Gestion des Disponibilités
- Règles hebdomadaires (ex: Lun-Ven 9h-18h)
- Exceptions (jours fériés, congés)
- Capacité par créneau

---

## 🔌 API Endpoints

### Public
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/services` | Liste des services actifs |
| GET | `/availability?serviceId=&date=` | Créneaux disponibles |
| POST | `/bookings` | Créer une réservation |
| GET | `/bookings/public/:id` | Détail réservation (public) |

### Auth
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/login` | Connexion admin |
| POST | `/auth/register` | Inscription admin |
| GET | `/auth/me` | Profil admin |

### Admin (Auth requise)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/admin/dashboard` | Statistiques |
| GET | `/admin/bookings` | Liste réservations |
| GET | `/admin/bookings/:id` | Détail réservation |
| PATCH | `/admin/bookings/:id` | Modifier réservation |
| POST | `/admin/bookings/:id/notes` | Ajouter note |
| POST | `/admin/bookings/:id/cancel` | Annuler + notifier |
| GET | `/admin/export/bookings.csv` | Export CSV |
| CRUD | `/admin/services` | Gestion services |
| CRUD | `/admin/availability-rules` | Règles horaires |
| CRUD | `/admin/availability-exceptions` | Exceptions |

📚 **Documentation complète** : http://localhost:3001/docs

---

## 🧪 Tests

```bash
# Tests backend (Jest)
npm run test -w apps/api

# Tests frontend (Vitest)
npm run test -w apps/web

# Tous les tests
npm run test
```

### Couverture des tests
- **Backend** : Auth, Services, Validateurs (6+ tests)
- **Frontend** : Utilitaires, Composants UI (2+ tests)

---

## 📦 Scripts Disponibles

```bash
npm run dev          # Lance API + Web en développement
npm run build        # Build production
npm run test         # Lance tous les tests
npm run lint         # Vérifie le code
npm run format       # Formate le code

npm run db:migrate   # Applique les migrations
npm run db:seed      # Insère les données de démo
npm run db:studio    # Interface Prisma Studio
```

---

## 🔮 Améliorations Possibles (1 jour de plus)

### Fonctionnelles
- [ ] Envoi d'emails réels (Resend, Mailgun)
- [ ] Rappels SMS (Twilio)
- [ ] Paiement en ligne (Stripe)
- [ ] Calendrier synchronisé (Google Calendar)
- [ ] Multi-langue (i18n)
- [ ] Mode sombre

### Techniques
- [ ] Tests E2E (Playwright)
- [ ] CI/CD (GitHub Actions)
- [ ] Docker + Docker Compose
- [ ] Rate limiting Redis
- [ ] Monitoring (Sentry)
- [ ] CDN pour assets

### UX
- [ ] Annulation par le client (lien magique)
- [ ] Reprogrammation de rdv
- [ ] Notifications push
- [ ] Statistiques avancées (graphiques)

---

## 📄 Licence

MIT © 2024

---

<div align="center">
  <p>Fait avec ❤️ pour démontrer des compétences fullstack</p>
  <p><strong>BookEasy</strong> - Réservez en 30 secondes</p>
</div>
