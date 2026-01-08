# Life Goals App - Guide Complet pour Debutants

## Introduction

Ce guide explique en detail le fonctionnement de l'application Life Goals et les concepts de programmation utilises, depuis les bases de React Native jusqu'a la gestion d'etat avec Redux.

---

## Table des matieres

**Partie 1 - Les bases de React Native**
1. [Qu'est-ce que React Native ?](#1-quest-ce-que-react-native-)
2. [Structure d'un projet React Native](#2-structure-dun-projet-react-native)
3. [Les composants : la base de React](#3-les-composants--la-base-de-react)
4. [L'etat (State) : la memoire de l'application](#4-letat-state--la-memoire-de-lapplication)
5. [Les Props : la communication entre composants](#5-les-props--la-communication-entre-composants)
6. [Les Hooks : useState et useEffect](#6-les-hooks--usestate-et-useeffect)
7. [Les fonctions de rappel (Callbacks)](#7-les-fonctions-de-rappel-callbacks)

**Partie 2 - Evolution du projet**
8. [Historique du projet Life Goals](#8-historique-du-projet-life-goals)
9. [Le probleme du state local](#9-le-probleme-du-state-local)

**Partie 3 - Redux**
10. [Introduction a Redux](#10-introduction-a-redux)
11. [Les concepts cles de Redux](#11-les-concepts-cles-de-redux)
12. [Redux Toolkit : la version moderne](#12-redux-toolkit--la-version-moderne)
13. [Migration vers Redux](#13-migration-vers-redux)
14. [Le flux Redux en detail](#14-le-flux-redux-en-detail)

**Annexes**
15. [Structure finale du projet](#15-structure-finale-du-projet)
16. [Glossaire](#16-glossaire)

---

# Partie 1 - Les bases de React Native

## 1. Qu'est-ce que React Native ?

### Explication simple

Imagine que tu veux construire une maison. Tu pourrais:
- Construire une maison en briques (Android natif avec Java/Kotlin)
- Construire une maison en bois (iOS natif avec Swift)
- Ou utiliser un systeme de construction universel qui s'adapte aux deux (React Native)

**React Native** est un framework qui permet d'ecrire du code une seule fois et de le faire fonctionner sur Android ET iOS.

### Comment ca marche ?

```
Tu ecris du code JavaScript
        │
        ▼
React Native le traduit
        │
        ▼
Application Android + Application iOS
```

---

## 2. Structure d'un projet React Native

```
life-goals-app/
│
├── App.js                 ← Le cerveau de l'application
│
├── src/                   ← Dossier source
│   ├── app/
│   │   └── store.js       ← Configuration Redux
│   ├── features/          ← Fonctionnalites (Redux)
│   │   ├── goals/
│   │   └── counter/
│   └── components/        ← Composants reutilisables
│
├── assets/                ← Les images
├── package.json           ← Liste des dependances
└── app.json               ← Configuration Expo
```

---

## 3. Les composants : la base de React

### Qu'est-ce qu'un composant ?

Un **composant** est un morceau d'interface reutilisable. C'est comme une brique LEGO : tu peux l'utiliser plusieurs fois et le combiner avec d'autres.

### Exemple simple

```javascript
// Un composant qui affiche un objectif
function GoalItem({ text }) {
  return (
    <View>
      <Text>{text}</Text>
    </View>
  );
}

// Utilisation
<GoalItem text="Apprendre React" />
<GoalItem text="Faire du sport" />
<GoalItem text="Lire un livre" />
```

### Deux types de composants

| Type | Description | Exemple |
|------|-------------|---------|
| **Presentationnel** | Affiche des donnees recues via props | GoalItem, AddModal |
| **Connecte** | Lit/modifie le state (Redux) | GoalsList, Counter |

---

## 4. L'etat (State) : la memoire de l'application

### Qu'est-ce que l'etat ?

L'**etat** (state) est la memoire de ton application. C'est la ou on stocke les donnees qui peuvent changer.

### Analogie : Un tableau blanc

- Le **state** = ce qui est ecrit sur le tableau
- Quand tu effaces et ecris autre chose = le state **change**
- Tous les eleves voient le nouveau contenu = l'interface **se met a jour**

### Avec useState (version simple)

```javascript
import { useState } from 'react';

function Compteur() {
  // Declare une variable "count" avec valeur initiale 0
  const [count, setCount] = useState(0);
  
  return (
    <View>
      <Text>Compteur : {count}</Text>
      <Button 
        title="+" 
        onPress={() => setCount(count + 1)} 
      />
    </View>
  );
}
```

### Probleme : le state local

Avec `useState`, le state est **local** au composant. Si plusieurs composants ont besoin des memes donnees, ca devient complique.

```
    ┌─────────────┐
    │    App      │  ← Doit stocker TOUT le state
    │  useState() │  ← Devient enorme!
    └──────┬──────┘
           │ props (on doit tout passer manuellement)
    ┌──────┴──────┐
    │  Component  │
    └──────┬──────┘
           │ props
    ┌──────┴──────┐
    │  Component  │  ← "Prop drilling" = cauchemar!
    └─────────────┘
```

C'est pour ca qu'on utilise **Redux** !

---

## 5. Les Props : la communication entre composants

### Qu'est-ce qu'une prop ?

Les **props** sont des donnees passees d'un parent a un enfant. C'est comme donner des instructions.

### Exemple

```javascript
// Parent envoie des props
<GoalItem 
  text="Apprendre React"
  done={false}
  onDelete={() => console.log('Supprimer')}
/>

// Enfant recoit les props
function GoalItem({ text, done, onDelete }) {
  return (
    <View>
      <Text>{text}</Text>
      <Button title="X" onPress={onDelete} />
    </View>
  );
}
```

### Difference State vs Props

| State | Props |
|-------|-------|
| Memoire interne | Donnees recues |
| Peut etre modifie | Lecture seule |
| `useState()` | Attributs du composant |

---

## 6. Les Hooks : useState et useEffect

### useState : gerer l'etat local

```javascript
const [valeur, setValeur] = useState(valeurInitiale);
```

### useEffect : reagir aux changements

```javascript
// Execute quand "visible" change
useEffect(() => {
  if (visible) {
    console.log('Modal ouverte!');
  }
}, [visible]);  // ← Dependances
```

### useSelector et useDispatch (Redux)

```javascript
// Lire le state Redux
const goals = useSelector(state => state.goals.items);

// Modifier le state Redux
const dispatch = useDispatch();
dispatch(addGoal({ text: 'Nouveau' }));
```

---

## 7. Les fonctions de rappel (Callbacks)

### Principe

Un **callback** est une fonction passee en parametre pour etre executee plus tard.

```javascript
// Parent definit le callback
const handleDelete = (id) => {
  dispatch(deleteGoal(id));
};

// Parent passe le callback
<GoalItem onDelete={handleDelete} />

// Enfant appelle le callback
<Button onPress={() => onDelete(goal.id)} />
```

---

# Partie 2 - Evolution du projet

## 8. Historique du projet Life Goals

### v1.0 - Version initiale

```javascript
// App.js avec useState simple
function App() {
  const [goals, setGoals] = useState([]);
  
  const addGoal = (text) => {
    setGoals([...goals, { id: Date.now(), text }]);
  };
  
  return (
    <View>
      {goals.map(goal => <GoalItem key={goal.id} text={goal.text} />)}
    </View>
  );
}
```

**Fonctionnalites:** Ajouter, modifier, supprimer des objectifs.

### v2.0 - Objectifs hierarchiques

Ajout des sous-objectifs avec `parentId`:

```javascript
const goals = [
  { id: '1', text: 'Devenir freelance', done: false, parentId: null },
  { id: '1-1', text: 'Creer portfolio', done: false, parentId: '1' },
  { id: '1-2', text: 'Trouver clients', done: false, parentId: '1' },
];
```

**Nouvelles fonctionnalites:**
- Sous-objectifs illimites
- Auto-completion des parents
- Cascade undo/delete

### v3.0 - Introduction de Redux (Counter)

Ajout d'un compteur utilisant Redux pour demontrer le concept.

### v4.0 - 100% Redux

Migration complete : Goals + Counter utilisent Redux.

---

## 9. Le probleme du state local

### Avant Redux : useState partout

```javascript
function App() {
  // Tout le state dans App.js
  const [goals, setGoals] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [inputText, setInputText] = useState('');
  // ... encore plus de state!
  
  // Tous les handlers aussi
  const addGoalHandler = () => { /* ... */ };
  const deleteGoalHandler = () => { /* ... */ };
  // ... encore plus de handlers!
  
  // Passer TOUT aux enfants via props
  return (
    <GoalsList 
      goals={goals}
      onAdd={addGoalHandler}
      onDelete={deleteGoalHandler}
      // ... 10 autres props!
    />
  );
}
```

### Problemes

1. **App.js devient enorme** - Tout le state et la logique concentres
2. **Prop drilling** - Passer des props a travers plusieurs niveaux
3. **Difficile a maintenir** - Un changement impacte tout
4. **Pas de separation** - UI et logique melanges

### Solution : Redux

```javascript
// Avec Redux, chaque composant accede directement au state
function GoalsList() {
  const goals = useSelector(state => state.goals.items);
  const dispatch = useDispatch();
  
  return (
    <FlatList
      data={goals}
      renderItem={({ item }) => (
        <GoalItem 
          goal={item}
          onDelete={() => dispatch(deleteGoal(item.id))}
        />
      )}
    />
  );
}
```

---

# Partie 3 - Redux

## 10. Introduction a Redux

### Qu'est-ce que Redux ?

**Redux** est une bibliotheque de gestion d'etat. Au lieu d'avoir le state eparpille dans les composants, tout est centralise dans un **store**.

### Analogie : La banque

| Sans Redux | Avec Redux |
|------------|------------|
| Chacun garde son argent chez soi | Tout l'argent est a la banque |
| Difficile de savoir qui a quoi | Un seul endroit = clarte |
| Transferts compliques | Transactions centralisees |

### Schema global

```
┌─────────────────────────────────────────────────────────────┐
│                         REDUX                                │
│                                                              │
│   ┌─────────┐    dispatch    ┌──────────┐    update         │
│   │ ACTION  │ ──────────────►│ REDUCER  │ ──────────┐       │
│   └─────────┘                └──────────┘           │       │
│        ▲                                            ▼       │
│        │                                      ┌─────────┐   │
│        │                                      │  STORE  │   │
│        │                                      │ (state) │   │
│        │                                      └────┬────┘   │
│        │                          useSelector      │        │
│        │         ┌─────────────────────────────────┘        │
│        │         │                                          │
│        │         ▼                                          │
│   ┌────┴─────────────┐                                      │
│   │    COMPONENT     │                                      │
│   │   (React UI)     │                                      │
│   └──────────────────┘                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. Les concepts cles de Redux

### 1. Store

Le **store** est le conteneur unique qui detient tout l'etat de l'application.

```javascript
// Structure du store
{
  counter: { value: 0 },
  goals: {
    items: [...],
    addModalVisible: false,
    editingGoal: null,
    // ...
  }
}
```

### 2. Actions

Les **actions** sont des objets qui decrivent ce qui s'est passe.

```javascript
// Action simple
{ type: 'counter/increment' }

// Action avec donnees (payload)
{ type: 'goals/addGoal', payload: { text: 'Nouveau', parentId: null } }
```

### 3. Reducers

Les **reducers** sont des fonctions qui prennent le state actuel + une action, et retournent le nouveau state.

```javascript
function counterReducer(state = { value: 0 }, action) {
  switch (action.type) {
    case 'counter/increment':
      return { ...state, value: state.value + 1 };
    case 'counter/decrement':
      return { ...state, value: state.value - 1 };
    default:
      return state;
  }
}
```

### 4. Dispatch

**dispatch** est la fonction qui envoie une action au store.

```javascript
dispatch({ type: 'counter/increment' });
// ou avec un action creator
dispatch(increment());
```

### 5. Selectors

Les **selecteurs** sont des fonctions qui extraient des donnees du state.

```javascript
const selectCount = (state) => state.counter.value;
const selectAllGoals = (state) => state.goals.items;

// Utilisation
const count = useSelector(selectCount);
```

### Resume visuel

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  1. USER CLIQUE          2. DISPATCH ACTION                  │
│     sur "+"      ───────►  increment()                       │
│                                   │                          │
│                                   ▼                          │
│                          3. REDUCER EXECUTE                  │
│                             state.value += 1                 │
│                                   │                          │
│                                   ▼                          │
│                          4. STORE MIS A JOUR                 │
│                             { value: 1 }                     │
│                                   │                          │
│                                   ▼                          │
│                          5. COMPOSANT RE-REND                │
│  6. UI AFFICHE "1"  ◄─────  useSelector detecte              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 12. Redux Toolkit : la version moderne

### Pourquoi Redux Toolkit ?

Redux "classique" necessite beaucoup de code repetitif. **Redux Toolkit** simplifie tout.

| Redux classique | Redux Toolkit |
|-----------------|---------------|
| Beaucoup de boilerplate | Code minimal |
| Actions a creer manuellement | Actions generees automatiquement |
| Immutabilite manuelle | Immer integre (mutation OK) |
| Configuration complexe | configureStore() simple |

### createSlice : la magie

Un **slice** regroupe state + actions + reducer pour une fonctionnalite.

```javascript
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      // Grace a Immer, on peut "muter" directement
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Actions generees automatiquement
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Reducer a ajouter au store
export default counterSlice.reducer;
```

### configureStore : configuration simple

```javascript
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import goalsReducer from './goalsSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    goals: goalsReducer,
  },
});
```

### Provider : connecter React a Redux

```javascript
import { Provider } from 'react-redux';
import { store } from './store';

export default function App() {
  return (
    <Provider store={store}>
      <MonApplication />
    </Provider>
  );
}
```

---

## 13. Migration vers Redux

### Etape 1 : Creer le slice

```javascript
// src/features/goals/goalsSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  addModalVisible: false,
  // ... autres etats
};

export const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state, action) => {
      state.items.push({
        id: String(Date.now()),
        text: action.payload.text,
        done: false,
        parentId: action.payload.parentId || null,
      });
      state.addModalVisible = false;
    },
    deleteGoal: (state, action) => {
      const id = action.payload;
      // Supprimer le goal et ses enfants
      const idsToDelete = getIdsToDelete(state.items, id);
      state.items = state.items.filter(g => !idsToDelete.includes(g.id));
    },
    // ... autres reducers
  },
});

export const { addGoal, deleteGoal } = goalsSlice.actions;
export default goalsSlice.reducer;
```

### Etape 2 : Configurer le store

```javascript
// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import goalsReducer from '../features/goals/goalsSlice';

export const store = configureStore({
  reducer: {
    goals: goalsReducer,
  },
});
```

### Etape 3 : Ajouter le Provider

```javascript
// App.js

import { Provider } from 'react-redux';
import { store } from './src/app/store';

export default function App() {
  return (
    <Provider store={store}>
      <GoalsList />
    </Provider>
  );
}
```

### Etape 4 : Connecter le composant

```javascript
// AVANT (useState)
function GoalsList() {
  const [goals, setGoals] = useState([]);
  
  const handleAdd = (text) => {
    setGoals([...goals, { id: Date.now(), text }]);
  };
}

// APRES (Redux)
function GoalsList() {
  const goals = useSelector(state => state.goals.items);
  const dispatch = useDispatch();
  
  const handleAdd = (text) => {
    dispatch(addGoal({ text }));
  };
}
```

### Comparaison avant/apres

| Avant (useState) | Apres (Redux) |
|------------------|---------------|
| State dans App.js | State dans store.js |
| `setGoals([...])` | `dispatch(addGoal())` |
| Props drilling | `useSelector` direct |
| Logique melangee | Logique dans slice |

---

## 14. Le flux Redux en detail

### Exemple : Ajouter un objectif

```
┌────────────────────────────────────────────────────────────────┐
│ 1. USER TAPE "Apprendre Redux" et clique AJOUTER               │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ 2. COMPOSANT appelle dispatch                                   │
│                                                                 │
│    dispatch(addGoal({ text: 'Apprendre Redux', parentId: null }))
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ 3. ACTION creee                                                 │
│                                                                 │
│    {                                                            │
│      type: 'goals/addGoal',                                     │
│      payload: { text: 'Apprendre Redux', parentId: null }       │
│    }                                                            │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ 4. REDUCER execute                                              │
│                                                                 │
│    addGoal: (state, action) => {                                │
│      state.items.push({                                         │
│        id: '1704720000000',                                     │
│        text: 'Apprendre Redux',                                 │
│        done: false,                                             │
│        parentId: null                                           │
│      });                                                        │
│      state.addModalVisible = false;                             │
│    }                                                            │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ 5. STORE mis a jour                                             │
│                                                                 │
│    {                                                            │
│      goals: {                                                   │
│        items: [                                                 │
│          { id: '1704720000000', text: 'Apprendre Redux', ... }  │
│        ],                                                       │
│        addModalVisible: false                                   │
│      }                                                          │
│    }                                                            │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ 6. useSelector DETECTE le changement                            │
│                                                                 │
│    const goals = useSelector(state => state.goals.items);       │
│    // goals a change! React re-rend le composant                │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ 7. UI AFFICHE le nouvel objectif                                │
│                                                                 │
│    ┌─────────────────────────────────────┐                      │
│    │  ✓ Apprendre Redux              🗑  │                      │
│    └─────────────────────────────────────┘                      │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

# Annexes

## 15. Structure finale du projet

```
life-goals-app/
├── App.js                              # Provider Redux
│
├── src/
│   ├── app/
│   │   └── store.js                    # configureStore
│   │
│   ├── features/
│   │   ├── counter/
│   │   │   ├── Counter.js              # UI (useSelector/useDispatch)
│   │   │   └── counterSlice.js         # State + Actions
│   │   │
│   │   └── goals/
│   │       ├── GoalsList.js            # UI (useSelector/useDispatch)
│   │       └── goalsSlice.js           # State + Actions
│   │
│   └── components/                     # Composants presentationnels
│       ├── GoalItem.js
│       ├── GoalInput.js
│       ├── AddModal.js
│       ├── EditModal.js
│       └── CompletedGoals.js
│
├── assets/
├── package.json
└── app.json
```

### Separation des responsabilites

| Dossier | Role | Redux? |
|---------|------|--------|
| `src/app/` | Configuration store | Oui |
| `src/features/` | Logique metier + UI connectee | Oui |
| `src/components/` | UI pure (recoit props) | Non |

---

## 16. Glossaire

| Terme | Definition |
|-------|------------|
| **Action** | Objet decrivant un evenement { type, payload } |
| **Reducer** | Fonction (state, action) => newState |
| **Store** | Conteneur central du state |
| **Dispatch** | Fonction pour envoyer une action |
| **Selector** | Fonction pour extraire des donnees du state |
| **Slice** | Regroupement state + reducers + actions |
| **Provider** | Composant qui rend le store accessible |
| **useSelector** | Hook pour lire le state |
| **useDispatch** | Hook pour obtenir dispatch |
| **Immer** | Librairie permettant les "mutations" |
| **Payload** | Donnees transportees par une action |
| **Middleware** | Code execute entre dispatch et reducer |
| **Thunk** | Action asynchrone (API calls, etc.) |

---

## Resume des concepts

### Les 3 principes de Redux

1. **Source unique de verite** - Un seul store pour tout le state
2. **State en lecture seule** - On ne modifie jamais directement, on dispatch des actions
3. **Changements via fonctions pures** - Les reducers sont des fonctions pures

### Quand utiliser Redux ?

| Situation | useState | Redux |
|-----------|----------|-------|
| State local simple | ✅ | ❌ |
| Formulaire | ✅ | ❌ |
| Toggle UI | ✅ | ❌ |
| State partage entre composants | ❌ | ✅ |
| State complexe/imbrique | ❌ | ✅ |
| Application moyenne/grande | ❌ | ✅ |

### Ce que tu as appris

- Les bases de React Native (composants, props, state)
- Les hooks useState, useEffect, useSelector, useDispatch
- L'architecture Redux (store, actions, reducers)
- Redux Toolkit (createSlice, configureStore)
- La migration d'une app useState vers Redux
- La separation composants connectes vs presentationnels

---

## Pour aller plus loin

### Ressources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Redux Documentation](https://react-redux.js.org/)
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)

### Exercices suggeres

1. Ajouter une fonctionnalite de recherche (nouveau slice?)
2. Persister le state avec AsyncStorage
3. Ajouter des categories aux objectifs
4. Implementer un historique (undo/redo global)
5. Ajouter des notifications avec createAsyncThunk