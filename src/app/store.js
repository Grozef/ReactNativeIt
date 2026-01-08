/**
 * @file src/app/store.js
 * @description Configuration du store Redux avec Redux Toolkit.
 * @see https://redux-toolkit.js.org/tutorials/quick-start
 * @version 2.0.0
 * 
 * Le store contient:
 * - counter: etat du compteur (demo)
 * - goals: etat des objectifs de vie
 */

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import goalsReducer from '../features/goals/goalsSlice';

/**
 * Store Redux configure avec tous les reducers
 * 
 * @type {Object}
 * 
 * Structure du state:
 * {
 *   counter: { value: 0 },
 *   goals: { items: [...], addModalVisible: false, ... }
 * }
 */
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    goals: goalsReducer,
  },
});
