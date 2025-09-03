# Le Système d'Agents IA : Protocole de Capacités Buzzy (BCP)

Pour qu'un agent IA puisse agir de manière autonome, il doit d'abord comprendre quels outils sont à sa disposition. Le **Protocole de Capacités Buzzy (BCP)** est le mécanisme qui permet cette prise de conscience.

Son objectif est de traduire tout l'éventail des capacités de Buzzy dans un format structuré, lisible par une machine, que les Grands Modèles de Langage (LLM) peuvent utiliser nativement via leurs fonctionnalités de **"Tool Use"** ou **"Function Calling"**.

## Le `CapabilityRegistry` : Le Traducteur

Le service `CapabilityRegistry.js` est le cœur du BCP. Au démarrage, il effectue deux actions fondamentales :

1.  **Scanner les Nœuds :** Il récupère la liste de tous les nœuds via le `NodeRegistry`.
2.  **Scanner les Workflows :** Il parcourt le répertoire `workflows/` pour identifier tous les workflows réutilisables.

Ensuite, pour chaque nœud et chaque workflow, il génère une **définition de capacité**.

## La Structure d'une Capacité

Une capacité est une description standardisée au format JSON Schema qui contient :

*   **`name`**: Un nom de fonction unique et compatible avec les API des LLM (ex: `file_read`, `workflow_project_audit`).
*   **`description`**: Une description textuelle riche de ce que fait l'outil. Le `CapabilityRegistry` l'enrichit automatiquement avec des exemples et des cas d'usage pour aider le LLM à faire le bon choix.
*   **`parameters`**: Un schéma JSON décrivant tous les paramètres que la fonction accepte, leur type, et s'ils sont requis.

## Le Manifeste BCP

Le résultat final est un **manifeste BCP**, un grand document JSON qui contient la liste complète de toutes les capacités (nœuds et workflows) disponibles dans l'instance de Buzzy. Ce manifeste est la "carte des outils" qui est fournie aux agents IA.

Grâce à ce manifeste, un agent peut :
*   **Raisonner :** Face à un objectif, le LLM peut parcourir la liste des outils et sélectionner le plus approprié.
*   **Agir :** Le LLM peut générer une requête JSON valide avec le nom de l'outil et les bons paramètres, que Buzzy peut ensuite exécuter.
*   **Découvrir :** Le `CapabilityRegistry` expose des fonctions de recherche, permettant à un agent de chercher dynamiquement un outil par catégorie, par mot-clé ou par tag.

En résumé, le BCP est le pont essentiel qui transforme Buzzy d'une simple collection d'outils en un écosystème cohérent et utilisable par une intelligence artificielle.

---

**Prochaine lecture :** [02-03-Le_Cycle_Plan-Execute-Reflect.md](./02-03-Le_Cycle_Plan-Execute-Reflect.md)