import React from 'react';

type CaptchaLanguage = 'en' | 'pt' | 'es' | 'fr' | 'de';
type ChallengeType = 'drag-drop' | 'audio' | 'emoji-selection';
interface CaptchaProps {
    lang?: CaptchaLanguage;
    onValidate?: (result: CaptchaResult) => void;
    className?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
}
interface CaptchaResult {
    success: boolean;
    timestamp: number;
    proofOfWork: string;
    challengeResult: boolean;
    invisibleFiltersResult: boolean;
    errors?: string[];
}
interface ValidationResult {
    isValid: boolean;
    layer: 'invisible' | 'proof-of-work' | 'challenge';
    details?: string;
}
interface InvisibleFilters {
    honeypot: string;
    mouseMovements: MouseMovement[];
    typingSpeed: number;
    submissionTime: number;
    startTime: number;
}
interface MouseMovement {
    x: number;
    y: number;
    timestamp: number;
    type: 'move' | 'click' | 'touch';
}
interface ProofOfWorkChallenge {
    difficulty: number;
    target: string;
    nonce?: string;
    hash?: string;
}
interface DragDropChallenge {
    sourceEmoji: string;
    targetEmoji: string;
    instruction: string;
}
interface AudioChallenge {
    targetSound: string;
    audioOptions: string[];
    instruction: string;
}
interface EmojiChallenge {
    targetEmoji: string;
    emojiOptions: string[];
    instruction: string;
}

declare const Captcha: React.FC<CaptchaProps>;

interface SimpleCaptchaProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
    className?: string;
}
/**
 * Simplified CAPTCHA component with minimal configuration required.
 * Perfect for quick integration with just 1-2 lines of code.
 */
declare const SimpleCaptcha: React.FC<SimpleCaptchaProps>;

interface UseCaptchaOptions {
    difficulty?: 'easy' | 'medium' | 'hard';
    onValidate?: (result: CaptchaResult) => void;
}
interface UseCaptchaReturn {
    isLoading: boolean;
    isVerifying: boolean;
    isCompleted: boolean;
    error: string | null;
    challengeType: ChallengeType | null;
    challenge: DragDropChallenge | AudioChallenge | EmojiChallenge | null;
    startChallenge: () => void;
    submitAnswer: (answer: string | boolean) => Promise<void>;
    reset: () => void;
    trackMouseMovement: (x: number, y: number, type?: 'move' | 'click' | 'touch') => void;
    trackKeystroke: () => void;
    setHoneypotValue: (value: string) => void;
    result: CaptchaResult | null;
}
declare function useCaptcha(options?: UseCaptchaOptions): UseCaptchaReturn;

/**
 * Class to handle invisible bot detection filters
 */
declare class InvisibleFiltersTracker {
    private startTime;
    private mouseMovements;
    private keystrokes;
    private keystrokeStartTime;
    private honeypotValue;
    constructor();
    /**
     * Track mouse movement
     */
    trackMouseMovement(x: number, y: number, type?: 'move' | 'click' | 'touch'): void;
    /**
     * Track keystroke for typing speed calculation
     */
    trackKeystroke(): void;
    /**
     * Set honeypot field value (should remain empty for humans)
     */
    setHoneypotValue(value: string): void;
    /**
     * Get current typing speed in characters per minute
     */
    getTypingSpeed(): number;
    /**
     * Get time elapsed since tracker initialization
     */
    getTimeElapsed(): number;
    /**
     * Validate invisible filters
     */
    validate(): {
        isValid: boolean;
        reasons: string[];
    };
    /**
     * Detect linear mouse movements (bot-like behavior)
     */
    private detectLinearMovements;
    /**
     * Get current filter data
     */
    getFilterData(): InvisibleFilters;
    /**
     * Reset all tracking data
     */
    reset(): void;
}

/**
 * Validate the complete CAPTCHA result
 * All three layers must pass for successful validation
 */
declare function validateCaptcha(invisibleFilters: InvisibleFiltersTracker, proofOfWorkChallenge: ProofOfWorkChallenge, proofOfWorkNonce: string, challengeResult: boolean): CaptchaResult;

/**
 * Generate a proof of work challenge
 */
declare function generateProofOfWork(difficulty?: number): ProofOfWorkChallenge;
/**
 * Validate a proof of work solution
 */
declare function validateProofOfWork(challenge: ProofOfWorkChallenge, nonce: string): boolean;

export { Captcha, type CaptchaLanguage, type CaptchaProps, type CaptchaResult, type ChallengeType, SimpleCaptcha, type ValidationResult, generateProofOfWork, useCaptcha, validateCaptcha, validateProofOfWork };
