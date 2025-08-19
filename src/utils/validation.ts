import { CaptchaResult, ValidationResult, InvisibleFilters as _InvisibleFilters, ProofOfWorkChallenge } from '../types';
import { validateProofOfWork } from './proofOfWork';
import { InvisibleFiltersTracker } from './invisibleFilters';

/**
 * Validate the complete CAPTCHA result
 * All three layers must pass for successful validation
 */
export function validateCaptcha(
  invisibleFilters: InvisibleFiltersTracker,
  proofOfWorkChallenge: ProofOfWorkChallenge,
  proofOfWorkNonce: string,
  challengeResult: boolean
): CaptchaResult {
  const timestamp = Date.now();
  const errors: string[] = [];
  
  // Layer 1: Invisible Filters Validation
  const invisibleValidation = invisibleFilters.validate();
  if (!invisibleValidation.isValid) {
    errors.push(...invisibleValidation.reasons);
  }
  
  // Layer 2: Proof of Work Validation
  const proofOfWorkValid = validateProofOfWork(proofOfWorkChallenge, proofOfWorkNonce);
  if (!proofOfWorkValid) {
    errors.push('Proof of work validation failed');
  }
  
  // Layer 3: Interactive Challenge Validation
  if (!challengeResult) {
    errors.push('Interactive challenge failed');
  }
  
  // All layers must pass
  const success = invisibleValidation.isValid && proofOfWorkValid && challengeResult;
  
  return {
    success,
    timestamp,
    proofOfWork: proofOfWorkNonce,
    challengeResult,
    invisibleFiltersResult: invisibleValidation.isValid,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Validate individual layers for debugging purposes
 */
export function validateLayer(
  layer: 'invisible' | 'proof-of-work' | 'challenge',
  data: InvisibleFiltersTracker | { nonce: string; challenge: ProofOfWorkChallenge } | boolean
): ValidationResult {
  switch (layer) {
    case 'invisible':
      if (data instanceof InvisibleFiltersTracker) {
        const result = data.validate();
        return {
          isValid: result.isValid,
          layer: 'invisible',
          details: result.reasons.join(', ')
        };
      }
      return {
        isValid: false,
        layer: 'invisible',
        details: 'Invalid invisible filters data'
      };
      
    case 'proof-of-work':
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (typeof data === 'object' && data !== null && 'challenge' in data && 'nonce' in data) {
        const powData = data as { nonce: string; challenge: ProofOfWorkChallenge };
        const isValid = validateProofOfWork(powData.challenge, powData.nonce);
        return {
          isValid,
          layer: 'proof-of-work',
          details: isValid ? 'Valid proof of work' : 'Invalid proof of work'
        };
      }
      return {
        isValid: false,
        layer: 'proof-of-work',
        details: 'Missing challenge or nonce'
      };
      
    case 'challenge':
      return {
        isValid: Boolean(data),
        layer: 'challenge',
        details: data ? 'Challenge completed' : 'Challenge failed'
      };
      
    default:
      return {
        isValid: false,
        layer: 'invisible',
        details: 'Unknown validation layer'
      };
  }
}

/**
 * Server-side validation helper
 * This function can be used on the server to validate CAPTCHA results
 */
export function validateCaptchaServer(
  captchaResult: CaptchaResult,
  expectedTimestamp?: number,
  maxAge = 300000 // 5 minutes
): { isValid: boolean; reason?: string } {
  // Check if result is successful
  if (!captchaResult.success) {
    return {
      isValid: false,
      reason: 'CAPTCHA validation failed'
    };
  }
  
  // Check timestamp validity (prevent replay attacks)
  if (expectedTimestamp) {
    const timeDiff = Math.abs(captchaResult.timestamp - expectedTimestamp);
    if (timeDiff > maxAge) {
      return {
        isValid: false,
        reason: 'CAPTCHA result expired'
      };
    }
  }
  
  // Check that all layers passed
  if (!captchaResult.invisibleFiltersResult || !captchaResult.challengeResult) {
    return {
      isValid: false,
      reason: 'One or more validation layers failed'
    };
  }
  
  // Validate proof of work format
  if (!captchaResult.proofOfWork || captchaResult.proofOfWork.length < 10) {
    return {
      isValid: false,
      reason: 'Invalid proof of work'
    };
  }
  
  return {
    isValid: true
  };
}

/**
 * Generate a secure token for server validation
 */
export function generateValidationToken(captchaResult: CaptchaResult, secret: string): string {
  // Simple token generation - in production, use proper HMAC
  const data = `${captchaResult.timestamp}-${captchaResult.proofOfWork}-${secret}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}