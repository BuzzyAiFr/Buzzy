# Architecture Fondamentale : Le Graphe de Connaissances

Le Graphe de Connaissances (Knowledge Graph) est la **mémoire sémantique** de Buzzy. C'est une structure de données dynamique qui représente un projet logiciel non pas comme une simple arborescence de fichiers, mais comme un réseau de concepts interconnectés : fichiers, fonctions, classes, dépendances, et même l'historique des modifications.

## Rôle et Objectifs

Le but du graphe est de fournir à Buzzy et à ses agents une **compréhension profonde** d'une base de code. Cela permet de répondre à des questions complexes comme :
*   "Quelle est la fonction la plus critique de ce module ?"
*   "Si je modifie cette fonction, quels autres fichiers seront impactés ?"
*   "Montre-moi les dépendances entre le service A et le module B."

## Le Service `KnowledgeGraph`

Au cœur de ce système se trouve le service `KnowledgeGraph.js`, situé dans `src/services/data_and_knowledge`. Il fournit une API abstraite pour toutes les opérations sur le graphe et gère sa persistance dans Redis, tout comme le `StateManager` et l'`AgentManager`. Ses responsabilités sont :
*   Fournir des méthodes pour ajouter des nœuds (entités) et des arêtes (relations).
*   Sauvegarder l'état complet du graphe (nœuds et arêtes) dans Redis après chaque modification.
*   Recharger le graphe depuis Redis au démarrage pour assurer la continuité.
*   Exécuter des requêtes complexes pour explorer les relations.

## Comment le Graphe est-il Construit ?

Le graphe n'est pas statique. Il est construit et enrichi dynamiquement par une famille de **nœuds d'analyse** spécialisés, situés dans `src/nodes/analysis/`. Un workflow d'audit typique utilise ces nœuds en séquence :

1.  **`scan.directory`**: Parcourt l'arborescence des fichiers du projet pour identifier les fichiers pertinents.
2.  **`*.updateFromFile`**: Des analyseurs spécifiques (ex: `javascript.updateFromFile`, `packagejson.updateFromFile`) lisent le contenu des fichiers, en extraient la structure (fonctions, imports, etc.) et créent des entités de base.
3.  **`history.updateFromGit`**: Enrichit le graphe avec des informations provenant de l'historique Git, ajoutant une dimension temporelle et contextuelle.
4.  **`updateGraph`**: Consolide toutes ces informations pour créer les relations (arêtes) entre les entités, formant ainsi un graphe cohérent.

## Comment Interroger le Graphe ?

Une fois construit, le graphe devient une source de vérité interrogeable.

*   **Le Nœud `graph.query`**: C'est le principal point d'entrée pour poser des questions au graphe. Il prend en entrée une requête structurée et retourne les résultats, permettant aux workflows et aux agents d'obtenir des informations précises sur l'état du projet.
*   **Visualisation**: Des nœuds comme `ui.graph.render` peuvent utiliser les données du graphe pour générer des visualisations interactives, offrant une vue d'ensemble puissante de l'architecture du projet.

---

Vous avez maintenant une vue complète de l'architecture fondamentale de Buzzy. La prochaine section se concentre sur la manière dont les **Agents IA** utilisent cette architecture pour devenir des acteurs autonomes.

**Prochaine lecture :** [02-Le_Systeme_d_Agents_IA/02-01-Architecture_Multi-Agents.md](../02-Le_Systeme_d_Agents_IA/02-01-Architecture_Multi-Agents.md)