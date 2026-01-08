/**
 * @file AddModal.js
 * @description Modal d'ajout d'un nouvel objectif ou sous-objectif.
 * @version 2.1.0
 * 
 * @changelog
 * v2.1.0 - Le texte saisi dans l'input est pre-rempli dans la modal
 * v2.0.0 - Ajout du support pour les sous-objectifs
 * 
 * MODIFICATIONS EFFECTUEES:
 * -------------------------
 * 1. Nouvelles props: parentId, parentGoal pour identifier le parent
 * 2. Modification onAdd: passe maintenant (text, parentId) au lieu de (text)
 * 3. Ajout useEffect pour reset le champ quand la modal s'ouvre
 * 4. Titre dynamique: "Nouvel objectif" ou "Sous-objectif de X"
 * 5. Placeholder dynamique selon le contexte
 * 6. Ajout indicateur visuel du parent (bandeau orange)
 * 7. Nouveaux styles: parentIndicator, parentLabel, parentText
 * 8. [AJOUT v2.1] Nouvelle prop initialText pour pre-remplir le champ
 */

import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, Modal } from 'react-native';

/**
 * Modal pour ajouter un nouvel objectif
 * Supporte l'ajout de sous-objectifs si un parent est specifie
 * [MODIFICATION v2.1] Supporte le pre-remplissage du champ via initialText
 * 
 * @param {Object} props - Proprietes du composant
 * @param {boolean} props.visible - Visibilite de la modal
 * @param {string|null} props.parentId - ID du parent (null pour objectif racine)
 * @param {Object|null} props.parentGoal - Objectif parent (pour affichage)
 * @param {string} props.initialText - Texte initial pour pre-remplir le champ [AJOUT v2.1]
 * @param {Function} props.onAdd - Callback d'ajout (text, parentId) => void
 * @param {Function} props.onCancel - Callback d'annulation
 * @returns {JSX.Element} Composant AddModal
 */
export default function AddModal({ visible, parentId, parentGoal, initialText = '', onAdd, onCancel }) {
  /**
   * @type {[string, Function]} Texte saisi
   */
  const [enteredGoal, setEnteredGoal] = useState('');

  /**
   * [MODIFICATION v2.1] Reset le champ avec initialText quand la modal s'ouvre
   * Utilise initialText si fourni, sinon chaine vide
   */
  useEffect(() => {
    if (visible) {
      setEnteredGoal(initialText || '');
    }
  }, [visible, initialText]);

  /**
   * Gere l'ajout d'un objectif
   * Transmet le parentId si present
   */
  const addHandler = () => {
    onAdd(enteredGoal, parentId);
    setEnteredGoal('');
  };

  /**
   * Gere l'annulation
   * Reset le champ et ferme la modal
   */
  const cancelHandler = () => {
    setEnteredGoal('');
    onCancel();
  };

  /**
   * Determine le titre de la modal
   * @type {string}
   */
  const title = parentGoal 
    ? `Sous-objectif de "${parentGoal.text}"` 
    : 'Nouvel objectif';

  /**
   * Determine le placeholder
   * @type {string}
   */
  const placeholder = parentGoal
    ? 'Entrez votre sous-objectif...'
    : 'Entrez votre objectif...';

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Titre de la modal */}
          <Text style={styles.modalTitle}>{title}</Text>

          {/* Indicateur de parent si sous-objectif */}
          {parentGoal && (
            <View style={styles.parentIndicator}>
              <Text style={styles.parentLabel}>Parent:</Text>
              <Text style={styles.parentText}>{parentGoal.text}</Text>
            </View>
          )}

          {/* Champ de saisie */}
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor="#888"
            value={enteredGoal}
            onChangeText={setEnteredGoal}
            autoFocus={true}
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
                  styles.addButton,
                  pressed && styles.pressed,
                ]}
                onPress={addHandler}
                android_ripple={{ color: '#7b2cbf' }}
              >
                <Text style={styles.buttonText}>Ajouter</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Styles du composant AddModal
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
  /** Indicateur du parent */
  parentIndicator: {
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  /** Label "Parent:" */
  parentLabel: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 4,
  },
  /** Texte du parent */
  parentText: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '500',
  },
  /** Champ de saisie */
  textInput: {
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
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
  /** Bouton ajouter */
  addButton: {
    backgroundColor: '#5e60ce',
  },
  /** Texte des boutons */
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});