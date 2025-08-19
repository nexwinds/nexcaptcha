import { useState, useCallback, useRef } from 'react';
import { CaptchaResult, ChallengeType, DragDropChallenge, AudioChallenge, EmojiChallenge, ProofOfWorkChallenge } from '../types';
import { InvisibleFiltersTracker, createInvisibleFiltersTracker } from '../utils/invisibleFilters';
import { generateProofOfWork, solveProofOfWork, getDifficulty } from '../utils/proofOfWork';
import { generateRandomChallenge, validateChallengeAnswer } from '../utils/challenges';
import { validateCaptcha } from '../utils/validation';

export interface UseCaptchaOptions {
  difficulty?: 'easy' | 'medium' | 'hard';
  onValidate?: (result: CaptchaResult) => void;
}

export interface UseCaptchaReturn {
  // State
  isLoading: boolean;
  isVerifying: boolean;
  isCompleted: boolean;
  error: string | null;
  
  // Challenge data
  challengeType: ChallengeType | null;
  challenge: DragDropChallenge | AudioChallenge | EmojiChallenge | null;
  
  // Actions
  startChallenge: () => void;
  submitAnswer: (answer: string | boolean) => Promise<void>;
  reset: () => void;
  
  // Invisible filters
  trackMouseMovement: (x: number, y: number, type?: 'move' | 'click' | 'touch') => void;
  trackKeystroke: () => void;
  setHoneypotValue: (value: string) => void;
  
  // Result
  result: CaptchaResult | null;
}

export function useCaptcha(options: UseCaptchaOptions = {}): UseCaptchaReturn {
  const { difficulty = 'medium', onValidate } = options;
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challengeType, setChallengeType] = useState<ChallengeType | null>(null);
  const [challenge, setChallenge] = useState<DragDropChallenge | AudioChallenge | EmojiChallenge | null>(null);
  const [result, setResult] = useState<CaptchaResult | null>(null);
  
  // Refs for persistent data
  const invisibleFiltersRef = useRef<InvisibleFiltersTracker>(createInvisibleFiltersTracker());
  const proofOfWorkChallengeRef = useRef<ProofOfWorkChallenge | null>(null);
  const proofOfWorkNonceRef = useRef<string | null>(null);
  
  /**
   * Start a new CAPTCHA challenge
   */
  const startChallenge = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsCompleted(false);
    setResult(null);
    
    try {
      // Reset invisible filters
      invisibleFiltersRef.current.reset();
      
      // Generate proof of work challenge
      const powDifficulty = getDifficulty(difficulty);
      proofOfWorkChallengeRef.current = generateProofOfWork(powDifficulty);
      
      // Start solving proof of work in background
      void solveProofOfWork(proofOfWorkChallengeRef.current).then(nonce => {
        proofOfWorkNonceRef.current = nonce;
      });
      
      // Generate interactive challenge
      const { type, challenge: generatedChallenge } = generateRandomChallenge();
      setChallengeType(type);
      setChallenge(generatedChallenge);
      
      setIsLoading(false);
    } catch (err) {
      setError('Failed to initialize CAPTCHA');
      setIsLoading(false);
    }
  }, [difficulty]);
  
  /**
   * Submit challenge answer
   */
  const submitAnswer = useCallback(async (answer: string | boolean) => {
    if (!challengeType || !challenge || !proofOfWorkChallengeRef.current) {
      setError('CAPTCHA not properly initialized');
      return;
    }
    
    setIsVerifying(true);
    setError(null);
    
    try {
      // Wait for proof of work to complete if not ready
      let attempts = 0;
      while (!proofOfWorkNonceRef.current && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!proofOfWorkNonceRef.current) {
        throw new Error('Proof of work timeout');
      }
      
      // Validate challenge answer
      const challengeResult = validateChallengeAnswer(challengeType, challenge, answer);
      
      // Perform complete validation
      const captchaResult = validateCaptcha(
        invisibleFiltersRef.current,
        proofOfWorkChallengeRef.current,
        proofOfWorkNonceRef.current,
        challengeResult
      );
      
      setResult(captchaResult);
      setIsCompleted(true);
      
      // Call validation callback
      if (onValidate) {
        onValidate(captchaResult);
      }
      
      if (!captchaResult.success) {
        setError(captchaResult.errors?.join(', ') ?? 'Validation failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Validation failed';
      setError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  }, [challengeType, challenge, onValidate]);
  
  /**
   * Reset CAPTCHA state
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setIsVerifying(false);
    setIsCompleted(false);
    setError(null);
    setChallengeType(null);
    setChallenge(null);
    setResult(null);
    
    // Reset refs
    invisibleFiltersRef.current.reset();
    proofOfWorkChallengeRef.current = null;
    proofOfWorkNonceRef.current = null;
  }, []);
  
  /**
   * Track mouse movement for invisible filters
   */
  const trackMouseMovement = useCallback((x: number, y: number, type: 'move' | 'click' | 'touch' = 'move') => {
    invisibleFiltersRef.current.trackMouseMovement(x, y, type);
  }, []);
  
  /**
   * Track keystroke for invisible filters
   */
  const trackKeystroke = useCallback(() => {
    invisibleFiltersRef.current.trackKeystroke();
  }, []);
  
  /**
   * Set honeypot value for invisible filters
   */
  const setHoneypotValue = useCallback((value: string) => {
    invisibleFiltersRef.current.setHoneypotValue(value);
  }, []);
  
  // Don't auto-start challenge on mount - let user trigger it
  
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return {
    // State
    isLoading,
    isVerifying,
    isCompleted,
    error,
    
    // Challenge data
    challengeType,
    challenge,
    
    // Actions
    startChallenge,
    submitAnswer,
    reset,
    
    // Invisible filters
    trackMouseMovement,
    trackKeystroke,
    setHoneypotValue,
    
    // Result
    result
  };
}