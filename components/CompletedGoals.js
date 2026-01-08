/**
 * @file CompletedGoals.js
 * @description Modal affichant les objectifs accomplis avec leur hierarchie.
 * @version 2.0.0
 * 
 * @changelog
 * v2.0.0 - Ajout du support hierarchique pour les objectifs accomplis
 * 
 * MODIFICATIONS EFFECTUEES:
 * -------------------------
 * 1. Nouvelles props: allGoals, getChildren pour naviguer la hierarchie
 * 2. CompletedGoalItem: Refonte complete avec support hierarchique
 *    - Nouvelles props: goal (object), children, getChildren, level
 *    - Affichage recursif des sous-objectifs
 *    - Compteur d'enfants pour les parents
 *    - Undo seulement sur les feuilles (pas les parents)
 * 3. Ajout fonction countAllCompleted pour stats totales
 * 4. Stats: Affichage "X objectifs principaux (Y total avec sous-objectifs)"
 * 5. Nouveaux styles: goalItemParent, childCount, childrenContainer, statsSubtext
 */

import { StyleSheet, View, Text, FlatList, Pressable, Modal } from 'react-native';

/**
 * Composant d'affichage d'un objectif accompli
 * Affiche recursivement les sous-objectifs
 * 
 * @param {Object} props - Proprietes du composant
 * @param {Object} props.goal - Objectif a afficher
 * @param {Object[]} props.children - Sous-objectifs
 * @param {Function} props.onDelete - Callback de suppression
 * @param {Function} props.onUndo - Callback d'annulation completion
 * @param {Function} props.getChildren - Fonction pour recuperer les enfants
 * @param {number} [props.level=0] - Niveau d'indentation
 * @returns {JSX.Element} Composant CompletedGoalItem
 */
function CompletedGoalItem({ goal, children, onDelete, onUndo, getChildren, level = 0 }) {
  /**
   * Verifie si l'objectif a des enfants
   * @type {boolean}
   */
  const hasChildren = children && children.length > 0;

  /**
   * Calcule la marge gauche selon le niveau
   * @type {number}
   */
  const marginLeft = level * 16;

  return (
    <View style={{ marginLeft }}>
      {/* Objectif principal */}
      <View style={[styles.goalItem, hasChildren && styles.goalItemParent]}>
        <View style={styles.textContainer}>
          <Text style={styles.goalText}>{goal.text}</Text>
          {hasChildren && (
            <Text style={styles.childCount}>
              {children.length} sous-objectif{children.length > 1 ? 's' : ''}
            </Text>
          )}
        </View>
        
        {/* Bouton undo (seulement pour les feuilles) */}
        {!hasChildren && (
          <Pressable
            style={({ pressed }) => [
              styles.undoButton,
              pressed && styles.pressedButton,
            ]}
            onPress={() => onUndo(goal.id)}
          >
            <Text style={styles.undoText}>&#8634;</Text>
          </Pressable>
        )}
        
        {/* Bouton supprimer */}
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.pressedButton,
          ]}
          onPress={() => onDelete(goal.id)}
        >
          <Text style={styles.deleteText}>&#10005;</Text>
        </Pressable>
      </View>

      {/* Sous-objectifs (affichage recursif) */}
      {hasChildren && (
        <View style={styles.childrenContainer}>
          {children.map((child) => (
            <CompletedGoalItem
              key={child.id}
              goal={child}
              children={getChildren(child.id)}
              onDelete={onDelete}
              onUndo={onUndo}
              getChildren={getChildren}
              level={level + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * Modal affichant la liste des objectifs accomplis
 * Supporte l'affichage hierarchique
 * 
 * @param {Object} props - Proprietes du composant
 * @param {boolean} props.visible - Visibilite de la modal
 * @param {Object[]} props.goals - Liste des objectifs racines accomplis
 * @param {Object[]} props.allGoals - Liste complete des objectifs
 * @param {Function} props.onClose - Callback de fermeture
 * @param {Function} props.onDelete - Callback de suppression
 * @param {Function} props.onUndo - Callback d'annulation completion
 * @param {Function} props.getChildren - Fonction pour recuperer les enfants
 * @returns {JSX.Element} Composant CompletedGoals
 */
export default function CompletedGoals({ 
  visible, 
  goals, 
  allGoals,
  onClose, 
  onDelete, 
  onUndo,
  getChildren 
}) {
  /**
   * Compte le total d'objectifs accomplis (incluant sous-objectifs)
   * @param {Object[]} goalsList - Liste des objectifs
   * @returns {number} Nombre total
   */
  const countAllCompleted = (goalsList) => {
    let count = goalsList.length;
    goalsList.forEach((goal) => {
      const children = getChildren(goal.id);
      if (children.length > 0) {
        count += countAllCompleted(children);
      }
    });
    return count;
  };

  /**
   * Nombre total d'objectifs accomplis
   * @type {number}
   */
  const totalCompleted = countAllCompleted(goals);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
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
          
          {/* Contenu */}
          {goals.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun objectif accompli pour le moment</Text>
              <Text style={styles.emptySubtext}>Continuez vos efforts !</Text>
            </View>
          ) : (
            <>
              {/* Statistiques */}
              <View style={styles.statsContainer}>
                <Text style={styles.statsText}>
                  {goals.length} objectif{goals.length > 1 ? 's' : ''} principal{goals.length > 1 ? 'aux' : ''}
                </Text>
                {totalCompleted > goals.length && (
                  <Text style={styles.statsSubtext}>
                    ({totalCompleted} total avec sous-objectifs)
                  </Text>
                )}
              </View>
              
              {/* Liste des objectifs */}
              <FlatList
                data={goals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <CompletedGoalItem
                    goal={item}
                    children={getChildren(item.id)}
                    onDelete={onDelete}
                    onUndo={onUndo}
                    getChildren={getChildren}
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

/**
 * Styles du composant CompletedGoals
 * @type {Object}
 */
const styles = StyleSheet.create({
  /** Conteneur de la modal */
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  /** Contenu de la modal */
  modalContent: {
    backgroundColor: '#1e1e2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  /** Header de la modal */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
  },
  /** Titre de la modal */
  title: {
    color: '#4ade80',
    fontSize: 20,
    fontWeight: 'bold',
  },
  /** Bouton fermer */
  closeButton: {
    padding: 8,
  },
  /** Etat presse */
  pressed: {
    opacity: 0.5,
  },
  /** Texte bouton fermer */
  closeText: {
    color: '#9ca3af',
    fontSize: 20,
  },
  /** Conteneur statistiques */
  statsContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  /** Texte statistiques */
  statsText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  /** Sous-texte statistiques */
  statsSubtext: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  /** Liste des objectifs */
  list: {
    marginTop: 8,
  },
  /** Conteneur vide */
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  /** Texte vide */
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 8,
  },
  /** Sous-texte vide */
  emptySubtext: {
    color: '#6b7280',
    fontSize: 14,
  },
  /** Style d'un objectif */
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2e1a',
    borderRadius: 8,
    marginVertical: 4,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#4ade80',
  },
  /** Style objectif parent */
  goalItemParent: {
    borderLeftColor: '#f59e0b',
    backgroundColor: '#2e2a1a',
  },
  /** Conteneur du texte */
  textContainer: {
    flex: 1,
    padding: 16,
  },
  /** Texte de l'objectif */
  goalText: {
    color: '#9ca3af',
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  /** Compteur d'enfants */
  childCount: {
    color: '#f59e0b',
    fontSize: 12,
    marginTop: 4,
  },
  /** Bouton undo */
  undoButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /** Bouton supprimer */
  deleteButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /** Etat presse des boutons */
  pressedButton: {
    opacity: 0.5,
  },
  /** Texte bouton undo */
  undoText: {
    color: '#60a5fa',
    fontSize: 20,
    fontWeight: 'bold',
  },
  /** Texte bouton supprimer */
  deleteText: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  /** Conteneur des enfants */
  childrenContainer: {
    marginTop: 2,
    marginLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#3d5c3d',
    paddingLeft: 8,
  },
});
