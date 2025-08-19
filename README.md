# NexCaptcha

A modern, secure, and user-friendly CAPTCHA solution for React applications that provides multi-layered bot protection without compromising user experience.

[![npm version](https://badge.fury.io/js/nexcaptcha.svg)](https://badge.fury.io/js/nexcaptcha)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🔒 **Multi-layered Security**: Combines behavioral analysis, proof-of-work, and interactive puzzles
- 🎨 **Customizable UI**: Fully themeable with CSS-in-JS support and custom styling
- 🌍 **Internationalization**: Built-in support for 10+ languages with easy customization
- ♿ **Accessibility**: WCAG 2.1 AA compliant with full screen reader support
- 📱 **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- 🚀 **High Performance**: Web Worker support, lazy loading, and optimized algorithms
- 🔧 **Developer Experience**: Full TypeScript support, comprehensive APIs, and React hooks
- 🛡️ **Privacy Focused**: No external dependencies, all processing happens client-side
- 🎯 **Smart Difficulty**: Adaptive challenge difficulty based on user behavior
- 🔄 **Fallback Support**: Graceful degradation for older browsers

## 📦 Installation

```bash
npm install nexcaptcha
# or
yarn add nexcaptcha
# or
pnpm add nexcaptcha
```

### Peer Dependencies

Make sure you have the required peer dependencies installed:

```bash
npm install react react-dom next tailwindcss
```

## 🚀 Quick Start

### 1. Basic Usage

```tsx
import { NexCaptcha, createCaptchaConfig } from 'nexcaptcha';
import 'nexcaptcha/dist/styles.css';

function MyForm() {
  const config = createCaptchaConfig({
    challengeTypes: ['drag-drop', 'emoji-selection'],
    difficulty: 'medium',
  });

  const handleCaptchaComplete = (result) => {
    console.log('CAPTCHA completed:', result);
    // Verify the result on your backend
  };

  return (
    <form>
      {/* Your form fields */}
      
      <NexCaptcha
        config={config}
        onComplete={handleCaptchaComplete}
        onError={(error) => console.error('CAPTCHA error:', error)}
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### 2. Using the Hook

```tsx
import { useNexCaptcha, createCaptchaConfig } from 'nexcaptcha';

function MyComponent() {
  const config = createCaptchaConfig();
  const { result, error, isLoading, handleComplete, handleError, reset } = useNexCaptcha(config);

  return (
    <div>
      <NexCaptcha
        config={config}
        onComplete={handleComplete}
        onError={handleError}
      />
      
      {result && (
        <div>Verification successful! Score: {result.score}</div>
      )}
      
      {error && (
        <div>Error: {error.message}</div>
      )}
    </div>
  );
}
```

### 3. Advanced Configuration

```tsx
import { NexCaptcha, createCaptchaConfig } from 'nexcaptcha';

const advancedConfig = createCaptchaConfig({
  // Security layers
  enableBehavioralAnalysis: true,
  enableProofOfWork: true,
  
  // Challenge types
  challengeTypes: [
    'drag-drop',
    'emoji-selection',
    'slider-puzzle',
    'number-sorting',
    'audio-matching'
  ],
  
  // Difficulty and timing
  difficulty: 'hard',
  timeout: 300000, // 5 minutes
  maxAttempts: 3,
  
  // UI customization
  buttonText: 'Verify I\'m Human',
  title: 'Security Verification',
  
  // Theme
  theme: {
    primaryColor: 'indigo-600',
    backgroundColor: 'gray-50',
    borderRadius: 'xl',
  },
  
  // Internationalization
  i18n: {
    locale: 'en',
    messages: {
      en: {
        verify: 'Verify I\'m Human',
        title: 'Human Verification',
        loading: 'Loading verification...',
        error: 'Verification failed',
        tryAgain: 'Try Again',
        complete: 'Verification complete',
      },
      es: {
        verify: 'Verificar que soy humano',
        title: 'Verificación humana',
        loading: 'Cargando verificación...',
        error: 'Verificación fallida',
        tryAgain: 'Intentar de nuevo',
        complete: 'Verificación completa',
      },
    },
  },
});

function SecureForm() {
  return (
    <NexCaptcha
      config={advancedConfig}
      onComplete={(result) => {
        // Handle successful verification
        console.log('Verification result:', {
          success: result.success,
          score: result.score,
          timeSpent: result.timeSpent,
          behavioralScore: result.behavioralScore,
          challengeType: result.challengeType,
        });
      }}
      onError={(error) => {
        console.error('Verification error:', error);
      }}
      className="my-custom-captcha"
    />
  );
}
```

## 📚 Documentation

- **[API Reference](./docs/API.md)** - Complete API documentation
- **[Examples](./docs/EXAMPLES.md)** - Practical implementation examples
- **[Migration Guide](./docs/MIGRATION.md)** - Upgrading from other CAPTCHA solutions

## 🎯 Use Cases

- **Form Protection**: Contact forms, registration, login
- **E-commerce**: Checkout, account creation, reviews
- **Content Management**: Comments, uploads, submissions
- **API Protection**: Rate limiting, bot detection
- **High Security**: Financial transactions, sensitive operations

## ⚙️ Configuration

NexCaptcha offers extensive configuration options to fit your security and UX requirements:

```tsx
import { createCaptchaConfig } from 'nexcaptcha';

const config = createCaptchaConfig({
  // Security Configuration
  difficulty: 3, // 1 (low) to 5 (maximum)
  enableBehavioralAnalysis: true, // Mouse/keyboard tracking
  enableProofOfWork: true, // Background computational challenges
  enableInteractivePuzzles: true, // User-facing puzzles
  
  // UI Customization
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#6b7280',
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
  },
  
  // Internationalization
  i18n: {
    locale: 'en', // Supports: en, es, fr, de, it, pt, ru, zh, ja, ko
    messages: {
      verify: 'Verify I\'m Human',
      title: 'Human Verification',
      loading: 'Loading...',
      complete: 'Verification complete!',
    },
  },
  
  // Callbacks
  onChallenge: (challenge) => console.log('Challenge started:', challenge.type),
  onSuccess: (result) => console.log('Success:', result),
  onFailure: (error) => console.error('Failed:', error),
});
```

## 🪝 React Hooks

Use the `useNexCaptcha` hook for more control over the CAPTCHA flow:

```tsx
import { useNexCaptcha, createCaptchaConfig } from 'nexcaptcha';

function CustomCaptcha() {
  const config = createCaptchaConfig({ difficulty: 2 });
  
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
      
      {result?.success && (
        <div>✅ Verified! Score: {result.score}</div>
      )}
      
      {error && (
        <div>❌ Error: {error.message}</div>
      )}
    </div>
  );
}
```

## 🌐 Browser Support

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 70+ | Full support |
| Firefox | 65+ | Full support |
| Safari | 12+ | Full support |
| Edge | 79+ | Full support |
| Mobile Safari | 12+ | Touch optimized |
| Chrome Mobile | 70+ | Touch optimized |

**Features by Browser:**
- **Web Workers**: Supported in all modern browsers for background proof-of-work
- **Touch Events**: Full support for mobile interactions
- **Accessibility**: Screen reader support across all platforms

## ⚡ Performance

- **Bundle Size**: ~45KB gzipped (including all features)
- **Lazy Loading**: Components load on-demand
- **Web Workers**: CPU-intensive tasks run in background
- **Memory Efficient**: Automatic cleanup and garbage collection
- **Tree Shaking**: Import only what you need

```tsx
// Import specific components to reduce bundle size
import { NexCaptcha } from 'nexcaptcha/components';
import { createI18nManager } from 'nexcaptcha/i18n';
```

## 🔧 Advanced Usage

### Custom Validation

```tsx
import { ValidationEngine } from 'nexcaptcha';

const validator = new ValidationEngine({
  enableBehavioralAnalysis: true,
  difficulty: 4,
});

// Server-side validation
const result = await validator.validateChallenge(
  challengeId,
  userResponse,
  { userAgent: req.headers['user-agent'] }
);
```

### Behavioral Analysis

```tsx
import { BehavioralAnalyzer } from 'nexcaptcha';

const analyzer = new BehavioralAnalyzer();
analyzer.startTracking();

// Get behavioral score
const score = analyzer.calculateScore();
console.log('Human-like behavior score:', score);
```

## 🎨 Theming Examples

### Dark Theme

```tsx
const darkTheme = createCaptchaConfig({
  theme: {
    primaryColor: '#3b82f6',
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    borderRadius: '8px',
  },
  className: 'dark-captcha',
});
```

### Brand Colors

```tsx
const brandTheme = createCaptchaConfig({
  theme: {
    primaryColor: '#8b5cf6', // Your brand purple
    secondaryColor: '#a78bfa',
    backgroundColor: '#faf5ff',
    borderColor: '#e9d5ff',
  },
});
```

## 🔧 Configuration Options

### CaptchaConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enableBehavioralAnalysis` | `boolean` | `true` | Enable mouse tracking and behavioral analysis |
| `enableProofOfWork` | `boolean` | `true` | Enable background computational challenges |
| `challengeTypes` | `ChallengeType[]` | `['drag-drop', 'emoji-selection']` | Types of interactive puzzles to use |
| `difficulty` | `'easy' \| 'medium' \| 'hard'` | `'medium'` | Overall difficulty level |
| `timeout` | `number` | `300000` | Maximum time allowed (milliseconds) |
| `maxAttempts` | `number` | `3` | Maximum number of attempts |
| `buttonText` | `string` | `'Verify I\'m Human'` | Text for the trigger button |
| `title` | `string` | `'Human Verification'` | Modal title |
| `theme` | `CaptchaTheme` | See below | Theme configuration |
| `i18n` | `I18nConfig` | See below | Internationalization settings |

### Challenge Types

- **`drag-drop`**: Drag items to correct positions
- **`emoji-selection`**: Select specific emojis from a grid
- **`slider-puzzle`**: Arrange sliding puzzle pieces
- **`number-sorting`**: Sort numbers in correct order
- **`audio-matching`**: Match audio clips to descriptions

### Theme Configuration

```tsx
interface CaptchaTheme {
  primaryColor?: string;     // Tailwind color class (e.g., 'blue-600')
  backgroundColor?: string;  // Background color class
  borderRadius?: string;     // Border radius class (e.g., 'lg', 'xl')
}
```

## 🌐 Internationalization

NexCaptcha supports multiple languages out of the box:

```tsx
const config = createCaptchaConfig({
  i18n: {
    locale: 'es', // Spanish
    messages: {
      es: {
        verify: 'Verificar que soy humano',
        title: 'Verificación humana',
        // ... other translations
      },
    },
  },
});
```

### Supported Languages

- English (`en`) - Default
- Spanish (`es`)
- French (`fr`)
- German (`de`)
- Portuguese (`pt`)
- Italian (`it`)
- Japanese (`ja`)
- Korean (`ko`)
- Chinese Simplified (`zh-CN`)
- Chinese Traditional (`zh-TW`)

## 🔒 Security Features

### Behavioral Analysis

- **Mouse Movement Tracking**: Analyzes movement patterns, velocity, and acceleration
- **Keystroke Dynamics**: Measures typing rhythm and patterns
- **Click Behavior**: Tracks click timing and pressure patterns
- **Scroll Patterns**: Monitors scrolling behavior

### Proof-of-Work

- **Adaptive Difficulty**: Automatically adjusts based on device performance
- **Web Worker Support**: Runs computations in background threads
- **Fallback Mode**: Graceful degradation for unsupported browsers
- **Performance Monitoring**: Tracks and optimizes computational load

### Interactive Puzzles

- **Dynamic Generation**: Puzzles are generated randomly for each session
- **Anti-Automation**: Designed to be difficult for bots to solve
- **Accessibility**: Keyboard navigation and screen reader support
- **Touch Support**: Optimized for mobile and tablet devices

## 📱 Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+
- **Required APIs**: Web Crypto API, Web Workers, Canvas API
- **Optional APIs**: Web Audio API (for audio challenges), Touch Events

## 🌍 Internationalization

NexCaptcha supports 10+ languages out of the box with easy customization:

```tsx
import { 
  createCaptchaConfig, 
  SUPPORTED_LOCALES, 
  detectBrowserLocale 
} from 'nexcaptcha';

// Auto-detect user's language
const userLocale = detectBrowserLocale();

const config = createCaptchaConfig({
  i18n: {
    locale: userLocale, // en, es, fr, de, it, pt, ru, zh, ja, ko
    messages: {
      verify: 'Custom verification text',
      title: 'Custom title',
      // Override any default messages
    },
  },
});
```

## 🔧 Troubleshooting

### Common Issues

**CAPTCHA not loading:**
```tsx
// Ensure proper import
import { NexCaptcha } from 'nexcaptcha';

// Check browser console for errors
// Verify React version compatibility (16.8+)
```

**TypeScript errors:**
```bash
# Install type definitions
npm install --save-dev @types/react @types/react-dom

# Ensure TypeScript 4.0+
npm install --save-dev typescript@latest
```

**Performance issues:**
```tsx
// Use lazy loading for better performance
import { lazy, Suspense } from 'react';

const NexCaptcha = lazy(() => import('nexcaptcha'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NexCaptcha />
    </Suspense>
  );
}
```

**Mobile compatibility:**
```tsx
// Ensure touch events are enabled
const config = createCaptchaConfig({
  enableTouchEvents: true, // Default: true
  theme: {
    fontSize: '16px', // Prevent zoom on iOS
  },
});
```

### Debug Mode

```tsx
const config = createCaptchaConfig({
  debug: true, // Enable console logging
  onChallenge: (challenge) => {
    console.log('Challenge details:', challenge);
  },
});
```

## 🛠️ Development

### Prerequisites

- Node.js 16+
- npm/yarn/pnpm
- TypeScript 4.0+

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/nexcaptcha.git
cd nexcaptcha

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Available Scripts

- `npm run build` - Build the library for production
- `npm run dev` - Development mode with hot reload
- `npm run test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code with ESLint
- `npm run type-check` - TypeScript type checking
- `npm run docs` - Generate documentation

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Bug Reports**: Found a bug? [Open an issue](https://github.com/your-username/nexcaptcha/issues)
- 💡 **Feature Requests**: Have an idea? [Start a discussion](https://github.com/your-username/nexcaptcha/discussions)
- 📖 **Documentation**: Improve docs, add examples
- 🌍 **Translations**: Add support for new languages
- 🧪 **Testing**: Write tests, improve coverage
- 🎨 **Design**: Improve UI/UX, accessibility

### Development Process

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/nexcaptcha.git`
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes
5. **Add** tests for new functionality
6. **Ensure** all tests pass: `npm test`
7. **Lint** your code: `npm run lint`
8. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
9. **Push** to your branch: `git push origin feature/amazing-feature`
10. **Open** a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing code conventions
- Add JSDoc comments for public APIs
- Write tests for new features
- Update documentation as needed

## 🔒 Security

Security is a top priority for NexCaptcha. If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email us at: security@nexcaptcha.com
3. Include detailed information about the vulnerability
4. Allow time for us to address the issue before public disclosure

## 📄 License

MIT License © 2024 NexCaptcha

See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **TypeScript Team** - For excellent type safety
- **Open Source Community** - For inspiration and feedback
- **Security Researchers** - For keeping the web safe

## 📞 Support & Community

- 📖 **[Documentation](./docs/)** - Complete guides and API reference
- 🐛 **[Issue Tracker](https://github.com/your-username/nexcaptcha/issues)** - Bug reports and feature requests
- 💬 **[Discussions](https://github.com/your-username/nexcaptcha/discussions)** - Community Q&A
- 📧 **[Email Support](mailto:support@nexcaptcha.com)** - Direct support
- 🐦 **[Twitter](https://twitter.com/nexcaptcha)** - Updates and announcements
- 💼 **[LinkedIn](https://linkedin.com/company/nexcaptcha)** - Professional updates

### Enterprise Support

Need enterprise-level support? Contact us for:
- Priority support and SLA
- Custom integrations
- Security audits
- Training and consulting

📧 **Enterprise**: enterprise@nexcaptcha.com

---

<div align="center">

**Made with ❤️ for developers worldwide**

[⭐ Star us on GitHub](https://github.com/your-username/nexcaptcha) • [🐦 Follow on Twitter](https://twitter.com/nexcaptcha) • [📖 Read the Docs](./docs/)

</div>