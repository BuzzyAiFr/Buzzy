# Guides Pratiques : Créer un Nœud Personnalisé

L'une des plus grandes forces de Buzzy est sa modularité. Créer un nouveau nœud est le moyen le plus direct d'étendre les capacités du système. Ce guide vous montrera comment créer un nœud simple, puis analysera un nœud plus complexe pour illustrer des concepts avancés.

## 1. Créer un Nœud Simple : `utils.string.toUpperCase`

### Étape 1 : Structure de Fichiers
Créez les répertoires et fichiers suivants :
```
src/
└── nodes/
    └── utils/
        └── string.toUpperCase/
            ├── node.config.js
            └── index.js
```

### Étape 2 : `node.config.js` (La Carte d'Identité)
```javascript
module.exports = {
  name: 'utils.string.toUpperCase',
  description: 'Converts a string to uppercase.',
  inputs: {
    inputString: {
      type: 'string',
      description: 'The string to convert.',
      required: true
    }
  },
  outputs: {
    outputString: {
      type: 'string',
      description: 'The resulting uppercase string.'
    }
  },
  meta: {
    category: 'utils',
    tags: ['string', 'format']
  }
};
```

### Étape 3 : `index.js` (La Logique)
```javascript
module.exports = {
  async run({ inputString }, context) {
    if (typeof inputString !== 'string') {
      throw new Error('Input must be a string.');
    }
    return {
      outputString: inputString.toUpperCase()
    };
  }
};
```

---

## 2. Anatomie d'un Nœud Avancé : `analysis.code.linter`

Cet exemple simple est un bon début. Analysons maintenant un nœud plus complexe pour voir comment il s'intègre plus profondément dans l'écosystème Buzzy.

**Étude de cas :** Le nœud `analysis.code.linter`.
**Rôle :** Exécuter l'outil ESLint sur un fichier ou un répertoire et ajouter les résultats au Graphe de Connaissances.

### `node.config.js` : Des Options Flexibles
```javascript
module.exports = {
  name: "analysis.code.linter",
  description: "Exécute ESLint sur un fichier ou un répertoire.",
  inputs: {
    path: {
      type: "string",
      description: "Le chemin du fichier ou du répertoire à analyser.",
      required: true
    },
    configPath: {
      type: "string",
      description: "Chemin optionnel vers un fichier de configuration ESLint.",
      required: false
    }
  },
  outputs: {
    issues: {
      type: "array",
      description: "Un tableau des problèmes détectés."
    }
  },
  // ... méta ...
};
```
On voit ici comment un nœud peut offrir plus de flexibilité avec des entrées optionnelles comme `configPath`.

### `index.js` : Logique Avancée et Utilisation du Contexte

L'analyse du fichier `index.js` de ce nœud révèle plusieurs pratiques avancées :

1.  **Intégration d'Outils Externes :** Le nœud importe et utilise la librairie `ESLint` pour effectuer le travail d'analyse. Buzzy agit comme un orchestrateur autour d'outils existants.

2.  **Logique de Filtrage Robuste :** Avant de lancer l'analyse, le nœud contient une logique pour valider les chemins, ignorer les répertoires non pertinents (`.git`, `node_modules`) et ne traiter que les extensions de fichiers supportées (`.js`, `.mjs`).

3.  **Utilisation du `context` :** C'est le point le plus important. La fonction `run` reçoit le `context` en deuxième argument. Ce nœud l'utilise pour accéder au service `knowledgeGraph`.

    ```javascript
    // Extrait simplifié de index.js
    module.exports = {
      async run({ path, configPath }, { knowledgeGraph }) {
        // ... logique de linting ...
        
        const issues = [];
        for (const result of results) {
          for (const message of result.messages) {
            const issue = { /* ... données du problème ... */ };
            issues.push(issue);

            // Interaction avec le Graphe de Connaissances
            const nodeId = `${issue.filePath}#L${issue.line}`;
            knowledgeGraph.addNode(nodeId, { type: 'LinterIssue', ... });
            knowledgeGraph.addEdge(issue.filePath, nodeId, 'HAS_LINTER_ISSUE');
          }
        }
        
        return { issues };
      }
    };
    ```
    Chaque fois que le linter trouve un problème, le nœud l'ajoute activement au `knowledgeGraph`. Il ne se contente pas de retourner une valeur ; **il enrichit la compréhension que Buzzy a du projet**. C'est là toute la puissance de l'écosystème.

---

**Prochaine lecture :** [05-Contribution_et_Optimisation/05-01-Performance_et_Cache.md](../05-Contribution_et_Optimisation/05-01-Performance_et_Cache.md)