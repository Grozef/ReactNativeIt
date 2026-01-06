import { StyleSheet, View, Text, Pressable } from 'react-native';

export default function GoalItem({ id, text, done, onDelete, onEdit, onDone }) {
  return (
    <View style={[styles.goalItem, done && styles.goalItemDone]}>
      <Pressable
        style={({ pressed }) => [
          styles.textContainer,
          pressed && styles.pressed,
        ]}
        onPress={onEdit}
        android_ripple={{ color: '#4a4a6a' }}
      >
        <Text style={[styles.goalText, done && styles.goalTextDone]}>{text}</Text>
      </Pressable>
      {!done && (
        <Pressable
          style={({ pressed }) => [
            styles.doneButton,
            pressed && styles.pressedDone,
          ]}
          onPress={() => onDone(id)}
        >
          <Text style={styles.doneText}>&#10003;</Text>
        </Pressable>
      )}
      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.pressedDelete,
        ]}
        onPress={() => onDelete(id)}
      >
        <Text style={styles.deleteText}>&#10005;</Text>
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
  goalItemDone: {
    borderLeftColor: '#4ade80',
    backgroundColor: '#1a2e1a',
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
  goalTextDone: {
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  doneButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressedDone: {
    opacity: 0.5,
  },
  doneText: {
    color: '#4ade80',
    fontSize: 20,
    fontWeight: 'bold',
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
