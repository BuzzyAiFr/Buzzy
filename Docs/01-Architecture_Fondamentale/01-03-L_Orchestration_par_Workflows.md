# Architecture Fondamentale : L'Orchestration par Workflows

Si les [Nœuds](./01-02-Le_Systeme_de_Noeuds.md) sont les briques de base, les **Workflows** sont les plans d'exécution qui les assemblent pour accomplir des tâches complexes. Ils sont le cœur de l'automatisation dans Buzzy.

## Qu'est-ce qu'un Workflow ?

Un workflow est un fichier `JSON` déclaratif qui décrit une série de tâches, leurs dépendances, et la manière dont les données circulent entre elles. Il représente un processus métier ou technique de haut niveau.

Le principal avantage est la **séparation des préoccupations** : la logique d'orchestration (le "quoi" et le "quand") est entièrement découplée de la logique d'exécution (le "comment", qui est dans les nœuds).

## Le `WorkflowRunner` : Le Double Rôle de Chef d'Orchestre

Le service `WorkflowRunner` est le moteur qui donne vie à ces fichiers. Il possède une double responsabilité fondamentale :

### 1. Exécuteur de Workflows Statiques
C'est son rôle le plus classique. Il prend un fichier de workflow, construit un **Graphe Orienté Acyclique (DAG)** des tâches, et les exécute en respectant leurs dépendances. Il s'appuie sur le `StateManager` pour persister l'état à chaque étape.

### 2. Pilote de Plans Agentiques Dynamiques
C'est sa capacité la plus avancée. Le `WorkflowRunner` contient également la logique de la boucle **Plan-Execute-Reflect** qui permet à un agent IA d'agir de manière autonome. Quand on lui donne un objectif, il :
1.  **Planifie :** Appelle le nœud `agent.planner.create` pour générer un plan d'action (un workflow dynamique).
2.  **Exécute :** Utilise ses propres capacités pour exécuter ce plan nouvellement créé.
3.  **Réfléchit :** En cas d'échec, il appelle le nœud `agent.reflection.analyze` pour comprendre l'erreur et décider de modifier le plan ou de réessayer.

## Structure d'un Workflow : Exemple Concret

Analysons un workflow simple qui manipule des fichiers : `workflows/tests/test-file-operations.workflow.json`.

```json
{
  "name": "Test: File System Operations",
  "description": "Valide la création, l'écriture, la lecture et la suppression de fichiers...",
  "tasks": {
    "create_test_dir": {
      "node": "directory.create",
      "inputs": { "path": "./test-workspace/file-ops-test" }
    },
    "create_file": {
      "node": "file.create",
      "inputs": { "path": "./test-workspace/file-ops-test/test-file.txt" },
      "dependsOn": ["create_test_dir"]
    },
    "write_to_file": {
      "node": "file.write",
      "inputs": {
        "path": "./test-workspace/file-ops-test/test-file.txt",
        "content": "Hello, Buzzy!"
      },
      "dependsOn": ["create_file"]
    },
    "read_from_file": {
      "node": "file.read",
      "inputs": { "path": "./test-workspace/file-ops-test/test-file.txt" },
      "dependsOn": ["write_to_file"]
    }
  }
}
```

### Concepts Clés illustrés :

*   **`tasks`**: Un objet où chaque clé est un nom de tâche unique (`create_test_dir`, `create_file`, etc.).
*   **`node`**: Le nœud à exécuter pour cette tâche. Le `WorkflowRunner` le trouvera grâce au `NodeRegistry`.
*   **`inputs`**: Les paramètres passés au nœud. Ils peuvent être des valeurs statiques (comme ici) ou des références aux sorties d'autres tâches.
*   **`dependsOn`**: La clé de voûte de l'orchestration. Ce tableau indique que la tâche `create_file` ne peut démarrer que lorsque la tâche `create_test_dir` est terminée avec succès. Cela crée une chaîne d'exécution séquentielle.

Ce mécanisme simple mais puissant permet de construire des logiques d'automatisation extrêmement complexes et robustes.

---

**Prochaine lecture :** [01-04-Le_Graphe_de_Connaissances.md](./01-04-Le_Graphe_de_Connaissances.md)