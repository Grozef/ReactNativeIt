import { StyleSheet, View, Text, Pressable } from 'react-native';

export default function GoalItem({ id, text, onDelete, onEdit }) {
  return (
    <View style={styles.goalItem}>
      <Pressable
        android_ripple={{ color: '#4a90d9' }}
        onPress={onEdit}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressedItem,
        ]}
      >
        <Text style={styles.goalText}>{text}</Text>
      </Pressable>
      <Pressable
        onPress={() => onDelete(id)}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.pressedDelete,
        ]}
        android_ripple={{ color: '#ff6b6b' }}
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
  pressable: {
    flex: 1,
    padding: 16,
  },
  pressedItem: {
    opacity: 0.7,
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
