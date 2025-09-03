# Contribution et Optimisation : Règles de Contribution

Contribuer à Buzzy signifie adhérer à un ensemble de principes et de workflows qui garantissent la qualité, la cohérence et la robustesse du projet. Ce document synthétise les règles essentielles.

## 1. Workflow de Développement

Chaque nouvelle fonctionnalité ou correction doit suivre un processus de développement structuré :

1.  **Planification :** Avant d'écrire une seule ligne de code, une phase de planification est obligatoire. Mettez à jour le `Plans/plan_general.md` si l'impact est global, et créez un plan détaillé pour votre tâche en utilisant le template `Plans/Template_Plan_Detaille.md`.

2.  **Développement Guidé par les Tests :**
    *   **Créez un workflow de test** dans `workflows/tests/` qui valide votre nouvelle fonctionnalité.
    *   **Assurez la non-régression** en lançant la suite de tests complète via la commande `buzzy test run`.

## 2. Conventions pour les Composants

### Nœuds (`/src/nodes/`)
La clarté du fichier `node.config.js` est primordiale pour que les agents IA puissent découvrir et utiliser les nœuds.
-   **`meta.category`**: Une catégorie de haut niveau (ex: `file_system`, `code`, `llm`).
-   **`meta.tags`**: Des mots-clés précis (ex: `read`, `analyze`, `generate`).
-   **`description`**: Une phrase claire et concise formulée comme une instruction (ex: "Lit le contenu d'un fichier.").

### Workflows (`.workflow.json`)
-   La clé racine pour les étapes doit **toujours** être `"tasks"`.
-   `"tasks"` doit être un **objet** (et non un tableau).
-   Utilisez la syntaxe `{{...}}` pour référencer les sorties d'autres tâches ou les entrées du workflow.

## 3. Principes Clés

-   **Modularité :** Chaque composant doit être autonome et avoir une responsabilité unique.
-   **Universalité :** Concevez des nœuds qui sont génériques et réutilisables dans différents contextes.
-   **Amélioration Continue :** Chaque contribution doit être une opportunité d'améliorer la qualité globale du projet.

---

Vous avez maintenant une vue complète de la documentation technique de Buzzy. La prochaine étape est de mettre à jour le `README.md` principal.