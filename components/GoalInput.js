/**
 * @file GoalInput.js
 * @description Composant de saisie pour ajouter un nouvel objectif.
 * @version 2.1.0
 * 
 * @changelog
 * v2.1.0 - Le texte saisi est transmis a la modal
 * 
 * MODIFICATIONS EFFECTUEES:
 * -------------------------
 * 1. [MODIFICATION v2.1] onOpenModal recoit maintenant le texte saisi en parametre
 * 2. [AJOUT v2.1] Nouvelle prop onTextChange pour synchroniser avec App.js
 * 3. [AJOUT v2.1] Prop initialText pour reset apres fermeture modal
 */

import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable } from 'react-native';

/**
 * Composant de saisie d'objectif
 * Affiche un champ de texte et un bouton d'ajout
 * [MODIFICATION v2.1] Le texte saisi est transmis a la modal
 * 
 * @param {Object} props - Proprietes du composant
 * @param {Function} props.onOpenModal - Callback pour ouvrir la modal (recoit le texte) [MODIFICATION v2.1]
 * @param {string} props.inputText - Texte controle depuis App.js [AJOUT v2.1]
 * @param {Function} props.onInputChange - Callback quand le texte change [AJOUT v2.1]
 * @returns {JSX.Element} Composant GoalInput
 */
export default function GoalInput({ onOpenModal, inputText, onInputChange }) {
  /**
   * [MODIFICATION v2.1] Gere l'ouverture de la modal
   * Transmet le texte saisi a la modal
   */
  const handleOpenModal = () => {
    onOpenModal(inputText);
  };

  return (
    <View style={styles.inputContainer}>
      {/* Champ de saisie */}
      <TextInput
        style={styles.textInput}
        placeholder="Votre objectif..."
        placeholderTextColor="#888"
        value={inputText}
        onChangeText={onInputChange}
      />
      
      {/* Bouton d'ajout */}
      <View style={styles.buttonWrapper}>
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.pressed,
          ]}
          onPress={handleOpenModal}
          android_ripple={{ color: '#7b2cbf' }}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Styles du composant GoalInput
 * @type {Object}
 */
const styles = StyleSheet.create({
  /** Conteneur principal */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  /** Champ de saisie */
  textInput: {
    flex: 1,
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    padding: 14,
    color: '#ffffff',
    fontSize: 16,
  },
  /** Wrapper du bouton */
  buttonWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  /** Bouton d'ajout */
  addButton: {
    backgroundColor: '#5e60ce',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  /** Etat presse */
  pressed: {
    opacity: 0.7,
  },
  /** Texte du bouton */
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});