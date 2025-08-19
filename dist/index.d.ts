import React from 'react';

/**
 * SimpleCaptcha - Streamlined CAPTCHA Component
 * A single, out-of-the-box CAPTCHA solution with embedded configuration
 */

interface SimpleCaptchaProps {
    /** Callback when verification is completed - returns simple boolean */
    onVerify?: (success: boolean) => void;
    /** Custom CSS class name */
    className?: string;
    /** Whether CAPTCHA is disabled */
    disabled?: boolean;
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
declare const SimpleCaptcha: React.FC<SimpleCaptchaProps>;

/**
 * NexCaptcha - Streamlined CAPTCHA solution
 *
 * @fileoverview Simplified entry point for easy integration
 * @version 2.0.0
 * @author NexCaptcha Team
 */

declare const PACKAGE_INFO: {
    readonly name: "nexcaptcha";
    readonly version: "2.0.0";
    readonly description: "Streamlined CAPTCHA solution with minimal configuration";
    readonly author: "NexCaptcha Team";
    readonly license: "MIT";
    readonly keywords: readonly ["captcha", "security", "react", "typescript", "simple", "streamlined"];
};

export { PACKAGE_INFO, SimpleCaptcha, SimpleCaptcha as default };
