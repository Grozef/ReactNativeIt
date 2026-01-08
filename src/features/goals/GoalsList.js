/**
 * @file src/features/goals/GoalsList.js
 * @description Composant principal des objectifs utilisant Redux.
 * @version 1.0.0
 * 
 * Ce composant:
 * - Lit l'etat depuis le store Redux avec useSelector
 * - Dispatch les actions avec useDispatch
 * - Affiche la liste des objectifs actifs
 * - Gere les modals (ajout, edition, termines)
 */

import { useRef, useCallback } from 'react';
import { StyleSheet, View, FlatList, ImageBackground, Pressable, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSelector, useDispatch } from 'react-redux';
import ConfettiCannon from 'react-native-confetti-cannon';

// Actions Redux
import {
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
  // Selecteurs
  selectAllGoals,
  selectAddModalVisible,
  selectEditModalVisible,
  selectCompletedModalVisible,
  selectEditingGoal,
  selectAddingToParentId,
  selectInputText,
  selectInitialModalText,
  selectParentGoal,
  selectRootGoals,
} from './goalsSlice';

// Composants UI
import GoalItem from '../../components/GoalItem';
import GoalInput from '../../components/GoalInput';
import AddModal from '../../components/AddModal';
import EditModal from '../../components/EditModal';
import CompletedGoals from '../../components/CompletedGoals';

/**
 * Composant principal de la liste des objectifs
 * Utilise Redux pour tout l'etat
 * 
 * @param {boolean} counterVisible - Si le counter est affiche (pour ajuster le padding)
 */
export function GoalsList({ counterVisible = false }) {
  const dispatch = useDispatch();
  const confettiRef = useRef(null);

  // ============================================================
  // SELECTEURS REDUX
  // ============================================================

  const allGoals = useSelector(selectAllGoals);
  const rootGoals = useSelector(selectRootGoals);
  const addModalVisible = useSelector(selectAddModalVisible);
  const editModalVisible = useSelector(selectEditModalVisible);
  const completedModalVisible = useSelector(selectCompletedModalVisible);
  const editingGoal = useSelector(selectEditingGoal);
  const addingToParentId = useSelector(selectAddingToParentId);
  const inputText = useSelector(selectInputText);
  const initialModalText = useSelector(selectInitialModalText);
  const parentGoal = useSelector(selectParentGoal);

  // ============================================================
  // FONCTIONS UTILITAIRES (derivees du state)
  // ============================================================

  /**
   * Recupere les enfants directs d'un objectif
   */
  const getChildren = useCallback((parentId) => {
    return allGoals.filter(goal => goal.parentId === parentId);
  }, [allGoals]);

  /**
   * Verifie si un objectif est effectivement termine
   * (lui + tous ses descendants)
   */
  const isEffectivelyDone = useCallback((goal) => {
    const children = getChildren(goal.id);
    if (children.length === 0) {
      return goal.done;
    }
    return goal.done && children.every(child => isEffectivelyDone(child));
  }, [allGoals, getChildren]);

  /**
   * Verifie si tous les enfants sont termines
   */
  const areAllChildrenDone = useCallback((parentId) => {
    const children = getChildren(parentId);
    if (children.length === 0) return true;
    return children.every(child => isEffectivelyDone(child));
  }, [getChildren, isEffectivelyDone]);

  // ============================================================
  // FILTRAGE DES OBJECTIFS
  // ============================================================

  const activeRootGoals = rootGoals.filter(goal => !isEffectivelyDone(goal));
  const completedRootGoals = rootGoals.filter(goal => isEffectivelyDone(goal));

  // ============================================================
  // HANDLERS (dispatch des actions)
  // ============================================================

  /**
   * Ajoute un objectif
   */
  const handleAddGoal = (text, parentId) => {
    dispatch(addGoal({ text, parentId }));
  };

  /**
   * Supprime un objectif
   */
  const handleDeleteGoal = (id) => {
    dispatch(deleteGoal(id));
  };

  /**
   * Marque un objectif comme termine + confetti
   */
  const handleDone = (id) => {
    dispatch(toggleDone(id));
    // Trigger confetti
    if (confettiRef.current) {
      confettiRef.current.start();
    }
  };

  /**
   * Remet un objectif en cours
   */
  const handleUndo = (id) => {
    dispatch(undoGoal(id));
  };

  /**
   * Ouvre la modal d'edition
   */
  const handleEdit = (goal) => {
    dispatch(openEditModal(goal));
  };

  /**
   * Sauvegarde l'edition
   */
  const handleSaveEdit = (newText) => {
    if (editingGoal) {
      dispatch(updateGoal({ id: editingGoal.id, text: newText }));
    }
  };

  /**
   * Ouvre la modal d'ajout de sous-objectif
   */
  const handleAddSubGoal = (parentId) => {
    dispatch(openAddModal({ parentId, initialText: '' }));
  };

  /**
   * Ouvre la modal d'ajout avec le texte de l'input
   */
  const handleOpenAddModal = (text) => {
    dispatch(openAddModal({ parentId: null, initialText: text }));
  };

  /**
   * Met a jour le texte de l'input
   */
  const handleInputChange = (text) => {
    dispatch(setInputText(text));
  };

  // ============================================================
  // RENDU
  // ============================================================

  return (
    <ImageBackground
      source={require('../../../assets/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={[styles.container, counterVisible && styles.containerWithCounter]}>
        <StatusBar style="light" />

        {/* Input de saisie */}
        <GoalInput 
          onOpenModal={handleOpenAddModal}
          inputText={inputText}
          onInputChange={handleInputChange}
        />

        {/* Liste des objectifs actifs */}
        <View style={styles.goalsContainer}>
          <FlatList
            data={activeRootGoals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <GoalItem
                goal={item}
                children={getChildren(item.id)}
                allGoals={allGoals}
                onDelete={handleDeleteGoal}
                onEdit={() => handleEdit(item)}
                onDone={handleDone}
                onUndo={handleUndo}
                onAddSubGoal={handleAddSubGoal}
                getChildren={getChildren}
                isEffectivelyDone={isEffectivelyDone}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Bouton objectifs termines */}
        <Pressable
          style={({ pressed }) => [
            styles.completedButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => dispatch(openCompletedModal())}
        >
          <Text style={styles.completedButtonText}>
            Done ({completedRootGoals.length})
          </Text>
        </Pressable>

        {/* Modal d'ajout */}
        <AddModal
          visible={addModalVisible}
          parentId={addingToParentId}
          parentGoal={parentGoal}
          initialText={initialModalText}
          onAdd={handleAddGoal}
          onCancel={() => dispatch(closeAddModal())}
        />

        {/* Modal d'edition */}
        <EditModal
          visible={editModalVisible}
          goal={editingGoal}
          onSave={handleSaveEdit}
          onCancel={() => dispatch(closeEditModal())}
        />

        {/* Modal objectifs termines */}
        <CompletedGoals
          visible={completedModalVisible}
          goals={completedRootGoals}
          allGoals={allGoals}
          onClose={() => dispatch(closeCompletedModal())}
          onDelete={handleDeleteGoal}
          onUndo={handleUndo}
          getChildren={getChildren}
        />

        {/* Animation confetti */}
        <ConfettiCannon
          count={150}
          origin={{ x: -10, y: 0 }}
          autoStart={false}
          fadeOut={true}
          ref={confettiRef}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 100,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  containerWithCounter: {
    paddingBottom: 320,
  },
  goalsContainer: {
    flex: 1,
    marginTop: 16,
  },
  completedButton: {
    backgroundColor: '#4ade80',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  completedButtonText: {
    color: '#1e1e2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GoalsList;