import { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Pressable,
  Modal,
} from 'react-native';

export default function GoalInput({ onAddGoal, visible, onOpenModal, onCloseModal }) {
  const [enteredGoal, setEnteredGoal] = useState('');

  const goalInputHandler = (text) => {
    setEnteredGoal(text);
  };

  const addGoalHandler = () => {
    onAddGoal(enteredGoal);
    setEnteredGoal('');
  };

  const cancelHandler = () => {
    setEnteredGoal('');
    onCloseModal();
  };

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          styles.openButton,
          pressed && styles.pressedButton,
        ]}
        onPress={onOpenModal}
        android_ripple={{ color: '#7b2cbf' }}
      >
        <Text style={styles.openButtonText}>+ Ajouter un objectif</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvel objectif</Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="Entrez votre objectif..."
              placeholderTextColor="#888"
              onChangeText={goalInputHandler}
              value={enteredGoal}
              autoFocus={true}
            />

            <View style={styles.buttonContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  pressed && styles.pressedButton,
                ]}
                onPress={cancelHandler}
                android_ripple={{ color: '#666' }}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.addButton,
                  pressed && styles.pressedButton,
                ]}
                onPress={addGoalHandler}
                android_ripple={{ color: '#7b2cbf' }}
              >
                <Text style={styles.buttonText}>Ajouter</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  openButton: {
    backgroundColor: '#5e60ce',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  openButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pressedButton: {
    opacity: 0.7,
  },
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
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
