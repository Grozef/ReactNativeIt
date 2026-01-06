# Life Goals App

## Documentation Technique

---

## Presentation

Life Goals App est une application mobile React Native / Expo permettant de gerer ses objectifs de vie. L'application offre une interface moderne avec un theme sombre et permet d'ajouter, modifier, supprimer et marquer comme accomplis ses objectifs personnels.

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
│   ├── GoalItem.js           # Affichage d'un objectif individuel
│   ├── GoalInput.js          # Barre de saisie et bouton d'ajout
│   ├── AddModal.js           # Modal d'ajout d'objectif
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

### Objectifs accomplis

- Les objectifs marques 'Done' disparaissent de la liste principale
- Animation confetti declenchee lors de la completion
- Bouton 'Done (X)' en bas affiche le nombre d'objectifs accomplis
- Modal dediee listant tous les objectifs accomplis
- **Undo** : Bouton fleche bleue pour remettre en cours
- **Suppression** : Bouton X rouge pour supprimer definitivement

---

## Composants

### App.js

Composant racine gerant l'etat global de l'application.

**Etats :**
- `goals` - Tableau des objectifs {id, text, done}
- `addModalVisible` - Visibilite modal ajout
- `editModalVisible` - Visibilite modal edition
- `completedModalVisible` - Visibilite modal objectifs accomplis
- `editingGoal` - Objectif en cours d'edition
- `showConfetti` - Declenchement animation confetti

**Handlers :**
- `addGoalHandler(goalText)` - Ajoute un nouvel objectif
- `deleteGoalHandler(id)` - Supprime un objectif
- `doneGoalHandler(id)` - Marque un objectif comme accompli + lance confetti
- `undoGoalHandler(id)` - Remet un objectif en cours
- `startEditHandler(goal)` - Ouvre la modal d'edition
- `saveEditHandler(newText)` - Sauvegarde les modifications
- `cancelEditHandler()` - Annule l'edition

---

### GoalItem.js

Affiche un objectif individuel avec ses actions.

**Props :**
| Prop | Type | Description |
|------|------|-------------|
| id | string | Identifiant unique |
| text | string | Texte de l'objectif |
| done | boolean | Statut de completion |
| onDelete | function | Callback suppression |
| onEdit | function | Callback edition |
| onDone | function | Callback completion |

**Elements UI :**
- Zone de texte cliquable (ouvre edition)
- Bouton coche verte (marquer done) - masque si done=true
- Bouton X rouge (supprimer)

---

### GoalInput.js

Barre de saisie en haut de l'ecran.

**Props :**
| Prop | Type | Description |
|------|------|-------------|
| onOpenModal | function | Ouvre la modal d'ajout |

---

### AddModal.js

Modal pour ajouter un nouvel objectif.

**Props :**
| Prop | Type | Description |
|------|------|-------------|
| visible | boolean | Visibilite de la modal |
| onAdd | function | Callback d'ajout |
| onCancel | function | Fermeture de la modal |

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

### CompletedGoals.js

Modal affichant la liste des objectifs accomplis.

**Props :**
| Prop | Type | Description |
|------|------|-------------|
| visible | boolean | Visibilite de la modal |
| goals | array | Liste des objectifs accomplis |
| onClose | function | Fermeture de la modal |
| onDelete | function | Suppression d'un objectif |
| onUndo | function | Remise en cours d'un objectif |

**Elements UI :**
- Header avec titre et bouton fermeture
- Compteur d'objectifs accomplis
- Liste des objectifs avec boutons undo/delete
- Message vide si aucun objectif accompli

---

## Installation

```bash
# 1. Extraire l'archive ZIP
unzip life-goals-app-updated.zip

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
| Principal | Violet | #5e60ce |
| Succes | Vert | #4ade80 |
| Danger | Rouge | #ff6b6b |
| Undo | Bleu | #60a5fa |
| Fond carte | Gris fonce | #1e1e2e |
| Fond carte done | Vert fonce | #1a2e1a |
| Texte | Blanc | #ffffff |
| Texte secondaire | Gris | #9ca3af |

### Typographie

- Police systeme par defaut
- Taille texte objectif : 16px
- Taille icones : 18-20px

---

## Structure des donnees

### Objectif

```javascript
{
  id: string,      // Identifiant unique (timestamp)
  text: string,    // Texte de l'objectif
  done: boolean    // Statut de completion
}
```

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
