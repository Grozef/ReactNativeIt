/**
 * @file src/features/goals/goalsSlice.js
 * @description Slice Redux pour la gestion des objectifs hierarchiques.
 * @version 1.0.0
 * 
 * STATE:
 * ------
 * {
 *   items: Goal[],           // Liste des objectifs
 *   addModalVisible: bool,   // Modal ajout visible
 *   editModalVisible: bool,  // Modal edition visible
 *   completedModalVisible: bool,
 *   editingGoal: Goal|null,  // Objectif en edition
 *   addingToParentId: string|null,
 *   inputText: string,       // Texte input principal
 *   initialModalText: string
 * }
 * 
 * ACTIONS:
 * --------
 * - addGoal(text, parentId)
 * - deleteGoal(id)
 * - toggleDone(id)
 * - undoGoal(id)
 * - updateGoal(id, text)
 * - setInputText(text)
 * - openAddModal(parentId?, initialText?)
 * - closeAddModal()
 * - openEditModal(goal)
 * - closeEditModal()
 * - openCompletedModal()
 * - closeCompletedModal()
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * Donnees initiales avec exemples hierarchiques
 */
const initialGoals = [
  { id: '1', text: 'Devenir freelance', done: false, parentId: null },
  { id: '1-1', text: 'Creer un portfolio', done: false, parentId: '1' },
  { id: '1-2', text: 'Trouver 3 clients', done: false, parentId: '1' },
  { id: '1-3', text: 'Fixer ses tarifs', done: false, parentId: '1' },
  { id: '2', text: 'Apprendre React Native', done: false, parentId: null },
  { id: '3', text: 'Faire un triathlon', done: false, parentId: null },
  { id: '3-1', text: 'Entrainement natation', done: false, parentId: '3' },
  { id: '3-2', text: 'Entrainement velo', done: false, parentId: '3' },
  { id: '3-3', text: 'Entrainement course', done: false, parentId: '3' },
];

/**
 * Etat initial du slice goals
 */
const initialState = {
  items: initialGoals,
  addModalVisible: false,
  editModalVisible: false,
  completedModalVisible: false,
  editingGoal: null,
  addingToParentId: null,
  inputText: '',
  initialModalText: '',
};

/**
 * Slice des objectifs
 */
export const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    /**
     * Ajoute un nouvel objectif
     * @param {Object} action.payload - { text: string, parentId?: string }
     */
    addGoal: (state, action) => {
      const { text, parentId = null } = action.payload;
      if (text.trim().length === 0) return;
      
      state.items.push({
        id: String(Date.now()),
        text: text.trim(),
        done: false,
        parentId,
      });
      
      // Fermer la modal et reset
      state.addModalVisible = false;
      state.addingToParentId = null;
      state.inputText = '';
      state.initialModalText = '';
    },

    /**
     * Supprime un objectif et tous ses descendants
     * @param {string} action.payload - ID de l'objectif
     */
    deleteGoal: (state, action) => {
      const id = action.payload;
      
      // Fonction recursive pour collecter les IDs a supprimer
      const getIdsToDelete = (goalId) => {
        const children = state.items.filter(g => g.parentId === goalId);
        let ids = [goalId];
        children.forEach(child => {
          ids = [...ids, ...getIdsToDelete(child.id)];
        });
        return ids;
      };
      
      const idsToDelete = getIdsToDelete(id);
      state.items = state.items.filter(goal => !idsToDelete.includes(goal.id));
    },

    /**
     * Marque un objectif comme termine
     * @param {string} action.payload - ID de l'objectif
     */
    toggleDone: (state, action) => {
      const id = action.payload;
      const goal = state.items.find(g => g.id === id);
      if (goal) {
        goal.done = true;
      }
    },

    /**
     * Remet un objectif en cours + cascade vers les parents
     * @param {string} action.payload - ID de l'objectif
     */
    undoGoal: (state, action) => {
      const id = action.payload;
      
      // Marquer l'objectif comme non-done
      const goal = state.items.find(g => g.id === id);
      if (goal) {
        goal.done = false;
      }
      
      // Remonter vers les parents et les marquer non-done aussi
      const undoParents = (goalId) => {
        const g = state.items.find(item => item.id === goalId);
        if (!g || !g.parentId) return;
        
        const parent = state.items.find(item => item.id === g.parentId);
        if (parent) {
          parent.done = false;
          undoParents(parent.id);
        }
      };
      
      undoParents(id);
    },

    /**
     * Met a jour le texte d'un objectif
     * @param {Object} action.payload - { id: string, text: string }
     */
    updateGoal: (state, action) => {
      const { id, text } = action.payload;
      if (text.trim().length === 0) return;
      
      const goal = state.items.find(g => g.id === id);
      if (goal) {
        goal.text = text.trim();
      }
      
      state.editModalVisible = false;
      state.editingGoal = null;
    },

    /**
     * Met a jour le texte de l'input principal
     */
    setInputText: (state, action) => {
      state.inputText = action.payload;
    },

    /**
     * Ouvre la modal d'ajout
     * @param {Object} action.payload - { parentId?: string, initialText?: string }
     */
    openAddModal: (state, action) => {
      const { parentId = null, initialText = '' } = action.payload || {};
      state.addModalVisible = true;
      state.addingToParentId = parentId;
      state.initialModalText = initialText || state.inputText;
    },

    /**
     * Ferme la modal d'ajout
     */
    closeAddModal: (state) => {
      state.addModalVisible = false;
      state.addingToParentId = null;
      state.inputText = '';
      state.initialModalText = '';
    },

    /**
     * Ouvre la modal d'edition
     * @param {Object} action.payload - Goal a editer
     */
    openEditModal: (state, action) => {
      const goal = action.payload;
      if (goal && !goal.done) {
        state.editModalVisible = true;
        state.editingGoal = goal;
      }
    },

    /**
     * Ferme la modal d'edition
     */
    closeEditModal: (state) => {
      state.editModalVisible = false;
      state.editingGoal = null;
    },

    /**
     * Ouvre la modal des objectifs termines
     */
    openCompletedModal: (state) => {
      state.completedModalVisible = true;
    },

    /**
     * Ferme la modal des objectifs termines
     */
    closeCompletedModal: (state) => {
      state.completedModalVisible = false;
    },
  },
});

// ============================================================
// ACTIONS EXPORTEES
// ============================================================

export const {
  addGoal,
  deleteGoal,
  toggleDone,
  undoGoal,
  updateGoal,
  setInputText,
  openAddModal,
  closeAddModal,
  openEditModal,
  closeEditModal,
  openCompletedModal,
  closeCompletedModal,
} = goalsSlice.actions;

// ============================================================
// SELECTEURS
// ============================================================

/**
 * Selectionne tous les objectifs
 */
export const selectAllGoals = (state) => state.goals.items;

/**
 * Selectionne l'etat des modals
 */
export const selectAddModalVisible = (state) => state.goals.addModalVisible;
export const selectEditModalVisible = (state) => state.goals.editModalVisible;
export const selectCompletedModalVisible = (state) => state.goals.completedModalVisible;

/**
 * Selectionne les donnees d'edition
 */
export const selectEditingGoal = (state) => state.goals.editingGoal;
export const selectAddingToParentId = (state) => state.goals.addingToParentId;
export const selectInputText = (state) => state.goals.inputText;
export const selectInitialModalText = (state) => state.goals.initialModalText;

/**
 * Selectionne les enfants d'un objectif
 */
export const selectChildren = (parentId) => (state) => 
  state.goals.items.filter(goal => goal.parentId === parentId);

/**
 * Selectionne les objectifs racines
 */
export const selectRootGoals = (state) => 
  state.goals.items.filter(goal => goal.parentId === null);

/**
 * Calcule si un objectif est effectivement termine
 * (lui-meme done ET tous ses enfants done recursivement)
 */
export const selectIsEffectivelyDone = (goalId) => (state) => {
  const items = state.goals.items;
  
  const isEffectivelyDone = (id) => {
    const goal = items.find(g => g.id === id);
    if (!goal) return false;
    
    const children = items.filter(g => g.parentId === id);
    if (children.length === 0) {
      return goal.done;
    }
    return goal.done && children.every(child => isEffectivelyDone(child.id));
  };
  
  return isEffectivelyDone(goalId);
};

/**
 * Selectionne le parent goal pour l'ajout
 */
export const selectParentGoal = (state) => {
  const parentId = state.goals.addingToParentId;
  if (!parentId) return null;
  return state.goals.items.find(g => g.id === parentId) || null;
};

export default goalsSlice.reducer;
