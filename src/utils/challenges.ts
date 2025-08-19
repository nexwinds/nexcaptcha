import { DragDropChallenge, AudioChallenge, EmojiChallenge, ChallengeType } from '../types';

// Emoji sets for different challenge types
const ANIMALS = ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];
const FOOD = ['🍎', '🍌', '🍊', '🍋', '🍉', '🍇', '🍓', '🥝', '🍑', '🥭', '🍍', '🥥', '🥕', '🌽', '🥒'];
const OBJECTS = ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🥅', '🎯', '🎱', '🎳', '🎮', '🎲', '🎭'];
const NATURE = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🌿', '🍀', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌊'];

// Sound types for audio challenges - mapped to actual audio files
const SOUND_TYPES = [
  { emoji: '🐱', sound: 'cat', description: 'meow', file: 'assets/audio/farm-animals/cat.mp3' },
  { emoji: '🐶', sound: 'dog', description: 'bark', file: 'assets/audio/farm-animals/dog.mp3' },
  { emoji: '🐄', sound: 'cow', description: 'moo', file: 'assets/audio/farm-animals/cow.mp3' },
  { emoji: '🦆', sound: 'duck', description: 'quack', file: 'assets/audio/farm-animals/duck.mp3' },
  { emoji: '🦜', sound: 'red-parrot', description: 'chirp', file: 'assets/audio/birds/red-parrot.mp3' },
  { emoji: '🦁', sound: 'lion', description: 'roar', file: 'assets/audio/jungle-animals/lion.mp3' },
  { emoji: '🐅', sound: 'tiger', description: 'growl', file: 'assets/audio/jungle-animals/tiger.mp3' }
];

/**
 * Generate a random drag and drop challenge
 */
export function generateDragDropChallenge(): DragDropChallenge {
  const challenges = [
    { source: ANIMALS, target: FOOD, instruction: 'Move the animal to the food' },
    { source: FOOD, target: ANIMALS, instruction: 'Feed the animal' },
    { source: OBJECTS, target: NATURE, instruction: 'Place the object in nature' },
    { source: NATURE, target: OBJECTS, instruction: 'Combine nature with the object' }
  ];
  
  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  const sourceEmoji = challenge.source[Math.floor(Math.random() * challenge.source.length)];
  const targetEmoji = challenge.target[Math.floor(Math.random() * challenge.target.length)];
  
  return {
    sourceEmoji,
    targetEmoji,
    instruction: challenge.instruction
  };
}

/**
 * Generate a random audio challenge
 */
export function generateAudioChallenge(): AudioChallenge {
  const targetSound = SOUND_TYPES[Math.floor(Math.random() * SOUND_TYPES.length)];
  
  // Create 3 audio options including the target
  const otherSounds = SOUND_TYPES.filter(s => s.sound !== targetSound.sound);
  const shuffledOthers = otherSounds.sort(() => Math.random() - 0.5).slice(0, 2);
  
  const audioOptions = [targetSound, ...shuffledOthers]
    .sort(() => Math.random() - 0.5)
    .map(s => s.sound);
  
  return {
    targetSound: targetSound.sound,
    audioOptions,
    instruction: `Click the ${targetSound.description} sound`
  };
}

/**
 * Generate a random emoji selection challenge
 */
export function generateEmojiChallenge(): EmojiChallenge {
  const allEmojis = [...ANIMALS, ...FOOD, ...OBJECTS, ...NATURE];
  const targetEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
  
  // Create 8 emoji options including the target
  const otherEmojis = allEmojis.filter(e => e !== targetEmoji);
  const shuffledOthers = otherEmojis.sort(() => Math.random() - 0.5).slice(0, 7);
  
  const emojiOptions = [targetEmoji, ...shuffledOthers]
    .sort(() => Math.random() - 0.5);
  
  return {
    targetEmoji,
    emojiOptions,
    instruction: `Click the ${targetEmoji} emoji`
  };
}

/**
 * Generate a random challenge of any type
 */
export function generateRandomChallenge(): {
  type: ChallengeType;
  challenge: DragDropChallenge | AudioChallenge | EmojiChallenge;
} {
  const types: ChallengeType[] = ['drag-drop', 'audio', 'emoji-selection'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  switch (randomType) {
    case 'drag-drop':
      return {
        type: 'drag-drop',
        challenge: generateDragDropChallenge()
      };
    case 'audio':
      return {
        type: 'audio',
        challenge: generateAudioChallenge()
      };
    case 'emoji-selection':
      return {
        type: 'emoji-selection',
        challenge: generateEmojiChallenge()
      };
    default:
      return {
        type: 'emoji-selection',
        challenge: generateEmojiChallenge()
      };
  }
}

/**
 * Get audio file URL for sound challenges
 * Returns the path to the actual audio file
 */
export function generateAudioDataUrl(soundType: string): string {
  const soundTypeData = SOUND_TYPES.find(s => s.sound === soundType);
  
  if (!soundTypeData) {
    console.warn(`Sound type '${soundType}' not found, falling back to cat sound`);
    return 'assets/audio/farm-animals/cat.mp3';
  }
  
  return soundTypeData.file;
}

/**
 * Validate challenge answer
 */
export function validateChallengeAnswer(
  type: ChallengeType,
  challenge: DragDropChallenge | AudioChallenge | EmojiChallenge,
  answer: string | boolean
): boolean {
  switch (type) {
    case 'drag-drop': {
      const _dragChallenge = challenge as DragDropChallenge;
      return answer === true; // Drag was completed successfully
    }
      
    case 'audio': {
      const audioChallenge = challenge as AudioChallenge;
      return answer === audioChallenge.targetSound;
    }
      
    case 'emoji-selection': {
      const emojiChallenge = challenge as EmojiChallenge;
      return answer === emojiChallenge.targetEmoji;
    }
      
    default:
      return false;
  }
}