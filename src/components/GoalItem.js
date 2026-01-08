/**
 * @file src/components/GoalItem.js
 * @description Composant d'affichage d'un objectif avec support hierarchique.
 * @version 2.2.0
 */

import { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';

export default function GoalItem({ 
  goal, 
  children, 
  allGoals,
  onDelete, 
  onEdit, 
  onDone, 
  onUndo,
  onAddSubGoal,
  getChildren,
  isEffectivelyDone,
  level = 0 
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = children && children.length > 0;
  const effectivelyDone = isEffectivelyDone(goal);
  
  const allChildrenDone = hasChildren 
    ? children.every((c) => isEffectivelyDone(c)) 
    : true;

  const canBeMarkedDone = !goal.done && (!hasChildren || allChildrenDone);

  const doneChildrenCount = hasChildren 
    ? children.filter((c) => isEffectivelyDone(c)).length 
    : 0;

  const marginLeft = level * 20;

  return (
    <View style={[styles.container, { marginLeft }]}>
      <View style={[
        styles.goalItem, 
        effectivelyDone && styles.goalItemDone,
        hasChildren && styles.goalItemParent
      ]}>
        {hasChildren && (
          <Pressable
            style={styles.expandButton}
            onPress={() => setExpanded(!expanded)}
          >
            <Text style={styles.expandText}>
              {expanded ? '▼' : '▶'}
            </Text>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.textContainer,
            pressed && styles.pressed,
            !hasChildren && styles.textContainerNoExpand,
          ]}
          onPress={onEdit}
          android_ripple={{ color: '#4a4a6a' }}
        >
          <Text style={[
            styles.goalText, 
            effectivelyDone && styles.goalTextDone
          ]}>
            {goal.text}
          </Text>
          {hasChildren && (
            <Text style={styles.progressText}>
              {doneChildrenCount}/{children.length}
            </Text>
          )}
        </Pressable>

        {!effectivelyDone && (
          <Pressable
            style={({ pressed }) => [
              styles.addSubButton,
              pressed && styles.pressedButton,
            ]}
            onPress={() => onAddSubGoal(goal.id)}
          >
            <Text style={styles.addSubText}>+</Text>
          </Pressable>
        )}

        {canBeMarkedDone && (
          <Pressable
            style={({ pressed }) => [
              styles.doneButton,
              pressed && styles.pressedButton,
            ]}
            onPress={() => onDone(goal.id)}
          >
            <Text style={styles.doneText}>&#10003;</Text>
          </Pressable>
        )}

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

      {hasChildren && expanded && (
        <View style={styles.childrenContainer}>
          {children.map((child) => (
            <GoalItem
              key={child.id}
              goal={child}
              children={getChildren(child.id)}
              allGoals={allGoals}
              onDelete={onDelete}
              onEdit={() => onEdit(child)}
              onDone={onDone}
              onUndo={onUndo}
              onAddSubGoal={onAddSubGoal}
              getChildren={getChildren}
              isEffectivelyDone={isEffectivelyDone}
              level={level + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e2e',
    borderRadius: 8,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#5e60ce',
  },
  goalItemDone: {
    borderLeftColor: '#4ade80',
    backgroundColor: '#1a2e1a',
  },
  goalItemParent: {
    borderLeftColor: '#f59e0b',
  },
  expandButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  textContainer: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
  },
  textContainerNoExpand: {
    paddingLeft: 16,
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
  progressText: {
    color: '#f59e0b',
    fontSize: 12,
    marginTop: 4,
  },
  addSubButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSubText: {
    color: '#60a5fa',
    fontSize: 20,
    fontWeight: 'bold',
  },
  doneButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  pressedButton: {
    opacity: 0.5,
  },
  deleteText: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  childrenContainer: {
    marginTop: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#3d3d5c',
    marginLeft: 8,
    paddingLeft: 8,
  },
});
