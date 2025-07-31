# Zoo Management System

Application complète de gestion de zoo avec backend NestJS, frontend Angular, base de données PostgreSQL et module TypeScript.

## Prérequis

- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **Docker** (pour la base de données PostgreSQL)
- **Compte Auth0** (pour l'authentification)

## Structure du projet

Le projet est divisé en trois parties principales :

```
formation-ts-nest-angular-main/
├── zoo-backend/                 # Backend NestJS (API REST)
│   ├── src/
│   │   ├── animaux/            # Module gestion des animaux
│   │   ├── enclos/             # Module gestion des enclos
│   │   ├── auth/               # Module authentification Auth0
│   │   └── main.ts
│   └── package.json
├── zoo-frontend/               # Frontend Angular 19
│   ├── src/app/
│   │   ├── pages/
│   │   │   ├── liste-animaux/  # Composant liste animaux
│   │   │   └── liste-enclos/   # Composant liste enclos
│   │   ├── components/         # Composants réutilisables
│   │   └── dto/               # DTOs partagés
│   └── package.json
├── zoo-ts/                     # Module TypeScript (logique métier)
│   ├── src/
│   │   ├── animals/           # Classes d'animaux
│   │   ├── interfaces/        # Interfaces TypeScript
│   │   └── services/          # Services métier
│   └── package.json
└── README.md
```

## Installation et Configuration

### 1. Cloner le projet

```bash
git clone <votre-repo-url>
cd formation-ts-nest-angular-main
```

### 2. Configuration de la base de données

Lancez PostgreSQL avec Docker :

```bash
docker run --name zoo-postgres \
  -e POSTGRES_DB=zoo \
  -e POSTGRES_USER=******** \
  -e POSTGRES_PASSWORD=******** \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Configuration Auth0

1. Créez un compte sur [Auth0](https://auth0.com/)
2. Créez une nouvelle application :
   - **Type** : Single Page Application (pour Angular)
   - **Type** : Machine to Machine (pour NestJS)
3. Configurez les URLs autorisées :
   - Allowed Callback URLs: `http://localhost:4200`
   - Allowed Logout URLs: `http://localhost:4200`
   - Allowed Web Origins: `http://localhost:4200`
4. Créez les rôles suivants :
   - `veterinaire`
   - `gardien`
   - `visiteur`
5. Créez des utilisateurs de test et assignez-leur les rôles

### 4. Configuration des variables d'environnement :

Votre USERNAME et PASSWORD doivent être identiques à ceux utilisés lors de la création de votre base de donnée
Le domain et clientID Auth0 se trouve dans les parametres de votre SPA créée sur Auth0

Créez le fichier `zoo-backend/.env` :

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=*******
DB_PASSWORD=*******
DB_DATABASE=zoo

# Auth0 Configuration
AUTH0_ISSUER_BASE_URL=https://dev-*********************.**.auth0.com/
AUTH0_AUDIENCE=http://localhost:3000

# Application Configuration
PORT=3000
```

Créez le fichier `zoo-frontend/src/environments/environment.ts` :

```
export const environment = {
  production: false,
  auth0: {
    domain: 'dev-***********.**.auth0.com',
    clientId: '*********************************',
    audience: 'http://localhost:3000'
  }
};
```

### 5. Installation des dépendances

```bash
# Backend NestJS
cd zoo-backend
npm install

# Frontend Angular
cd ../zoo-frontend
npm install

# Module TypeScript
cd ../zoo-ts
npm install
```

## Lancement de l'application

### 1. Démarrer le backend

```bash
cd zoo-backend
npm run start:dev
```

Le backend sera accessible sur : http://localhost:3000
Documentation Swagger : http://localhost:3000/api

### 2. Démarrer le frontend

```bash
cd zoo-frontend
npm start
```

Le frontend sera accessible sur : http://localhost:4200

### 3. Tests des fonctionnalités

### Backend - Tests via Swagger

1. Ouvrez http://localhost:3000/api
2. Testez les endpoints suivants :

#### Endpoints Animaux
- `POST /animaux` - Créer un animal (rôle gardien requis)
- `GET /animaux` - Lister tous les animaux
- `GET /animaux/{id}` - Obtenir un animal par ID
- `DELETE /animaux/{id}` - Supprimer un animal (rôle gardien requis)
- `GET /animaux/soignerAnimal/{id}` - Soigner un animal (rôle vétérinaire requis)
- `POST /animaux/assigner-enclos` - Assigner un animal à un enclos (rôle gardien requis)
- `GET /animaux/{id}/enclos` - Obtenir l'enclos d'un animal
- `DELETE /animaux/{id}/enclos` - Retirer un animal de son enclos (rôle gardien requis)

#### Endpoints Enclos
- `POST /enclos` - Créer un enclos (rôle gardien requis)
- `GET /enclos` - Lister tous les enclos
- `GET /enclos/{id}` - Obtenir un enclos par ID
- `PUT /enclos/{id}` - Modifier un enclos (rôle gardien requis)
- `DELETE /enclos/{id}` - Supprimer un enclos (rôle gardien requis)
- `GET /enclos/search/type` - Rechercher par type
- `GET /enclos/search/status` - Rechercher par statut
- `PATCH /enclos/{id}/status` - Mettre à jour le statut d'un enclos (rôle gardien requis)
- `GET /enclos/{id}/animals` - Obtenir les animaux dans un enclos
- `POST /enclos/recalculate-occupancy` - Recalculer l'occupation (rôle gardien requis)

#### Routes de test (sans authentification)
- `GET /animaux/test/{id}` - Obtenir un animal par ID (test)
- `POST /animaux/test` - Créer un nouvel animal (test)

### Frontend - Tests via l'interface

1. Ouvrez http://localhost:4200
2. Testez les fonctionnalités :

#### Gestion des Animaux
- Cliquez sur "Animaux" dans la navigation
- Ajoutez de nouveaux animaux
- Consultez la liste des animaux
- Testez les filtres de recherche

#### Gestion des Enclos
- Cliquez sur "Enclos" dans la navigation
- Ajoutez de nouveaux enclos
- Consultez la liste des enclos
- Testez les filtres par type et statut
- Supprimez des enclos

### Tests d'authentification

1. Cliquez sur "Connexion" pour vous connecter via Auth0
2. Testez les différentes routes selon les rôles :
   - **Visiteur** : Peut voir les animaux et enclos
   - **Gardien** : Peut gérer les animaux et enclos
   - **Vétérinaire** : Peut soigner les animaux et consulter les données

## Fonctionnalités implémentées

### Backend (NestJS)
- **Authentification Auth0** avec JWT et gestion des rôles
- **Base de données PostgreSQL** avec TypeORM
- **API REST** complète avec documentation Swagger
- **Validation** des données avec class-validator
- **Gestion des rôles** : visiteur, gardien, vétérinaire
- **CORS** configuré pour le frontend Angular
- **Routes de test** pour le développement

### Frontend (Angular 19)
- **Angular Material** pour l'interface utilisateur
- **Authentification Auth0** intégrée
- **Routing** entre les différentes pages
- **Composants réutilisables** (dialogs, etc.)
- **Gestion des formulaires** réactive
- **Interface moderne** et responsive


## Gestion des rôles et permissions

Consultez le fichier `ROLES_AND_PERMISSIONS.md` pour les détails complets sur :
- Les rôles disponibles
- Les permissions par route
- Les exemples d'utilisation
- Les codes de réponse

## Versions utilisées

- **NestJS** : ^11.1.3
- **Angular** : ^19.0.0
- **TypeScript** : ^5.8.3
- **PostgreSQL** : 15 (Docker)
- **Auth0** : @auth0/auth0-angular ^2.2.3

## Dépannage

### Problèmes courants

1. **Erreur de connexion à la base de données**
   - Vérifiez que Docker est en cours d'exécution
   - Vérifiez les paramètres de connexion dans `.env`

2. **Erreur d'authentification Auth0**
   - Vérifiez la configuration Auth0 dans `zoo-frontend/src/main.ts`
   - Vérifiez les variables d'environnement du backend

3. **Erreur CORS**
   - Vérifiez que le backend est configuré pour accepter les requêtes du frontend

4. **Erreur de compilation TypeScript**
   - Vérifiez que toutes les dépendances sont installées
   - Vérifiez la version de Node.js (18+)


### Scripts disponibles

**Backend :**
- `npm run start:dev` - Démarrage en mode développement
- `npm run build` - Compilation pour production
- `npm run test` - Exécution des tests

**Frontend :**
- `npm start` - Démarrage du serveur de développement
- `npm run build` - Compilation pour production
- `npm test` - Exécution des tests

---

**Note** : Ce projet est configuré pour un environnement de développement. Pour la production, configurez les variables d'environnement appropriées et désactivez `synchronize: true` dans TypeORM.
