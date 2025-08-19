# NexCaptcha

A modern, lightweight CAPTCHA library with multiple challenge types and invisible bot detection. Integrates in **less than 5 lines of code**.

## Features

- 🚀 **Ultra-simple integration** - Less than 5 lines of code
- 🎯 **Multiple challenge types** - Drag & drop, audio, emoji selection
- 🛡️ **Invisible bot detection** - Mouse tracking, typing patterns, honeypots
- 🔒 **Proof of work** - CPU-based verification
- 🌍 **Multi-language support** - English, Spanish, French, German, Chinese
- ⚡ **Lightweight** - Minimal bundle size
- 📱 **Responsive** - Works on all devices

## Quick Start

### Installation

```bash
npm install nexcaptcha
```

### React Integration (3 lines)

```jsx
import { SimpleCaptcha } from 'nexcaptcha';
import 'nexcaptcha/dist/styles.css';

function MyForm() {
  return <SimpleCaptcha onSuccess={() => alert('Verified!')} />;
}
```

### Next.js Integration (4 lines)

```tsx
'use client';
import { SimpleCaptcha } from 'nexcaptcha';
import 'nexcaptcha/dist/styles.css';

export default function ContactForm() {
  return <SimpleCaptcha onSuccess={() => console.log('Verified!')} />;
}
```

### HTML Integration (4 lines)

```html
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="./node_modules/nexcaptcha/dist/index.umd.js"></script>
<link rel="stylesheet" href="./node_modules/nexcaptcha/dist/styles.css">

<div id="captcha"></div>
<script>
  const captcha = React.createElement(NexCaptcha.SimpleCaptcha, {
    onSuccess: () => alert('Verified!')
  });
  ReactDOM.createRoot(document.getElementById('captcha')).render(captcha);
</script>
```

## API Reference

### SimpleCaptcha (Recommended)

The easiest way to integrate CAPTCHA with minimal configuration.

```tsx
import { SimpleCaptcha } from 'nexcaptcha';

<SimpleCaptcha
  onSuccess={() => console.log('User verified!')}
  onError={(error) => console.error('Verification failed:', error)}
  className="my-captcha"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSuccess` | `() => void` | - | Called when verification succeeds |
| `onError` | `(error: string) => void` | - | Called when verification fails |
| `className` | `string` | - | Additional CSS classes |

### Captcha (Advanced)

For more control over the CAPTCHA behavior.

```tsx
import { Captcha } from 'nexcaptcha';

<Captcha
  lang="en"
  difficulty="medium"
  onValidate={(result) => {
    if (result.success) {
      console.log('Verification successful!');
    }
  }}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lang` | `'en' \| 'es' \| 'fr' \| 'de' \| 'zh'` | `'en'` | Interface language |
| `difficulty` | `'easy' \| 'medium' \| 'hard'` | `'medium'` | Challenge difficulty |
| `onValidate` | `(result: CaptchaResult) => void` | - | Validation callback |
| `className` | `string` | - | Additional CSS classes |

## Challenge Types

### 1. Drag & Drop
Users drag emojis to complete a pattern or sequence.

### 2. Audio Challenge
Users identify sounds from different categories (animals, nature, etc.).

### 3. Emoji Selection
Users select specific emojis from a grid based on instructions.

## Security Features

### Invisible Bot Detection
- **Mouse Movement Tracking**: Analyzes natural vs. scripted movement patterns
- **Typing Speed Analysis**: Detects inhuman typing speeds
- **Honeypot Fields**: Hidden form fields that bots typically fill

### Proof of Work
- CPU-intensive calculations that are expensive for bots
- Adjustable difficulty based on your needs
- Client-side verification with server validation

## Form Integration

### Basic Form

```tsx
import { useState } from 'react';
import { SimpleCaptcha } from 'nexcaptcha';

function ContactForm() {
  const [isVerified, setIsVerified] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert('Please complete the CAPTCHA');
      return;
    }
    // Submit form
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" required />
      <SimpleCaptcha onSuccess={() => setIsVerified(true)} />
      <button type="submit" disabled={!isVerified}>
        Submit
      </button>
    </form>
  );
}
```

### Advanced Form with Error Handling

```tsx
import { useState } from 'react';
import { Captcha } from 'nexcaptcha';

function AdvancedForm() {
  const [captchaResult, setCaptchaResult] = useState(null);
  const [error, setError] = useState('');
  
  const handleCaptchaValidate = (result) => {
    setCaptchaResult(result);
    if (!result.success) {
      setError('CAPTCHA verification failed. Please try again.');
    } else {
      setError('');
    }
  };
  
  return (
    <form>
      <input type="text" placeholder="Name" required />
      <Captcha 
        onValidate={handleCaptchaValidate}
        difficulty="hard"
        lang="en"
      />
      {error && <div className="error">{error}</div>}
      <button 
        type="submit" 
        disabled={!captchaResult?.success}
      >
        Submit
      </button>
    </form>
  );
}
```

## Styling

### Default Styles
Import the default stylesheet:

```css
@import 'nexcaptcha/dist/styles.css';
```

### Custom Styling
Override CSS variables for easy theming:

```css
.nexcaptcha {
  --nexcaptcha-primary: #007bff;
  --nexcaptcha-background: #ffffff;
  --nexcaptcha-border: #e0e0e0;
  --nexcaptcha-text: #333333;
  --nexcaptcha-border-radius: 8px;
}
```

### CSS Classes
- `.nexcaptcha` - Main container
- `.nexcaptcha-header` - Header section
- `.nexcaptcha-content` - Challenge content
- `.nexcaptcha-footer` - Footer with actions
- `.nexcaptcha-loading` - Loading state
- `.nexcaptcha-error` - Error state
- `.nexcaptcha-success` - Success state

## Server-Side Validation

```javascript
import { validateCaptcha } from 'nexcaptcha';

// Express.js example
app.post('/submit-form', async (req, res) => {
  const { captchaResult, formData } = req.body;
  
  const validation = await validateCaptcha(captchaResult);
  
  if (!validation.isValid) {
    return res.status(400).json({ 
      error: 'CAPTCHA validation failed',
      details: validation.details 
    });
  }
  
  // Process form data
  res.json({ success: true });
});
```

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import { 
  CaptchaProps, 
  CaptchaResult, 
  ValidationResult 
} from 'nexcaptcha';

const handleValidate = (result: CaptchaResult) => {
  console.log('Success:', result.success);
  console.log('Timestamp:', result.timestamp);
  console.log('Proof of Work:', result.proofOfWork);
};
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance

- **Bundle size**: ~35KB gzipped
- **Load time**: <100ms on 3G
- **Memory usage**: <5MB
- **CPU impact**: Minimal (proof of work is optional)

## Security Considerations

1. **Always validate on the server**: Client-side validation can be bypassed
2. **Rate limiting**: Implement rate limiting on your endpoints
3. **HTTPS only**: Always use HTTPS in production
4. **Regular updates**: Keep the library updated for security patches

## Migration Guide

### From v0.x to v1.x

1. Replace `IframeCaptcha` with `SimpleCaptcha`:
   ```tsx
   // Before
   <IframeCaptcha onSuccess={handleSuccess} />
   
   // After
   <SimpleCaptcha onSuccess={handleSuccess} />
   ```

2. Update imports:
   ```tsx
   // Before
   import { IframeCaptcha } from 'nexcaptcha';
   
   // After
   import { SimpleCaptcha } from 'nexcaptcha';
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- 📧 Email: support@nexcaptcha.com
- 🐛 Issues: [GitHub Issues](https://github.com/nexcaptcha/nexcaptcha/issues)
- 📖 Docs: [Documentation](https://docs.nexcaptcha.com)
- 💬 Discord: [Community Server](https://discord.gg/nexcaptcha)