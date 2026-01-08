/**
 * @file src/features/counter/Counter.js
 * @description Composant Counter qui utilise Redux pour l'etat.
 * @see https://redux-toolkit.js.org/tutorials/quick-start
 * @version 1.0.0
 * 
 * Ce composant utilise les hooks React-Redux:
 * - useSelector: lire des donnees du store
 * - useDispatch: envoyer des actions au store
 */

import { useState } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

// Import des actions et selecteurs depuis le slice
import {
  increment,
  decrement,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from './counterSlice';

/**
 * Composant logo Redux stylise
 * Represente le logo Redux avec des formes React Native
 * 
 * @returns {JSX.Element} Logo Redux
 */
function ReduxLogo() {
  return (
    <View style={logoStyles.container}>
      {/* Cercle central */}
      <View style={logoStyles.centerDot} />
      
      {/* Les 3 orbites elliptiques */}
      <View style={[logoStyles.orbit, logoStyles.orbit1]} />
      <View style={[logoStyles.orbit, logoStyles.orbit2]} />
      <View style={[logoStyles.orbit, logoStyles.orbit3]} />
      
      {/* Les 3 points sur les orbites */}
      <View style={[logoStyles.orbitDot, logoStyles.dot1]} />
      <View style={[logoStyles.orbitDot, logoStyles.dot2]} />
      <View style={[logoStyles.orbitDot, logoStyles.dot3]} />
    </View>
  );
}

/**
 * Composant principal Counter
 * Affiche un compteur avec boutons +/- et actions avancees
 * 
 * PATTERN REDUX:
 * 1. useSelector() lit la valeur depuis le store
 * 2. useDispatch() recupere la fonction dispatch
 * 3. dispatch(action()) envoie une action au store
 * 4. Le reducer traite l'action et met a jour le state
 * 5. useSelector() detecte le changement et re-rend le composant
 * 
 * @returns {JSX.Element} Composant Counter
 */
export function Counter() {
  /**
   * useSelector: Hook pour lire des donnees du store Redux
   * Re-rend le composant quand la valeur selectionnee change
   * 
   * Equivalent a: const count = store.getState().counter.value
   */
  const count = useSelector(selectCount);
  
  /**
   * useDispatch: Hook pour obtenir la fonction dispatch
   * dispatch() envoie une action au store
   */
  const dispatch = useDispatch();
  
  /**
   * Etat local pour le montant a ajouter
   * (pas besoin de Redux pour un etat de formulaire local)
   */
  const [incrementAmount, setIncrementAmount] = useState('2');
  
  /**
   * Etat local pour le loading de l'action async
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Convertit le montant saisi en nombre
   * @returns {number} Montant ou 0 si invalide
   */
  const incrementValue = Number(incrementAmount) || 0;

  /**
   * Gere l'increment asynchrone avec etat de loading
   */
  const handleAddAsync = async () => {
    setIsLoading(true);
    await dispatch(incrementAsync(incrementValue));
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Logo Redux */}
      <View style={styles.logoContainer}>
        <ReduxLogo />
      </View>

      {/* Ligne du compteur: - [valeur] + */}
      <View style={styles.counterRow}>
        {/* Bouton decrement */}
        <Pressable
          style={({ pressed }) => [
            styles.counterButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => dispatch(decrement())}
          aria-label="Decrement value"
        >
          <Text style={styles.counterButtonText}>-</Text>
        </Pressable>

        {/* Affichage de la valeur */}
        <Text style={styles.countDisplay}>{count}</Text>

        {/* Bouton increment */}
        <Pressable
          style={({ pressed }) => [
            styles.counterButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => dispatch(increment())}
          aria-label="Increment value"
        >
          <Text style={styles.counterButtonText}>+</Text>
        </Pressable>
      </View>

      {/* Ligne des actions: [input] [Add Amount] [Add Async] */}
      <View style={styles.actionsRow}>
        {/* Input pour le montant */}
        <TextInput
          style={styles.amountInput}
          value={incrementAmount}
          onChangeText={setIncrementAmount}
          keyboardType="numeric"
          aria-label="Set increment amount"
        />

        {/* Bouton Add Amount (synchrone) */}
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => dispatch(incrementByAmount(incrementValue))}
        >
          <Text style={styles.actionButtonText}>Add Amount</Text>
        </Pressable>

        {/* Bouton Add Async (asynchrone avec delai) */}
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.buttonPressed,
            isLoading && styles.buttonLoading,
          ]}
          onPress={handleAddAsync}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>
            {isLoading ? 'Adding...' : 'Add Async'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Styles du logo Redux
 */
const logoStyles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#764abc',
    position: 'absolute',
    zIndex: 10,
  },
  orbit: {
    position: 'absolute',
    width: 80,
    height: 35,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#764abc',
    backgroundColor: 'transparent',
  },
  orbit1: {
    transform: [{ rotate: '0deg' }],
  },
  orbit2: {
    transform: [{ rotate: '60deg' }],
  },
  orbit3: {
    transform: [{ rotate: '120deg' }],
  },
  orbitDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#764abc',
    position: 'absolute',
  },
  dot1: {
    top: 12,
    right: 8,
  },
  dot2: {
    bottom: 12,
    right: 8,
  },
  dot3: {
    left: 8,
    top: '50%',
    marginTop: -6,
  },
});

/**
 * Styles du composant Counter
 */
const styles = StyleSheet.create({
  /** Conteneur principal */
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  /** Conteneur du logo */
  logoContainer: {
    marginBottom: 24,
  },
  /** Ligne du compteur */
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  /** Boutons + et - */
  counterButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /** Texte des boutons +/- */
  counterButtonText: {
    fontSize: 32,
    color: '#764abc',
    fontWeight: '300',
  },
  /** Affichage de la valeur */
  countDisplay: {
    fontSize: 48,
    fontWeight: '300',
    color: '#1a1a2e',
    minWidth: 100,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  /** Ligne des actions */
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  /** Input du montant */
  amountInput: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: '#764abc',
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 16,
    color: '#1a1a2e',
    backgroundColor: '#ffffff',
  },
  /** Boutons d'action */
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#764abc',
    borderRadius: 4,
  },
  /** Texte des boutons d'action */
  actionButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
  /** Etat presse */
  buttonPressed: {
    opacity: 0.7,
  },
  /** Etat loading */
  buttonLoading: {
    backgroundColor: '#9b7bc7',
  },
});

export default Counter;
