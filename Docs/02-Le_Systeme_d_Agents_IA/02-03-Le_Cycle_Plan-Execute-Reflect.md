# Le Système d'Agents IA : Le Cycle Plan-Execute-Reflect

Si le [Protocole de Capacités (BCP)](./02-02-Protocole_de_Capacites_(BCP).md) donne aux agents la capacité de "voir" leurs outils, le cycle **Plan-Execute-Reflect** (Planifier-Exécuter-Réfléchir) leur donne la capacité de "raisonner". C'est le moteur d'autonomie de Buzzy, orchestré par le `WorkflowRunner`.

## Le Déroulement du Cycle

Lorsqu'un agent reçoit un objectif de haut niveau (ex: "auditer la qualité du code du projet"), le cycle se déroule comme suit :

### 1. Plan (Planifier) : La Phase Stratégique

L'agent ne se précipite pas. Il collecte d'abord des informations pour élaborer le meilleur plan possible.

-   **Nœud Clé :** `agent.planner.create`
-   **Processus :**
    1.  **Découverte :** Appelle `agent.tool.discover` pour obtenir la liste à jour des outils disponibles.
    2.  **Contexte :** Interroge le [Graphe de Connaissances](../01-Architecture_Fondamentale/01-04-Le_Graphe_de_Connaissances.md) via `analysis.graph.query` pour comprendre le contexte du projet.
    3.  **Apprentissage :** Cherche dans les expériences passées via `agent.tool.learn` des exemples de plans ayant réussi (ou échoué) pour des objectifs similaires.
    4.  **Synthèse :** Construit un prompt détaillé pour un LLM, incluant l'objectif, les outils, le contexte et les exemples. Le LLM retourne alors un plan d'action sous la forme d'un **workflow dynamique**.

### 2. Execute (Exécuter) : La Phase d'Action

Une fois le plan généré et validé, il est temps de l'exécuter.

-   **Nœud Clé :** `agent.executor.runPlan`
-   **Processus :**
    1.  **Validation :** S'assure que tous les nœuds spécifiés dans le plan existent réellement.
    2.  **Archivage :** Enregistre le plan dans la mémoire collaborative (`memory.collaborate`) pour l'apprentissage futur.
    3.  **Exécution :** Délègue l'exécution du workflow dynamique au service `WorkflowRunner`.
    4.  **Rapport :** Une fois l'exécution terminée (avec succès ou échec), enregistre le résultat dans la mémoire collaborative.

### 3. Reflect (Réfléchir) : La Phase Corrective

L'échec est une source d'apprentissage. Si l'exécution du plan échoue, l'agent entre dans une phase de réflexion.

-   **Nœud Clé :** `agent.reflection.analyze`
-   **Processus :**
    1.  **Auto-correction :** Le nœud possède des logiques pour identifier et corriger automatiquement des erreurs communes (ex: un nom de nœud invalide dans le plan).
    2.  **Consultation :** Si l'erreur est inconnue, il construit un nouveau prompt pour un LLM, incluant l'objectif, le plan échoué et le message d'erreur.
    3.  **Stratégie :** Le LLM analyse la situation et propose une stratégie :
        -   **`RETRY`**: Réessayer si l'erreur semble temporaire.
        -   **`MODIFY_PLAN`**: Modifier le plan pour contourner le problème et relancer le cycle.
        -   **`ABORT`**: Abandonner si le problème semble insoluble.

Ce cycle itératif de collecte d'informations, d'action et d'auto-correction est ce qui permet à Buzzy de passer d'un simple exécutant d'outils à un véritable résolveur de problèmes autonome.

---

Vous avez maintenant une vue complète du fonctionnement des Agents IA. La prochaine section se concentre sur un autre système clé de Buzzy : le **Système de Templates**.

**Prochaine lecture :** [03-Le_Systeme_de_Templates/03-01-Architecture_du_Gestionnaire_de_Templates.md](../03-Le_Systeme_de_Templates/03-01-Architecture_du_Gestionnaire_de_Templates.md)