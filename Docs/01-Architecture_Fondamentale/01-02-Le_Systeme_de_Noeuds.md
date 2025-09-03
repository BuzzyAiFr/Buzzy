# Architecture Fondamentale : Le Système de Nœuds

Le **Nœud** est l'unité de travail fondamentale et atomique de Buzzy. Chaque nœud représente une capacité ou une action spécifique, isolée et réutilisable. C'est en combinant ces briques de base que des automatisations complexes sont construites.

## Anatomie d'un Nœud

Chaque nœud est un répertoire situé sous `src/nodes/` qui contient au minimum deux fichiers :

1.  **`node.config.js` : La Carte d'Identité**
    Ce fichier de métadonnées est crucial. Il permet à Buzzy (et aux agents IA) de comprendre ce que fait le nœud, comment l'utiliser, et ce qu'il produit. Il contient :
    *   `name`: Un identifiant unique et sémantique (ex: `file.read`).
    *   `description`: Une description claire et concise de l'action du nœud.
    *   `inputs`: Un schéma JSON décrivant les paramètres que le nœud accepte.
    *   `outputs`: Un schéma JSON décrivant les données que le nœud retourne.
    *   `category` et `tags`: Des métadonnées essentielles pour la découverte et le classement par les agents IA.

2.  **`index.js` : La Logique d'Exécution**
    Ce fichier contient le code JavaScript qui est exécuté lorsque le nœud est appelé. Il exporte une fonction `run` asynchrone qui reçoit les `inputs` validés et le `context` (qui contient tous les services de Buzzy).

## Le `NodeRegistry` : Le Gardien des Capacités

Le service `NodeRegistry` est le gestionnaire central des nœuds. Au démarrage de Buzzy, il scanne le répertoire `src/nodes`, charge chaque `node.config.js`, le valide, et maintient un registre en mémoire de toutes les capacités disponibles. C'est la source de vérité unique que le `WorkflowRunner` et le `CapabilityRegistry` consultent.

## Standardisation pour l'IA

Pour que les agents IA puissent utiliser les nœuds de manière autonome ("Tool Use"), la clarté du `node.config.js` est primordiale. Une `description` bien formulée et des `tags` pertinents sont la clé pour permettre à un LLM de découvrir et de sélectionner le bon outil pour la bonne tâche.

## Catégories de Nœuds Principales

Les nœuds sont organisés par catégories fonctionnelles. Voici un aperçu des plus importantes :

*   **`agent`**: Capacités d'autonomie et de raisonnement (planification, exécution, réflexion).
*   **`analysis`**: Analyse statique et sémantique du code source pour alimenter le Graphe de Connaissances.
*   **`cache` / `performance`**: Outils pour la gestion du cache, le monitoring et l'optimisation des performances.
*   **`control`**: Structures de contrôle pour les workflows (boucles, conditions).
*   **`file` / `directory`**: Interactions de base avec le système de fichiers.
*   **`llm` / `provider`**: Communication avec les Grands Modèles de Langage (OpenAI, Groq, Ollama, etc.).
*   **`memory`**: Gestion de la mémoire à court et long terme des agents.
*   **`template`**: Gestion des templates de nœuds, workflows et prompts.
*   **`web`**: Capacités d'interaction avec le web (recherche, scraping, navigation).
*   **`utils`**: Fonctions utilitaires diverses (manipulation de JSON, de chaînes de caractères, etc.).

## Extensibilité et Évolution

L'écosystème des nœuds est conçu pour être dynamique et évolutif. Deux mécanismes principaux le permettent :

### Versioning des Nœuds
Pour gérer les changements et éviter les ruptures de compatibilité, Buzzy intègre un système de versioning.
-   **Nœud Clé :** `buzzy.node.version`
-   **Rôle :** Permet de requêter la version d'un nœud spécifique en utilisant le versioning sémantique (SemVer). Les workflows peuvent ainsi s'assurer qu'ils utilisent une version compatible d'une capacité.

### Écosystème de Plugins
Buzzy peut être étendu avec des capacités externes grâce à un système de plugins.
-   **Service Clé :** `PluginManager`
-   **Rôle :** Ce service est responsable du chargement dynamique de plugins. Un plugin peut contenir un ou plusieurs nœuds, permettant d'ajouter de nouvelles intégrations (ex: un nouveau fournisseur de LLM) ou des outils d'analyse spécifiques sans avoir à modifier le cœur de Buzzy.

---

**Prochaine lecture :** [01-03-L_Orchestration_par_Workflows.md](./01-03-L_Orchestration_par_Workflows.md)