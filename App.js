// import { useState } from 'react';
// import { StyleSheet, View, FlatList, ImageBackground } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import GoalItem from './components/GoalItem';
// import GoalInput from './components/GoalInput';
// import EditModal from './components/EditModal';

// const sampleGoals = [
//   "Faire les courses",
//   "Aller à la salle de sport 3 fois par semaine",
//   "Monter à plus de 5000m d altitude",
//   "Acheter mon premier appartement",
//   "Perdre 5 kgs",
//   "Gagner en productivité",
//   "Apprendre un nouveau langage",
//   "Faire une mission en freelance",
//   "Organiser un meetup autour de la tech",
//   "Faire un triathlon",
// ];

// export default function App() {
//   const [goals, setGoals] = useState(
//     sampleGoals.map((text, index) => ({ id: String(index), text }))
//   );
//   const [isAddModalVisible, setIsAddModalVisible] = useState(false);
//   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//   const [editingGoal, setEditingGoal] = useState(null);

//   const addGoalHandler = (goalText) => {
//     if (goalText.trim().length === 0) return;
//     setGoals((currentGoals) => [
//       ...currentGoals,
//       { id: String(Date.now()), text: goalText },
//     ]);
//     setIsAddModalVisible(false);
//   };

//   const deleteGoalHandler = (id) => {
//     setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== id));
//   };

//   const startEditHandler = (goal) => {
//     setEditingGoal(goal);
//     setIsEditModalVisible(true);
//   };

//   const saveEditHandler = (newText) => {
//     if (newText.trim().length === 0) return;
//     setGoals((currentGoals) =>
//       currentGoals.map((goal) =>
//         goal.id === editingGoal.id ? { ...goal, text: newText } : goal
//       )
//     );
//     setIsEditModalVisible(false);
//     setEditingGoal(null);
//   };

//   const cancelEditHandler = () => {
//     setIsEditModalVisible(false);
//     setEditingGoal(null);
//   };

//   return (
//     <ImageBackground
//       source={require('./assets/background.png')}
//       style={styles.backgroundImage}
//       resizeMode="cover"
//     >
//       <View style={styles.container}>
//         <StatusBar style="light" />
        
//         <GoalInput
//           onAddGoal={addGoalHandler}
//           visible={isAddModalVisible}
//           onOpenModal={() => setIsAddModalVisible(true)}
//           onCloseModal={() => setIsAddModalVisible(false)}
//         />

//         <View style={styles.goalsContainer}>
//           <FlatList
//             data={goals}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <GoalItem
//                 id={item.id}
//                 text={item.text}
//                 onDelete={deleteGoalHandler}
//                 onEdit={() => startEditHandler(item)}
//               />
//             )}
//             showsVerticalScrollIndicator={false}
//           />
//         </View>

//         <EditModal
//           visible={isEditModalVisible}
//           goal={editingGoal}
//           onSave={saveEditHandler}
//           onCancel={cancelEditHandler}
//         />
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     paddingTop: 60,
//     paddingHorizontal: 16,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   goalsContainer: {
//     flex: 1,
//     marginTop: 16,
//   },
// });


import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  FlatList, 
  StyleSheet,
  Modal 
} from 'react-native';

const sampleGoals = [
  { id: '1', text: 'Faire les courses' },
  { id: '2', text: 'Aller à la salle de sport' },
  { id: '3', text: 'Apprendre React Native' },
];

export default function App() {
  const [goals, setGoals] = useState(sampleGoals);
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const addGoal = () => {
    if (text.trim() === '') return;
    setGoals([...goals, { id: Date.now().toString(), text }]);
    setText('');
    setModalVisible(false);
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Objectifs</Text>
      
      <Pressable style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.addBtnText}>+ Ajouter</Text>
      </Pressable>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <Text style={styles.goalText}>{item.text}</Text>
            <Pressable onPress={() => deleteGoal(item.id)}>
              <Text style={styles.deleteBtn}>X</Text>
            </Pressable>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Nouvel objectif..."
              placeholderTextColor="#999"
              value={text}
              onChangeText={setText}
            />
            <View style={styles.modalBtns}>
              <Pressable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Annuler</Text>
              </Pressable>
              <Pressable style={styles.saveBtn} onPress={addGoal}>
                <Text style={styles.btnText}>Ajouter</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  addBtn: {
    backgroundColor: '#5e60ce',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  addBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  goalText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  deleteBtn: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 15,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2d2d44',
    padding: 20,
    borderRadius: 10,
    width: '85%',
  },
  input: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    backgroundColor: '#666',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  saveBtn: {
    backgroundColor: '#5e60ce',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});