/**
 * NexCaptcha - Streamlined CAPTCHA solution
 * 
 * @fileoverview Simplified entry point for easy integration
 * @version 2.0.0
 * @author NexCaptcha Team
 */

// Main Component - Single export for simplicity
export { SimpleCaptcha } from './components/SimpleCaptcha';

// Default export for minimal usage (Google reCAPTCHA style)
export { default } from './components/SimpleCaptcha';

// Package information
export const PACKAGE_INFO = {
  name: 'nexcaptcha',
  version: '2.0.0',
  description: 'Streamlined CAPTCHA solution with minimal configuration',
  author: 'NexCaptcha Team',
  license: 'MIT',
  keywords: [
    'captcha',
    'security',
    'react',
    'typescript',
    'simple',
    'streamlined',
  ],
} as const;