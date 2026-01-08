/**
 * @file App.js
 * @description Point d'entree de l'application - 100% Redux.
 * @version 4.0.0
 * 
 * @changelog
 * v4.0.0 - Migration complete vers Redux
 *   - Goals et Counter utilisent tous deux Redux
 *   - Tout l'etat est dans le store
 *   - App.js ne contient plus de useState
 * 
 * ARCHITECTURE:
 * -------------
 * 
 *   ┌─────────────────────────────────────────────────────────┐
 *   │                        App.js                           │
 *   │  ┌───────────────────────────────────────────────────┐  │
 *   │  │              <Provider store={store}>              │  │
 *   │  │                                                    │  │
 *   │  │  ┌──────────────────────────────────────────────┐ │  │
 *   │  │  │              <MainApp />                     │ │  │
 *   │  │  │                                              │ │  │
 *   │  │  │  ┌────────────────────────────────────────┐ │ │  │
 *   │  │  │  │           <GoalsList />                │ │ │  │
 *   │  │  │  │  useSelector(goals) + useDispatch()   │ │ │  │
 *   │  │  │  └────────────────────────────────────────┘ │ │  │
 *   │  │  │                                              │ │  │
 *   │  │  │  ┌────────────────────────────────────────┐ │ │  │
 *   │  │  │  │           <Counter />                  │ │ │  │
 *   │  │  │  │  useSelector(counter) + useDispatch() │ │ │  │
 *   │  │  │  └────────────────────────────────────────┘ │ │  │
 *   │  │  └──────────────────────────────────────────────┘ │  │
 *   │  └───────────────────────────────────────────────────┘  │
 *   └─────────────────────────────────────────────────────────┘
 *                            │
 *                            ▼
 *   ┌─────────────────────────────────────────────────────────┐
 *   │                    Redux Store                           │
 *   │  ┌───────────────────────────────────────────────────┐  │
 *   │  │  state: {                                         │  │
 *   │  │    counter: { value: 0 },                         │  │
 *   │  │    goals: {                                       │  │
 *   │  │      items: [...],                                │  │
 *   │  │      addModalVisible: false,                      │  │
 *   │  │      editModalVisible: false,                     │  │
 *   │  │      ...                                          │  │
 *   │  │    }                                              │  │
 *   │  │  }                                                │  │
 *   │  └───────────────────────────────────────────────────┘  │
 *   └─────────────────────────────────────────────────────────┘
 * 
 * STRUCTURE DES FICHIERS:
 * -----------------------
 * src/
 *   app/
 *     store.js                 <- configureStore({ counter, goals })
 *   features/
 *     counter/
 *       Counter.js             <- useSelector + useDispatch
 *       counterSlice.js        <- createSlice (state + actions)
 *     goals/
 *       GoalsList.js           <- useSelector + useDispatch
 *       goalsSlice.js          <- createSlice (state + actions)
 *   components/
 *     GoalItem.js              <- Composant presentationnel
 *     GoalInput.js             <- Composant presentationnel
 *     AddModal.js              <- Composant presentationnel
 *     EditModal.js             <- Composant presentationnel
 *     CompletedGoals.js        <- Composant presentationnel
 */

import { useState } from 'react';
import { StyleSheet, View, Pressable, Text, SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';

// Store Redux
import { store } from './src/app/store';

// Features Redux
import { GoalsList } from './src/features/goals/GoalsList';
import { Counter } from './src/features/counter/Counter';

/**
 * Composant principal avec toggle Counter
 * Le seul useState restant est pour l'affichage du Counter (UI locale)
 */
function MainApp() {
  // Etat local uniquement pour le toggle Counter (pas besoin de Redux pour ca)
  const [counterVisible, setCounterVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Liste des objectifs (100% Redux) */}
      <GoalsList />
      
      {/* Bouton toggle Counter */}
      <View style={styles.counterSection}>
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
      </View>
    </View>
  );
}

/**
 * App racine avec Provider Redux
 * Tout l'etat de l'application est dans le store
 */
export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  counterSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  counterToggleButton: {
    backgroundColor: '#764abc',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  counterToggleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});
