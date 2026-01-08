/**
 * @file src/components/AddModal.js
 * @description Modal d'ajout d'un nouvel objectif ou sous-objectif.
 * @version 2.1.0
 */

import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, Modal } from 'react-native';

export default function AddModal({ visible, parentId, parentGoal, initialText = '', onAdd, onCancel }) {
  const [enteredGoal, setEnteredGoal] = useState('');

  useEffect(() => {
    if (visible) {
      setEnteredGoal(initialText || '');
    }
  }, [visible, initialText]);

  const addHandler = () => {
    onAdd(enteredGoal, parentId);
    setEnteredGoal('');
  };

  const cancelHandler = () => {
    setEnteredGoal('');
    onCancel();
  };

  const title = parentGoal 
    ? `Sous-objectif de "${parentGoal.text}"` 
    : 'Nouvel objectif';

  const placeholder = parentGoal
    ? 'Entrez votre sous-objectif...'
    : 'Entrez votre objectif...';

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>

          {parentGoal && (
            <View style={styles.parentIndicator}>
              <Text style={styles.parentLabel}>Parent:</Text>
              <Text style={styles.parentText}>{parentGoal.text}</Text>
            </View>
          )}

          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor="#888"
            value={enteredGoal}
            onChangeText={setEnteredGoal}
            autoFocus={true}
          />

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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#1e1e2e',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  parentIndicator: {
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  parentLabel: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 4,
  },
  parentText: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  buttonWrapper: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  cancelButton: {
    backgroundColor: '#444',
  },
  addButton: {
    backgroundColor: '#5e60ce',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
