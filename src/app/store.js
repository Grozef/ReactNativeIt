/**
 * @file src/app/store.js
 * @description Configuration du store Redux avec Redux Toolkit.
 * @see https://redux-toolkit.js.org/tutorials/quick-start
 * @version 1.0.0
 * 
 * Le store est le conteneur central qui detient tout l'etat de l'application.
 * configureStore() simplifie la configuration et ajoute automatiquement:
 * - Redux DevTools
 * - redux-thunk middleware (pour les actions async)
 * - Verification des mutations accidentelles
 */

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

/**
 * Store Redux configure avec tous les reducers de l'application
 * 
 * @type {Object}
 * 
 * @example
 * // Structure du state:
 * // {
 * //   counter: { value: 0 }
 * // }
 */
export const store = configureStore({
  /**
   * reducer: Objet contenant tous les slice reducers
   * Chaque cle devient une propriete du state global
   */
  reducer: {
    counter: counterReducer,  // state.counter sera gere par counterSlice
  },
});
