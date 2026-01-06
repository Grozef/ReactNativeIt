import { StyleSheet, View, Text, FlatList, Pressable, Modal } from 'react-native';
import GoalItem from './GoalItem';

export default function CompletedGoals({ visible, goals, onClose, onDelete }) {
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
                  <GoalItem
                    id={item.id}
                    text={item.text}
                    done={true}
                    onDelete={onDelete}
                    onEdit={() => {}}
                    onDone={() => {}}
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
});
