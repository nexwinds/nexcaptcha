/**
 * Challenge Manager - Modular challenge selection and generation
 * Handles all challenge-related logic separately from the main component
 */

import type {
  DragDropChallengeData,
  EmojiSelectionChallengeData,
  SliderPuzzleChallengeData,
  NumberSortingChallengeData,
  AudioMatchingChallengeData,
} from '../types';

export type ChallengeType = 'center-click' | 'drag-drop' | 'emoji-selection' | 'slider' | 'number-sorting' | 'audio-matching';

export interface ChallengeConfig {
  enabledTypes?: ChallengeType[];
  difficulty?: number;
  forceType?: ChallengeType;
}

/**
 * Challenge Manager Class
 * Handles challenge selection, generation, and validation
 */
export class ChallengeManager {
  private config: ChallengeConfig;
  private availableTypes: ChallengeType[];

  constructor(config: ChallengeConfig = {}) {
    this.config = config;
    this.availableTypes = config.enabledTypes || [
      'center-click',
      'drag-drop',
      'emoji-selection',
      'slider',
      'number-sorting',
      'audio-matching'
    ];
  }

  /**
   * Get a random challenge type
   */
  public getRandomChallengeType(): ChallengeType {
    // If a specific type is forced, return it
    if (this.config.forceType) {
      console.log('Forced challenge type:', this.config.forceType);
      return this.config.forceType;
    }

    // Select random from available types
    const randomIndex = Math.floor(Math.random() * this.availableTypes.length);
    const selectedType = this.availableTypes[randomIndex];
    
    console.log('Available challenge types:', this.availableTypes);
    console.log('Random index:', randomIndex);
    console.log('Selected challenge type:', selectedType);
    
    return selectedType;
  }

  /**
   * Generate challenge data for a specific type
   */
  public generateChallengeData(challengeType: ChallengeType): any {
    console.log('Generating challenge data for:', challengeType);
    
    switch (challengeType) {
      case 'center-click':
        return null; // No data needed for center-click
        
      case 'drag-drop':
        return this.generateDragDropData();
        
      case 'emoji-selection':
        return this.generateEmojiSelectionData();
        
      case 'slider':
        return this.generateSliderData();
        
      case 'number-sorting':
        return this.generateNumberSortingData();
        
      case 'audio-matching':
        return this.generateAudioMatchingData();
        
      default:
        console.warn('Unknown challenge type:', challengeType);
        return null;
    }
  }

  /**
   * Generate drag-drop challenge data (puzzle piece fitting)
   */
  private generateDragDropData(): DragDropChallengeData {
    return {
      puzzlePieces: [
        { id: 'piece1', shape: 'circle', color: '#ff6b6b', position: { x: 50, y: 50 }, rotation: 0, isDragging: false, isPlaced: false },
        { id: 'piece2', shape: 'square', color: '#4ecdc4', position: { x: 150, y: 50 }, rotation: 0, isDragging: false, isPlaced: false },
        { id: 'piece3', shape: 'triangle', color: '#45b7d1', position: { x: 250, y: 50 }, rotation: 0, isDragging: false, isPlaced: false }
      ],
      puzzleSlots: [
        { id: 'slot1', shape: 'circle', position: { x: 80, y: 180 }, size: { width: 80, height: 80 }, expectedPieceId: 'piece1', hasItem: false },
        { id: 'slot2', shape: 'square', position: { x: 180, y: 180 }, size: { width: 80, height: 80 }, expectedPieceId: 'piece2', hasItem: false },
        { id: 'slot3', shape: 'triangle', position: { x: 280, y: 180 }, size: { width: 80, height: 80 }, expectedPieceId: 'piece3', hasItem: false }
      ]
    };
  }

  /**
   * Generate emoji selection challenge data
   */
  private generateEmojiSelectionData(): EmojiSelectionChallengeData {
    return {
      instruction: 'Select all animals',
      emojis: [
        { id: '1', emoji: '🐶', category: 'animal' },
        { id: '2', emoji: '🚗', category: 'vehicle' },
        { id: '3', emoji: '🐱', category: 'animal' },
        { id: '4', emoji: '🏠', category: 'building' },
        { id: '5', emoji: '🐭', category: 'animal' },
        { id: '6', emoji: '🌳', category: 'nature' },
        { id: '7', emoji: '🐸', category: 'animal' },
        { id: '8', emoji: '📱', category: 'technology' }
      ],
      correctEmojis: ['1', '3', '5', '7'],
      maxSelections: 4
    };
  }

  /**
   * Generate slider puzzle challenge data
   */
  private generateSliderData(): SliderPuzzleChallengeData {
    return {
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyMCI+U2xpZGVyIFB1enpsZTwvdGV4dD48L3N2Zz4=',
      pieces: [
        { id: '1', currentPosition: { x: 0, y: 0 }, correctPosition: { x: 0, y: 0 }, imageData: '' },
        { id: '2', currentPosition: { x: 100, y: 0 }, correctPosition: { x: 100, y: 0 }, imageData: '' },
        { id: '3', currentPosition: { x: 200, y: 0 }, correctPosition: { x: 200, y: 0 }, imageData: '' },
        { id: '4', currentPosition: { x: 0, y: 100 }, correctPosition: { x: 0, y: 100 }, imageData: '' },
        { id: '5', currentPosition: { x: 200, y: 100 }, correctPosition: { x: 100, y: 100 }, imageData: '' },
        { id: '6', currentPosition: { x: 100, y: 100 }, correctPosition: { x: 200, y: 100 }, imageData: '' },
        { id: '7', currentPosition: { x: 0, y: 200 }, correctPosition: { x: 0, y: 200 }, imageData: '' },
        { id: '8', currentPosition: { x: 100, y: 200 }, correctPosition: { x: 100, y: 200 }, imageData: '' },
        { id: '9', currentPosition: { x: 200, y: 200 }, correctPosition: { x: 200, y: 200 }, imageData: '' }
      ],
      gridSize: { width: 3, height: 3 },
      tolerance: 10
    };
  }

  /**
   * Generate number sorting challenge data
   */
  private generateNumberSortingData(): NumberSortingChallengeData {
    // Generate 3 random numbers between 1-9 for simpler drag-and-drop sorting
    const numbers: number[] = [];
    while (numbers.length < 3) {
      const num = Math.floor(Math.random() * 9) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    
    return {
      numbers: numbers,
      sortOrder: 'asc' as const,
      timeLimit: 30000
    };
  }

  /**
   * Generate audio matching challenge data (animal sounds)
   */
  private generateAudioMatchingData(): AudioMatchingChallengeData {
    const animalSounds = [
      { id: 'cat', url: '/assets/audio/farm-animals/cat.mp3', category: 'cat', duration: 2000 },
      { id: 'cow', url: '/assets/audio/farm-animals/cow.mp3', category: 'cow', duration: 2000 },
      { id: 'dog', url: '/assets/audio/farm-animals/dog.mp3', category: 'dog', duration: 2000 },
      { id: 'duck', url: '/assets/audio/farm-animals/duck.mp3', category: 'duck', duration: 2000 },
      { id: 'lion', url: '/assets/audio/jungle-animals/lion.mp3', category: 'lion', duration: 2000 },
      { id: 'tiger', url: '/assets/audio/jungle-animals/tiger.mp3', category: 'tiger', duration: 2000 }
    ];
    
    // Randomly select 3 animal sounds for the challenge
    const shuffled = [...animalSounds].sort(() => Math.random() - 0.5);
    const selectedSounds = shuffled.slice(0, 3);
    
    return {
      audioFiles: selectedSounds,
      categories: selectedSounds.map(sound => sound.category),
      correctMappings: selectedSounds.reduce((acc, sound) => {
        acc[sound.id] = sound.category;
        return acc;
      }, {} as Record<string, string>),
      animalSounds: selectedSounds,
      animalOptions: [
        { id: 'cat', name: 'Cat', emoji: '🐱' },
        { id: 'cow', name: 'Cow', emoji: '🐄' },
        { id: 'dog', name: 'Dog', emoji: '🐶' },
        { id: 'duck', name: 'Duck', emoji: '🦆' },
        { id: 'lion', name: 'Lion', emoji: '🦁' },
        { id: 'tiger', name: 'Tiger', emoji: '🐅' }
      ]
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<ChallengeConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.enabledTypes) {
      this.availableTypes = newConfig.enabledTypes;
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): ChallengeConfig {
    return { ...this.config };
  }
}

// Export a default instance for convenience
export const defaultChallengeManager = new ChallengeManager();