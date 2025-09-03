# Contribution et Optimisation : Performance et Cache

La performance est un aspect critique de l'architecture de Buzzy. Pour garantir une exécution rapide et une utilisation efficace des ressources, le système intègre des mécanismes de cache sophistiqués et des services dédiés au monitoring et à l'optimisation.

## Architecture du Cache Multi-niveaux

Buzzy implémente une stratégie de cache multi-niveaux, orchestrée par le `CacheManager` (`src/services/cache/CacheManager.js`), pour minimiser la latence d'accès aux données.

-   **Cache L1 (Mémoire vive)**: C'est le niveau le plus rapide, directement en mémoire. Il est utilisé pour les données les plus fréquemment accédées avec une très courte durée de vie.
-   **Cache L2 (Service distant, ex: Redis)**: Un cache partagé, plus lent que la L1 mais persistant et accessible par plusieurs instances de Buzzy. Il est idéal pour les états de session et les métadonnées.
-   **Cache L3 (Système de fichiers)**: Le niveau le plus lent, utilisé pour stocker des artéfacts plus volumineux comme des templates compilés ou des résultats d'analyse coûteux.

De plus, des services comme `AgentMemoryManager` appliquent des stratégies de cache encore plus fines, spécialisées par type d'agent, pour optimiser l'utilisation de la mémoire en fonction de leur rôle.

## Monitoring et Optimisation

Le répertoire `src/services/monitoring_and_optimization/` contient un ensemble de services dédiés à la surveillance et à l'amélioration active des performances.

-   **`PerformanceMonitor`**: Collecte en temps réel des métriques sur l'exécution des workflows et la performance des agents (temps de réponse, utilisation des ressources, etc.).
-   **`PerformanceOptimizer`**: Peut appliquer des stratégies d'optimisation basées sur les données du `PerformanceMonitor`, comme l'équilibrage de charge entre les agents.
-   **`FeedbackManager`**: Enregistre les succès et les échecs des opérations, fournissant une base de données essentielle pour les mécanismes d'apprentissage (`agent.tool.learn`).
-   **`LRUCleaner`**: Un service utilitaire qui implémente une politique d'éviction "Least Recently Used" pour nettoyer les caches et les partitions mémoire.

Cette combinaison d'un cache multi-niveaux et de services de monitoring proactifs permet à Buzzy de maintenir des performances élevées tout en gérant des tâches complexes.

---

**Prochaine lecture :** [05-02-Regles_de_Contribution.md](./05-02-Regles_de_Contribution.md)