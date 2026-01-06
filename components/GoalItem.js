import { StyleSheet, View, Text, Pressable } from 'react-native';

export default function GoalItem({ id, text, onDelete, onEdit }) {
  return (
    <View style={styles.goalItem}>
      <Pressable
        style={({ pressed }) => [
          styles.textContainer,
          pressed && styles.pressed,
        ]}
        onPress={onEdit}
        android_ripple={{ color: '#4a4a6a' }}
      >
        <Text style={styles.goalText}>{text}</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.pressedDelete,
        ]}
        onPress={() => onDelete(id)}
      >
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e2e',
    borderRadius: 8,
    marginVertical: 6,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#5e60ce',
  },
  textContainer: {
    flex: 1,
    padding: 16,
  },
  pressed: {
    backgroundColor: '#2d2d44',
  },
  goalText: {
    color: '#ffffff',
    fontSize: 16,
  },
  deleteButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressedDelete: {
    opacity: 0.5,
  },
  deleteText: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
