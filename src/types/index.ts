/**
 * Core type definitions for NexCaptcha
 */

// Base CAPTCHA types
export interface CaptchaConfig {
  /** Enable behavioral analysis layer */
  enableBehavioralAnalysis?: boolean;
  /** Enable proof-of-work challenges */
  enableProofOfWork?: boolean;
  /** Enable interactive puzzles */
  enableInteractivePuzzles?: boolean;
  /** Difficulty level (1-5) */
  difficulty?: number;
  /** Theme configuration */
  theme?: CaptchaTheme;
  /** Internationalization settings */
  i18n?: I18nConfig;
  /** Custom styling */
  className?: string;
  /** Callback functions */
  onSuccess?: (result: CaptchaResult) => void;
  onFailure?: (error: CaptchaError) => void;
  onChallenge?: (challenge: ChallengeData) => void;
}

export interface CaptchaTheme {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string;
  fontSize?: string;
}

export interface I18nConfig {
  locale?: string;
  messages?: Record<string, string>;
}

// Challenge types
export type ChallengeType = 
  | 'drag-drop'
  | 'emoji-selection'
  | 'slider-puzzle'
  | 'number-sorting'
  | 'audio-matching'
  | 'proof-of-work'
  | 'behavioral';

export interface ChallengeData {
  id: string;
  type: ChallengeType;
  difficulty: number;
  data: any;
  timeLimit?: number;
  attempts?: number;
  maxAttempts?: number;
}

export interface CaptchaResult {
  success: boolean;
  challengeId: string;
  score: number;
  timeSpent: number;
  behavioralScore?: number;
  proofOfWorkScore?: number;
  interactiveScore?: number;
  metadata?: Record<string, any>;
}

export interface CaptchaError {
  code: string;
  message: string;
  challengeId?: string;
  details?: any;
}

// Behavioral analysis types
export interface BehavioralData {
  mouseMovements: MouseMovement[];
  keystrokes: Keystroke[];
  clickPatterns: ClickPattern[];
  timingData: TimingData;
}

export interface MouseMovement {
  x: number;
  y: number;
  timestamp: number;
  velocity?: number;
  acceleration?: number;
}

export interface Keystroke {
  key: string;
  timestamp: number;
  duration: number;
  pressure?: number;
}

export interface ClickPattern {
  x: number;
  y: number;
  timestamp: number;
  duration: number;
  button: number;
}

export interface TimingData {
  startTime: number;
  endTime: number;
  pauseDurations: number[];
  totalTime: number;
}

// Proof of work types
export interface ProofOfWorkChallenge {
  difficulty: number;
  target: string;
  nonce: number;
  data: string;
  algorithm: 'sha256' | 'scrypt' | 'argon2';
}

export interface ProofOfWorkResult {
  nonce: number;
  hash: string;
  timeSpent: number;
  iterations: number;
}

// Interactive puzzle types
export interface DragDropPuzzle {
  items: DragDropItem[];
  targets: DragDropTarget[];
  correctMappings: Record<string, string>;
}

export interface DragDropItem {
  id: string;
  content: string;
  type: 'text' | 'image' | 'emoji';
  data?: any;
}

export interface DragDropTarget {
  id: string;
  label: string;
  acceptedTypes: string[];
}

export interface EmojiSelectionPuzzle {
  instruction: string;
  emojis: EmojiItem[];
  correctEmojis: string[];
  maxSelections: number;
}

export interface EmojiItem {
  id: string;
  emoji: string;
  category: string;
  description?: string;
}

export interface SliderPuzzle {
  imageUrl: string;
  pieces: PuzzlePiece[];
  gridSize: { width: number; height: number };
  tolerance: number;
}

export interface PuzzlePiece {
  id: string;
  currentPosition: { x: number; y: number };
  correctPosition: { x: number; y: number };
  imageData: string;
}

export interface NumberSortingPuzzle {
  numbers: number[];
  sortOrder: 'asc' | 'desc';
  timeLimit: number;
}

export interface AudioMatchingPuzzle {
  audioFiles: AudioFile[];
  categories: string[];
  correctMappings: Record<string, string>;
}

export interface AudioFile {
  id: string;
  url: string;
  category: string;
  duration: number;
}

// Challenge data types
export interface DragDropChallengeData {
  items: DragDropItem[];
  targets: DragDropTarget[];
  correctMappings: Record<string, string>;
}

export interface EmojiSelectionChallengeData {
  instruction: string;
  emojis: EmojiItem[];
  correctEmojis: string[];
  maxSelections: number;
}

export interface SliderPuzzleChallengeData {
  imageUrl: string;
  pieces: PuzzlePiece[];
  gridSize: { width: number; height: number };
  tolerance: number;
}

export interface NumberSortingChallengeData {
  numbers: number[];
  sortOrder: 'asc' | 'desc';
  timeLimit: number;
}

export interface AudioMatchingChallengeData {
  audioFiles: AudioFile[];
  categories: string[];
  correctMappings: Record<string, string>;
}

// Result types
export interface DragDropResult {
  mappings: Record<string, string>;
  timeSpent: number;
  attempts: number;
}

export interface EmojiSelectionResult {
  selectedEmojis: string[];
  timeSpent: number;
  attempts: number;
}

export interface SliderPuzzleResult {
  finalPositions: Record<string, { x: number; y: number }>;
  timeSpent: number;
  attempts: number;
}

export interface NumberSortingResult {
  sortedNumbers: number[];
  timeSpent: number;
  attempts: number;
}

export interface AudioMatchingResult {
  matches: Record<string, string>;
  timeSpent: number;
  attempts: number;
}

// Component props types
export interface CaptchaContainerProps extends CaptchaConfig {
  children?: React.ReactNode;
}

export interface ChallengeComponentProps {
  challenge: ChallengeData;
  onComplete: (result: any) => void;
  onError: (error: CaptchaError) => void;
  theme?: CaptchaTheme;
}

// Hook types
export interface UseCaptchaReturn {
  isLoading: boolean;
  currentChallenge: ChallengeData | null;
  isCompleted: boolean;
  error: CaptchaError | null;
  score: number;
  startChallenge: () => void;
  submitChallenge: (result: any) => void;
  resetChallenge: () => void;
}

export interface UseBehavioralAnalysisReturn {
  isTracking: boolean;
  behavioralData: BehavioralData;
  startTracking: () => void;
  stopTracking: () => void;
  getScore: () => number;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  score: number;
  confidence: number;
  reasons: string[];
}

export interface SecurityLayer {
  name: string;
  weight: number;
  validate: (data: any) => Promise<ValidationResult>;
}

// Utility types
export type CaptchaState = 'idle' | 'loading' | 'challenge' | 'validating' | 'success' | 'error';

export interface CaptchaContext {
  state: CaptchaState;
  config: CaptchaConfig;
  currentChallenge: ChallengeData | null;
  result: CaptchaResult | null;
  error: CaptchaError | null;
}

// Event types
export interface CaptchaEvent {
  type: string;
  timestamp: number;
  data: any;
}

export type CaptchaEventHandler = (event: CaptchaEvent) => void;