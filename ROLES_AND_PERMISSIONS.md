# Rôles et Permissions - API Zoo

## Rôles disponibles

- **visiteur** : Accès en lecture seule aux informations publiques
- **gardien** : Gestion complète des animaux et enclos
- **veterinaire** : Soins des animaux et consultation des données

## Routes protégées par rôles

### Animaux (`/animaux`)

| Route | Méthode | Rôles autorisés | Description |
|-------|---------|-----------------|-------------|
| `/` | POST | `gardien` | Créer un nouvel animal |
| `/` | GET | `veterinaire`, `gardien`, `visiteur` | Lister tous les animaux |
| `/:id` | GET | `veterinaire`, `gardien`, `visiteur` | Obtenir un animal par ID |
| `/test/:id` | GET | Aucune authentification requise | **TEST** - Obtenir un animal par ID |
| `/test` | POST | Aucune authentification requise | **TEST** - Créer un nouvel animal |
| `/search/name` | GET | `veterinaire`, `gardien`, `visiteur` | Rechercher des animaux par nom |
| `/:id` | DELETE | `gardien` | Supprimer un animal |
| `/soignerAnimal/:id` | GET | `veterinaire` | Soigner un animal |
| `/assigner-enclos` | POST | `gardien` | Assigner un animal à un enclos |
| `/:id/enclos` | GET | `veterinaire`, `gardien`, `visiteur` | Obtenir l'enclos d'un animal |
| `/:id/enclos` | DELETE | `gardien` | Retirer un animal de son enclos |

### Enclos (`/enclos`)

| Route | Méthode | Rôles autorisés | Description |
|-------|---------|-----------------|-------------|
| `/` | POST | `gardien` | Créer un nouvel enclos |
| `/` | GET | `veterinaire`, `gardien`, `visiteur` | Lister tous les enclos |
| `/:id` | GET | `veterinaire`, `gardien`, `visiteur` | Obtenir un enclos par ID |
| `/:id` | PUT | `gardien` | Mettre à jour un enclos |
| `/:id` | DELETE | `gardien` | Supprimer un enclos |
| `/search/type` | GET | `veterinaire`, `gardien`, `visiteur` | Rechercher des enclos par type |
| `/search/status` | GET | `veterinaire`, `gardien`, `visiteur` | Rechercher des enclos par statut |
| `/:id/status` | PATCH | `gardien` | Mettre à jour le statut d'un enclos |
| `/:id/animals` | GET | `veterinaire`, `gardien`, `visiteur` | Obtenir les animaux dans un enclos |
| `/recalculate-occupancy` | POST | `gardien` | Recalculer l'occupation de tous les enclos |

## Authentification

Toutes les routes nécessitent une authentification JWT via Auth0. L'access token doit être inclus dans l'en-tête `Authorization: Bearer <token>`.

## Codes de réponse

- **200/201** : Succès
- **401** : Non authentifié (token manquant ou invalide)
- **403** : Non autorisé (rôle insuffisant)
- **404** : Ressource non trouvée
- **400** : Données invalides

## Routes de test (Mode développement)

Pour faciliter les tests sans authentification, les routes suivantes sont disponibles :

- `GET /animaux/test/:id` - Obtenir un animal par ID sans authentification
- `POST /animaux/test` - Créer un nouvel animal sans authentification

⚠️ **Attention** : Ces routes ne sont disponibles qu'en mode développement et ne doivent pas être utilisées en production.

## Exemple d'utilisation

### Routes protégées (avec authentification)

```bash
# Obtenir tous les animaux (nécessite un token avec rôle visiteur, gardien ou veterinaire)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/animaux

# Créer un animal (nécessite un token avec rôle gardien)
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"nom":"Simba","espece":"Lion","age":5}' \
     http://localhost:3000/animaux

# Soigner un animal (nécessite un token avec rôle veterinaire)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/animaux/soignerAnimal/1
```

### Routes de test (sans authentification)

```bash
# Obtenir un animal par ID (sans authentification)
curl http://localhost:3000/animaux/test/1

# Créer un nouvel animal (sans authentification)
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"nom":"TestAnimal","espece":"Test","age":3}' \
     http://localhost:3000/animaux/test
``` 