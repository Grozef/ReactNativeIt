import { useState } from 'react';
import { StyleSheet, View, FlatList, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import GoalItem from './components/GoalItem';
import GoalInput from './components/GoalInput';
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
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const addGoalHandler = (goalText) => {
    if (goalText.trim().length === 0) return;
    setGoals((currentGoals) => [
      ...currentGoals,
      { id: String(Date.now()), text: goalText },
    ]);
    setIsAddModalVisible(false);
  };

  const deleteGoalHandler = (id) => {
    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== id));
  };

  const startEditHandler = (goal) => {
    setEditingGoal(goal);
    setIsEditModalVisible(true);
  };

  const saveEditHandler = (newText) => {
    if (newText.trim().length === 0) return;
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === editingGoal.id ? { ...goal, text: newText } : goal
      )
    );
    setIsEditModalVisible(false);
    setEditingGoal(null);
  };

  const cancelEditHandler = () => {
    setIsEditModalVisible(false);
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
        
        <GoalInput
          onAddGoal={addGoalHandler}
          visible={isAddModalVisible}
          onOpenModal={() => setIsAddModalVisible(true)}
          onCloseModal={() => setIsAddModalVisible(false)}
        />

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

        <EditModal
          visible={isEditModalVisible}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  goalsContainer: {
    flex: 1,
    marginTop: 16,
  },
});
