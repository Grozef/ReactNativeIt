/**
 * @file App.js
 * @description Application Life Goals avec Counter Redux integre.
 * @version 3.0.0
 * 
 * @changelog
 * v3.0.0 - Integration Redux Toolkit + Life Goals
 *   - Structure src/ avec app/store.js et features/counter/
 *   - Provider Redux wrappant toute l'application
 *   - Counter accessible via bouton toggle
 * 
 * STRUCTURE:
 * ----------
 * src/
 *   app/
 *     store.js              <- Configuration Redux store
 *   features/
 *     counter/
 *       Counter.js          <- Composant Counter UI
 *       counterSlice.js     <- Slice Redux (state + actions)
 *   components/
 *     GoalItem.js           <- Objectif hierarchique
 *     GoalInput.js          <- Barre de saisie
 *     AddModal.js           <- Modal ajout
 *     EditModal.js          <- Modal edition
 *     CompletedGoals.js     <- Modal objectifs termines
 */

import { useState, useRef } from 'react';
import { StyleSheet, View, FlatList, ImageBackground, Pressable, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ConfettiCannon from 'react-native-confetti-cannon';

// Redux
import { Provider } from 'react-redux';
import { store } from './src/app/store';

// Components
import GoalItem from './src/components/GoalItem';
import GoalInput from './src/components/GoalInput';
import AddModal from './src/components/AddModal';
import EditModal from './src/components/EditModal';
import CompletedGoals from './src/components/CompletedGoals';
import { Counter } from './src/features/counter/Counter';

/**
 * Donnees initiales avec exemples hierarchiques
 */
const INITIAL_GOALS = [
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
 * Composant principal de l'application
 */
function LifeGoalsApp() {
  // ============================================================
  // ETATS
  // ============================================================
  
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [completedModalVisible, setCompletedModalVisible] = useState(false);
  const [counterVisible, setCounterVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [inputText, setInputText] = useState('');
  const [addingToParentId, setAddingToParentId] = useState(null);
  const [initialModalText, setInitialModalText] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef(null);

  // ============================================================
  // FONCTIONS UTILITAIRES HIERARCHIE
  // ============================================================

  const getChildren = (parentId) => {
    return goals.filter(goal => goal.parentId === parentId);
  };

  const areAllChildrenDone = (parentId) => {
    const children = getChildren(parentId);
    if (children.length === 0) return true;
    return children.every(child => isEffectivelyDone(child));
  };

  const hasChildren = (goalId) => {
    return goals.some(goal => goal.parentId === goalId);
  };

  const isEffectivelyDone = (goal) => {
    const children = getChildren(goal.id);
    if (children.length === 0) {
      return goal.done;
    }
    return goal.done && children.every(child => isEffectivelyDone(child));
  };

  // ============================================================
  // FILTRAGE
  // ============================================================

  const rootGoals = goals.filter(goal => goal.parentId === null);
  const activeRootGoals = rootGoals.filter(goal => !isEffectivelyDone(goal));
  const completedRootGoals = rootGoals.filter(goal => isEffectivelyDone(goal));

  // ============================================================
  // HANDLERS
  // ============================================================

  const addGoalHandler = (goalText, parentId = null) => {
    if (goalText.trim().length === 0) return;
    setGoals((currentGoals) => [
      ...currentGoals,
      { 
        id: String(Date.now()), 
        text: goalText, 
        done: false, 
        parentId: parentId
      },
    ]);
    setAddModalVisible(false);
    setAddingToParentId(null);
    setInputText('');
    setInitialModalText('');
  };

  const deleteGoalHandler = (id) => {
    const getIdsToDelete = (goalId) => {
      const children = goals.filter(g => g.parentId === goalId);
      let ids = [goalId];
      children.forEach(child => {
        ids = [...ids, ...getIdsToDelete(child.id)];
      });
      return ids;
    };
    
    const idsToDelete = getIdsToDelete(id);
    setGoals((currentGoals) =>
      currentGoals.filter((goal) => !idsToDelete.includes(goal.id))
    );
  };

  const doneGoalHandler = (id) => {
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === id ? { ...goal, done: true } : goal
      )
    );
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const undoGoalHandler = (id) => {
    setGoals((currentGoals) => {
      let updated = currentGoals.map((goal) =>
        goal.id === id ? { ...goal, done: false } : goal
      );
      
      const undoParents = (goals, goalId) => {
        const goal = goals.find((g) => g.id === goalId);
        if (!goal || !goal.parentId) return goals;
        goals = goals.map((g) =>
          g.id === goal.parentId ? { ...g, done: false } : g
        );
        return undoParents(goals, goal.parentId);
      };
      
      return undoParents(updated, id);
    });
  };

  const startEditHandler = (goal) => {
    if (goal.done) return;
    setEditingGoal(goal);
    setEditModalVisible(true);
  };

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

  const cancelEditHandler = () => {
    setEditModalVisible(false);
    setEditingGoal(null);
  };

  const cancelAddHandler = () => {
    setAddModalVisible(false);
    setAddingToParentId(null);
    setInputText('');
    setInitialModalText('');
  };

  const openAddModalWithText = (text) => {
    setInitialModalText(text);
    setAddModalVisible(true);
  };

  const addSubGoalHandler = (parentId) => {
    setAddingToParentId(parentId);
    setInitialModalText('');
    setAddModalVisible(true);
  };

  // ============================================================
  // RENDU
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
          <FlatList
            data={activeRootGoals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <GoalItem
                goal={item}
                children={getChildren(item.id)}
                allGoals={goals}
                onDelete={deleteGoalHandler}
                onEdit={() => startEditHandler(item)}
                onDone={doneGoalHandler}
                onUndo={undoGoalHandler}
                onAddSubGoal={addSubGoalHandler}
                getChildren={getChildren}
                isEffectivelyDone={isEffectivelyDone}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Bouton Done */}
        <Pressable
          style={({ pressed }) => [
            styles.completedButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setCompletedModalVisible(true)}
        >
          <Text style={styles.completedButtonText}>
            Done ({completedRootGoals.length})
          </Text>
        </Pressable>

        {/* Bouton Counter Redux */}
        <Pressable
          style={({ pressed }) => [
            styles.counterToggleButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setCounterVisible(!counterVisible)}
        >
          <Text style={styles.counterToggleText}>
            {counterVisible ? 'Masquer Counter Redux' : 'Afficher Counter Redux'}
          </Text>
        </Pressable>

        {/* Counter Redux */}
        {counterVisible && <Counter />}

        {/* Modals */}
        <AddModal
          visible={addModalVisible}
          parentId={addingToParentId}
          parentGoal={addingToParentId ? goals.find(g => g.id === addingToParentId) : null}
          initialText={initialModalText}
          onAdd={addGoalHandler}
          onCancel={cancelAddHandler}
        />

        <EditModal
          visible={editModalVisible}
          goal={editingGoal}
          onSave={saveEditHandler}
          onCancel={cancelEditHandler}
        />

        <CompletedGoals
          visible={completedModalVisible}
          goals={completedRootGoals}
          allGoals={goals}
          onClose={() => setCompletedModalVisible(false)}
          onDelete={deleteGoalHandler}
          onUndo={undoGoalHandler}
          getChildren={getChildren}
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
 * App racine avec Provider Redux
 */
export default function App() {
  return (
    <Provider store={store}>
      <LifeGoalsApp />
    </Provider>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
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
  counterToggleButton: {
    backgroundColor: '#764abc',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  counterToggleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});
