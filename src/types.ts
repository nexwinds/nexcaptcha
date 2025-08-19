export type CaptchaLanguage = 'en' | 'pt' | 'es' | 'fr' | 'de';

export type ChallengeType = 'drag-drop' | 'audio' | 'emoji-selection';

export interface CaptchaProps {
  lang?: CaptchaLanguage;
  onValidate?: (result: CaptchaResult) => void;
  className?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface CaptchaResult {
  success: boolean;
  timestamp: number;
  proofOfWork: string;
  challengeResult: boolean;
  invisibleFiltersResult: boolean;
  errors?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  layer: 'invisible' | 'proof-of-work' | 'challenge';
  details?: string;
}

export interface InvisibleFilters {
  honeypot: string;
  mouseMovements: MouseMovement[];
  typingSpeed: number;
  submissionTime: number;
  startTime: number;
}

export interface MouseMovement {
  x: number;
  y: number;
  timestamp: number;
  type: 'move' | 'click' | 'touch';
}

export interface ProofOfWorkChallenge {
  difficulty: number;
  target: string;
  nonce?: string;
  hash?: string;
}

export interface DragDropChallenge {
  sourceEmoji: string;
  targetEmoji: string;
  instruction: string;
}

export interface AudioChallenge {
  targetSound: string;
  audioOptions: string[];
  instruction: string;
}

export interface EmojiChallenge {
  targetEmoji: string;
  emojiOptions: string[];
  instruction: string;
}

export interface Translations {
  [key: string]: {
    title: string;
    dragInstruction: string;
    audioInstruction: string;
    emojiInstruction: string;
    verifying: string;
    success: string;
    failed: string;
    retry: string;
    playSound: string;
    submitAnswer: string;
    attribution: string;
    clickToVerify: string;
    modalWelcomeTitle: string;
    modalWelcomeContent: string;
    modalInstructionsTitle: string;
    modalInstructionsContent: string;
    modalAudioTitle: string;
    modalAudioContent: string;
    modalReadyTitle: string;
    modalReadyContent: string;
    audioIntegrationTitle: string;
    audioStep1: string;
    audioStep2: string;
    audioStep3: string;
    audioStep4: string;
    playExample: string;
    next: string;
    startChallenge: string;
  };
}