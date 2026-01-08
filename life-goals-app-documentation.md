# Life Goals App

## Documentation Technique

---

## Presentation

Life Goals App est une application mobile React Native / Expo permettant de gerer ses objectifs de vie de maniere hierarchique. L'application offre une interface moderne avec un theme sombre et permet d'ajouter, modifier, supprimer et marquer comme accomplis ses objectifs personnels et leurs sous-objectifs.

---

## Technologies utilisees

- React Native 0.76.3
- Expo SDK 52
- React 18.3.1
- react-native-confetti-cannon (animations)
- react-native-web (support web)

---

## Structure du projet

```
life-goals-app/
├── App.js                    # Composant principal, gestion de l'etat global
├── app.json                  # Configuration Expo
├── package.json              # Dependances
├── babel.config.js           # Configuration Babel
├── components/
│   ├── GoalItem.js           # Affichage d'un objectif avec sous-objectifs
│   ├── GoalInput.js          # Barre de saisie et bouton d'ajout
│   ├── AddModal.js           # Modal d'ajout d'objectif/sous-objectif
│   ├── EditModal.js          # Modal d'edition d'objectif
│   └── CompletedGoals.js     # Modal des objectifs accomplis
└── assets/
    ├── background.png        # Image de fond
    ├── icon.png              # Icone de l'app
    └── splash.png            # Ecran de demarrage
```

---

## Fonctionnalites

### Gestion des objectifs

- **Ajout** : Via le bouton 'Add' qui ouvre une modal de saisie
- **Edition** : Clic sur le texte de l'objectif pour modifier
- **Suppression** : Bouton X rouge a droite de chaque objectif
- **Completion** : Bouton coche verte pour marquer comme accompli

### Objectifs hierarchiques (v2.0)

- **Sous-objectifs** : Bouton "+" bleu pour ajouter un sous-objectif a n'importe quel objectif
- **Affichage hierarchique** : Les sous-objectifs sont indentes sous leur parent
- **Expand/Collapse** : Fleche pour deplier/replier les sous-objectifs
- **Indicateur de progression** : Affichage "X/Y" sur les parents (ex: "2/3")
- **Auto-completion parent** : Un parent est automatiquement "done" quand tous ses enfants le sont
- **Cascade undo** : Remettre un enfant en cours remet aussi le parent en cours
- **Suppression cascade** : Supprimer un parent supprime tous ses enfants

### Objectifs accomplis

- Les objectifs parents marques 'Done' disparaissent de la liste principale
- Animation confetti declenchee lors de la completion
- Bouton 'Done (X)' en bas affiche le nombre d'objectifs racines accomplis
- Modal dediee listant tous les objectifs accomplis avec leur hierarchie
- **Undo** : Bouton fleche bleue pour remettre en cours (feuilles seulement)
- **Suppression** : Bouton X rouge pour supprimer definitivement

---

## Structure des donnees

### Objectif (Goal)

```javascript
{
  id: string,           // Identifiant unique (timestamp)
  text: string,         // Texte de l'objectif
  done: boolean,        // Statut de completion
  parentId: string|null // ID du parent (null si objectif racine) [v2.0]
}
```

### Exemple de hierarchie

```javascript
[
  { id: '1', text: 'Devenir freelance', done: false, parentId: null },
  { id: '1-1', text: 'Creer un portfolio', done: false, parentId: '1' },
  { id: '1-2', text: 'Trouver 3 clients', done: false, parentId: '1' },
  { id: '1-3', text: 'Fixer ses tarifs', done: false, parentId: '1' },
]
```

---

## Composants

### App.js

Composant racine gerant l'etat global de l'application.

**Etats :**
| Etat | Type | Description |
|------|------|-------------|
| goals | Goal[] | Tableau des objectifs |
| addModalVisible | boolean | Visibilite modal ajout |
| editModalVisible | boolean | Visibilite modal edition |
| completedModalVisible | boolean | Visibilite modal objectifs accomplis |
| editingGoal | Goal\|null | Objectif en cours d'edition |
| addingToParentId | string\|null | ID du parent pour sous-objectif [v2.0] |
| showConfetti | boolean | Declenchement animation confetti |

**Fonctions utilitaires (v2.0) :**
| Fonction | Description |
|----------|-------------|
| getChildren(parentId) | Recupere les enfants directs d'un objectif |
| areAllChildrenDone(parentId) | Verifie si tous les enfants sont done |
| hasChildren(goalId) | Verifie si un objectif a des enfants |
| isEffectivelyDone(goal) | Calcule le statut effectif (recursif) |

**Handlers :**
| Handler | Description |
|---------|-------------|
| addGoalHandler(text, parentId) | Ajoute un objectif ou sous-objectif [v2.0: parentId] |
| deleteGoalHandler(id) | Supprime un objectif et ses enfants [v2.0: cascade] |
| doneGoalHandler(id) | Marque done + met a jour parents [v2.0: cascade] |
| undoGoalHandler(id) | Remet en cours + met a jour parents [v2.0: cascade] |
| addSubGoalHandler(parentId) | Ouvre modal pour sous-objectif [v2.0] |

---

### GoalItem.js

Affiche un objectif individuel avec support hierarchique et recursif.

**Props :**
| Prop | Type | Description |
|------|------|-------------|
| goal | object | Objectif a afficher [v2.0: objet complet] |
| children | Goal[] | Sous-objectifs directs [v2.0] |
| allGoals | Goal[] | Liste complete [v2.0] |
| onDelete | function | Callback suppression |
| onEdit | function | Callback edition |
| onDone | function | Callback completion |
| onUndo | function | Callback undo [v2.0] |
| onAddSubGoal | function | Callback ajout sous-objectif [v2.0] |
| getChildren | function | Fonction pour recuperer enfants [v2.0] |
| isEffectivelyDone | function | Fonction statut effectif [v2.0] |
| level | number | Niveau d'indentation [v2.0] |

**Elements UI :**
- Fleche expand/collapse (si a des enfants) [v2.0]
- Zone de texte cliquable (ouvre edition)
- Indicateur progression "X/Y" (si parent) [v2.0]
- Bouton "+" bleu (ajouter sous-objectif) [v2.0]
- Bouton coche verte (marquer done) - feuilles seulement [v2.0]
- Bouton X rouge (supprimer)
- Liste recursive des enfants [v2.0]

---

### AddModal.js

Modal pour ajouter un nouvel objectif ou sous-objectif.

**Props :**
| Prop | Type | Description |
|------|------|-------------|
| visible | boolean | Visibilite de la modal |
| parentId | string\|null | ID du parent [v2.0] |
| parentGoal | Goal\|null | Objectif parent [v2.0] |
| onAdd | function | Callback d'ajout (text, parentId) [v2.0] |
| onCancel | function | Fermeture de la modal |

**Comportement v2.0 :**
- Titre dynamique: "Nouvel objectif" ou "Sous-objectif de X"
- Indicateur visuel du parent (bandeau orange)
- Reset automatique a l'ouverture

---

### CompletedGoals.js

Modal affichant la liste des objectifs accomplis avec hierarchie.

**Props :**
| Prop | Type | Description |
|------|------|-------------|
| visible | boolean | Visibilite de la modal |
| goals | Goal[] | Objectifs racines accomplis |
| allGoals | Goal[] | Liste complete [v2.0] |
| onClose | function | Fermeture de la modal |
| onDelete | function | Suppression d'un objectif |
| onUndo | function | Remise en cours |
| getChildren | function | Recuperer enfants [v2.0] |

**Comportement v2.0 :**
- Affichage hierarchique recursif
- Compteur d'enfants pour les parents
- Stats: "X objectifs principaux (Y total avec sous-objectifs)"
- Undo seulement sur les feuilles

---

### GoalInput.js

Barre de saisie en haut de l'ecran.

**Props :**
| Prop | Type | Description |
|------|------|-------------|
| onOpenModal | function | Ouvre la modal d'ajout |

---

### EditModal.js

Modal pour modifier un objectif existant.

**Props :**
| Prop | Type | Description |
|------|------|-------------|
| visible | boolean | Visibilite de la modal |
| goal | object | Objectif a editer |
| onSave | function | Callback sauvegarde |
| onCancel | function | Fermeture de la modal |

---

## Installation

```bash
# 1. Extraire l'archive ZIP
unzip life-goals-app-hierarchical.zip

# 2. Aller dans le dossier
cd life-goals-app

# 3. Installer les dependances
npm install

# 4. Lancer l'application
npx expo start
```

---

## Commandes disponibles

```bash
npm start        # Demarre Expo
npm run android  # Lance sur Android
npm run ios      # Lance sur iOS
npm run web      # Lance dans le navigateur
```

---

## Design

### Palette de couleurs

| Usage | Couleur | Hex |
|-------|---------|-----|
| Objectif simple | Violet | #5e60ce |
| Objectif parent | Orange | #f59e0b |
| Succes/Done | Vert | #4ade80 |
| Danger/Delete | Rouge | #ff6b6b |
| Undo | Bleu | #60a5fa |
| Ajout sous-objectif | Bleu | #60a5fa |
| Fond carte | Gris fonce | #1e1e2e |
| Fond carte done | Vert fonce | #1a2e1a |
| Fond carte parent done | Orange fonce | #2e2a1a |
| Texte | Blanc | #ffffff |
| Texte secondaire | Gris | #9ca3af |
| Ligne hierarchie | Gris fonce | #3d3d5c |

### Typographie

- Police systeme par defaut
- Taille texte objectif : 16px
- Taille icones : 18-20px
- Taille indicateur progression : 12px

---

## Regles metier hierarchiques

1. **Un objectif parent ne peut pas etre marque "done" manuellement**
   - Le bouton coche n'apparait que sur les feuilles (objectifs sans enfants)

2. **Auto-completion du parent**
   - Quand tous les enfants sont done, le parent devient automatiquement done
   - Cette regle s'applique recursivement (grand-parent, etc.)

3. **Cascade undo**
   - Remettre un enfant en cours remet automatiquement tous ses ancetres en cours
   - Un parent ne peut pas etre done si un de ses descendants ne l'est pas

4. **Suppression en cascade**
   - Supprimer un parent supprime tous ses descendants

5. **Statut effectif**
   - `isEffectivelyDone(goal)` calcule le vrai statut en tenant compte des enfants
   - Un parent est "effectivement done" ssi tous ses enfants le sont (recursif)

---

## Changelog

### v2.1.0 - Synchronisation input/modal

- Le texte saisi dans l'input principal est maintenant pre-rempli dans la modal
- Nouvel etat `inputText` dans App.js
- Nouvel etat `initialModalText` dans App.js
- GoalInput transmet le texte via `onOpenModal(text)`
- AddModal recoit `initialText` pour pre-remplir le champ
- Clear automatique apres ajout ou annulation

### v2.0.0 - Objectifs hierarchiques

- Ajout propriete `parentId` sur les objectifs
- Support des sous-objectifs a profondeur illimitee
- Auto-completion des parents
- Cascade undo vers les ancetres
- Suppression en cascade des descendants
- UI: bouton expand/collapse, bouton "+", indicateur progression
- Code documente avec commentaires [AJOUT v2.0] et [MODIFICATION v2.0]

### v1.1.0 - Objectifs termines

- Ajout bouton coche pour marquer done
- Animation confetti
- Modal objectifs accomplis avec undo

### v1.0.0 - Version initiale

- CRUD objectifs basique
- Theme sombre
- Modals ajout/edition

---

## Dependances

### Production

```json
{
  "expo": "~52.0.0",
  "expo-status-bar": "~2.0.0",
  "react": "18.3.1",
  "react-native": "0.76.3",
  "react-dom": "18.3.1",
  "react-native-web": "~0.19.13",
  "@expo/metro-runtime": "~4.0.1",
  "react-native-confetti-cannon": "^1.5.2"
}
```

### Developpement

```json
{
  "@babel/core": "^7.25.0",
  "babel-preset-expo": "~12.0.0"
}
```