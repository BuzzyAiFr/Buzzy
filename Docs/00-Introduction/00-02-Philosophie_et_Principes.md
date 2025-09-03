# Philosophie et Principes de Conception

Buzzy est construit sur un ensemble de principes fondamentaux qui garantissent sa robustesse, sa flexibilité et sa capacité à évoluer.

## 1. Double Nature : Framework et Outil

Buzzy est conçu pour être à la fois :
-   **Un Framework :** Une base solide et extensible pour construire des logiques d'automatisation complexes en assemblant des briques logicielles (les nœuds).
-   **Un Outil :** Une application directement utilisable via sa CLI pour interagir avec des agents, lancer des analyses ou exécuter des workflows.

Cette dualité permet de l'utiliser "sur l'étagère" tout en offrant une profondeur de personnalisation quasi infinie.

## 2. Modularité Extrême : Les Nœuds

Le principe de base de Buzzy est la **modularité**. Chaque action ou capacité est encapsulée dans un **Nœud** indépendant. Un nœud est une brique de base, atomique et réutilisable.

-   **Exemple :** `file.read`, `analysis.code.linter`, `llm.query`.
-   **Avantage :** Cette granularité permet de tester, maintenir et versionner chaque capacité de manière isolée. Elle permet également aux agents IA de découvrir et de composer des "chaînes de compétences" très précises.

## 2. Architecture Sans État (Stateless)

Pour garantir la scalabilité et la résilience, le cœur de Buzzy est **stateless**. L'état d'exécution d'un workflow n'est jamais conservé en mémoire par le moteur principal (`WorkflowRunner`).

-   **Gestionnaire clé :** Un **StateManager** centralisé, s'appuyant sur une base de données externe comme Redis, est responsable de la persistance de l'état.
-   **Avantage :** Plusieurs instances de Buzzy peuvent fonctionner en parallèle sans conflit. Une exécution peut être mise en pause et reprise, même si le processus Buzzy redémarre. Ce principe s'applique aussi aux agents, qui sont persistés via un `AgentManager`.

## 3. Rendre les LLM surpuissants (AI-Driven)

Le but ultime de Buzzy est de servir de **multiplicateur de force pour les Grands Modèles de Langage**. Il est conçu pour être **piloté par une intelligence artificielle**.

-   **Principe :** Fournir aux LLMs un ensemble d'outils (les nœuds) si vaste et si bien décrit qu'ils peuvent atteindre n'importe quel objectif, transformant même un modèle local de faible capacité en un expert capable d'opérations complexes.
-   **Gestionnaire clé :** Le `CapabilityRegistry` et le **Buzzy Capability Protocol (BCP)** traduisent les capacités des nœuds dans un format que les LLMs peuvent interpréter nativement (similaire au "Tool Use" d'OpenAI).

## 4. Orchestration par Workflows

Les nœuds sont les briques, mais les **Workflows** sont les plans d'architecte. Un workflow est un fichier déclaratif (JSON) qui définit une séquence de tâches, leurs dépendances et la manière dont les données circulent entre elles.

-   **Gestionnaire clé :** Le `WorkflowRunner` est le moteur qui interprète ces fichiers et orchestre l'exécution des nœuds.
-   **Avantage :** La logique d'orchestration est séparée de la logique d'exécution, ce qui rend les processus complexes plus faciles à lire, à modifier et à partager.

---

**Prochaine lecture :** [01-Architecture_Fondamentale/01-01-Vue_d_ensemble_Systeme.md](../01-Architecture_Fondamentale/01-01-Vue_d_ensemble_Systeme.md)