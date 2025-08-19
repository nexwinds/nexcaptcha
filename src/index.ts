export { Captcha } from './components/Captcha';
export { SimpleCaptcha } from './components/SimpleCaptcha';
export { useCaptcha } from './hooks/useCaptcha';
export type { 
  CaptchaProps, 
  CaptchaResult, 
  CaptchaLanguage,
  ChallengeType,
  ValidationResult 
} from './types';
export { validateCaptcha } from './utils/validation';
export { generateProofOfWork, validateProofOfWork } from './utils/proofOfWork';