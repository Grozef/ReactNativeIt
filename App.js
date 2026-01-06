import { useState, useRef } from 'react';
import { StyleSheet, View, FlatList, ImageBackground, Pressable, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ConfettiCannon from 'react-native-confetti-cannon';
import GoalItem from './components/GoalItem';
import GoalInput from './components/GoalInput';
import AddModal from './components/AddModal';
import EditModal from './components/EditModal';
import CompletedGoals from './components/CompletedGoals';

const sampleGoals = [
  "survivre",
  "Faire les courses",
  "Aller a la salle de sport 3 fois par semaine",
  "Monter a plus de 5000m d altitude",
  "Acheter mon premier appartement",
  "Perdre 5 kgs",
  "Gagner en productivite",
  "Apprendre un nouveau langage",
  "Faire une mission en freelance",
  "Organiser un meetup autour de la tech",
  "Faire un triathlon",
];

export default function App() {
  const [goals, setGoals] = useState(
    sampleGoals.map((text, index) => ({ id: String(index), text, done: false }))
  );
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [completedModalVisible, setCompletedModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef(null);

  const activeGoals = goals.filter((goal) => !goal.done);
  const completedGoals = goals.filter((goal) => goal.done);

  const addGoalHandler = (goalText) => {
    if (goalText.trim().length === 0) return;
    setGoals((currentGoals) => [
      ...currentGoals,
      { id: String(Date.now()), text: goalText, done: false },
    ]);
    setAddModalVisible(false);
  };

  const deleteGoalHandler = (id) => {
    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== id));
  };

  const doneGoalHandler = (id) => {
    setGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === id ? { ...goal, done: true } : goal
      )
    );
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const startEditHandler = (goal) => {
    if (goal.done) return;
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
            data={activeGoals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <GoalItem
                id={item.id}
                text={item.text}
                done={item.done}
                onDelete={deleteGoalHandler}
                onEdit={() => startEditHandler(item)}
                onDone={doneGoalHandler}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.completedButton,
            pressed && styles.completedButtonPressed,
          ]}
          onPress={() => setCompletedModalVisible(true)}
        >
          <Text style={styles.completedButtonText}>
            Done ({completedGoals.length})
          </Text>
        </Pressable>

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

        <CompletedGoals
          visible={completedModalVisible}
          goals={completedGoals}
          onClose={() => setCompletedModalVisible(false)}
          onDelete={deleteGoalHandler}
        />

        {showConfetti && (
          <ConfettiCannon
            count={150}
            origin={{ x: -10, y: 0 }}
            autoStart={true}
            fadeOut={true}
            ref={confettiRef}
          />
        )}
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
  completedButton: {
    backgroundColor: '#4ade80',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 30,
    alignItems: 'center',
  },
  completedButtonPressed: {
    opacity: 0.7,
  },
  completedButtonText: {
    color: '#1e1e2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
