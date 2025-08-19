/**
 * SimpleCaptcha - Streamlined CAPTCHA Component
 * A single, out-of-the-box CAPTCHA solution with embedded configuration
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  DragDropPuzzle, 
  EmojiSelectionPuzzle, 
  SliderPuzzle, 
  NumberSortingPuzzle,
  AudioMatchingPuzzle 
} from './puzzles';
import { ChallengeManager, type ChallengeType } from '../core/challenge-manager';
import type { 
  DragDropChallengeData,
  EmojiSelectionChallengeData,
  SliderPuzzleChallengeData,
  NumberSortingChallengeData,
  AudioMatchingChallengeData,
  CaptchaTheme
} from '../types';

// Embedded transient configuration - not exposed to end users
const EMBEDDED_CONFIG = {
  enableBehavioralAnalysis: true,
  enableProofOfWork: true,
  enableInteractivePuzzles: true,
  difficulty: 5, // High difficulty (1-5 scale)
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
  },
};

interface SimpleCaptchaProps {
  /** Callback when verification is completed - returns simple boolean */
  onVerify?: (success: boolean) => void;
  /** Custom CSS class name */
  className?: string;
  /** Whether CAPTCHA is disabled */
  disabled?: boolean;
}

// ChallengeType is now imported from challenge-manager

interface CaptchaState {
  isVisible: boolean;
  isLoading: boolean;
  isVerified: boolean;
  attempts: number;
  startTime: number;
  behavioralScore: number;
  proofOfWorkCompleted: boolean;
  puzzleCompleted: boolean;
  currentChallengeType: ChallengeType;
  challengeData: any;
  lastChallengeTime: number;
}

/**
 * SimpleCaptcha Component - Google reCAPTCHA-like simplicity
 * 
 * Usage:
 * ```tsx
 * import SimpleCaptcha from 'nexcaptcha';
 * 
 * const handleVerify = (success: boolean) => {
 *   console.log('Verification:', success);
 * };
 * 
 * <SimpleCaptcha onVerify={handleVerify} />
 * ```
 */
export const SimpleCaptcha: React.FC<SimpleCaptchaProps> = ({
  onVerify,
  className = '',
  disabled = false,
}) => {
  // Initialize challenge manager
  const challengeManager = useRef(new ChallengeManager()).current;
  
  const [state, setState] = useState<CaptchaState>({
    isVisible: false,
    isLoading: false,
    isVerified: false,
    attempts: 0,
    startTime: 0,
    behavioralScore: 0,
    proofOfWorkCompleted: false,
    puzzleCompleted: false,
    currentChallengeType: 'center-click',
    challengeData: null,
    lastChallengeTime: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseMovements = useRef<Array<{ x: number; y: number; timestamp: number }>>([]);
  const keystrokes = useRef<Array<{ key: string; timestamp: number }>>([]);

  // Challenge generation using modular ChallengeManager
  const generateChallengeData = useCallback((challengeType: ChallengeType): any => {
    return challengeManager.generateChallengeData(challengeType);
  }, [challengeManager]);

  // Challenge type randomization using modular ChallengeManager
  const getRandomChallengeType = useCallback((): ChallengeType => {
    return challengeManager.getRandomChallengeType();
  }, [challengeManager]);

  // Behavioral analysis - track mouse movements and timing
  const trackMouseMovement = useCallback((e: MouseEvent) => {
    if (state.isVisible && !state.isVerified) {
      mouseMovements.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      });
    }
  }, [state.isVisible, state.isVerified]);

  // Simple proof of work - computational challenge
  const performProofOfWork = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const target = Math.floor(Math.random() * 1000000);
      let nonce = 0;
      const startTime = Date.now();
      
      const worker = () => {
        const hash = (nonce + target).toString().split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0);
        
        if (Math.abs(hash) % 10000 < EMBEDDED_CONFIG.difficulty * 10) {
          resolve(Date.now() - startTime > 100); // Ensure minimum time
        } else {
          nonce++;
          if (nonce < 100000) {
            setTimeout(worker, 0);
          } else {
            resolve(false);
          }
        }
      };
      
      worker();
    });
  }, []);

  // Simple interactive puzzle - click sequence
  const handlePuzzleInteraction = useCallback((event: React.MouseEvent) => {
    if (state.isVerified || disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Simple pattern recognition - click in specific areas
    const isValidClick = x > rect.width * 0.3 && x < rect.width * 0.7 && 
                        y > rect.height * 0.3 && y < rect.height * 0.7;
    
    if (isValidClick) {
      setState(prev => ({ ...prev, puzzleCompleted: true }));
    }
  }, [state.isVerified, disabled]);

  // Behavioral score calculation
  const calculateBehavioralScore = useCallback((): number => {
    const movements = mouseMovements.current;
    if (movements.length < 3) return 0;

    // Calculate movement smoothness and human-like patterns
    let smoothnessScore = 0;
    let timingScore = 0;
    
    for (let i = 1; i < movements.length; i++) {
      const prev = movements[i - 1];
      const curr = movements[i];
      
      const distance = Math.sqrt(
        Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
      );
      const timeDiff = curr.timestamp - prev.timestamp;
      
      // Human-like movement patterns
      if (distance > 0 && distance < 200 && timeDiff > 10 && timeDiff < 500) {
        smoothnessScore += 1;
      }
      
      if (timeDiff > 50 && timeDiff < 300) {
        timingScore += 1;
      }
    }
    
    return Math.min(100, (smoothnessScore + timingScore) / movements.length * 100);
  }, []);

  // Main verification process
  const performVerification = useCallback(async () => {
    if (state.isVerified || state.isLoading || disabled) return;

    console.log('Starting verification process...');
    setState(prev => ({ ...prev, isLoading: true, startTime: Date.now() }));

    try {
      // Step 1: Behavioral analysis
      const behavioralScore = calculateBehavioralScore();
      console.log('Behavioral score:', behavioralScore);
      
      // Step 2: Proof of work
      const proofOfWorkResult = await performProofOfWork();
      console.log('Proof of work result:', proofOfWorkResult);
      
      // Step 3: Check puzzle completion
      const puzzleResult = state.puzzleCompleted;
      console.log('Puzzle completed:', puzzleResult);
      
      // Calculate overall success
      const success = behavioralScore > 30 && proofOfWorkResult && puzzleResult;
      console.log('Overall success:', success, { behavioralScore, proofOfWorkResult, puzzleResult });
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isVerified: success,
        behavioralScore,
        proofOfWorkCompleted: proofOfWorkResult,
        puzzleCompleted: success ? prev.puzzleCompleted : false,
        attempts: prev.attempts + 1,
      }));
      
      console.log('Verification completed, success:', success);
      // Return simple boolean result
      onVerify?.(success);
      
    } catch (error) {
      console.error('Verification error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        puzzleCompleted: false,
        attempts: prev.attempts + 1,
      }));
      onVerify?.(false);
    }
  }, [state.isVerified, state.isLoading, state.puzzleCompleted, disabled, calculateBehavioralScore, performProofOfWork, onVerify]);

  // Initialize behavioral tracking
  useEffect(() => {
    if (state.isVisible) {
      document.addEventListener('mousemove', trackMouseMovement);
      return () => document.removeEventListener('mousemove', trackMouseMovement);
    }
  }, [state.isVisible, trackMouseMovement]);



  // Handle checkbox click
  const handleCheckboxClick = useCallback(() => {
    if (disabled || state.isVerified) return;
    
    const challengeType = getRandomChallengeType();
    const challengeData = generateChallengeData(challengeType);
    
    // Debug logging
    console.log('Selected challenge type:', challengeType);
    console.log('Challenge data:', challengeData);
    
    setState(prev => ({
      ...prev,
      isVisible: true,
      isLoading: true,
      startTime: Date.now(),
      attempts: prev.attempts + 1,
      behavioralScore: 0,
      proofOfWorkCompleted: false,
      puzzleCompleted: false,
      currentChallengeType: challengeType,
      challengeData: challengeData,
      lastChallengeTime: Date.now(),
    }));

    // Start proof of work
    setTimeout(() => {
      performProofOfWork();
    }, 100);
  }, [disabled, state.isVerified, getRandomChallengeType, generateChallengeData, performProofOfWork]);

  // Reset function
  const reset = useCallback(() => {
    setState({
      isVisible: false,
      isLoading: false,
      isVerified: false,
      attempts: 0,
      startTime: 0,
      behavioralScore: 0,
      proofOfWorkCompleted: false,
      puzzleCompleted: false,
      currentChallengeType: 'center-click',
      challengeData: null,
      lastChallengeTime: 0,
    });
    mouseMovements.current = [];
    keystrokes.current = [];
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`nexcaptcha-container ${className}`}
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: EMBEDDED_CONFIG.theme.fontSize,
      }}
    >
      {/* Main checkbox interface - Google reCAPTCHA style */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px',
          border: `1px solid ${EMBEDDED_CONFIG.theme.borderColor}`,
          borderRadius: EMBEDDED_CONFIG.theme.borderRadius,
          backgroundColor: EMBEDDED_CONFIG.theme.backgroundColor,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
        onClick={handleCheckboxClick}
      >
        <div 
          style={{
            width: '20px',
            height: '20px',
            border: `2px solid ${state.isVerified ? EMBEDDED_CONFIG.theme.primaryColor : EMBEDDED_CONFIG.theme.borderColor}`,
            borderRadius: '3px',
            marginRight: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: state.isVerified ? EMBEDDED_CONFIG.theme.primaryColor : 'transparent',
            transition: 'all 0.2s ease',
          }}
        >
          {state.isLoading && (
            <div 
              style={{
                width: '12px',
                height: '12px',
                border: '2px solid transparent',
                borderTop: `2px solid ${EMBEDDED_CONFIG.theme.primaryColor}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
          )}
          {state.isVerified && !state.isLoading && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path 
                d="M2 6L5 9L10 3" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span style={{ color: EMBEDDED_CONFIG.theme.secondaryColor }}>
          I'm not a robot
        </span>
      </div>

      {/* Interactive puzzle area */}
      {state.isVisible && !state.isVerified && (
        <div 
          style={{
            marginTop: '8px',
            padding: '16px',
            border: `1px solid ${EMBEDDED_CONFIG.theme.borderColor}`,
            borderRadius: EMBEDDED_CONFIG.theme.borderRadius,
            backgroundColor: EMBEDDED_CONFIG.theme.backgroundColor,
          }}
        >
          {/* Dynamic puzzle rendering based on challenge type */}
          {state.currentChallengeType === 'center-click' && (
            <>
              <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '500' }}>
                Click in the center area to verify
              </div>
              <div 
                onClick={handlePuzzleInteraction}
                style={{
                  width: '100%',
                  height: '120px',
                  border: `2px dashed ${EMBEDDED_CONFIG.theme.borderColor}`,
                  borderRadius: EMBEDDED_CONFIG.theme.borderRadius,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: state.puzzleCompleted ? '#f0f9ff' : '#fafafa',
                  transition: 'all 0.2s ease',
                }}
              >
                {state.puzzleCompleted ? (
                  <span style={{ color: EMBEDDED_CONFIG.theme.primaryColor, fontWeight: '500' }}>
                    ✓ Puzzle completed
                  </span>
                ) : (
                  <span style={{ color: EMBEDDED_CONFIG.theme.secondaryColor }}>
                    Click here
                  </span>
                )}
              </div>
            </>
          )}

          {state.currentChallengeType === 'drag-drop' && state.challengeData && (
            <DragDropPuzzle
              challenge={state.challengeData}
              theme={EMBEDDED_CONFIG.theme}
              onComplete={() => {
                setState(prev => ({ ...prev, puzzleCompleted: true }));
              }}
              onInteraction={() => {}}
              disabled={state.puzzleCompleted}
            />
          )}

          {state.currentChallengeType === 'emoji-selection' && state.challengeData && (
            <EmojiSelectionPuzzle
              challenge={state.challengeData}
              theme={EMBEDDED_CONFIG.theme}
              onComplete={() => {
                setState(prev => ({ ...prev, puzzleCompleted: true }));
              }}
              onInteraction={() => {}}
              disabled={state.puzzleCompleted}
            />
          )}

          {state.currentChallengeType === 'slider' && state.challengeData && (
            <SliderPuzzle
              challenge={state.challengeData}
              theme={EMBEDDED_CONFIG.theme}
              onComplete={() => {
                setState(prev => ({ ...prev, puzzleCompleted: true }));
              }}
              onInteraction={() => {}}
              disabled={state.puzzleCompleted}
            />
          )}

          {state.currentChallengeType === 'number-sorting' && state.challengeData && (
            <NumberSortingPuzzle
              challenge={state.challengeData}
              theme={EMBEDDED_CONFIG.theme}
              onComplete={() => {
                setState(prev => ({ ...prev, puzzleCompleted: true }));
              }}
              onInteraction={() => {}}
              disabled={state.puzzleCompleted}
            />
          )}

          {state.currentChallengeType === 'audio-matching' && state.challengeData && (
            <AudioMatchingPuzzle
              challenge={state.challengeData}
              theme={EMBEDDED_CONFIG.theme}
              onComplete={() => {
                setState(prev => ({ ...prev, puzzleCompleted: true }));
              }}
              onInteraction={() => {}}
              disabled={state.puzzleCompleted}
            />
          )}
          
          {state.puzzleCompleted && !state.isLoading && (
            <button
              onClick={performVerification}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: EMBEDDED_CONFIG.theme.primaryColor,
                color: 'white',
                border: 'none',
                borderRadius: EMBEDDED_CONFIG.theme.borderRadius,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Verify
            </button>
          )}
          
          {state.puzzleCompleted && state.isLoading && (
            <div style={{
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              border: 'none',
              borderRadius: EMBEDDED_CONFIG.theme.borderRadius,
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'center',
            }}>
              Verifying...
            </div>
          )}
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SimpleCaptcha;