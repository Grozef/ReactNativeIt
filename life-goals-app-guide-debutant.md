# Life Goals App - Guide Complet pour Debutants

## Introduction

Ce guide explique en detail le fonctionnement de l'application Life Goals et les concepts de programmation utilises. Il est destine aux personnes qui debutent en React Native.

---

## Table des matieres

1. [Qu'est-ce que React Native ?](#1-quest-ce-que-react-native-)
2. [Structure d'un projet React Native](#2-structure-dun-projet-react-native)
3. [Les composants : la base de React](#3-les-composants--la-base-de-react)
4. [L'etat (State) : la memoire de l'application](#4-letat-state--la-memoire-de-lapplication)
5. [Les Props : la communication entre composants](#5-les-props--la-communication-entre-composants)
6. [Le flux de donnees unidirectionnel](#6-le-flux-de-donnees-unidirectionnel)
7. [Les Hooks : useState et useEffect](#7-les-hooks--usestate-et-useeffect)
8. [La recursivite : afficher une hierarchie](#8-la-recursivite--afficher-une-hierarchie)
9. [Les fonctions de rappel (Callbacks)](#9-les-fonctions-de-rappel-callbacks)
10. [Les styles en React Native](#10-les-styles-en-react-native)
11. [Architecture de l'application](#11-architecture-de-lapplication)
12. [Glossaire](#12-glossaire)

---

## 1. Qu'est-ce que React Native ?

### Explication simple

Imagine que tu veux construire une maison. Tu pourrais:
- Construire une maison en briques (Android natif)
- Construire une maison en bois (iOS natif)
- Ou utiliser un systeme de construction universel qui s'adapte aux deux (React Native)

**React Native** est un framework (un ensemble d'outils) qui permet d'ecrire du code une seule fois et de le faire fonctionner sur Android ET iOS.

### Comment ca marche ?

```
Tu ecris du code JavaScript
        ↓
React Native le traduit
        ↓
Application Android + Application iOS
```

### Pourquoi React Native ?

| Avantage | Explication |
|----------|-------------|
| Un seul code | Pas besoin d'apprendre Java/Kotlin ET Swift |
| Rapide | Les modifications s'affichent instantanement |
| Grande communaute | Beaucoup d'aide disponible en ligne |
| Reutilisable | Le meme code pour mobile et web |

---

## 2. Structure d'un projet React Native

### Les fichiers de notre projet

```
life-goals-app/
│
├── App.js                 ← Le cerveau de l'application
│
├── components/            ← Les "pieces" reutilisables
│   ├── GoalItem.js        ← Affiche UN objectif
│   ├── GoalInput.js       ← La barre de saisie en haut
│   ├── AddModal.js        ← La fenetre popup pour ajouter
│   ├── EditModal.js       ← La fenetre popup pour modifier
│   └── CompletedGoals.js  ← La liste des objectifs termines
│
├── assets/                ← Les images
│   ├── background.png
│   └── icon.png
│
├── package.json           ← La liste des "ingredients" (bibliotheques)
└── app.json               ← La configuration de l'app
```

### Analogie : Une pizzeria

Pense a l'application comme une pizzeria:

| Element | Equivalent dans l'app |
|---------|----------------------|
| Le chef (qui coordonne tout) | `App.js` |
| La recette de la pate | `GoalItem.js` |
| Le comptoir de commande | `GoalInput.js` |
| Le menu | `AddModal.js` |
| La liste des ingredients | `package.json` |

---

## 3. Les composants : la base de React

### Qu'est-ce qu'un composant ?

Un **composant** est un morceau d'interface reutilisable. C'est comme une brique LEGO : tu peux l'utiliser plusieurs fois et le combiner avec d'autres briques.

### Exemple simple

```javascript
// Un composant qui affiche "Bonjour"
function Salutation() {
  return <Text>Bonjour !</Text>;
}
```

### Exemple dans notre app : GoalItem

```javascript
function GoalItem({ goal }) {
  return (
    <View>
      <Text>{goal.text}</Text>
      <Button title="Supprimer" />
    </View>
  );
}
```

Ce composant affiche UN objectif. Si tu as 10 objectifs, React cree 10 instances de ce composant.

### Les composants de notre application

```
App.js (parent principal)
│
├── GoalInput (barre de saisie)
│
├── GoalItem (objectif 1)
│   └── GoalItem (sous-objectif 1.1)
│   └── GoalItem (sous-objectif 1.2)
│
├── GoalItem (objectif 2)
│
├── AddModal (popup ajout)
├── EditModal (popup edition)
└── CompletedGoals (popup objectifs termines)
```

### Pourquoi utiliser des composants ?

1. **Reutilisabilite** : GoalItem est utilise pour CHAQUE objectif
2. **Lisibilite** : Le code est organise en petits morceaux
3. **Maintenance** : Modifier GoalItem modifie TOUS les objectifs

---

## 4. L'etat (State) : la memoire de l'application

### Qu'est-ce que l'etat ?

L'**etat** (state) est la memoire de ton application. C'est la ou on stocke les donnees qui peuvent changer.

### Analogie : Un tableau blanc

Imagine un tableau blanc dans une salle de classe:
- Le **state**, c'est ce qui est ecrit sur le tableau
- Quand le prof efface et ecrit autre chose, le tableau **change**
- Tous les eleves voient le **nouveau contenu** (l'interface se met a jour)

### Comment declarer un etat ?

```javascript
// useState retourne : [valeur actuelle, fonction pour modifier]
const [goals, setGoals] = useState([]);
//      ^        ^
//      |        └── Fonction pour modifier
//      └── Valeur actuelle (tableau vide au depart)
```

### Les etats dans App.js

```javascript
// Liste des objectifs
const [goals, setGoals] = useState([...]);

// La modal d'ajout est-elle visible ?
const [addModalVisible, setAddModalVisible] = useState(false);

// Quel objectif est en cours d'edition ?
const [editingGoal, setEditingGoal] = useState(null);

// Texte saisi dans l'input
const [inputText, setInputText] = useState('');
```

### Regles importantes du state

1. **Ne jamais modifier directement** :
```javascript
// MAUVAIS - Ne fais jamais ca !
goals.push(newGoal);

// BON - Utilise la fonction setGoals
setGoals([...goals, newGoal]);
```

2. **Les changements declenchent un re-rendu** :
```javascript
setAddModalVisible(true);  // React re-affiche l'interface avec la modal
```

---

## 5. Les Props : la communication entre composants

### Qu'est-ce qu'une prop ?

Les **props** (proprietes) sont des donnees passees d'un composant parent a un composant enfant. C'est comme donner des instructions a quelqu'un.

### Analogie : Une commande au restaurant

```
Client (Parent)                    Serveur (Enfant)
     │                                  │
     │  "Une pizza margherita"          │
     │  ─────────────────────────────►  │
     │        (c'est une PROP)          │
     │                                  │
```

### Exemple simple

```javascript
// Parent envoie une prop "text"
<GoalItem text="Apprendre React" />

// Enfant recoit la prop
function GoalItem({ text }) {
  return <Text>{text}</Text>;
}
```

### Les props dans notre application

```javascript
// App.js envoie des props a GoalItem
<GoalItem
  goal={item}                    // L'objectif a afficher
  children={getChildren(item.id)} // Ses sous-objectifs
  onDelete={deleteGoalHandler}   // Fonction a appeler pour supprimer
  onDone={doneGoalHandler}       // Fonction a appeler pour terminer
/>
```

### Difference entre State et Props

| State | Props |
|-------|-------|
| Memoire interne du composant | Donnees recues de l'exterieur |
| Peut etre modifie par le composant | Ne peut PAS etre modifie par l'enfant |
| Declare avec useState | Passe comme attribut |

### Schema visuel

```
    App.js (possede le state "goals")
       │
       │ props: goal, onDelete, onDone
       ▼
    GoalItem (recoit et affiche)
       │
       │ props: goal, onDelete, onDone
       ▼
    GoalItem (sous-objectif, recursif)
```

---

## 6. Le flux de donnees unidirectionnel

### Le principe fondamental

En React, les donnees circulent **toujours du haut vers le bas** (du parent vers les enfants). C'est le **flux unidirectionnel**.

### Pourquoi ?

Imagine un arbre genealogique:
- Les parents peuvent donner de l'argent aux enfants (props)
- Les enfants ne peuvent pas prendre l'argent des parents directement
- Mais les enfants peuvent **demander** aux parents (callbacks)

### Comment un enfant "modifie" les donnees du parent ?

Via des **fonctions de rappel** (callbacks) :

```javascript
// 1. Le parent definit une fonction
const deleteGoalHandler = (id) => {
  setGoals(goals.filter(goal => goal.id !== id));
};

// 2. Le parent passe cette fonction a l'enfant
<GoalItem onDelete={deleteGoalHandler} />

// 3. L'enfant appelle cette fonction quand necessaire
function GoalItem({ id, onDelete }) {
  return (
    <Pressable onPress={() => onDelete(id)}>
      <Text>Supprimer</Text>
    </Pressable>
  );
}
```

### Schema du flux

```
                    App.js
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
     GoalItem     GoalItem     GoalItem
         │
    ┌────┴────┐
    │         │
    ▼         ▼
GoalItem   GoalItem
(enfants)  (enfants)

DONNEES : De haut en bas (props) ────────────►
ACTIONS : De bas en haut (callbacks) ◄────────
```

---

## 7. Les Hooks : useState et useEffect

### Qu'est-ce qu'un Hook ?

Les **Hooks** sont des fonctions speciales de React qui permettent d'ajouter des fonctionnalites aux composants. Ils commencent toujours par "use".

### useState : gerer l'etat

```javascript
import { useState } from 'react';

function Compteur() {
  // Declare une variable "count" avec valeur initiale 0
  const [count, setCount] = useState(0);
  
  return (
    <View>
      <Text>Compteur : {count}</Text>
      <Button 
        title="Incrementer" 
        onPress={() => setCount(count + 1)} 
      />
    </View>
  );
}
```

### useEffect : reagir aux changements

**useEffect** execute du code quand quelque chose change.

```javascript
import { useEffect } from 'react';

// Execute quand "visible" change
useEffect(() => {
  if (visible) {
    setEnteredGoal(initialText);  // Pre-remplir le champ
  }
}, [visible, initialText]);  // ← Dependances : quand surveiller ?
```

### Analogie : Le reveil

- **useState** = L'heure affichee sur le reveil
- **useEffect** = L'alarme qui se declenche quand une condition est remplie

### Les dependances de useEffect

```javascript
// Execute UNE SEULE FOIS au demarrage
useEffect(() => { ... }, []);

// Execute A CHAQUE changement de "visible"
useEffect(() => { ... }, [visible]);

// Execute A CHAQUE rendu (rarement souhaite)
useEffect(() => { ... });
```

---

## 8. La recursivite : afficher une hierarchie

### Qu'est-ce que la recursivite ?

La **recursivite**, c'est quand une fonction s'appelle elle-meme. Dans notre app, un composant GoalItem peut contenir d'autres GoalItem.

### Analogie : Les poupees russes

```
┌─────────────────────────────┐
│  Grande poupee (parent)     │
│  ┌───────────────────────┐  │
│  │  Moyenne (enfant)     │  │
│  │  ┌─────────────────┐  │  │
│  │  │  Petite (enfant)│  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

### Comment ca marche dans notre app ?

```javascript
function GoalItem({ goal, children, getChildren }) {
  return (
    <View>
      {/* Affiche l'objectif actuel */}
      <Text>{goal.text}</Text>
      
      {/* Si a des enfants, affiche chaque enfant */}
      {children.map((child) => (
        <GoalItem                          // ← GoalItem dans GoalItem !
          key={child.id}
          goal={child}
          children={getChildren(child.id)} // ← Recupere les enfants de l'enfant
          getChildren={getChildren}
        />
      ))}
    </View>
  );
}
```

### Visualisation

```
Donnees :
{ id: '1', text: 'Devenir freelance', parentId: null }
  { id: '1-1', text: 'Creer portfolio', parentId: '1' }
  { id: '1-2', text: 'Trouver clients', parentId: '1' }
    { id: '1-2-1', text: 'Client 1', parentId: '1-2' }

Affichage :
├── Devenir freelance
│   ├── Creer portfolio
│   └── Trouver clients
│       └── Client 1
```

### La condition d'arret

Toute recursivite doit avoir une **condition d'arret** pour ne pas boucler indefiniment :

```javascript
// Si pas d'enfants, on ne rappelle pas GoalItem
if (children.length === 0) {
  return <Text>{goal.text}</Text>;  // Arret de la recursion
}
```

---

## 9. Les fonctions de rappel (Callbacks)

### Qu'est-ce qu'un callback ?

Un **callback** est une fonction passee en parametre a une autre fonction, pour etre executee plus tard.

### Analogie : Le numero de rappel

Quand tu appelles un service client et qu'ils disent "on vous rappelle", tu donnes ton numero (le callback). Ils l'utiliseront quand ils seront prets.

### Exemple simple

```javascript
// La fonction "onPress" est un callback
<Pressable onPress={() => console.log('Clique !')}>
  <Text>Clique moi</Text>
</Pressable>
```

### Dans notre application

```javascript
// App.js definit les callbacks
const deleteGoalHandler = (id) => {
  setGoals(goals.filter(g => g.id !== id));
};

const doneGoalHandler = (id) => {
  setGoals(goals.map(g => 
    g.id === id ? { ...g, done: true } : g
  ));
};

// App.js les passe aux enfants
<GoalItem
  onDelete={deleteGoalHandler}  // Callback pour supprimer
  onDone={doneGoalHandler}      // Callback pour terminer
/>

// GoalItem les appelle quand l'utilisateur clique
<Pressable onPress={() => onDelete(goal.id)}>
  <Text>Supprimer</Text>
</Pressable>
```

### Pourquoi utiliser des callbacks ?

1. **Separation des responsabilites** : GoalItem affiche, App.js gere les donnees
2. **Reutilisabilite** : GoalItem peut etre utilise avec differentes actions
3. **Flux unidirectionnel** : Les donnees montent via callbacks, descendent via props

---

## 10. Les styles en React Native

### Difference avec le CSS web

En React Native, on n'utilise pas de fichiers CSS. On utilise des objets JavaScript avec `StyleSheet`.

### Syntaxe de base

```javascript
import { StyleSheet, View, Text } from 'react-native';

function MonComposant() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bonjour</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    padding: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
```

### Differences avec CSS

| CSS Web | React Native |
|---------|--------------|
| `background-color` | `backgroundColor` |
| `font-size: 20px` | `fontSize: 20` |
| `margin-top` | `marginTop` |
| Classes `.ma-classe` | Objets `styles.maClasse` |

### Styles conditionnels

```javascript
<View style={[
  styles.goalItem,                    // Style de base
  goal.done && styles.goalItemDone,   // Si done, ajoute ce style
  hasChildren && styles.goalItemParent // Si parent, ajoute ce style
]}>
```

### Flexbox : le systeme de mise en page

React Native utilise **Flexbox** pour positionner les elements :

```javascript
container: {
  flexDirection: 'row',      // Elements cote a cote (horizontal)
  // flexDirection: 'column' // Elements empiles (vertical, par defaut)
  
  justifyContent: 'space-between', // Espace entre les elements
  alignItems: 'center',            // Centre verticalement
  
  flex: 1,  // Prend tout l'espace disponible
}
```

### Schema Flexbox

```
flexDirection: 'row'
┌─────────────────────────────────┐
│ [Element 1] [Element 2] [Element 3] │
└─────────────────────────────────┘

flexDirection: 'column'
┌─────────────────────────────────┐
│ [Element 1]                     │
│ [Element 2]                     │
│ [Element 3]                     │
└─────────────────────────────────┘
```

---

## 11. Architecture de l'application

### Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                         App.js                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    STATE (Donnees)                       │ │
│  │  - goals: [{id, text, done, parentId}, ...]             │ │
│  │  - addModalVisible: true/false                           │ │
│  │  - inputText: "..."                                      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 HANDLERS (Actions)                       │ │
│  │  - addGoalHandler()                                      │ │
│  │  - deleteGoalHandler()                                   │ │
│  │  - doneGoalHandler()                                     │ │
│  │  - undoGoalHandler()                                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 FONCTIONS UTILITAIRES                    │ │
│  │  - getChildren(parentId)                                 │ │
│  │  - isEffectivelyDone(goal)                               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│                    ↓ PROPS ↓        ↑ CALLBACKS ↑           │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │GoalInput │  │ GoalItem │  │ AddModal │  │EditModal │     │
│  └──────────┘  └────┬─────┘  └──────────┘  └──────────┘     │
│                     │                                        │
│                ┌────┴────┐                                   │
│                │GoalItem │ (recursif)                        │
│                └─────────┘                                   │
└─────────────────────────────────────────────────────────────┘
```

### Le cycle de vie d'une action

Exemple : L'utilisateur marque un objectif comme termine

```
1. Utilisateur clique sur ✓
         │
         ▼
2. GoalItem appelle onDone(goal.id)
         │
         ▼
3. App.js recoit l'appel dans doneGoalHandler
         │
         ▼
4. doneGoalHandler appelle setGoals(...)
         │
         ▼
5. React detecte le changement de state
         │
         ▼
6. React re-rend tous les composants concernes
         │
         ▼
7. L'interface affiche l'objectif comme termine
         │
         ▼
8. Animation confetti !
```

### La structure des donnees

```javascript
// Un objectif simple
{
  id: '1',
  text: 'Apprendre React',
  done: false,
  parentId: null        // null = objectif racine
}

// Un sous-objectif
{
  id: '1-1',
  text: 'Lire la documentation',
  done: true,
  parentId: '1'         // Reference vers le parent
}
```

### Comment la hierarchie fonctionne

```javascript
// 1. Recuperer les enfants d'un objectif
const getChildren = (parentId) => {
  return goals.filter(goal => goal.parentId === parentId);
};

// 2. Verifier si un objectif est effectivement termine
const isEffectivelyDone = (goal) => {
  const children = getChildren(goal.id);
  
  // Pas d'enfants ? Retourne le statut done
  if (children.length === 0) {
    return goal.done;
  }
  
  // A des enfants ? Tous doivent etre done ET le parent aussi
  return goal.done && children.every(child => isEffectivelyDone(child));
};
```

---

## 12. Glossaire

| Terme | Definition |
|-------|------------|
| **Composant** | Morceau d'interface reutilisable (fonction qui retourne du JSX) |
| **State** | Donnees internes d'un composant qui peuvent changer |
| **Props** | Donnees passees d'un parent a un enfant |
| **Hook** | Fonction speciale React (useState, useEffect...) |
| **Callback** | Fonction passee en parametre pour etre appelee plus tard |
| **JSX** | Syntaxe qui ressemble a du HTML mais c'est du JavaScript |
| **Render** | Processus de conversion du code en interface visible |
| **Re-render** | Nouveau rendu declenche par un changement de state |
| **Recursivite** | Quand une fonction/composant s'appelle elle-meme |
| **Flux unidirectionnel** | Les donnees vont toujours du parent vers l'enfant |
| **Expo** | Outil qui simplifie le developpement React Native |
| **StyleSheet** | Objet pour definir les styles en React Native |
| **Flexbox** | Systeme de mise en page pour positionner les elements |
| **Modal** | Fenetre popup qui s'affiche par-dessus le contenu |
| **FlatList** | Composant pour afficher des listes longues efficacement |
| **Pressable** | Composant qui detecte les clics/touchers |

---

## Resume des concepts cles

### Les 5 regles d'or de React

1. **Un seul sens** : Les donnees vont du parent vers les enfants
2. **State immutable** : Ne modifie jamais le state directement, utilise le setter
3. **Composants purs** : Un composant avec les memes props affiche la meme chose
4. **Callbacks pour remonter** : Utilise des callbacks pour communiquer vers le parent
5. **Separation des responsabilites** : Chaque composant a UN role

### Ce que tu as appris

- Creer des composants reutilisables
- Gerer l'etat avec useState
- Passer des donnees avec les props
- Reagir aux changements avec useEffect
- Afficher des hierarchies avec la recursivite
- Styliser une application mobile
- Organiser le code de maniere maintenable

---

## Pour aller plus loin

### Ressources recommandees

1. **Documentation React** : https://react.dev
2. **Documentation React Native** : https://reactnative.dev
3. **Documentation Expo** : https://docs.expo.dev

### Exercices suggeres

1. Ajouter une fonctionnalite de recherche/filtre
2. Sauvegarder les objectifs dans le stockage local
3. Ajouter des dates d'echeance aux objectifs
4. Ajouter des categories/tags aux objectifs
5. Ajouter des notifications de rappel