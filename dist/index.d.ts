/**
 * NexCaptcha - Multi-layer CAPTCHA solution for Next.js
 *
 * @fileoverview Main entry point for the NexCaptcha package
 * @version 1.0.0
 * @author NexCaptcha Team
 */
export { NexCaptcha, useNexCaptcha } from './components/NexCaptcha';
export { DragDropPuzzle, EmojiSelectionPuzzle, SliderPuzzle, NumberSortingPuzzle, AudioMatchingPuzzle, } from './components/puzzles';
export { ValidationEngine } from './core/validation-engine';
export { BehavioralAnalyzer } from './core/behavioral-analysis';
export { ProofOfWorkProcessor, AdaptiveProofOfWork } from './core/proof-of-work';
export { ChallengeGenerator } from './core/challenge-generator';
export type { CaptchaConfig, CaptchaResult, CaptchaError, CaptchaTheme, I18nConfig, ChallengeType, ChallengeData, ValidationResult, BehavioralData, ProofOfWorkChallenge, ProofOfWorkResult, DragDropChallengeData, EmojiSelectionChallengeData, SliderPuzzleChallengeData, NumberSortingChallengeData, AudioMatchingChallengeData, DragDropResult, EmojiSelectionResult, SliderPuzzleResult, NumberSortingResult, AudioMatchingResult, } from './types/index';
import type { CaptchaConfig } from './types/index';
export declare const DEFAULT_CONFIG: CaptchaConfig;
export { I18nManager, createI18nManager, detectBrowserLocale, isValidLocale, getLocaleDisplayName, formatDuration, formatNumber, getPlural, defaultI18n, t, DEFAULT_TRANSLATIONS, SUPPORTED_LOCALES, RTL_LOCALES, } from './utils/i18n';
export declare const createCaptchaConfig: (overrides?: Partial<CaptchaConfig>) => CaptchaConfig;
/**
 * Validate CAPTCHA configuration
 */
export declare const validateConfig: (config: CaptchaConfig) => {
    isValid: boolean;
    errors: string[];
};
/**
 * Get package version
 */
export declare const getVersion: () => string;
/**
 * Check browser compatibility
 */
export declare const checkBrowserCompatibility: () => {
    isSupported: boolean;
    missingFeatures: string[];
};
export declare const PACKAGE_INFO: {
    readonly name: "nexcaptcha";
    readonly version: "1.0.0";
    readonly description: "Multi-layer CAPTCHA solution for Next.js with Tailwind CSS";
    readonly author: "NexCaptcha Team";
    readonly license: "MIT";
    readonly repository: "https://github.com/nexcaptcha/nexcaptcha";
    readonly homepage: "https://nexcaptcha.dev";
    readonly keywords: readonly ["captcha", "security", "nextjs", "react", "tailwindcss", "typescript", "behavioral-analysis", "proof-of-work", "puzzle"];
};
//# sourceMappingURL=index.d.ts.map