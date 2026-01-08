/**
 * @file src/components/GoalInput.js
 * @description Composant de saisie pour ajouter un nouvel objectif.
 * @version 2.1.0
 */

import { StyleSheet, View, TextInput, Text, Pressable } from 'react-native';

export default function GoalInput({ onOpenModal, inputText, onInputChange }) {
  const handleOpenModal = () => {
    onOpenModal(inputText);
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Votre objectif..."
        placeholderTextColor="#888"
        value={inputText}
        onChangeText={onInputChange}
      />
      
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

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    padding: 14,
    color: '#ffffff',
    fontSize: 16,
  },
  buttonWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  addButton: {
    backgroundColor: '#5e60ce',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
