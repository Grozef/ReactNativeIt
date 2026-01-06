import { StyleSheet, View, Text, FlatList, Pressable, Modal } from 'react-native';

function CompletedGoalItem({ id, text, onDelete, onUndo }) {
  return (
    <View style={styles.goalItem}>
      <View style={styles.textContainer}>
        <Text style={styles.goalText}>{text}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.undoButton,
          pressed && styles.pressedButton,
        ]}
        onPress={() => onUndo(id)}
      >
        <Text style={styles.undoText}>&#8634;</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.pressedButton,
        ]}
        onPress={() => onDelete(id)}
      >
        <Text style={styles.deleteText}>&#10005;</Text>
      </Pressable>
    </View>
  );
}

export default function CompletedGoals({ visible, goals, onClose, onDelete, onUndo }) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Objectifs Accomplis</Text>
            <Pressable
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
              onPress={onClose}
            >
              <Text style={styles.closeText}>&#10005;</Text>
            </Pressable>
          </View>
          
          {goals.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun objectif accompli pour le moment</Text>
              <Text style={styles.emptySubtext}>Continuez vos efforts !</Text>
            </View>
          ) : (
            <>
              <View style={styles.statsContainer}>
                <Text style={styles.statsText}>{goals.length} objectif{goals.length > 1 ? 's' : ''} accompli{goals.length > 1 ? 's' : ''}</Text>
              </View>
              <FlatList
                data={goals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <CompletedGoalItem
                    id={item.id}
                    text={item.text}
                    onDelete={onDelete}
                    onUndo={onUndo}
                  />
                )}
                showsVerticalScrollIndicator={false}
                style={styles.list}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e1e2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
  },
  title: {
    color: '#4ade80',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  pressed: {
    opacity: 0.5,
  },
  closeText: {
    color: '#9ca3af',
    fontSize: 20,
  },
  statsContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  statsText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  list: {
    marginTop: 8,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#6b7280',
    fontSize: 14,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2e1a',
    borderRadius: 8,
    marginVertical: 6,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#4ade80',
  },
  textContainer: {
    flex: 1,
    padding: 16,
  },
  goalText: {
    color: '#9ca3af',
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  undoButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressedButton: {
    opacity: 0.5,
  },
  undoText: {
    color: '#60a5fa',
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteText: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
