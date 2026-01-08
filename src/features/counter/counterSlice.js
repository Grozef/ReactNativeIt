/**
 * @file src/features/counter/counterSlice.js
 * @description Slice Redux pour le compteur avec actions et reducers.
 * @see https://redux-toolkit.js.org/tutorials/quick-start
 * @version 1.0.0
 * 
 * Un "slice" est une portion de l'etat Redux avec:
 * - Un nom unique
 * - Un etat initial
 * - Des reducers (fonctions qui modifient l'etat)
 * 
 * createSlice() genere automatiquement les action creators.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Etat initial du compteur
 * @type {Object}
 * @property {number} value - Valeur actuelle du compteur
 */
const initialState = {
  value: 0,
};

/**
 * Action asynchrone pour incrementer apres un delai
 * createAsyncThunk permet de gerer les actions async (API calls, timers, etc.)
 * 
 * @param {number} amount - Montant a ajouter
 * @returns {Promise<number>} Le montant apres le delai
 * 
 * @example
 * dispatch(incrementAsync(5)); // Ajoute 5 apres 1 seconde
 */
export const incrementAsync = createAsyncThunk(
  'counter/incrementAsync',  // Nom de l'action
  async (amount) => {
    // Simule un appel API avec un delai de 1 seconde
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return amount;
  }
);

/**
 * Slice du compteur
 * Contient le nom, l'etat initial et les reducers
 */
export const counterSlice = createSlice({
  // Nom du slice (utilisé pour generer les noms d'actions)
  name: 'counter',
  
  // Etat initial
  initialState,
  
  /**
   * Reducers: fonctions qui modifient l'etat
   * 
   * Redux Toolkit utilise Immer en interne, ce qui permet d'ecrire
   * du code "mutatif" qui produit en realite des mises a jour immutables.
   * 
   * Exemple:
   * - SANS Immer: return { ...state, value: state.value + 1 }
   * - AVEC Immer: state.value += 1
   */
  reducers: {
    /**
     * Incremente la valeur de 1
     * @param {Object} state - Etat actuel (draft Immer)
     */
    increment: (state) => {
      state.value += 1;
    },
    
    /**
     * Decremente la valeur de 1
     * @param {Object} state - Etat actuel (draft Immer)
     */
    decrement: (state) => {
      state.value -= 1;
    },
    
    /**
     * Incremente la valeur d'un montant specifique
     * @param {Object} state - Etat actuel (draft Immer)
     * @param {Object} action - Action Redux
     * @param {number} action.payload - Montant a ajouter
     */
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
  
  /**
   * extraReducers: gere les actions externes (comme les thunks async)
   * 
   * Les actions async ont 3 etats:
   * - pending: en cours
   * - fulfilled: reussi
   * - rejected: echoue
   */
  extraReducers: (builder) => {
    builder
      // Quand incrementAsync est termine avec succes
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.value += action.payload;
      });
  },
});

/**
 * Export des action creators
 * Ces fonctions sont generees automatiquement par createSlice()
 * 
 * @example
 * import { increment, decrement, incrementByAmount } from './counterSlice';
 * 
 * dispatch(increment());           // { type: 'counter/increment' }
 * dispatch(decrement());           // { type: 'counter/decrement' }
 * dispatch(incrementByAmount(5));  // { type: 'counter/incrementByAmount', payload: 5 }
 */
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

/**
 * Selecteur pour lire la valeur du compteur depuis le state
 * 
 * @param {Object} state - State global Redux
 * @returns {number} Valeur du compteur
 * 
 * @example
 * const count = useSelector(selectCount);
 */
export const selectCount = (state) => state.counter.value;

/**
 * Export du reducer pour l'ajouter au store
 */
export default counterSlice.reducer;
