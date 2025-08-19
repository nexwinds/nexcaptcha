/**
 * NexCaptcha Main Component
 * Multi-layer CAPTCHA solution with behavioral analysis, proof-of-work, and interactive puzzles
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CaptchaConfig,
  CaptchaResult,
  CaptchaError,
  ChallengeType,
  ChallengeData,
  CaptchaTheme,
  BehavioralData,
  ProofOfWorkResult,
} from '../types/index';
import { ValidationEngine } from '../core/validation-engine';
import { BehavioralAnalyzer } from '../core/behavioral-analysis';
import { ProofOfWorkProcessor, AdaptiveProofOfWork } from '../core/proof-of-work';
import {
  DragDropPuzzle,
  EmojiSelectionPuzzle,
  SliderPuzzle,
  NumberSortingPuzzle,
  AudioMatchingPuzzle,
} from './puzzles';

interface NexCaptchaProps {
  /** CAPTCHA configuration */
  config: CaptchaConfig;
  /** Callback when CAPTCHA is completed */
  onComplete: (result: CaptchaResult) => void;
  /** Callback when CAPTCHA encounters an error */
  onError?: (error: CaptchaError) => void;
  /** Theme configuration */
  theme?: CaptchaTheme;
  /** Whether CAPTCHA is disabled */
  disabled?: boolean;
  /** Custom CSS class name */
  className?: string;
}

interface CaptchaState {
  isVisible: boolean;
  currentChallenge: ChallengeData | null;
  challengeType: ChallengeType | null;
  isLoading: boolean;
  error: CaptchaError | null;
  behavioralScore: number;
  proofOfWorkResult: ProofOfWorkResult | null;
  puzzleResult: any | null;
  attempts: number;
  startTime: number;
}

/**
 * Main NexCaptcha Component
 */
export const NexCaptcha: React.FC<NexCaptchaProps> = ({
  config,
  onComplete,
  onError,
  theme,
  disabled = false,
  className = '',
}) => {
  const [state, setState] = useState<CaptchaState>({
    isVisible: false,
    currentChallenge: null,
    challengeType: null,
    isLoading: false,
    error: null,
    behavioralScore: 0,
    proofOfWorkResult: null,
    puzzleResult: null,
    attempts: 0,
    startTime: 0,
  });

  const validationEngine = useRef<ValidationEngine | null>(null);
  const behavioralAnalyzer = useRef<BehavioralAnalyzer | null>(null);
  const proofOfWorkProcessor = useRef<ProofOfWorkProcessor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  /**
   * Initialize CAPTCHA components
   */
  useEffect(() => {
    try {
      validationEngine.current = new ValidationEngine(config);
      behavioralAnalyzer.current = new BehavioralAnalyzer();
      proofOfWorkProcessor.current = new ProofOfWorkProcessor();
    } catch (error) {
      handleError({
        code: 'INITIALIZATION_ERROR',
        message: 'Failed to initialize CAPTCHA components',
        details: error,
      });
    }
  }, [config]);

  /**
   * Handle error
   */
  const handleError = useCallback(
    (error: CaptchaError) => {
      setState(prev => ({ ...prev, error, isLoading: false }));
      onError?.(error);
    },
    [onError]
  );

  /**
   * Start CAPTCHA challenge
   */
  const startChallenge = useCallback(async () => {
    if (disabled || !validationEngine.current) return;

    setState(prev => ({
      ...prev,
      isVisible: true,
      isLoading: true,
      error: null,
      attempts: prev.attempts + 1,
      startTime: Date.now(),
    }));

    try {
      // Start behavioral analysis
      if (behavioralAnalyzer.current && config.enableBehavioralAnalysis) {
        behavioralAnalyzer.current.startTracking(containerRef.current || document.body);
      }

      // Start proof-of-work challenge
      if (config.enableProofOfWork && proofOfWorkProcessor.current) {
        const difficulty = await AdaptiveProofOfWork.getAdaptiveDifficulty();
        const powChallenge = ProofOfWorkProcessor.generateChallenge(difficulty);
        
        proofOfWorkProcessor.current.startChallenge(
          powChallenge,
          (result) => {
            setState(prev => ({ ...prev, proofOfWorkResult: result }));
          },
          (error) => {
            console.warn('Proof-of-work failed:', error);
          }
        );
      }

      // Generate interactive challenge
      const challengeType = selectChallengeType();
      const challenge = validationEngine.current.generateChallenge();
      
      setState(prev => ({
        ...prev,
        currentChallenge: challenge,
        challengeType,
        isLoading: false,
      }));
    } catch (error) {
      handleError({
        code: 'CHALLENGE_GENERATION_ERROR',
        message: 'Failed to generate challenge',
        details: error,
      });
    }
  }, [disabled, config]);

  /**
   * Select challenge type based on configuration
   */
  const selectChallengeType = useCallback((): ChallengeType => {
    const enabledTypes: ChallengeType[] = ['drag-drop', 'emoji-selection'];
    const randomIndex = Math.floor(Math.random() * enabledTypes.length);
    return enabledTypes[randomIndex];
  }, []);

  /**
   * Handle puzzle completion
   */
  const handlePuzzleComplete = useCallback(
    async (puzzleResult: any) => {
      if (!validationEngine.current) return;

      setState(prev => ({ ...prev, puzzleResult, isLoading: true }));

      try {
        // Get behavioral data
        let behavioralData: BehavioralData | null = null;
        if (behavioralAnalyzer.current && config.enableBehavioralAnalysis) {
          const behavioralScore = behavioralAnalyzer.current.calculateScore();
          setState(prev => ({ ...prev, behavioralScore }));
          behavioralAnalyzer.current.stopTracking();
        }

        // Stop proof-of-work
        if (proofOfWorkProcessor.current) {
          proofOfWorkProcessor.current.stopChallenge();
        }

        // Validate all results
        const validationResult = await validationEngine.current.validateChallenge(
          state.currentChallenge!.id,
          {
            puzzleResult: state.puzzleResult,
            behavioralData,
            proofOfWorkResult: state.proofOfWorkResult,
          }
        );

        const totalTime = Date.now() - state.startTime;
        
        const captchaResult: CaptchaResult = {
          success: validationResult.success,
          challengeId: state.currentChallenge!.id,
          score: validationResult.score,
          timeSpent: totalTime,
          behavioralScore: state.behavioralScore,
          metadata: {
            puzzleResult: state.puzzleResult,
            behavioralData,
            proofOfWorkResult: state.proofOfWorkResult,
            validationDetails: validationResult,
          },
        };

        // Close modal
        setState(prev => ({
          ...prev,
          isVisible: false,
          isLoading: false,
        }));

        // Call completion callback
        onComplete(captchaResult);
      } catch (error) {
        handleError({
          code: 'VALIDATION_ERROR',
          message: 'Failed to validate CAPTCHA response',
          details: error,
        });
      }
    },
    [config, state.challengeType, state.proofOfWorkResult, state.behavioralScore, state.attempts, state.startTime, onComplete]
  );

  /**
   * Handle puzzle interaction
   */
  const handlePuzzleInteraction = useCallback(
    (event: string, data: any) => {
      // Track interactions for behavioral analysis
      if (behavioralAnalyzer.current) {
        // Additional interaction tracking can be added here
      }
    },
    []
  );

  /**
   * Close modal
   */
  const closeModal = useCallback(() => {
    if (behavioralAnalyzer.current) {
      behavioralAnalyzer.current.stopTracking();
    }
    if (proofOfWorkProcessor.current) {
      proofOfWorkProcessor.current.stopChallenge();
    }
    
    setState(prev => ({
      ...prev,
      isVisible: false,
      currentChallenge: null,
      challengeType: null,
      error: null,
    }));
  }, []);

  /**
   * Handle escape key
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state.isVisible) {
        closeModal();
      }
    };

    if (state.isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [state.isVisible, closeModal]);

  /**
   * Handle modal backdrop click
   */
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        closeModal();
      }
    },
    [closeModal]
  );

  /**
   * Render puzzle component based on type
   */
  const renderPuzzle = () => {
    if (!state.currentChallenge || !state.challengeType) return null;

    const puzzleProps = {
      challenge: state.currentChallenge!.data,
      theme,
      onComplete: handlePuzzleComplete,
      onInteraction: handlePuzzleInteraction,
      disabled: disabled || state.isLoading,
    };

    switch (state.challengeType) {
      case 'drag-drop':
        return <DragDropPuzzle {...puzzleProps} />;
      case 'emoji-selection':
        return <EmojiSelectionPuzzle {...puzzleProps} />;
      case 'slider':
        return <SliderPuzzle {...puzzleProps} />;
      case 'number-sorting':
        return <NumberSortingPuzzle {...puzzleProps} />;
      case 'audio-matching':
        return <AudioMatchingPuzzle {...puzzleProps} />;
      default:
        return (
          <div className="text-center text-red-600">
            Unsupported challenge type: {state.challengeType}
          </div>
        );
    }
  };

  /**
   * Get theme classes
   */
  const getThemeClasses = () => {
    if (!theme) return '';
    
    return [
      theme.primaryColor && `text-${theme.primaryColor}`,
      theme.backgroundColor && `bg-${theme.backgroundColor}`,
      theme.borderRadius && `rounded-${theme.borderRadius}`,
    ].filter(Boolean).join(' ');
  };

  return (
    <div ref={containerRef} className={`nexcaptcha-container ${className}`}>
      {/* Checkbox-style Trigger */}
      <div className="bg-white border border-gray-300 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
        <button
          className={`flex items-center space-x-3 w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-400 rounded ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={startChallenge}
          disabled={disabled}
          aria-label="I'm not a robot - Start CAPTCHA verification"
        >
          <div className="flex-shrink-0">
            <div className="w-6 h-6 border-2 border-gray-400 rounded bg-white flex items-center justify-center hover:border-blue-500 transition-colors">
              <svg className="w-4 h-4 text-green-600 hidden" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <span className="text-gray-700 font-medium select-none">
            I'm not a robot
          </span>
        </button>
      </div>

      {/* Modal */}
      {state.isVisible && (
        <div
          className="nexcaptcha-modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="nexcaptcha-title"
        >
          <div
            ref={modalRef}
            className={`nexcaptcha-modal bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${getThemeClasses()}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="nexcaptcha-modal-header flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="nexcaptcha-title" className="text-xl font-semibold text-gray-800">
                {'Human Verification'}
              </h2>
              <button
                className="nexcaptcha-close-button text-gray-400 hover:text-gray-600 transition-colors"
                onClick={closeModal}
                aria-label="Close CAPTCHA"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="nexcaptcha-modal-content p-6">
              {state.isLoading ? (
                <div className="nexcaptcha-loading flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-gray-600">Preparing verification challenge...</p>
                </div>
              ) : state.error ? (
                <div className="nexcaptcha-error text-center py-12">
                  <div className="text-red-600 text-4xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Verification Error
                  </h3>
                  <p className="text-gray-600 mb-4">{state.error.message}</p>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    onClick={startChallenge}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="nexcaptcha-puzzle-container">
                  {renderPuzzle()}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="nexcaptcha-modal-footer px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  {config.enableBehavioralAnalysis && (
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Behavioral Analysis</span>
                    </div>
                  )}
                  {config.enableProofOfWork && (
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${
                        state.proofOfWorkResult ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <span>Proof of Work</span>
                    </div>
                  )}
                </div>
                <div>
                  Attempt {state.attempts}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NexCaptcha;

/**
 * Hook for using NexCaptcha with custom configuration
 */
export const useNexCaptcha = (config: CaptchaConfig) => {
  const [result, setResult] = useState<CaptchaResult | null>(null);
  const [error, setError] = useState<CaptchaError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = useCallback((captchaResult: CaptchaResult) => {
    setResult(captchaResult);
    setIsLoading(false);
  }, []);

  const handleError = useCallback((captchaError: CaptchaError) => {
    setError(captchaError);
    setIsLoading(false);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    result,
    error,
    isLoading,
    handleComplete,
    handleError,
    reset,
  };
};

// Simplified component for minimal usage (under 10 lines)
export const SimpleCaptcha: React.FC<{
  onVerify?: (success: boolean) => void;
  className?: string;
}> = ({ onVerify, className }) => {
  return (
    <NexCaptcha
      config={{
        enableBehavioralAnalysis: true,
        enableProofOfWork: true,
        enableInteractivePuzzles: true,
        difficulty: 5, // High difficulty (1-5 scale)
      }}
      onComplete={(result) => onVerify?.(true)}
      onError={() => onVerify?.(false)}
      className={className}
    />
  );
};

// Export optimized configuration for advanced users
export const OPTIMIZED_CONFIG = {
  enableBehavioralAnalysis: true,
  enableProofOfWork: true,
  enableInteractivePuzzles: true,
  difficulty: 5, // High difficulty (1-5 scale)
};

// Exports are already declared above