# 🎯 PolyQuiz — Plateforme de Quiz Interactive

> Travaux Pratiques Évalués — Ingénierie Front-End Avancée  
---

## 📋 Présentation

**PolyQuiz** est une plateforme de compétition intellectuelle en ligne proposant des quiz chronométrés de niveau expert, couvrant les thématiques suivantes :

- 🏎️ Sports mécaniques (F1, MotoGP)
- 🏀 Sports collectifs (NBA)
- 🎌 Culture japonaise (Manga / Anime)

L'application met en œuvre des patterns d'ingénierie React avancés : Custom Hooks, Context API, Protected Routes, `useReducer`, `useRef` et `useMemo`.

---

## 🏗️ Architecture du projet

```
frontend/
├── public/
│   └── questions.json          # Base de données des questions (API simulée)
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx  # Garde de route (Jalon 3)
│   ├── context/
│   │   └── UserContext.jsx     # Contexte global (pseudo + score) (Jalon 2)
│   ├── hooks/
│   │   └── useFetch.js         # Custom Hook d'abstraction réseau (Jalon 1)
│   ├── pages/
│   │   ├── Home.jsx            # Page d'accueil / connexion (pseudo)
│   │   ├── QuizEngine.jsx      # Moteur du quiz (Jalons 4 & 5)
│   │   └── Results.jsx         # Page de résultats (Jalon 5 — useMemo)
│   ├── App.jsx                 # Routage principal
│   ├── App.css
│   └── main.jsx                # Point d'entrée + <UserProvider>
```

---

## 🚀 Installation et démarrage

### Prérequis

- [Node.js](https://nodejs.org/) v18+
- npm ou yarn

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/ndampofouramichaelyves-source/PolyQuiz-projet-web
cd PolyQuiz-projet-web

# Installer les dépendances
npm install
```

### Lancer le projet

```bash
npm run dev
```

L'application est accessible sur `http://localhost:5173` (Vite)

---

## 🧩 Jalons implémentés

### Jalon 1 — Custom Hook `useFetch` 

Fichier : `src/hooks/useFetch.js`

Abstraction complète de la logique réseau. Le hook expose trois états :

| Valeur | Type | Description |
|--------|------|-------------|
| `data` | `any` | Données reçues depuis l'API |
| `loading` | `boolean` | Indicateur de chargement |
| `error` | `Error \| null` | Erreur éventuelle |

Les questions sont chargées depuis `/public/questions.json` — un tableau de ~10 questions avec les propriétés : `id`, `catégorie`, `libellé`, `options`, `bonne_réponse`.

---

### Jalon 2 — Context API `UserContext` 
Fichier : `src/context/UserContext.jsx`

Contexte global accessible depuis n'importe quel composant sans Props Drilling.

| État | Valeur par défaut | Description |
|------|-------------------|-------------|
| `pseudo` | `null` | Pseudonyme du joueur |
| `bestScore` | `0` | Meilleur score enregistré |

Le `<UserProvider>` enveloppe l'ensemble de l'application dans `main.jsx`.

---

### Jalon 3 — Protected Routes 

Fichier : `src/components/ProtectedRoute.jsx`

Les routes `/quiz` et `/resultats` sont sécurisées : tout accès sans pseudonyme déclenche une redirection automatique vers `/` via `<Navigate>` de React Router.

| Route | Protection |
|-------|------------|
| `/` | Publique — formulaire de connexion |
| `/quiz` | 🔒 Protégée par `<ProtectedRoute>` |
| `/resultats` | 🔒 Protégée par `<ProtectedRoute>` |

---

### Jalon 4 — Machine à états `useReducer` 
Fichier : `src/pages/QuizEngine.jsx`

L'état du quiz est géré par `quizReducer(state, action)` avec trois actions :

```
START_QUIZ       → Initialise le jeu
ANSWER_QUESTION  → Enregistre la réponse, calcule le score, passe à la suivante
FINISH_QUIZ      → Termine la partie et sauvegarde le score final
```

L'état interne contient : `currentIndex`, `selectedAnswers`, `status`, `score`.

---

### Jalon 5 — Performance (`useRef` & `useMemo`) 

**Chronomètre (`useRef`) — `QuizEngine.jsx`**  
Le `setInterval` du compte à rebours (60 secondes) est stocké dans une `ref` pour éviter les re-rendus inutiles. À zéro, `clearInterval` est appelé et l'action `FINISH_QUIZ` est dispatchée.

**Calcul mémoïsé (`useMemo`) — `Results.jsx`**  
Le ratio de bonnes réponses est calculé une seule fois via `useMemo`, même si la page subit des rafraîchissements (ex : changement de thème clair/sombre).

---

## 🛠️ Technologies utilisées

| Technologie | Usage |
|-------------|-------|
| React 18 | Framework UI |
| React Router v6 | Routage et protection des routes |
| Context API | État global (pseudo, score) |
| Vite | Bundler et serveur de développement |
| CSS / App.css | Styles globaux |

---

## 📐 Principes d'architecture respectés

- **Séparation des responsabilités** : logique réseau (`useFetch`), logique métier (`quizReducer`), rendu graphique (pages/composants)
- **Zéro Props Drilling** : toutes les données partagées transitent par le `UserContext`
- **Sécurité front-end** : aucune route sensible accessible sans authentification (pseudo)
- **Performance** : aucune fuite mémoire liée au timer, calculs coûteux mémoïsés



---

## 👤 Auteur (NDAM POFOURA YVES MICHAEL)

Projet réalisé   dans le cadre du deuxième  TP  REACT évalué .
