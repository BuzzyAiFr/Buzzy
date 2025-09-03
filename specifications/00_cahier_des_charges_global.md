# Cahier des Charges Global - Buzzy Framework

## 1. Vision et Objectifs du Projet

**Vision :** Créer un framework open-source de nouvelle génération pour le développement et l'orchestration d'**essaims d'agents IA autonomes**. Buzzy ne sera pas seulement un outil pour les développeurs, mais une plateforme complète permettant de donner aux agents des capacités étendues, y compris l'accès à un environnement de bureau complet, pour résoudre des tâches complexes.

**Objectifs Clés :**
-   **Flexibilité Maximale :** Permettre la création d'agents avec différents niveaux de "capacités", allant de simples outils en ligne de commande à un contrôle total d'un environnement de bureau virtualisé.
-   **Multi-Agent Natif :** Concevoir le framework autour de la collaboration entre plusieurs agents spécialisés (Planificateur, Exécuteur, Chercheur, etc.).
-   **Observabilité :** Fournir des outils de premier ordre pour tracer, visualiser et déboguer le processus de "réflexion" d'un agent.
-   **Extensibilité :** Permettre à la communauté d'ajouter facilement de nouveaux outils, de nouvelles configurations d'agents et de nouvelles capacités.
-   **Prêt pour la Production :** Offrir une voie claire pour le déploiement, de l'environnement local (Docker) à un cluster (Kubernetes).

## 2. Architecture et Stack Technologique

L'architecture s'inspirera fortement des systèmes modernes comme ByteBot, en adoptant une approche de microservices conteneurisés.

**Stack Technologique Recommandée :**
-   **Langage Principal :** **TypeScript**. Pour sa robustesse, son typage statique et son écosystème mature.
-   **Backend (Service Agent) :** **NestJS**. Un framework Node.js puissant et structuré, idéal pour des applications complexes.
-   **Frontend (Interface de gestion) :** **Next.js**. Le framework de référence pour les applications React modernes.
-   **Intégration LLM :** **LiteLLM**. Pour un support agnostique de plus de 100 fournisseurs de modèles de langage (OpenAI, Anthropic, Gemini, Ollama, etc.).
-   **Base de Données de Mémoire :** **Redis** pour le cache rapide et les données de session, et une **base de données vectorielle** (ex: ChromaDB, Weaviate) pour la mémoire sémantique à long terme (RAG).
-   **Conteneurisation :** **Docker** et **Docker Compose** pour l'environnement de développement local.
-   **Déploiement :** Des charts **Helm** seront fournis pour le déploiement sur Kubernetes.

**Diagramme d'Architecture de Haut Niveau :**
```mermaid
graph TD
    subgraph "Interface Utilisateur"
        UI[Next.js Web UI]
    end

    subgraph "Services Backend"
        Gateway[API Gateway]
        AgentService[Service Agent Principal (NestJS)]
        DesktopService[Service de Gestion des Desktops Virtuels]
    end

    subgraph "Infrastructure & Dépendances"
        LLM_Providers[Fournisseurs LLM via LiteLLM]
        VectorDB[(Vector DB)]
        Redis[(Redis Cache)]
        DesktopPool[Pool de Conteneurs Desktop (Ubuntu + VNC)]
    end

    UI --> Gateway
    Gateway --> AgentService
    Gateway --> DesktopService
    AgentService --> LLM_Providers
    AgentService --> VectorDB
    AgentService --> Redis
    AgentService --> DesktopService
    DesktopService --> DesktopPool
```

## 3. Composants Fondamentaux d'un Agent

Chaque agent au sein du framework sera structuré autour de quatre concepts fondamentaux :

1.  **Profil :** Un objet de configuration qui définit l'identité, le rôle et les objectifs de l'agent (ex: "Tu es un ingénieur QA spécialisé dans les tests E2E").
2.  **Mémoire :** Un système de mémoire à plusieurs niveaux :
    -   **Mémoire à Court Terme :** Historique de la conversation/tâche en cours (gérée en mémoire ou Redis).
    -   **Mémoire à Long Terme :** Un système de fichiers persistant propre à l'agent.
    -   **Mémoire Sémantique (RAG) :** Capacité à rechercher des informations pertinentes dans une base de connaissances (Vector DB) pour enrichir son contexte.
3.  **Planification :** La capacité de décomposer un objectif complexe en une séquence d'étapes exécutables. Le résultat de la planification est un "plan" ou un "workflow" dynamique.
4.  **Action :** L'exécution d'une étape du plan en utilisant un **Outil**.

## 4. Le Système d'Outils (Tools)

Les **Outils** sont la manière dont un agent interagit avec le monde. Le framework doit fournir un `ToolRegistry` robuste.

**Types d'Outils :**
-   **Fonctions Simples :** Outils basés sur du code (ex: `filesystem.readFile`, `http.get`).
-   **Contrôle du Bureau :** Outils pour interagir avec un environnement de bureau virtualisé (ex: `mouse.click`, `keyboard.type`, `screen.capture`). Ces outils communiqueront avec le `DesktopService`.
-   **Outils Composites :** Des workflows pré-définis qui peuvent être appelés comme un seul outil.

## 5. Fonctionnalités Clés (Features)

-   **Gestion d'Agents :** Création, configuration, démarrage, et arrêt d'agents via l'UI et l'API.
-   **Gestion de Tâches :** Assignation de tâches en langage naturel à des agents ou à des essaims d'agents.
-   **Vue en Direct :** Visualisation en temps réel de l'environnement de bureau d'un agent pendant qu'il travaille.
-   **Mode "Prise de Contrôle" :** Permettre à un utilisateur de prendre le contrôle manuel du bureau d'un agent pour le guider ou le débloquer.
-   **Observabilité :** Une interface dédiée pour visualiser les traces d'exécution, les logs, et le "dialogue interne" de l'agent (ses décisions de planification).
-   **Support Multi-Agent :** Capacité de définir des "équipes" d'agents avec des rôles différents qui collaborent sur une même tâche.
