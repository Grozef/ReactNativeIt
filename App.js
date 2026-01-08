/**
 * @file App.js
 * @description Composant principal de l'application Life Goals.
 *              Gere l'etat global des objectifs hierarchiques.
 * @version 2.0.0
 * 
 * @changelog
 * v2.0.0 - Ajout du support hierarchique (parent/enfants)
 * 
 * MODIFICATIONS EFFECTUEES:
 * -------------------------
 * 1. Structure Goal: Ajout de la propriete 'parentId' pour lier les sous-objectifs
 * 2. Nouveaux etats: addingToParentId pour gerer l'ajout de sous-objectifs
 * 3. Nouvelles fonctions: getChildren(), areAllChildrenDone(), hasChildren(), isEffectivelyDone()
 * 4. Modification deleteGoalHandler: Suppression en cascade des enfants
 * 5. Modification doneGoalHandler: Mise a jour automatique des parents quand tous enfants done
 * 6. Modification undoGoalHandler: Remise en cours des parents quand un enfant est undo
 * 7. Nouvelle fonction: addSubGoalHandler() pour ajouter des sous-objectifs
 * 8. Filtrage: activeRootGoals et completedRootGoals basés sur isEffectivelyDone()
 * 9. Props supplementaires passes aux composants enfants (getChildren, isEffectivelyDone, etc.)
 */

import { useState, useRef } from 'react';
import { StyleSheet, View, FlatList, ImageBackground, Pressable, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ConfettiCannon from 'react-native-confetti-cannon';
import GoalItem from './components/GoalItem';
import GoalInput from './components/GoalInput';
import AddModal from './components/AddModal';
import EditModal from './components/EditModal';
import CompletedGoals from './components/CompletedGoals';

/**
 * @typedef {Object} Goal
 * @property {string} id - Identifiant unique de l'objectif
 * @property {string} text - Texte descriptif de l'objectif
 * @property {boolean} done - Statut de completion
 * @property {string|null} parentId - ID du parent (null si objectif racine)
 *                                    [AJOUT v2.0] Nouvelle propriete pour hierarchie
 */

/**
 * Donnees d'exemple pour initialiser l'application
 * [MODIFICATION v2.0] Structure modifiee: ajout de parentId et exemples hierarchiques
 * @type {Goal[]}
 */
const sampleGoals = [
  // [AJOUT v2.0] Objectif parent avec sous-objectifs
  { id: '1', text: 'Devenir freelance', done: false, parentId: null },
  { id: '1-1', text: 'Creer un portfolio', done: false, parentId: '1' },      // sous-objectif
  { id: '1-2', text: 'Trouver 3 clients', done: false, parentId: '1' },       // sous-objectif
  { id: '1-3', text: 'Fixer ses tarifs', done: false, parentId: '1' },        // sous-objectif
  // [AJOUT v2.0] Autre objectif parent avec sous-objectifs
  { id: '2', text: 'Faire un triathlon', done: false, parentId: null },
  { id: '2-1', text: 'Entrainement natation', done: false, parentId: '2' },   // sous-objectif
  { id: '2-2', text: 'Entrainement velo', done: false, parentId: '2' },       // sous-objectif
  { id: '2-3', text: 'Entrainement course', done: false, parentId: '2' },     // sous-objectif
  // Objectifs simples (sans enfants)
  { id: '3', text: 'Apprendre un nouveau langage', done: false, parentId: null },
  { id: '4', text: 'Acheter mon premier appartement', done: false, parentId: null },
];

/**
 * Composant principal de l'application
 * @returns {JSX.Element} Application Life Goals
 */
export default function App() {
  /**
   * @type {[Goal[], Function]} Etat des objectifs
   * [MODIFICATION v2.0] Structure Goal inclut maintenant parentId
   */
  const [goals, setGoals] = useState(sampleGoals);
  
  /**
   * @type {[boolean, Function]} Visibilite modal ajout
   */
  const [addModalVisible, setAddModalVisible] = useState(false);
  
  /**
   * @type {[boolean, Function]} Visibilite modal edition
   */
  const [editModalVisible, setEditModalVisible] = useState(false);
  
  /**
   * @type {[boolean, Function]} Visibilite modal objectifs accomplis
   */
  const [completedModalVisible, setCompletedModalVisible] = useState(false);
  
  /**
   * @type {[Goal|null, Function]} Objectif en cours d'edition
   */
  const [editingGoal, setEditingGoal] = useState(null);
  
  /**
   * [AJOUT v2.1] Texte saisi dans l'input principal
   * Synchronise avec GoalInput et pre-remplit AddModal
   * @type {[string, Function]}
   */
  const [inputText, setInputText] = useState('');
  
  /**
   * [AJOUT v2.0] ID du parent pour ajout de sous-objectif
   * Permet de savoir si on ajoute un objectif racine (null) ou un sous-objectif
   * @type {[string|null, Function]}
   */
  const [addingToParentId, setAddingToParentId] = useState(null);
  
  /**
   * [AJOUT v2.1] Texte initial pour la modal d'ajout
   * Pre-remplit le champ de saisie de la modal
   * @type {[string, Function]}
   */
  const [initialModalText, setInitialModalText] = useState('');
  
  /**
   * @type {[boolean, Function]} Affichage animation confetti
   */
  const [showConfetti, setShowConfetti] = useState(false);
  
  /**
   * @type {Object} Reference pour le composant confetti
   */
  const confettiRef = useRef(null);

  // ============================================================
  // [AJOUT v2.0] FONCTIONS UTILITAIRES POUR LA HIERARCHIE
  // ============================================================

  /**
   * [AJOUT v2.0] Recupere les enfants directs d'un objectif
   * @param {string} parentId - ID de l'objectif parent
   * @returns {Goal[]} Liste des sous-objectifs
   */
  const getChildren = (parentId) => {
    return goals.filter((goal) => goal.parentId === parentId);
  };

  /**
   * [AJOUT v2.0] Verifie si tous les enfants d'un parent sont termines
   * Utilise pour determiner si un parent doit etre auto-complete
   * @param {string} parentId - ID de l'objectif parent
   * @returns {boolean} True si tous les enfants sont done
   */
  const areAllChildrenDone = (parentId) => {
    const children = getChildren(parentId);
    if (children.length === 0) return false;
    return children.every((child) => child.done);
  };

  /**
   * [AJOUT v2.0] Verifie si un objectif a des enfants
   * @param {string} goalId - ID de l'objectif
   * @returns {boolean} True si l'objectif a des enfants
   */
  const hasChildren = (goalId) => {
    return goals.some((goal) => goal.parentId === goalId);
  };

  /**
   * [AJOUT v2.0] Calcule le statut effectif d'un objectif (tenant compte des enfants)
   * Un parent est "effectivement done" seulement si TOUS ses enfants le sont
   * @param {Goal} goal - L'objectif a evaluer
   * @returns {boolean} True si l'objectif est effectivement termine
   */
  const isEffectivelyDone = (goal) => {
    const children = getChildren(goal.id);
    if (children.length === 0) {
      // Pas d'enfants: le statut done suffit
      return goal.done;
    }
    // A des enfants: tous doivent etre effectivement done (recursif)
    return children.every((child) => isEffectivelyDone(child));
  };

  // ============================================================
  // [MODIFICATION v2.0] FILTRAGE BASE SUR LE STATUT EFFECTIF
  // ============================================================

  /**
   * [MODIFICATION v2.0] Objectifs racines actifs
   * Utilise isEffectivelyDone au lieu de goal.done
   * @type {Goal[]}
   */
  const activeRootGoals = goals.filter(
    (goal) => goal.parentId === null && !isEffectivelyDone(goal)
  );

  /**
   * [MODIFICATION v2.0] Objectifs racines termines
   * Utilise isEffectivelyDone au lieu de goal.done
   * @type {Goal[]}
   */
  const completedRootGoals = goals.filter(
    (goal) => goal.parentId === null && isEffectivelyDone(goal)
  );

  // ============================================================
  // HANDLERS - GESTION DES OBJECTIFS
  // ============================================================

  /**
   * [MODIFICATION v2.0] Ajoute un nouvel objectif
   * [MODIFICATION v2.1] Clear aussi inputText apres ajout
   * Supporte maintenant l'ajout de sous-objectifs via parentId
   * @param {string} goalText - Texte de l'objectif
   * @param {string|null} parentId - ID du parent (optionnel) [AJOUT v2.0]
   */
  const addGoalHandler = (goalText, parentId = null) => {
    if (goalText.trim().length === 0) return;
    setGoals((currentGoals) => [
      ...currentGoals,
      { 
        id: String(Date.now()), 
        text: goalText, 
        done: false, 
        parentId: parentId  // [AJOUT v2.0] Lien vers le parent
      },
    ]);
    setAddModalVisible(false);
    setAddingToParentId(null);  // [AJOUT v2.0] Reset du parent
    setInputText('');           // [AJOUT v2.1] Clear l'input
    setInitialModalText('');    // [AJOUT v2.1] Clear le texte initial
  };

  /**
   * [MODIFICATION v2.0] Supprime un objectif et tous ses enfants
   * Suppression en cascade: un parent supprime aussi ses sous-objectifs
   * @param {string} id - ID de l'objectif a supprimer
   */
  const deleteGoalHandler = (id) => {
    setGoals((currentGoals) => {
      /**
       * [AJOUT v2.0] Recupere recursivement tous les IDs a supprimer
       * Parcourt l'arbre des enfants pour tout supprimer
       * @param {string} goalId - ID de depart
       * @returns {string[]} Liste des IDs a supprimer
       */
      const getIdsToDelete = (goalId) => {
        const children = currentGoals.filter((g) => g.parentId === goalId);
        let ids = [goalId];
        children.forEach((child) => {
          ids = [...ids, ...getIdsToDelete(child.id)];
        });
        return ids;
      };
      
      const idsToDelete = getIdsToDelete(id);
      return currentGoals.filter((goal) => !idsToDelete.includes(goal.id));
    });
  };

  /**
   * [MODIFICATION v2.0] Marque un objectif comme termine
   * Met a jour automatiquement le parent si tous les enfants sont done
   * @param {string} id - ID de l'objectif
   */
  const doneGoalHandler = (id) => {
    setGoals((currentGoals) => {
      // Marque l'objectif comme done
      let updated = currentGoals.map((goal) =>
        goal.id === id ? { ...goal, done: true } : goal
      );
      
      /**
       * [AJOUT v2.0] Met a jour recursivement les parents
       * Si tous les freres/soeurs sont done, le parent devient done aussi
       * @param {Goal[]} goals - Liste des objectifs
       * @param {string} goalId - ID de l'objectif modifie
       * @returns {Goal[]} Liste mise a jour
       */
      const updateParents = (goals, goalId) => {
        const goal = goals.find((g) => g.id === goalId);
        if (!goal || !goal.parentId) return goals;
        
        // Verifie si tous les freres/soeurs sont done
        const siblings = goals.filter((g) => g.parentId === goal.parentId);
        const allSiblingsDone = siblings.every((s) => s.done);
        
        if (allSiblingsDone) {
          // Marque le parent comme done
          goals = goals.map((g) =>
            g.id === goal.parentId ? { ...g, done: true } : g
          );
          // Continue vers le grand-parent (recursif)
          return updateParents(goals, goal.parentId);
        }
        return goals;
      };
      
      return updateParents(updated, id);
    });
    
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  /**
   * [MODIFICATION v2.0] Remet un objectif en cours (undo)
   * Remet aussi le parent en cours si necessaire (cascade vers le haut)
   * @param {string} id - ID de l'objectif
   */
  const undoGoalHandler = (id) => {
    setGoals((currentGoals) => {
      // Remet l'objectif en cours
      let updated = currentGoals.map((goal) =>
        goal.id === id ? { ...goal, done: false } : goal
      );
      
      /**
       * [AJOUT v2.0] Remet recursivement les parents en cours
       * Un parent ne peut pas etre done si un enfant ne l'est pas
       * @param {Goal[]} goals - Liste des objectifs
       * @param {string} goalId - ID de l'objectif modifie
       * @returns {Goal[]} Liste mise a jour
       */
      const undoParents = (goals, goalId) => {
        const goal = goals.find((g) => g.id === goalId);
        if (!goal || !goal.parentId) return goals;
        
        // Remet le parent en cours
        goals = goals.map((g) =>
          g.id === goal.parentId ? { ...g, done: false } : g
        );
        // Continue vers le grand-parent (recursif)
        return undoParents(goals, goal.parentId);
      };
      
      return undoParents(updated, id);
    });
  };

  /**
   * Ouvre la modal d'edition pour un objectif
   * @param {Goal} goal - Objectif a editer
   */
  const startEditHandler = (goal) => {
    if (goal.done) return;
    setEditingGoal(goal);
    setEditModalVisible(true);
  };

  /**
   * Sauvegarde les modifications d'un objectif
   * @param {string} newText - Nouveau texte
   */
  const saveEditHandler = (newText) => {
    if (newText.trim().length === 0) return;
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === editingGoal.id ? { ...goal, text: newText } : goal
      )
    );
    setEditModalVisible(false);
    setEditingGoal(null);
  };

  /**
   * Annule l'edition en cours
   */
  const cancelEditHandler = () => {
    setEditModalVisible(false);
    setEditingGoal(null);
  };

  /**
   * [AJOUT v2.0] Ouvre la modal d'ajout pour un sous-objectif
   * Stocke l'ID du parent pour l'associer au nouvel objectif
   * @param {string} parentId - ID du parent
   */
  const addSubGoalHandler = (parentId) => {
    setAddingToParentId(parentId);
    setAddModalVisible(true);
  };

  /**
   * [MODIFICATION v2.0] Annule l'ajout d'objectif
   * [MODIFICATION v2.1] Reset aussi inputText et initialModalText
   * Reset aussi addingToParentId
   */
  const cancelAddHandler = () => {
    setAddModalVisible(false);
    setAddingToParentId(null);  // [AJOUT v2.0] Reset du parent
    setInputText('');           // [AJOUT v2.1] Clear l'input
    setInitialModalText('');    // [AJOUT v2.1] Clear le texte initial
  };

  /**
   * [AJOUT v2.1] Ouvre la modal d'ajout avec le texte pre-rempli
   * Appele par GoalInput avec le texte saisi
   * @param {string} text - Texte a pre-remplir dans la modal
   */
  const openAddModalWithText = (text) => {
    setInitialModalText(text);
    setAddModalVisible(true);
  };

  // ============================================================
  // RENDU DU COMPOSANT
  // ============================================================

  return (
    <ImageBackground
      source={require('./assets/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <StatusBar style="light" />

        <GoalInput 
          onOpenModal={openAddModalWithText}
          inputText={inputText}
          onInputChange={setInputText}
        />

        <View style={styles.goalsContainer}>
          {/* 
           * [MODIFICATION v2.0] FlatList affiche maintenant activeRootGoals
           * au lieu de tous les objectifs non-done
           */}
          <FlatList
            data={activeRootGoals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              /* 
               * [MODIFICATION v2.0] GoalItem recoit maintenant des props
               * supplementaires pour gerer la hierarchie
               */
              <GoalItem
                goal={item}
                children={getChildren(item.id)}        /* [AJOUT v2.0] sous-objectifs */
                allGoals={goals}                       /* [AJOUT v2.0] liste complete */
                onDelete={deleteGoalHandler}
                onEdit={() => startEditHandler(item)}
                onDone={doneGoalHandler}
                onUndo={undoGoalHandler}               /* [AJOUT v2.0] */
                onAddSubGoal={addSubGoalHandler}       /* [AJOUT v2.0] */
                getChildren={getChildren}              /* [AJOUT v2.0] */
                isEffectivelyDone={isEffectivelyDone}  /* [AJOUT v2.0] */
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* 
         * [MODIFICATION v2.0] Affiche le nombre d'objectifs racines termines
         * au lieu du total des objectifs done
         */}
        <Pressable
          style={({ pressed }) => [
            styles.completedButton,
            pressed && styles.completedButtonPressed,
          ]}
          onPress={() => setCompletedModalVisible(true)}
        >
          <Text style={styles.completedButtonText}>
            Done ({completedRootGoals.length})
          </Text>
        </Pressable>

        {/* 
         * [MODIFICATION v2.0] AddModal recoit maintenant parentId et parentGoal
         * [MODIFICATION v2.1] AddModal recoit aussi initialText
         * pour supporter l'ajout de sous-objectifs
         */}
        <AddModal
          visible={addModalVisible}
          parentId={addingToParentId}                                              /* [AJOUT v2.0] */
          parentGoal={addingToParentId ? goals.find(g => g.id === addingToParentId) : null}  /* [AJOUT v2.0] */
          initialText={initialModalText}                                           /* [AJOUT v2.1] */
          onAdd={addGoalHandler}
          onCancel={cancelAddHandler}
        />

        <EditModal
          visible={editModalVisible}
          goal={editingGoal}
          onSave={saveEditHandler}
          onCancel={cancelEditHandler}
        />

        {/* 
         * [MODIFICATION v2.0] CompletedGoals recoit maintenant des props
         * supplementaires pour afficher la hierarchie des objectifs accomplis
         */}
        <CompletedGoals
          visible={completedModalVisible}
          goals={completedRootGoals}            /* [MODIFICATION v2.0] objectifs racines seulement */
          allGoals={goals}                      /* [AJOUT v2.0] */
          onClose={() => setCompletedModalVisible(false)}
          onDelete={deleteGoalHandler}
          onUndo={undoGoalHandler}
          getChildren={getChildren}             /* [AJOUT v2.0] */
        />

        {showConfetti && (
          <ConfettiCannon
            count={150}
            origin={{ x: -10, y: 0 }}
            autoStart={true}
            fadeOut={true}
            ref={confettiRef}
          />
        )}
      </View>
    </ImageBackground>
  );
}

/**
 * Styles du composant App
 * @type {Object}
 */
const styles = StyleSheet.create({
  /** Style de l'image de fond */
  backgroundImage: {
    flex: 1,
  },
  /** Conteneur principal */
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  /** Conteneur de la liste des objectifs */
  goalsContainer: {
    flex: 1,
    marginTop: 16,
  },
  /** Bouton d'acces aux objectifs termines */
  completedButton: {
    backgroundColor: '#4ade80',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 30,
    alignItems: 'center',
  },
  /** Etat presse du bouton */
  completedButtonPressed: {
    opacity: 0.7,
  },
  /** Texte du bouton */
  completedButtonText: {
    color: '#1e1e2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});