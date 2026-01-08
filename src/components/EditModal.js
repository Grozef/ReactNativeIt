/**
 * @file src/components/EditModal.js
 * @description Modal d'edition d'un objectif existant.
 * @version 2.0.0
 */

import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, Modal } from 'react-native';

export default function EditModal({ visible, goal, onSave, onCancel }) {
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    if (goal) {
      setEditedText(goal.text);
    }
  }, [goal]);

  const saveHandler = () => {
    onSave(editedText);
    setEditedText('');
  };

  const cancelHandler = () => {
    setEditedText('');
    onCancel();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Modifier l'objectif</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Modifier votre objectif..."
            placeholderTextColor="#888"
            value={editedText}
            onChangeText={setEditedText}
            autoFocus={true}
            multiline={true}
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
  saveButton: {
    backgroundColor: '#38b000',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
