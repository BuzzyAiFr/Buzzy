# Guides Pratiques : Installation et CLI

Ce guide explique comment installer Buzzy et comment interagir avec le système via son Interface en Ligne de Commande (CLI).

## Installation

L'utilisation de Buzzy est entièrement conteneurisée avec Docker pour garantir un environnement d'exécution stable et reproductible.

### Prérequis
*   Docker et Docker Compose

### Démarrage Rapide
```bash
# 1. Cloner le dépôt
git clone <URL_DU_DEPOT_BUZZY>
cd buzzy

# 2. Démarrer les services (Buzzy Core, Redis, etc.)
docker-compose up -d

# 3. Vérifier que la CLI fonctionne
docker-compose exec buzzy-core node src/cli/buzzy-cli.js --help
```

Toutes les commandes de la CLI doivent être préfixées par `docker-compose exec buzzy-core node src/cli/buzzy-cli.js`. Il est recommandé de créer un alias pour simplifier cette commande (ex: `alias buzzy="..."`).

## Architecture de la CLI

La CLI est conçue de manière modulaire. Le point d'entrée `buzzy-cli.js` agit comme un routeur qui délègue la logique à des modules spécialisés situés dans `src/cli/modules/`.

## Commandes Principales

Voici un aperçu des commandes les plus importantes. Pour obtenir de l'aide sur une commande spécifique, utilisez `buzzy <commande> --help`.

### `run`
Exécute un workflow à partir d'un fichier de définition.
```bash
# Exécuter un audit complet du projet
buzzy run workflows/audit/project-audit.workflow.json
```

### `agent`
Gère le cycle de vie des agents IA.
```bash
# Créer un nouvel agent de type "assistant"
buzzy agent create assistant --name "MonAssistant"

# Lister tous les agents persistés
buzzy agent list
```

### `template`
Interagit avec le système de gestion de templates. C'est une des commandes les plus riches.
```bash
# Lister tous les templates disponibles
buzzy template list

# Instancier un template en mode interactif
buzzy template instantiate <template-id> --interactive

# Gérer les versions d'un template
buzzy template version list <template-id>
```

### `test`
Exécute les workflows de test du projet.
```bash
# Lister toutes les catégories de tests disponibles
buzzy test list

# Lancer tous les tests d'une catégorie spécifique (ex: agent)
buzzy test run agent
```

### `autonomous`
Gère le mode autonome de Buzzy.
```bash
# Activer le mode autonome
buzzy autonomous enable

# Consulter le statut du mode autonome
buzzy autonomous status
```

---

**Prochaine lecture :** [04-02-Creer_un_Noeud_Personnalise.md](./04-02-Creer_un_Noeud_Personnalise.md)