# Le Système de Templates : Guide de Création

> **Note :** Ce guide se concentre sur la création de templates via le **système de gestion formel**. Comme expliqué dans le [document d'architecture](./03-01-Architecture_du_Gestionnaire_de_Templates.md), le concept de "template" est aussi utilisé de manière plus informelle dans d'autres parties de Buzzy.

Créer un template dans Buzzy permet de packager et de réutiliser une logique complexe. Que ce soit pour un Nœud, un Workflow ou un Prompt, la structure de base reste cohérente. Ce guide se concentre sur la création d'un **Template de Nœud**.

## Structure d'un Fichier de Template

Un template est un fichier `JSON` qui contient plusieurs sections clés. Voici une vue d'ensemble de sa structure, basée sur un exemple de template pour un nœud de cache.

```json
{
  "id": "cache.l1",
  "type": "node",
  "name": "Cache L1 Template",
  "version": "1.0.0",
  "description": "Template pour le cache de niveau 1",
  "author": "Buzzy Team",
  "tags": ["cache", "performance", "memory"],
  "category": "infrastructure",
  
  "config": {
    "name": "cache.l1",
    "description": "Cache L1 - Mémoire RAM avec politique LRU",
    "inputs": { "...définition des entrées..." },
    "outputs": { "...définition des sorties..." }
  },
  
  "implementation": {
    "entry": "index.js",
    "dependencies": ["events"],
    "environment": { "node": ">=14.0.0" }
  },
  
  "variables": {
    "maxSize": {
      "type": "string",
      "description": "Taille maximale du cache",
      "default": "1GB",
      "validation": ["1MB", "1GB", "5GB"]
    }
  },
  
  "examples": [
    {
      "title": "Stockage d'une valeur",
      "inputs": { "...exemples d'entrées..." },
      "expected": { "...résultat attendu..." }
    }
  ]
}
```

## Description des Sections

1.  **Métadonnées (racine)**:
    *   `id`, `type`, `name`, `version`, `description`, `author`, `tags`, `category`: Ces champs identifient et décrivent le template. Ils sont cruciaux pour que le `template.repository` puisse l'indexer et le retrouver.

2.  **`config`**:
    *   Cette section contient la définition qui sera utilisée pour générer le `node.config.js` du nœud final. Elle décrit ce que le nœud fait, ses entrées (`inputs`) et ses sorties (`outputs`).

3.  **`implementation`**:
    *   Décrit les aspects techniques de l'implémentation du nœud, comme le point d'entrée (`entry`), les dépendances (`dependencies`) ou l'environnement requis (`environment`).

4.  **`variables`**:
    *   C'est le cœur du système de templating. Cette section définit les paramètres qui peuvent être personnalisés lors de l'instanciation du template. Chaque variable a un `type`, une `description`, une valeur par `default` et potentiellement des règles de `validation`.

5.  **`examples`**:
    *   Fournit des exemples concrets d'utilisation qui peuvent servir de documentation ou de base pour des tests.

## Le Processus d'Instanciation

Lorsque vous demandez au `template.manager` d'instancier ce template, le `template.engine` va :
1.  Lire le template.
2.  Vous demander de fournir des valeurs pour les `variables` (ou utiliser les valeurs par défaut).
3.  Remplacer les placeholders dans les sections `config` et `implementation` avec les valeurs que vous avez fournies.
4.  Générer un répertoire de nœud complet et fonctionnel, prêt à être utilisé dans Buzzy.

---

Vous avez maintenant une vue complète du système de Templates. La prochaine section se concentre sur des **Guides Pratiques** pour utiliser et étendre Buzzy.

**Prochaine lecture :** [04-Guides_Pratiques/04-01-Installation_et_CLI.md](../04-Guides_Pratiques/04-01-Installation_et_CLI.md)