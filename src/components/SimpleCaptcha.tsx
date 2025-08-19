import React from 'react';
import { Captcha } from './Captcha';
import { CaptchaResult } from '../types';

interface SimpleCaptchaProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * Simplified CAPTCHA component with minimal configuration required.
 * Perfect for quick integration with just 1-2 lines of code.
 */
export const SimpleCaptcha: React.FC<SimpleCaptchaProps> = ({
  onSuccess,
  onError,
  className
}) => {
  const handleValidate = (result: CaptchaResult) => {
    if (result.success) {
      onSuccess?.();
    } else {
      onError?.(result.errors?.[0] ?? 'Verification failed');
    }
  };

  return (
    <Captcha
      className={className}
      onValidate={handleValidate}
      difficulty="medium"
      lang="en"
    />
  );
};