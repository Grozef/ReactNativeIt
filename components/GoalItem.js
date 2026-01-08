/**
 * @file GoalItem.js
 * @description Composant d'affichage d'un objectif avec support hierarchique.
 *              Affiche les sous-objectifs de maniere recursive.
 * @version 2.2.0
 * 
 * @changelog
 * v2.2.0 - Validation explicite des parents (pas d'auto-completion)
 * v2.0.0 - Refonte complete pour support hierarchique
 * 
 * MODIFICATIONS EFFECTUEES:
 * -------------------------
 * 1. Props: Remplacement de (id, text, done) par (goal) object complet
 * 2. Nouvelles props: children, allGoals, onUndo, onAddSubGoal, getChildren, isEffectivelyDone, level
 * 3. Ajout etat 'expanded' pour deplier/replier les sous-objectifs
 * 4. Ajout bouton expand/collapse (fleche) pour les objectifs parents
 * 5. Ajout bouton "+" pour ajouter des sous-objectifs
 * 6. Ajout indicateur de progression (X/Y) pour les parents
 * 7. Affichage recursif des enfants via GoalItem imbriques
 * 8. Styles: Nouveaux styles pour parents (orange), indentation, ligne de connexion
 * 9. [MODIFICATION v2.2] Le bouton "done" apparait sur les parents quand tous enfants done
 * 10. [AJOUT v2.2] Variable canBeMarkedDone pour controler l'affichage du bouton
 */

import { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';

/**
 * Composant d'affichage d'un objectif individuel
 * Supporte l'affichage hierarchique avec sous-objectifs
 * 
 * [MODIFICATION v2.0] Signature completement refaite:
 * - Avant: ({ id, text, done, onDelete, onEdit, onDone })
 * - Apres: ({ goal, children, allGoals, onDelete, onEdit, onDone, onUndo, onAddSubGoal, getChildren, isEffectivelyDone, level })
 * 
 * @param {Object} props - Proprietes du composant
 * @param {Object} props.goal - Objectif a afficher [MODIFICATION v2.0: objet complet au lieu de props separees]
 * @param {string} props.goal.id - ID unique
 * @param {string} props.goal.text - Texte de l'objectif
 * @param {boolean} props.goal.done - Statut de completion
 * @param {string|null} props.goal.parentId - ID du parent [AJOUT v2.0]
 * @param {Object[]} props.children - Sous-objectifs directs [AJOUT v2.0]
 * @param {Object[]} props.allGoals - Liste complete des objectifs [AJOUT v2.0]
 * @param {Function} props.onDelete - Callback de suppression
 * @param {Function} props.onEdit - Callback d'edition
 * @param {Function} props.onDone - Callback de completion
 * @param {Function} props.onUndo - Callback d'annulation completion [AJOUT v2.0]
 * @param {Function} props.onAddSubGoal - Callback d'ajout sous-objectif [AJOUT v2.0]
 * @param {Function} props.getChildren - Fonction pour recuperer les enfants [AJOUT v2.0]
 * @param {Function} props.isEffectivelyDone - Fonction pour verifier si done [AJOUT v2.0]
 * @param {number} [props.level=0] - Niveau d'indentation (pour recursion) [AJOUT v2.0]
 * @returns {JSX.Element} Composant GoalItem
 */
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
  /**
   * [AJOUT v2.0] Etat d'expansion des sous-objectifs
   * Permet de deplier/replier la liste des enfants
   * @type {[boolean, Function]}
   */
  const [expanded, setExpanded] = useState(true);

  /**
   * [AJOUT v2.0] Verifie si l'objectif a des enfants
   * Determine l'affichage du bouton expand et de l'indicateur de progression
   * @type {boolean}
   */
  const hasChildren = children && children.length > 0;

  /**
   * [AJOUT v2.0] Verifie si l'objectif est effectivement termine
   * Utilise la fonction passee en prop pour evaluation recursive
   * @type {boolean}
   */
  const effectivelyDone = isEffectivelyDone(goal);

  /**
   * [AJOUT v2.2] Verifie si tous les enfants sont done
   * Permet d'afficher le bouton coche sur un parent
   * @type {boolean}
   */
  const allChildrenDone = hasChildren 
    ? children.every((c) => isEffectivelyDone(c)) 
    : true;

  /**
   * [AJOUT v2.2] Verifie si l'objectif peut etre marque done
   * Un parent peut etre marque done seulement si tous ses enfants le sont
   * @type {boolean}
   */
  const canBeMarkedDone = !goal.done && (!hasChildren || allChildrenDone);

  /**
   * [AJOUT v2.0] Calcule le nombre d'enfants termines
   * Affiche dans l'indicateur de progression (ex: "2/3")
   * @type {number}
   */
  const doneChildrenCount = hasChildren 
    ? children.filter((c) => isEffectivelyDone(c)).length 
    : 0;

  /**
   * [AJOUT v2.0] Calcule la marge gauche selon le niveau
   * Cree l'indentation visuelle pour la hierarchie
   * @type {number}
   */
  const marginLeft = level * 20;

  return (
    <View style={[styles.container, { marginLeft }]}>
      {/* Objectif principal */}
      <View style={[
        styles.goalItem, 
        effectivelyDone && styles.goalItemDone,
        hasChildren && styles.goalItemParent  /* [AJOUT v2.0] Style orange pour parents */
      ]}>
        {/* [AJOUT v2.0] Bouton expand/collapse si a des enfants */}
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

        {/* Zone de texte cliquable pour edition */}
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
          {/* [AJOUT v2.0] Indicateur de progression pour les parents */}
          {hasChildren && (
            <Text style={styles.progressText}>
              {doneChildrenCount}/{children.length}
            </Text>
          )}
        </Pressable>

        {/* [AJOUT v2.0] Bouton ajouter sous-objectif */}
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

        {/* 
         * [MODIFICATION v2.0] Bouton marquer comme termine
         * [MODIFICATION v2.2] Apparait sur les parents aussi quand tous enfants done
         * Utilise canBeMarkedDone pour determiner l'affichage
         */}
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

      {/* 
       * [AJOUT v2.0] Sous-objectifs (affichage recursif)
       * Chaque enfant est rendu avec GoalItem, incrementant le level
       */}
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
              level={level + 1}  /* Incremente le niveau pour l'indentation */
            />
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * Styles du composant GoalItem
 * 
 * [AJOUT v2.0] Nouveaux styles:
 * - container: Wrapper pour gerer marginLeft dynamique
 * - goalItemParent: Style orange pour objectifs parents
 * - expandButton/expandText: Bouton fleche expand/collapse
 * - textContainerNoExpand: Padding quand pas de bouton expand
 * - progressText: Indicateur X/Y
 * - addSubButton/addSubText: Bouton "+" bleu
 * - childrenContainer: Conteneur indente avec ligne verticale
 * 
 * @type {Object}
 */
const styles = StyleSheet.create({
  /** [AJOUT v2.0] Conteneur principal - permet marginLeft dynamique */
  container: {
    marginVertical: 4,
  },
  /** Style de base d'un objectif */
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e2e',
    borderRadius: 8,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#5e60ce',
  },
  /** Style objectif termine */
  goalItemDone: {
    borderLeftColor: '#4ade80',
    backgroundColor: '#1a2e1a',
  },
  /** [AJOUT v2.0] Style objectif parent - bordure orange */
  goalItemParent: {
    borderLeftColor: '#f59e0b',
  },
  /** [AJOUT v2.0] Bouton expand/collapse */
  expandButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /** [AJOUT v2.0] Texte du bouton expand (fleche) */
  expandText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  /** Conteneur du texte */
  textContainer: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
  },
  /** [AJOUT v2.0] Conteneur texte sans bouton expand - padding gauche */
  textContainerNoExpand: {
    paddingLeft: 16,
  },
  /** Etat presse */
  pressed: {
    backgroundColor: '#2d2d44',
  },
  /** Texte de l'objectif */
  goalText: {
    color: '#ffffff',
    fontSize: 16,
  },
  /** Texte objectif termine */
  goalTextDone: {
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  /** [AJOUT v2.0] Texte de progression (ex: "2/3") */
  progressText: {
    color: '#f59e0b',
    fontSize: 12,
    marginTop: 4,
  },
  /** [AJOUT v2.0] Bouton ajouter sous-objectif */
  addSubButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /** [AJOUT v2.0] Texte bouton ajouter ("+") */
  addSubText: {
    color: '#60a5fa',
    fontSize: 20,
    fontWeight: 'bold',
  },
  /** Bouton marquer termine */
  doneButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /** Texte bouton termine */
  doneText: {
    color: '#4ade80',
    fontSize: 20,
    fontWeight: 'bold',
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
  /** Texte bouton supprimer */
  deleteText: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  /** [AJOUT v2.0] Conteneur des enfants - indentation et ligne verticale */
  childrenContainer: {
    marginTop: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#3d3d5c',
    marginLeft: 8,
    paddingLeft: 8,
  },
});