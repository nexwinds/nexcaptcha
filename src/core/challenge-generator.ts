/**
 * Challenge data generator for NexCaptcha
 * Provides actual data for different puzzle types
 */

import {
  DragDropItem,
  DragDropTarget,
  EmojiItem,
  PuzzlePiece,
  AudioFile,
} from '../types';

/**
 * Challenge data generator class
 */
export class ChallengeGenerator {
  private static readonly EMOJI_DATA = {
    animals: [
      { id: 'dog', emoji: '🐕', category: 'animals', description: 'Dog' },
      { id: 'cat', emoji: '🐱', category: 'animals', description: 'Cat' },
      { id: 'elephant', emoji: '🐘', category: 'animals', description: 'Elephant' },
      { id: 'lion', emoji: '🦁', category: 'animals', description: 'Lion' },
      { id: 'tiger', emoji: '🐅', category: 'animals', description: 'Tiger' },
      { id: 'bear', emoji: '🐻', category: 'animals', description: 'Bear' },
    ],
    food: [
      { id: 'apple', emoji: '🍎', category: 'food', description: 'Apple' },
      { id: 'banana', emoji: '🍌', category: 'food', description: 'Banana' },
      { id: 'pizza', emoji: '🍕', category: 'food', description: 'Pizza' },
      { id: 'burger', emoji: '🍔', category: 'food', description: 'Burger' },
      { id: 'cake', emoji: '🎂', category: 'food', description: 'Cake' },
      { id: 'cookie', emoji: '🍪', category: 'food', description: 'Cookie' },
    ],
    vehicles: [
      { id: 'car', emoji: '🚗', category: 'vehicles', description: 'Car' },
      { id: 'bus', emoji: '🚌', category: 'vehicles', description: 'Bus' },
      { id: 'train', emoji: '🚂', category: 'vehicles', description: 'Train' },
      { id: 'plane', emoji: '✈️', category: 'vehicles', description: 'Airplane' },
      { id: 'bike', emoji: '🚲', category: 'vehicles', description: 'Bicycle' },
      { id: 'ship', emoji: '🚢', category: 'vehicles', description: 'Ship' },
    ],
    nature: [
      { id: 'tree', emoji: '🌳', category: 'nature', description: 'Tree' },
      { id: 'flower', emoji: '🌸', category: 'nature', description: 'Flower' },
      { id: 'sun', emoji: '☀️', category: 'nature', description: 'Sun' },
      { id: 'moon', emoji: '🌙', category: 'nature', description: 'Moon' },
      { id: 'star', emoji: '⭐', category: 'nature', description: 'Star' },
      { id: 'cloud', emoji: '☁️', category: 'nature', description: 'Cloud' },
    ],
    mixed: [
      { id: 'house', emoji: '🏠', category: 'objects', description: 'House' },
      { id: 'book', emoji: '📚', category: 'objects', description: 'Book' },
      { id: 'phone', emoji: '📱', category: 'objects', description: 'Phone' },
      { id: 'clock', emoji: '🕐', category: 'objects', description: 'Clock' },
      { id: 'key', emoji: '🔑', category: 'objects', description: 'Key' },
      { id: 'gift', emoji: '🎁', category: 'objects', description: 'Gift' },
    ],
  };

  private static readonly DRAG_DROP_DATA = {
    Animals: {
      items: [
        { id: 'dog', content: '🐕', type: 'emoji' as const, data: { category: 'mammals' } },
        { id: 'fish', content: '🐟', type: 'emoji' as const, data: { category: 'aquatic' } },
        { id: 'bird', content: '🐦', type: 'emoji' as const, data: { category: 'birds' } },
        { id: 'cat', content: '🐱', type: 'emoji' as const, data: { category: 'mammals' } },
        { id: 'shark', content: '🦈', type: 'emoji' as const, data: { category: 'aquatic' } },
        { id: 'eagle', content: '🦅', type: 'emoji' as const, data: { category: 'birds' } },
      ],
      targets: [
        { id: 'mammals', label: 'Mammals', acceptedTypes: ['emoji'] },
        { id: 'aquatic', label: 'Aquatic Animals', acceptedTypes: ['emoji'] },
        { id: 'birds', label: 'Birds', acceptedTypes: ['emoji'] },
      ],
    },
    Colors: {
      items: [
        { id: 'red-item', content: 'Red Apple', type: 'text' as const, data: { color: 'red' } },
        { id: 'blue-item', content: 'Blue Sky', type: 'text' as const, data: { color: 'blue' } },
        { id: 'green-item', content: 'Green Grass', type: 'text' as const, data: { color: 'green' } },
        { id: 'yellow-item', content: 'Yellow Sun', type: 'text' as const, data: { color: 'yellow' } },
        { id: 'purple-item', content: 'Purple Flower', type: 'text' as const, data: { color: 'purple' } },
        { id: 'orange-item', content: 'Orange Fruit', type: 'text' as const, data: { color: 'orange' } },
      ],
      targets: [
        { id: 'warm-colors', label: 'Warm Colors', acceptedTypes: ['text'] },
        { id: 'cool-colors', label: 'Cool Colors', acceptedTypes: ['text'] },
      ],
    },
    Shapes: {
      items: [
        { id: 'circle', content: '⭕', type: 'emoji' as const, data: { sides: 0 } },
        { id: 'triangle', content: '🔺', type: 'emoji' as const, data: { sides: 3 } },
        { id: 'square', content: '⬜', type: 'emoji' as const, data: { sides: 4 } },
        { id: 'pentagon', content: '⬟', type: 'emoji' as const, data: { sides: 5 } },
        { id: 'hexagon', content: '⬡', type: 'emoji' as const, data: { sides: 6 } },
        { id: 'octagon', content: '⬢', type: 'emoji' as const, data: { sides: 8 } },
      ],
      targets: [
        { id: 'few-sides', label: '0-4 Sides', acceptedTypes: ['emoji'] },
        { id: 'many-sides', label: '5+ Sides', acceptedTypes: ['emoji'] },
      ],
    },
    Numbers: {
      items: [
        { id: 'two', content: '2', type: 'text' as const, data: { value: 2, type: 'even' } },
        { id: 'seven', content: '7', type: 'text' as const, data: { value: 7, type: 'odd' } },
        { id: 'twelve', content: '12', type: 'text' as const, data: { value: 12, type: 'even' } },
        { id: 'fifteen', content: '15', type: 'text' as const, data: { value: 15, type: 'odd' } },
        { id: 'twenty', content: '20', type: 'text' as const, data: { value: 20, type: 'even' } },
        { id: 'twentythree', content: '23', type: 'text' as const, data: { value: 23, type: 'odd' } },
      ],
      targets: [
        { id: 'even', label: 'Even Numbers', acceptedTypes: ['text'] },
        { id: 'odd', label: 'Odd Numbers', acceptedTypes: ['text'] },
      ],
    },
  };

  /**
   * Generate items for a specific category
   */
  public static generateItemsForCategory(category: string): DragDropItem[] {
    const categoryData = this.DRAG_DROP_DATA[category as keyof typeof this.DRAG_DROP_DATA];
    if (!categoryData) {
      throw new Error(`Unknown category: ${category}`);
    }
    
    // Shuffle and return a subset of items
    const shuffled = [...categoryData.items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4 + Math.floor(Math.random() * 3)); // 4-6 items
  }

  /**
   * Generate targets for a specific category
   */
  public static generateTargetsForCategory(category: string): DragDropTarget[] {
    const categoryData = this.DRAG_DROP_DATA[category as keyof typeof this.DRAG_DROP_DATA];
    if (!categoryData) {
      throw new Error(`Unknown category: ${category}`);
    }
    
    return categoryData.targets;
  }

  /**
   * Generate correct mappings for drag-drop items
   */
  public static generateCorrectMappings(items: DragDropItem[], category: string): Record<string, string> {
    const mappings: Record<string, string> = {};
    
    switch (category) {
      case 'Animals':
        items.forEach(item => {
          mappings[item.id] = item.data?.category || 'mammals';
        });
        break;
        
      case 'Colors':
        items.forEach(item => {
          const color = item.data?.color;
          if (['red', 'yellow', 'orange'].includes(color)) {
            mappings[item.id] = 'warm-colors';
          } else {
            mappings[item.id] = 'cool-colors';
          }
        });
        break;
        
      case 'Shapes':
        items.forEach(item => {
          const sides = item.data?.sides || 0;
          mappings[item.id] = sides <= 4 ? 'few-sides' : 'many-sides';
        });
        break;
        
      case 'Numbers':
        items.forEach(item => {
          mappings[item.id] = item.data?.type || 'even';
        });
        break;
        
      default:
        // Default mapping
        items.forEach(item => {
          mappings[item.id] = 'default-target';
        });
    }
    
    return mappings;
  }

  /**
   * Get emojis for a specific category
   */
  public static getEmojisForCategory(category: string): EmojiItem[] {
    const categoryData = this.EMOJI_DATA[category as keyof typeof this.EMOJI_DATA];
    if (!categoryData) {
      // Return mixed category as fallback
      return this.EMOJI_DATA.mixed;
    }
    
    // Shuffle the emojis
    return [...categoryData].sort(() => Math.random() - 0.5);
  }

  /**
   * Generate puzzle pieces for slider puzzle
   */
  public static generatePuzzlePieces(gridSize: { width: number; height: number }): PuzzlePiece[] {
    const pieces: PuzzlePiece[] = [];
    const totalPieces = gridSize.width * gridSize.height;
    
    // Generate pieces in correct positions
    for (let i = 0; i < totalPieces - 1; i++) { // -1 for empty space
      const row = Math.floor(i / gridSize.width);
      const col = i % gridSize.width;
      
      pieces.push({
        id: `piece-${i}`,
        currentPosition: { x: col * 100, y: row * 100 }, // Will be shuffled
        correctPosition: { x: col * 100, y: row * 100 },
        imageData: `data:image/svg+xml;base64,${this.generatePieceImageData(i)}`,
      });
    }
    
    // Shuffle current positions
    const shuffledPositions = pieces.map(p => p.currentPosition).sort(() => Math.random() - 0.5);
    pieces.forEach((piece, index) => {
      piece.currentPosition = shuffledPositions[index];
    });
    
    return pieces;
  }

  /**
   * Get audio files for a specific category
   */
  public static getAudioFilesForCategory(category: string): AudioFile[] {
    const audioData: Record<string, AudioFile[]> = {
      'birds': [
        { id: 'robin', url: '/assets/audio/birds/robin.mp3', category: 'birds', duration: 3000 },
        { id: 'sparrow', url: '/assets/audio/birds/sparrow.mp3', category: 'birds', duration: 2500 },
        { id: 'crow', url: '/assets/audio/birds/crow.mp3', category: 'birds', duration: 2000 },
      ],
      'farm-animals': [
        { id: 'cow', url: '/assets/audio/farm-animals/cow.mp3', category: 'farm-animals', duration: 2000 },
        { id: 'pig', url: '/assets/audio/farm-animals/pig.mp3', category: 'farm-animals', duration: 1500 },
        { id: 'sheep', url: '/assets/audio/farm-animals/sheep.mp3', category: 'farm-animals', duration: 2200 },
      ],
      'jungle-animals': [
        { id: 'lion', url: '/assets/audio/jungle-animals/lion.mp3', category: 'jungle-animals', duration: 3500 },
        { id: 'monkey', url: '/assets/audio/jungle-animals/monkey.mp3', category: 'jungle-animals', duration: 2800 },
        { id: 'elephant', url: '/assets/audio/jungle-animals/elephant.mp3', category: 'jungle-animals', duration: 4000 },
      ],
    };
    
    return audioData[category] || [];
  }

  /**
   * Generate random numbers for sorting puzzle
   */
  public static generateRandomNumbers(count: number, min: number = 1, max: number = 100): number[] {
    const numbers: number[] = [];
    const used = new Set<number>();
    
    while (numbers.length < count) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!used.has(num)) {
        numbers.push(num);
        used.add(num);
      }
    }
    
    return numbers;
  }

  /**
   * Generate mathematical sequence for number sorting
   */
  public static generateMathSequence(type: 'fibonacci' | 'prime' | 'even' | 'odd' | 'square', count: number): number[] {
    switch (type) {
      case 'fibonacci':
        return this.generateFibonacci(count);
      case 'prime':
        return this.generatePrimes(count);
      case 'even':
        return Array.from({ length: count }, (_, i) => (i + 1) * 2);
      case 'odd':
        return Array.from({ length: count }, (_, i) => (i * 2) + 1);
      case 'square':
        return Array.from({ length: count }, (_, i) => (i + 1) ** 2);
      default:
        return this.generateRandomNumbers(count);
    }
  }

  /**
   * Generate color palette for visual puzzles
   */
  public static generateColorPalette(count: number): string[] {
    const baseColors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    ];
    
    const shuffled = [...baseColors].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, baseColors.length));
  }

  /**
   * Generate pattern sequence for pattern recognition puzzles
   */
  public static generatePatternSequence(length: number): string[] {
    const patterns = ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon'];
    const sequence: string[] = [];
    
    // Generate a repeating pattern with some complexity
    const patternLength = 2 + Math.floor(Math.random() * 3); // 2-4 pattern length
    const basePattern = patterns.slice(0, patternLength);
    
    for (let i = 0; i < length; i++) {
      sequence.push(basePattern[i % patternLength]);
    }
    
    return sequence;
  }

  /**
   * Generate word pairs for matching puzzles
   */
  public static generateWordPairs(category: 'synonyms' | 'antonyms' | 'rhymes', count: number): Array<[string, string]> {
    const wordPairs: Record<string, Array<[string, string]>> = {
      synonyms: [
        ['happy', 'joyful'], ['big', 'large'], ['fast', 'quick'], ['smart', 'clever'],
        ['beautiful', 'pretty'], ['strong', 'powerful'], ['small', 'tiny'], ['cold', 'freezing'],
      ],
      antonyms: [
        ['hot', 'cold'], ['big', 'small'], ['fast', 'slow'], ['happy', 'sad'],
        ['light', 'dark'], ['up', 'down'], ['in', 'out'], ['good', 'bad'],
      ],
      rhymes: [
        ['cat', 'hat'], ['dog', 'log'], ['sun', 'fun'], ['tree', 'bee'],
        ['car', 'star'], ['book', 'look'], ['rain', 'train'], ['moon', 'spoon'],
      ],
    };
    
    const pairs = wordPairs[category] || wordPairs.synonyms;
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, pairs.length));
  }

  // Private helper methods
  private static generateFibonacci(count: number): number[] {
    const fib = [1, 1];
    while (fib.length < count) {
      fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
    }
    return fib.slice(0, count);
  }

  private static generatePrimes(count: number): number[] {
    const primes: number[] = [];
    let num = 2;
    
    while (primes.length < count) {
      if (this.isPrime(num)) {
        primes.push(num);
      }
      num++;
    }
    
    return primes;
  }

  private static isPrime(num: number): boolean {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }

  private static generatePieceImageData(pieceIndex: number): string {
    // Generate a simple SVG for the puzzle piece
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    const color = colors[pieceIndex % colors.length];
    
    const svg = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="${color}" stroke="#333" stroke-width="2"/>
        <text x="50" y="55" text-anchor="middle" font-family="Arial" font-size="24" fill="#333">
          ${pieceIndex + 1}
        </text>
      </svg>
    `;
    
    return btoa(svg);
  }
}