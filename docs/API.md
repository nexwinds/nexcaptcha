# NexCaptcha API Reference

Complete API documentation for NexCaptcha components, utilities, and types.

## Table of Contents

- [Components](#components)
  - [NexCaptcha](#nexcaptcha)
  - [Puzzle Components](#puzzle-components)
- [Utilities](#utilities)
  - [Configuration](#configuration)
  - [Internationalization](#internationalization)
  - [Browser Compatibility](#browser-compatibility)
- [Types](#types)
  - [Core Types](#core-types)
  - [Challenge Types](#challenge-types)
  - [Result Types](#result-types)
- [Hooks](#hooks)

## Components

### NexCaptcha

The main CAPTCHA component that orchestrates all security layers.

```tsx
import { NexCaptcha } from 'nexcaptcha';

<NexCaptcha
  config={config}
  onComplete={(result) => console.log('Success:', result)}
  onFailure={(error) => console.log('Error:', error)}
  onChallenge={(challenge) => console.log('Challenge:', challenge)}
/>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `CaptchaConfig` | Yes | Configuration object |
| `onComplete` | `(result: CaptchaResult) => void` | No | Success callback |
| `onFailure` | `(error: CaptchaError) => void` | No | Error callback |
| `onChallenge` | `(challenge: ChallengeData) => void` | No | Challenge start callback |
| `className` | `string` | No | Additional CSS classes |

### useNexCaptcha

React hook for programmatic CAPTCHA control.

```tsx
import { useNexCaptcha } from 'nexcaptcha';

const {
  isLoading,
  currentChallenge,
  result,
  error,
  startChallenge,
  reset,
  handleComplete,
  handleError
} = useNexCaptcha(config);
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `isLoading` | `boolean` | Whether CAPTCHA is loading |
| `currentChallenge` | `ChallengeData \| null` | Current active challenge |
| `result` | `CaptchaResult \| null` | Verification result |
| `error` | `CaptchaError \| null` | Current error state |
| `startChallenge` | `() => void` | Start a new challenge |
| `reset` | `() => void` | Reset CAPTCHA state |
| `handleComplete` | `(result: CaptchaResult) => void` | Handle completion |
| `handleError` | `(error: CaptchaError) => void` | Handle errors |

### Puzzle Components

Individual puzzle components that can be used standalone.

#### DragDropPuzzle

```tsx
import { DragDropPuzzle } from 'nexcaptcha';

<DragDropPuzzle
  challenge={challengeData}
  onComplete={(result) => console.log(result)}
  onInteraction={(type, data) => console.log(type, data)}
  disabled={false}
/>
```

#### EmojiSelectionPuzzle

```tsx
import { EmojiSelectionPuzzle } from 'nexcaptcha';

<EmojiSelectionPuzzle
  challenge={challengeData}
  onComplete={(result) => console.log(result)}
  onInteraction={(type, data) => console.log(type, data)}
  disabled={false}
/>
```

#### SliderPuzzle

```tsx
import { SliderPuzzle } from 'nexcaptcha';

<SliderPuzzle
  challenge={challengeData}
  onComplete={(result) => console.log(result)}
  onInteraction={(type, data) => console.log(type, data)}
  disabled={false}
/>
```

#### NumberSortingPuzzle

```tsx
import { NumberSortingPuzzle } from 'nexcaptcha';

<NumberSortingPuzzle
  challenge={challengeData}
  onComplete={(result) => console.log(result)}
  onInteraction={(type, data) => console.log(type, data)}
  disabled={false}
/>
```

#### AudioMatchingPuzzle

```tsx
import { AudioMatchingPuzzle } from 'nexcaptcha';

<AudioMatchingPuzzle
  challenge={challengeData}
  onComplete={(result) => console.log(result)}
  onInteraction={(type, data) => console.log(type, data)}
  disabled={false}
/>
```

## Utilities

### Configuration

#### createCaptchaConfig

Creates a configuration object with defaults.

```tsx
import { createCaptchaConfig } from 'nexcaptcha';

const config = createCaptchaConfig({
  difficulty: 3,
  enableBehavioralAnalysis: true,
  theme: {
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
  },
});
```

#### validateConfig

Validates a configuration object.

```tsx
import { validateConfig } from 'nexcaptcha';

const { isValid, errors } = validateConfig(config);
if (!isValid) {
  console.error('Config errors:', errors);
}
```

### Internationalization

#### I18nManager

Class for managing translations and locale.

```tsx
import { I18nManager } from 'nexcaptcha';

const i18n = new I18nManager({
  locale: 'es',
  messages: {
    verify: 'Verificar que soy humano',
    title: 'Verificación humana',
  },
});

const message = i18n.t('verify'); // "Verificar que soy humano"
```

#### createI18nManager

Factory function for creating I18nManager instances.

```tsx
import { createI18nManager } from 'nexcaptcha';

const i18n = createI18nManager({ locale: 'fr' });
```

#### detectBrowserLocale

Detects the user's browser locale.

```tsx
import { detectBrowserLocale } from 'nexcaptcha';

const locale = detectBrowserLocale(); // 'en', 'es', 'fr', etc.
```

#### isValidLocale

Checks if a locale is supported.

```tsx
import { isValidLocale } from 'nexcaptcha';

const isSupported = isValidLocale('es'); // true
const isNotSupported = isValidLocale('xyz'); // false
```

#### getLocaleDisplayName

Gets the display name for a locale.

```tsx
import { getLocaleDisplayName } from 'nexcaptcha';

const displayName = getLocaleDisplayName('es'); // "Español"
```

#### formatDuration

Formats time duration for display.

```tsx
import { formatDuration } from 'nexcaptcha';

const formatted = formatDuration(125); // "2:05"
```

#### formatNumber

Formats numbers based on locale.

```tsx
import { formatNumber } from 'nexcaptcha';

const formatted = formatNumber(1234.56, 'en'); // "1,234.56"
```

#### getPlural

Gets plural form based on count and locale.

```tsx
import { getPlural } from 'nexcaptcha';

const text = getPlural(1, 'item', 'items'); // "item"
const text2 = getPlural(5, 'item', 'items'); // "items"
```

#### t (Quick Translation)

Quick translation function using default i18n instance.

```tsx
import { t } from 'nexcaptcha';

const message = t('verify'); // Uses default locale
const withParams = t('timeRemaining', { time: '2:30' }); // "Time remaining: 2:30"
```

### Browser Compatibility

#### checkBrowserCompatibility

Checks if the current browser supports all required features.

```tsx
import { checkBrowserCompatibility } from 'nexcaptcha';

const { isSupported, missingFeatures } = checkBrowserCompatibility();
if (!isSupported) {
  console.warn('Missing features:', missingFeatures);
}
```

#### getVersion

Gets the package version.

```tsx
import { getVersion } from 'nexcaptcha';

const version = getVersion(); // "1.0.0"
```

## Types

### Core Types

#### CaptchaConfig

Main configuration interface.

```tsx
interface CaptchaConfig {
  enableBehavioralAnalysis?: boolean;
  enableProofOfWork?: boolean;
  enableInteractivePuzzles?: boolean;
  difficulty?: number; // 1-5
  theme?: CaptchaTheme;
  i18n?: I18nConfig;
  className?: string;
  onSuccess?: (result: CaptchaResult) => void;
  onFailure?: (error: CaptchaError) => void;
  onChallenge?: (challenge: ChallengeData) => void;
}
```

#### CaptchaTheme

Theme configuration interface.

```tsx
interface CaptchaTheme {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: string;
  fontSize?: string;
}
```

#### I18nConfig

Internationalization configuration.

```tsx
interface I18nConfig {
  locale?: string;
  messages?: Record<string, string>;
}
```

### Challenge Types

#### ChallengeType

Union type for all challenge types.

```tsx
type ChallengeType = 
  | 'drag-drop'
  | 'emoji-selection'
  | 'slider-puzzle'
  | 'number-sorting'
  | 'audio-matching'
  | 'proof-of-work'
  | 'behavioral';
```

#### ChallengeData

Base challenge data interface.

```tsx
interface ChallengeData {
  id: string;
  type: ChallengeType;
  difficulty: number;
  data: any;
  timeLimit?: number;
  attempts?: number;
  maxAttempts?: number;
}
```

#### Specific Challenge Data Types

- `DragDropChallengeData`
- `EmojiSelectionChallengeData`
- `SliderPuzzleChallengeData`
- `NumberSortingChallengeData`
- `AudioMatchingChallengeData`

### Result Types

#### CaptchaResult

Main result interface.

```tsx
interface CaptchaResult {
  success: boolean;
  challengeId: string;
  score: number;
  timeSpent: number;
  behavioralScore?: number;
  proofOfWorkScore?: number;
  interactiveScore?: number;
  metadata?: Record<string, any>;
}
```

#### CaptchaError

Error interface.

```tsx
interface CaptchaError {
  code: string;
  message: string;
  challengeId?: string;
  details?: any;
}
```

#### ValidationResult

Validation result interface.

```tsx
interface ValidationResult {
  isValid: boolean;
  score: number;
  confidence: number;
  reasons: string[];
}
```

## Constants

### DEFAULT_TRANSLATIONS

Default translation messages for all supported languages.

```tsx
import { DEFAULT_TRANSLATIONS } from 'nexcaptcha';

const englishMessages = DEFAULT_TRANSLATIONS.en;
```

### SUPPORTED_LOCALES

Array of all supported locale codes.

```tsx
import { SUPPORTED_LOCALES } from 'nexcaptcha';

console.log(SUPPORTED_LOCALES); // ['en', 'es', 'fr', 'de', ...]
```

### RTL_LOCALES

Array of right-to-left locale codes.

```tsx
import { RTL_LOCALES } from 'nexcaptcha';

console.log(RTL_LOCALES); // ['ar', 'he', 'fa', 'ur']
```

## Core Classes

### ValidationEngine

Core validation engine for challenge generation and validation.

```tsx
import { ValidationEngine } from 'nexcaptcha';

const engine = new ValidationEngine(config);
const challenge = await engine.generateChallenge();
const result = await engine.validateChallenge(challengeId, response);
```

### BehavioralAnalyzer

Behavioral analysis engine for tracking user interactions.

```tsx
import { BehavioralAnalyzer } from 'nexcaptcha';

const analyzer = new BehavioralAnalyzer();
analyzer.startTracking();
const score = analyzer.calculateScore();
analyzer.stopTracking();
```

### ProofOfWorkProcessor

Proof-of-work challenge processor.

```tsx
import { ProofOfWorkProcessor } from 'nexcaptcha';

const processor = new ProofOfWorkProcessor();
const challenge = processor.generateChallenge(difficulty);
const result = await processor.solve(challenge);
```

### AdaptiveProofOfWork

Adaptive proof-of-work that adjusts difficulty based on device performance.

```tsx
import { AdaptiveProofOfWork } from 'nexcaptcha';

const adaptive = new AdaptiveProofOfWork();
const challenge = adaptive.generateAdaptiveChallenge();
```

### ChallengeGenerator

Challenge generation utility.

```tsx
import { ChallengeGenerator } from 'nexcaptcha';

const generator = new ChallengeGenerator();
const challenge = generator.generateChallenge('drag-drop', difficulty);
```

## Error Codes

Common error codes returned by NexCaptcha:

- `VALIDATION_FAILED`: Challenge validation failed
- `TIMEOUT_EXCEEDED`: Challenge timeout exceeded
- `MAX_ATTEMPTS_REACHED`: Maximum attempts reached
- `BROWSER_NOT_SUPPORTED`: Browser lacks required features
- `NETWORK_ERROR`: Network request failed
- `INVALID_CONFIG`: Invalid configuration provided
- `CHALLENGE_GENERATION_FAILED`: Failed to generate challenge
- `BEHAVIORAL_ANALYSIS_FAILED`: Behavioral analysis failed
- `PROOF_OF_WORK_FAILED`: Proof-of-work validation failed

## Events

Events emitted during CAPTCHA lifecycle:

- `challenge_started`: Challenge has started
- `challenge_completed`: Challenge completed successfully
- `challenge_failed`: Challenge failed
- `interaction`: User interaction detected
- `behavioral_data`: Behavioral data collected
- `proof_of_work_completed`: Proof-of-work completed
- `validation_started`: Validation process started
- `validation_completed`: Validation process completed

## Best Practices

1. **Always validate configuration** using `validateConfig()` before use
2. **Handle errors gracefully** with proper error boundaries
3. **Use TypeScript** for better development experience
4. **Test browser compatibility** before deployment
5. **Customize themes** to match your application design
6. **Implement proper accessibility** features
7. **Monitor performance** especially with proof-of-work challenges
8. **Use appropriate difficulty levels** based on your security needs
9. **Implement proper fallbacks** for unsupported browsers
10. **Keep translations up to date** for international users