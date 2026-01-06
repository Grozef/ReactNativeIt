import { useState } from 'react';
import { StyleSheet, View, FlatList, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import GoalItem from './components/GoalItem';
import GoalInput from './components/GoalInput';
import AddModal from './components/AddModal';
import EditModal from './components/EditModal';

const sampleGoals = [
  "Faire les courses",
  "Aller à la salle de sport 3 fois par semaine",
  "Monter à plus de 5000m d altitude",
  "Acheter mon premier appartement",
  "Perdre 5 kgs",
  "Gagner en productivité",
  "Apprendre un nouveau langage",
  "Faire une mission en freelance",
  "Organiser un meetup autour de la tech",
  "Faire un triathlon",
];

export default function App() {
  const [goals, setGoals] = useState(
    sampleGoals.map((text, index) => ({ id: String(index), text }))
  );
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const addGoalHandler = (goalText) => {
    if (goalText.trim().length === 0) return;
    setGoals((currentGoals) => [
      ...currentGoals,
      { id: String(Date.now()), text: goalText },
    ]);
    setAddModalVisible(false);
  };

  const deleteGoalHandler = (id) => {
    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== id));
  };

  const startEditHandler = (goal) => {
    setEditingGoal(goal);
    setEditModalVisible(true);
  };

  const saveEditHandler = (newText) => {
    if (newText.trim().length === 0) return;
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === editingGoal.id ? { ...goal, text: newText } : goal
      )
    );
    setEditModalVisible(false);
    setEditingGoal(null);
  };

  const cancelEditHandler = () => {
    setEditModalVisible(false);
    setEditingGoal(null);
  };

  return (
    <ImageBackground
      source={require('./assets/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <StatusBar style="light" />

        <GoalInput onOpenModal={() => setAddModalVisible(true)} />

        <View style={styles.goalsContainer}>
          <FlatList
            data={goals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <GoalItem
                id={item.id}
                text={item.text}
                onDelete={deleteGoalHandler}
                onEdit={() => startEditHandler(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <AddModal
          visible={addModalVisible}
          onAdd={addGoalHandler}
          onCancel={() => setAddModalVisible(false)}
        />

        <EditModal
          visible={editModalVisible}
          goal={editingGoal}
          onSave={saveEditHandler}
          onCancel={cancelEditHandler}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  goalsContainer: {
    flex: 1,
    marginTop: 16,
  },
});
