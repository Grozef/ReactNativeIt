/**
 * @file EditModal.js
 * @description Modal d'edition d'un objectif existant.
 * @version 2.0.0
 */

import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, Modal } from 'react-native';

/**
 * Modal pour editer un objectif existant
 * 
 * @param {Object} props - Proprietes du composant
 * @param {boolean} props.visible - Visibilite de la modal
 * @param {Object|null} props.goal - Objectif a editer
 * @param {string} props.goal.id - ID de l'objectif
 * @param {string} props.goal.text - Texte de l'objectif
 * @param {Function} props.onSave - Callback de sauvegarde (newText) => void
 * @param {Function} props.onCancel - Callback d'annulation
 * @returns {JSX.Element} Composant EditModal
 */
export default function EditModal({ visible, goal, onSave, onCancel }) {
  /**
   * @type {[string, Function]} Texte edite
   */
  const [editedText, setEditedText] = useState('');

  /**
   * Met a jour le texte quand l'objectif change
   */
  useEffect(() => {
    if (goal) {
      setEditedText(goal.text);
    }
  }, [goal]);

  /**
   * Gere la sauvegarde des modifications
   */
  const saveHandler = () => {
    onSave(editedText);
    setEditedText('');
  };

  /**
   * Gere l'annulation de l'edition
   */
  const cancelHandler = () => {
    setEditedText('');
    onCancel();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Titre */}
          <Text style={styles.modalTitle}>Modifier l'objectif</Text>

          {/* Champ de saisie */}
          <TextInput
            style={styles.textInput}
            placeholder="Modifier votre objectif..."
            placeholderTextColor="#888"
            value={editedText}
            onChangeText={setEditedText}
            autoFocus={true}
            multiline={true}
          />

          {/* Boutons d'action */}
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  pressed && styles.pressed,
                ]}
                onPress={cancelHandler}
                android_ripple={{ color: '#555' }}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </Pressable>
            </View>

            <View style={styles.buttonWrapper}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.saveButton,
                  pressed && styles.pressed,
                ]}
                onPress={saveHandler}
                android_ripple={{ color: '#2d8a4e' }}
              >
                <Text style={styles.buttonText}>Sauvegarder</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Styles du composant EditModal
 * @type {Object}
 */
const styles = StyleSheet.create({
  /** Overlay semi-transparent */
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  /** Contenu de la modal */
  modalContent: {
    backgroundColor: '#1e1e2e',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  /** Titre de la modal */
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  /** Champ de saisie */
  textInput: {
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  /** Conteneur des boutons */
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  /** Wrapper des boutons */
  buttonWrapper: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  /** Style de base des boutons */
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  /** Etat presse */
  pressed: {
    opacity: 0.7,
  },
  /** Bouton annuler */
  cancelButton: {
    backgroundColor: '#444',
  },
  /** Bouton sauvegarder */
  saveButton: {
    backgroundColor: '#38b000',
  },
  /** Texte des boutons */
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
