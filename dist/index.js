/**
 * NexCaptcha - Multi-layer CAPTCHA solution for Next.js
 *
 * @fileoverview Main entry point for the NexCaptcha package
 * @version 1.0.0
 * @author NexCaptcha Team
 */
// Main Components
export { NexCaptcha, useNexCaptcha } from './components/NexCaptcha';
// Puzzle Components
export { DragDropPuzzle, EmojiSelectionPuzzle, SliderPuzzle, NumberSortingPuzzle, AudioMatchingPuzzle, } from './components/puzzles';
// Core Engine
export { ValidationEngine } from './core/validation-engine';
export { BehavioralAnalyzer } from './core/behavioral-analysis';
export { ProofOfWorkProcessor, AdaptiveProofOfWork } from './core/proof-of-work';
export { ChallengeGenerator } from './core/challenge-generator';
// Default configurations
export const DEFAULT_CONFIG = {
    enableBehavioralAnalysis: true,
    enableProofOfWork: true,
    enableInteractivePuzzles: true,
    difficulty: 3,
    theme: {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
    },
    i18n: {
        locale: 'en',
        messages: {
            'verify': 'Verify you are human',
            'title': 'Security Verification',
            'loading': 'Loading challenge...',
            'error': 'Verification failed',
            'tryAgain': 'Try again',
            'complete': 'Verification complete',
            'dragDrop': 'Drag items to correct positions',
            'emojiSelection': 'Select the correct emojis',
            'sliderPuzzle': 'Complete the puzzle',
            'numberSorting': 'Sort the numbers',
            'audioMatching': 'Match the audio clips',
        },
    },
};
// I18n utilities
export { I18nManager, createI18nManager, detectBrowserLocale, isValidLocale, getLocaleDisplayName, formatDuration, formatNumber, getPlural, defaultI18n, t, DEFAULT_TRANSLATIONS, SUPPORTED_LOCALES, RTL_LOCALES, } from './utils/i18n';
// Utility functions
export const createCaptchaConfig = (overrides = {}) => {
    return {
        ...DEFAULT_CONFIG,
        ...overrides,
        theme: {
            ...DEFAULT_CONFIG.theme,
            ...overrides.theme,
        },
        i18n: {
            ...DEFAULT_CONFIG.i18n,
            ...overrides.i18n,
            messages: {
                ...DEFAULT_CONFIG.i18n?.messages,
                ...overrides.i18n?.messages,
            },
        },
    };
};
/**
 * Validate CAPTCHA configuration
 */
export const validateConfig = (config) => {
    const errors = [];
    // Validate difficulty
    if (config.difficulty && (config.difficulty < 1 || config.difficulty > 5)) {
        errors.push('Difficulty must be between 1 and 5');
    }
    // Validate theme colors if provided
    if (config.theme?.primaryColor && !/^#[0-9A-F]{6}$/i.test(config.theme.primaryColor)) {
        errors.push('Primary color must be a valid hex color');
    }
    // Validate locale if provided
    if (config.i18n?.locale && typeof config.i18n.locale !== 'string') {
        errors.push('Locale must be a string');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};
/**
 * Get package version
 */
export const getVersion = () => {
    return '1.0.0';
};
/**
 * Check browser compatibility
 */
export const checkBrowserCompatibility = () => {
    const missingFeatures = [];
    // Check for required APIs
    if (typeof window === 'undefined') {
        return { isSupported: false, missingFeatures: ['Browser environment required'] };
    }
    if (!window.crypto || !window.crypto.subtle) {
        missingFeatures.push('Web Crypto API');
    }
    if (!window.Worker) {
        missingFeatures.push('Web Workers');
    }
    if (!window.AudioContext && !window.webkitAudioContext) {
        missingFeatures.push('Web Audio API');
    }
    if (!('ontouchstart' in window) && !window.navigator.maxTouchPoints) {
        // Touch events not available, but not required
    }
    return {
        isSupported: missingFeatures.length === 0,
        missingFeatures,
    };
};
// Package metadata
export const PACKAGE_INFO = {
    name: 'nexcaptcha',
    version: '1.0.0',
    description: 'Multi-layer CAPTCHA solution for Next.js with Tailwind CSS',
    author: 'NexCaptcha Team',
    license: 'MIT',
    repository: 'https://github.com/nexcaptcha/nexcaptcha',
    homepage: 'https://nexcaptcha.dev',
    keywords: [
        'captcha',
        'security',
        'nextjs',
        'react',
        'tailwindcss',
        'typescript',
        'behavioral-analysis',
        'proof-of-work',
        'puzzle',
    ],
};
