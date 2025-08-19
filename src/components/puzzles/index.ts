/**
 * Puzzle Components Export Index
 * Centralized exports for all interactive puzzle components
 */

export { default as DragDropPuzzle } from './DragDropPuzzle';
export { default as EmojiSelectionPuzzle } from './EmojiSelectionPuzzle';
export { default as SliderPuzzle } from './SliderPuzzle';
export { default as NumberSortingPuzzle } from './NumberSortingPuzzle';
export { default as AudioMatchingPuzzle } from './AudioMatchingPuzzle';

// Re-export types for convenience
export type {
  DragDropChallengeData,
  EmojiSelectionChallengeData,
  SliderPuzzleChallengeData,
  NumberSortingChallengeData,
  AudioMatchingChallengeData,
} from '../../types/index';