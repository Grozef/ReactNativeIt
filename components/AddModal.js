import { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable, Modal } from 'react-native';

export default function AddModal({ visible, onAdd, onCancel }) {
  const [enteredGoal, setEnteredGoal] = useState('');

  const addHandler = () => {
    onAdd(enteredGoal);
    setEnteredGoal('');
  };

  const cancelHandler = () => {
    setEnteredGoal('');
    onCancel();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nouvel objectif</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Entrez votre objectif..."
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
