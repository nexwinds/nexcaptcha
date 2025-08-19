# NexCaptcha Examples

Practical examples and use cases for implementing NexCaptcha in your applications.

## Table of Contents

- [Basic Implementation](#basic-implementation)
- [Advanced Configuration](#advanced-configuration)
- [Custom Themes](#custom-themes)
- [Internationalization](#internationalization)
- [Form Integration](#form-integration)
- [Next.js Integration](#nextjs-integration)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)
- [Accessibility](#accessibility)
- [Testing](#testing)

## Basic Implementation

### Simple CAPTCHA

```tsx
import React from 'react';
import { NexCaptcha } from 'nexcaptcha';

function LoginForm() {
  const handleCaptchaSuccess = (result) => {
    console.log('CAPTCHA verified:', result);
    // Proceed with form submission
  };

  const handleCaptchaError = (error) => {
    console.error('CAPTCHA failed:', error);
    // Show error message to user
  };

  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      
      <NexCaptcha
        onComplete={handleCaptchaSuccess}
        onFailure={handleCaptchaError}
      />
      
      <button type="submit">Login</button>
    </form>
  );
}
```

### Using the Hook

```tsx
import React from 'react';
import { useNexCaptcha, createCaptchaConfig } from 'nexcaptcha';

function CustomCaptcha() {
  const config = createCaptchaConfig({
    difficulty: 2,
    enableBehavioralAnalysis: true,
  });

  const {
    isLoading,
    currentChallenge,
    result,
    error,
    startChallenge,
    reset,
  } = useNexCaptcha(config);

  return (
    <div>
      {!currentChallenge && (
        <button onClick={startChallenge} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Start Verification'}
        </button>
      )}
      
      {currentChallenge && (
        <div>
          <p>Challenge Type: {currentChallenge.type}</p>
          {/* Challenge component will be rendered here */}
        </div>
      )}
      
      {result && (
        <div>
          <p>✅ Verification successful!</p>
          <p>Score: {result.score}</p>
          <button onClick={reset}>Reset</button>
        </div>
      )}
      
      {error && (
        <div>
          <p>❌ Verification failed: {error.message}</p>
          <button onClick={reset}>Try Again</button>
        </div>
      )}
    </div>
  );
}
```

## Advanced Configuration

### High-Security Setup

```tsx
import { NexCaptcha, createCaptchaConfig } from 'nexcaptcha';

const highSecurityConfig = createCaptchaConfig({
  // Enable all security layers
  enableBehavioralAnalysis: true,
  enableProofOfWork: true,
  enableInteractivePuzzles: true,
  
  // Maximum difficulty
  difficulty: 5,
  
  // Custom theme for security context
  theme: {
    primaryColor: '#dc2626', // Red for high security
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderRadius: '4px',
  },
  
  // Callbacks for security monitoring
  onChallenge: (challenge) => {
    console.log('Security challenge initiated:', challenge.type);
    // Log to security monitoring system
  },
  
  onSuccess: (result) => {
    console.log('Security verification passed:', {
      score: result.score,
      behavioralScore: result.behavioralScore,
      proofOfWorkScore: result.proofOfWorkScore,
    });
    // Log successful verification
  },
  
  onFailure: (error) => {
    console.error('Security verification failed:', error);
    // Alert security team if needed
  },
});

function SecureTransactionForm() {
  return (
    <form>
      <input type="number" placeholder="Amount" />
      <input type="text" placeholder="Recipient" />
      
      <NexCaptcha config={highSecurityConfig} />
      
      <button type="submit">Transfer Funds</button>
    </form>
  );
}
```

### Low-Friction Setup

```tsx
import { NexCaptcha, createCaptchaConfig } from 'nexcaptcha';

const lowFrictionConfig = createCaptchaConfig({
  // Minimal user interaction
  enableBehavioralAnalysis: true,
  enableProofOfWork: true,
  enableInteractivePuzzles: false, // Disable puzzles for better UX
  
  // Lower difficulty
  difficulty: 1,
  
  // Subtle theme
  theme: {
    primaryColor: '#10b981', // Green for friendly UX
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderRadius: '8px',
  },
});

function NewsletterSignup() {
  return (
    <form>
      <input type="email" placeholder="Your email" />
      
      <NexCaptcha config={lowFrictionConfig} />
      
      <button type="submit">Subscribe</button>
    </form>
  );
}
```

## Custom Themes

### Dark Theme

```tsx
import { createCaptchaConfig } from 'nexcaptcha';

const darkThemeConfig = createCaptchaConfig({
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#6b7280',
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    borderRadius: '8px',
    fontSize: '14px',
  },
  className: 'dark-captcha', // Add custom CSS class
});

// Custom CSS
const darkThemeStyles = `
.dark-captcha {
  color: #f9fafb;
}

.dark-captcha .nexcaptcha-button {
  background-color: #374151;
  color: #f9fafb;
  border: 1px solid #4b5563;
}

.dark-captcha .nexcaptcha-button:hover {
  background-color: #4b5563;
}

.dark-captcha .nexcaptcha-modal {
  background-color: #1f2937;
  border: 1px solid #374151;
}
`;
```

### Brand-Specific Theme

```tsx
const brandConfig = createCaptchaConfig({
  theme: {
    primaryColor: '#8b5cf6', // Brand purple
    secondaryColor: '#a78bfa',
    backgroundColor: '#faf5ff',
    borderColor: '#e9d5ff',
    borderRadius: '12px',
    fontSize: '16px',
  },
});
```

## Internationalization

### Multi-Language Support

```tsx
import { 
  NexCaptcha, 
  createCaptchaConfig, 
  detectBrowserLocale,
  isValidLocale 
} from 'nexcaptcha';

function InternationalCaptcha() {
  // Detect user's locale
  const detectedLocale = detectBrowserLocale();
  const locale = isValidLocale(detectedLocale) ? detectedLocale : 'en';
  
  const config = createCaptchaConfig({
    i18n: {
      locale,
      messages: {
        // Custom messages can override defaults
        verify: locale === 'es' ? 'Verificar Identidad' : undefined,
      },
    },
  });
  
  return <NexCaptcha config={config} />;
}
```

### Custom Translation Messages

```tsx
import { createI18nManager } from 'nexcaptcha';

const customI18n = createI18nManager({
  locale: 'en',
  messages: {
    verify: 'Prove You\'re Human',
    title: 'Bot Detection',
    loading: 'Initializing security check...',
    complete: 'Identity verified successfully',
    dragDrop: 'Arrange items in the correct order',
    emojiSelection: 'Choose the matching emojis',
  },
});

const config = createCaptchaConfig({
  i18n: {
    locale: customI18n.getLocale(),
    messages: customI18n.getMessages(),
  },
});
```

### Dynamic Language Switching

```tsx
import React, { useState } from 'react';
import { 
  NexCaptcha, 
  createCaptchaConfig, 
  SUPPORTED_LOCALES,
  getLocaleDisplayName 
} from 'nexcaptcha';

function MultiLanguageCaptcha() {
  const [locale, setLocale] = useState('en');
  
  const config = createCaptchaConfig({
    i18n: { locale },
  });
  
  return (
    <div>
      <select 
        value={locale} 
        onChange={(e) => setLocale(e.target.value)}
      >
        {SUPPORTED_LOCALES.map(loc => (
          <option key={loc} value={loc}>
            {getLocaleDisplayName(loc)}
          </option>
        ))}
      </select>
      
      <NexCaptcha config={config} />
    </div>
  );
}
```

## Form Integration

### React Hook Form

```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { NexCaptcha } from 'nexcaptcha';

interface FormData {
  email: string;
  password: string;
  captchaVerified: boolean;
}

function LoginWithValidation() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
  
  const onSubmit = (data: FormData) => {
    if (!data.captchaVerified) {
      alert('Please complete CAPTCHA verification');
      return;
    }
    
    console.log('Form submitted:', data);
    // Submit to API
  };
  
  const handleCaptchaSuccess = () => {
    setValue('captchaVerified', true);
  };
  
  const handleCaptchaError = () => {
    setValue('captchaVerified', false);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register('email', { required: 'Email is required' })}
        type="email" 
        placeholder="Email" 
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input 
        {...register('password', { required: 'Password is required' })}
        type="password" 
        placeholder="Password" 
      />
      {errors.password && <span>{errors.password.message}</span>}
      
      <NexCaptcha
        onComplete={handleCaptchaSuccess}
        onFailure={handleCaptchaError}
      />
      
      <button type="submit">Login</button>
    </form>
  );
}
```

### Formik Integration

```tsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { NexCaptcha } from 'nexcaptcha';

function ContactFormWithFormik() {
  return (
    <Formik
      initialValues={{ name: '', email: '', message: '', captchaVerified: false }}
      validate={(values) => {
        const errors: any = {};
        if (!values.email) errors.email = 'Required';
        if (!values.captchaVerified) errors.captchaVerified = 'Please complete CAPTCHA';
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        console.log('Submitting:', values);
        setSubmitting(false);
      }}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form>
          <Field name="name" type="text" placeholder="Name" />
          <ErrorMessage name="name" component="div" />
          
          <Field name="email" type="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" />
          
          <Field name="message" as="textarea" placeholder="Message" />
          <ErrorMessage name="message" component="div" />
          
          <NexCaptcha
            onComplete={() => setFieldValue('captchaVerified', true)}
            onFailure={() => setFieldValue('captchaVerified', false)}
          />
          <ErrorMessage name="captchaVerified" component="div" />
          
          <button type="submit" disabled={isSubmitting}>
            Send Message
          </button>
        </Form>
      )}
    </Formik>
  );
}
```

## Next.js Integration

### API Route Protection

```tsx
// pages/api/protected-action.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { ValidationEngine } from 'nexcaptcha';

const validationEngine = new ValidationEngine({
  enableBehavioralAnalysis: true,
  enableProofOfWork: true,
  difficulty: 3,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { captchaResult, ...formData } = req.body;
  
  // Verify CAPTCHA result
  if (!captchaResult || !captchaResult.success) {
    return res.status(400).json({ error: 'CAPTCHA verification required' });
  }
  
  // Additional server-side validation if needed
  try {
    const validation = await validationEngine.validateChallenge(
      captchaResult.challengeId,
      captchaResult,
      { userAgent: req.headers['user-agent'] }
    );
    
    if (!validation.success) {
      return res.status(400).json({ error: 'CAPTCHA validation failed' });
    }
    
    // Process the protected action
    console.log('Processing form data:', formData);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### SSR with Locale Detection

```tsx
// pages/contact.tsx
import { GetServerSideProps } from 'next';
import { NexCaptcha, createCaptchaConfig } from 'nexcaptcha';

interface ContactPageProps {
  locale: string;
}

function ContactPage({ locale }: ContactPageProps) {
  const config = createCaptchaConfig({
    i18n: { locale },
  });
  
  return (
    <div>
      <h1>Contact Us</h1>
      <form>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <textarea placeholder="Message"></textarea>
        
        <NexCaptcha config={config} />
        
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Detect locale from Accept-Language header
  const acceptLanguage = req.headers['accept-language'] || 'en';
  const locale = acceptLanguage.split(',')[0].split('-')[0];
  
  return {
    props: {
      locale: ['en', 'es', 'fr', 'de'].includes(locale) ? locale : 'en',
    },
  };
};

export default ContactPage;
```

## Error Handling

### Comprehensive Error Handling

```tsx
import React, { useState } from 'react';
import { NexCaptcha, CaptchaError } from 'nexcaptcha';

function RobustCaptcha() {
  const [error, setError] = useState<CaptchaError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  const handleError = (captchaError: CaptchaError) => {
    setError(captchaError);
    
    // Log error for monitoring
    console.error('CAPTCHA Error:', {
      code: captchaError.code,
      message: captchaError.message,
      challengeId: captchaError.challengeId,
      retryCount,
    });
    
    // Handle specific error types
    switch (captchaError.code) {
      case 'TIMEOUT_EXCEEDED':
        if (retryCount < maxRetries) {
          setTimeout(() => {
            setError(null);
            setRetryCount(prev => prev + 1);
          }, 2000);
        }
        break;
        
      case 'BROWSER_NOT_SUPPORTED':
        // Show fallback or alternative verification
        showFallbackVerification();
        break;
        
      case 'NETWORK_ERROR':
        // Retry with exponential backoff
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          setError(null);
          setRetryCount(prev => prev + 1);
        }, delay);
        break;
        
      default:
        // Generic error handling
        break;
    }
  };
  
  const handleSuccess = () => {
    setError(null);
    setRetryCount(0);
  };
  
  const showFallbackVerification = () => {
    // Implement alternative verification method
    console.log('Showing fallback verification');
  };
  
  if (retryCount >= maxRetries) {
    return (
      <div className="captcha-error">
        <p>Verification temporarily unavailable. Please try again later.</p>
        <button onClick={() => { setRetryCount(0); setError(null); }}>
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <NexCaptcha
        onComplete={handleSuccess}
        onFailure={handleError}
      />
      
      {error && (
        <div className="error-message">
          <p>Error: {error.message}</p>
          {retryCount > 0 && (
            <p>Retry attempt: {retryCount}/{maxRetries}</p>
          )}
        </div>
      )}
    </div>
  );
}
```

## Performance Optimization

### Lazy Loading

```tsx
import React, { lazy, Suspense } from 'react';

// Lazy load CAPTCHA component
const NexCaptcha = lazy(() => 
  import('nexcaptcha').then(module => ({ default: module.NexCaptcha }))
);

function OptimizedForm() {
  const [showCaptcha, setShowCaptcha] = useState(false);
  
  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      
      {!showCaptcha ? (
        <button 
          type="button" 
          onClick={() => setShowCaptcha(true)}
        >
          Verify Identity
        </button>
      ) : (
        <Suspense fallback={<div>Loading verification...</div>}>
          <NexCaptcha />
        </Suspense>
      )}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Web Worker for Proof-of-Work

```tsx
import { createCaptchaConfig } from 'nexcaptcha';

const optimizedConfig = createCaptchaConfig({
  enableProofOfWork: true,
  // Proof-of-work will automatically use Web Workers if available
  difficulty: 3,
});

// Check if Web Workers are supported
if (typeof Worker !== 'undefined') {
  console.log('Web Workers supported - proof-of-work will run in background');
} else {
  console.log('Web Workers not supported - proof-of-work will run on main thread');
}
```

## Accessibility

### Screen Reader Support

```tsx
import { createCaptchaConfig } from 'nexcaptcha';

const accessibleConfig = createCaptchaConfig({
  // Custom messages for screen readers
  i18n: {
    locale: 'en',
    messages: {
      verify: 'Verify you are human - this will open an accessibility-friendly verification dialog',
      title: 'Human Verification - Complete the challenge to continue',
      loading: 'Loading verification challenge, please wait',
      dragDrop: 'Drag and drop challenge: Use arrow keys to move items, space to select, enter to drop',
      emojiSelection: 'Emoji selection challenge: Use arrow keys to navigate, space to select emojis',
    },
  },
});

function AccessibleCaptcha() {
  return (
    <div>
      <label htmlFor="captcha-trigger">
        Complete verification to continue
      </label>
      <NexCaptcha 
        config={accessibleConfig}
        className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}
```

### Keyboard Navigation

```css
/* Custom CSS for better keyboard navigation */
.nexcaptcha-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.nexcaptcha-modal {
  /* Ensure modal is properly focused */
}

.nexcaptcha-puzzle-item:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 1px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .nexcaptcha-button {
    border: 2px solid;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .nexcaptcha-animation {
    animation: none;
  }
}
```

## Testing

### Jest Testing

```tsx
// __tests__/NexCaptcha.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NexCaptcha, createCaptchaConfig } from 'nexcaptcha';

// Mock the CAPTCHA for testing
jest.mock('nexcaptcha', () => ({
  ...jest.requireActual('nexcaptcha'),
  NexCaptcha: ({ onComplete, onFailure }: any) => (
    <div>
      <button 
        data-testid="captcha-success"
        onClick={() => onComplete({ success: true, score: 100 })}
      >
        Simulate Success
      </button>
      <button 
        data-testid="captcha-failure"
        onClick={() => onFailure({ code: 'TEST_ERROR', message: 'Test error' })}
      >
        Simulate Failure
      </button>
    </div>
  ),
}));

describe('NexCaptcha Integration', () => {
  test('handles successful verification', async () => {
    const onComplete = jest.fn();
    const onFailure = jest.fn();
    
    render(
      <NexCaptcha 
        onComplete={onComplete}
        onFailure={onFailure}
      />
    );
    
    fireEvent.click(screen.getByTestId('captcha-success'));
    
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith({
        success: true,
        score: 100,
      });
    });
    
    expect(onFailure).not.toHaveBeenCalled();
  });
  
  test('handles failed verification', async () => {
    const onComplete = jest.fn();
    const onFailure = jest.fn();
    
    render(
      <NexCaptcha 
        onComplete={onComplete}
        onFailure={onFailure}
      />
    );
    
    fireEvent.click(screen.getByTestId('captcha-failure'));
    
    await waitFor(() => {
      expect(onFailure).toHaveBeenCalledWith({
        code: 'TEST_ERROR',
        message: 'Test error',
      });
    });
    
    expect(onComplete).not.toHaveBeenCalled();
  });
});
```

### Cypress E2E Testing

```typescript
// cypress/integration/captcha.spec.ts
describe('CAPTCHA Integration', () => {
  beforeEach(() => {
    cy.visit('/contact');
  });
  
  it('completes form submission with CAPTCHA', () => {
    // Fill out form
    cy.get('[data-testid="name-input"]').type('John Doe');
    cy.get('[data-testid="email-input"]').type('john@example.com');
    cy.get('[data-testid="message-input"]').type('Test message');
    
    // Trigger CAPTCHA
    cy.get('[data-testid="captcha-trigger"]').click();
    
    // Wait for CAPTCHA modal
    cy.get('[data-testid="captcha-modal"]').should('be.visible');
    
    // Complete CAPTCHA (this would be mocked in test environment)
    cy.get('[data-testid="captcha-complete"]').click();
    
    // Verify success
    cy.get('[data-testid="captcha-success"]').should('be.visible');
    
    // Submit form
    cy.get('[data-testid="submit-button"]').click();
    
    // Verify form submission
    cy.get('[data-testid="success-message"]').should('contain', 'Message sent successfully');
  });
  
  it('handles CAPTCHA failure gracefully', () => {
    cy.get('[data-testid="captcha-trigger"]').click();
    
    // Simulate CAPTCHA failure
    cy.get('[data-testid="captcha-fail"]').click();
    
    // Verify error handling
    cy.get('[data-testid="captcha-error"]').should('be.visible');
    cy.get('[data-testid="retry-button"]').should('be.visible');
  });
});
```

These examples demonstrate various real-world scenarios and best practices for implementing NexCaptcha in your applications. Choose the patterns that best fit your use case and customize them according to your specific requirements.