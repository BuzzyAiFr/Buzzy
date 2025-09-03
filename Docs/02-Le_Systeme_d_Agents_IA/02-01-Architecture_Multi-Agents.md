# Le Système d'Agents IA : Architecture Multi-Agents

Buzzy n'est pas une IA monolithique, mais un écosystème de services complet conçu pour supporter une société d'agents intelligents et collaboratifs. Chaque agent est une entité spécialisée, soutenue par une infrastructure robuste qui gère son cycle de vie, sa mémoire, ses communications et sa gouvernance.

## L'Écosystème des Services d'Agent (`src/services/agent`)

Le fonctionnement des agents repose sur un ensemble de services spécialisés qui travaillent de concert :

### 1. `AgentManager` : Le Registre Central
C'est le service principal qui gère le cycle de vie des agents.
-   **Rôles :** Création, persistance dans Redis, et gestion d'état (démarré/arrêté).
-   **Typage :** Il définit les archétypes d'agents (`chef`, `assistant`, `architecte`, etc.) avec leurs capacités par défaut.

### 2. `AgentHierarchyManager` : Le Système de Gouvernance
Ce service structure les interactions entre les agents.
-   **Rôles :** Définit une hiérarchie complexe avec des niveaux d'autorité, des rôles (`strategic_manager`, `task_manager`) et des permissions granulaires.
-   **Flux d'information :** Gère les "chemins de reporting" pour s'assurer que l'information remonte correctement dans la chaîne de commandement.

### 3. `AgentContextManager` : L'Environnement de l'Agent
Chaque agent évolue dans un contexte isolé et riche fourni par ce service.
-   **Rôles :** Fournit à chaque agent une partition mémoire dédiée, un cache spécialisé (avec politique d'éviction LRU/LFU), et la capacité de créer des contextes partagés pour la collaboration.
-   **Templates :** Utilise des templates de contexte par type d'agent pour structurer leur "pensée" (`conversation`, `team`, `design`, etc.).

### 4. `AgentMemoryManager` : La Mémoire Collaborative
Ce service implémente une architecture de mémoire avancée.
-   **Rôles :** Crée des partitions mémoire spécialisées par type d'agent, chacune avec une stratégie de cache (L1, L2, L3) et de compression optimisée pour son rôle (ex: cache L1 rapide pour un `assistant`, cache L3 compressé pour un `architecte`).

### 5. `AgentCommunicationService` : Le Protocole de Communication
Ce service standardise tous les échanges inter-agents.
-   **Rôles :** Définit un protocole de messages structurés (`task`, `response`, `coordination`, `report`), gère des conversations et permet l'exécution de workflows de communication complexes.

### 6. `AgentRecoveryService` : Le Système Immunitaire
Ce service assure la résilience et la robustesse de la population d'agents.
-   **Rôles :** Surveille en permanence la santé des agents (temps de réponse, taux d'erreur) et déclenche automatiquement des stratégies de récupération en cas de défaillance (`restart_agent`, `recreate_agent`, `reset_context`).

## Les Archétypes d'Agents

Voici les principaux types d'agents définis par l'`AgentManager` :

-   **Agent Conversationnel (`conversational`)**: Le point de contact avec l'utilisateur.
-   **Agent Chef (`chef`)**: Le gestionnaire d'équipe.
-   **Agent Assistant (`assistant`)**: L'exécutant des tâches techniques.
-   **Agent Architecte (`architect`)**: Le concepteur de solutions et de plans.
-   **Agent Orchestrateur (`orchestrator`)**: Le superviseur de processus complexes.
-   **Agent Créateur (`creator`)**: Le méta-agent capable de créer de nouveaux agents.

## Services de Support à l'Apprentissage

Pour évoluer, les agents ont besoin d'apprendre de leurs expériences. Deux composants clés facilitent cet apprentissage :

-   **`FeedbackManager`**: Un service qui enregistre systématiquement les résultats (succès ou échecs) des actions des agents dans une base de données persistante.
-   **`agent.tool.learn`**: Un nœud qui permet aux agents d'interroger cette base de données pour retrouver des exemples pertinents d'actions passées, leur permettant d'affiner leurs stratégies futures (apprentissage "few-shot").

---

**Prochaine lecture :** [02-02-Protocole_de_Capacites_(BCP).md](./02-02-Protocole_de_Capacites_(BCP).md)