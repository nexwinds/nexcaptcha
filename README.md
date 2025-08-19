# NexCaptcha

A streamlined CAPTCHA solution with minimal configuration - Google reCAPTCHA alternative for React applications.

[![npm version](https://badge.fury.io/js/nexcaptcha.svg)](https://badge.fury.io/js/nexcaptcha)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **Zero Configuration**: Works out-of-the-box with no setup required
- 🔒 **Built-in Security**: Behavioral analysis, proof-of-work, and interactive puzzles
- 📱 **Responsive Design**: Seamless experience across all devices
- ♿ **Accessibility**: Screen reader support and keyboard navigation
- 🎯 **Simple API**: Single component with boolean verification callback
- 🛡️ **Privacy Focused**: No external dependencies, all processing client-side
- 🔧 **TypeScript**: Full type safety and IntelliSense support
- 📦 **Lightweight**: Minimal bundle size with no external dependencies

## 📦 Installation

```bash
npm install nexcaptcha
# or
yarn add nexcaptcha
# or
pnpm add nexcaptcha
```

### Peer Dependencies

```bash
npm install react react-dom
```

## 🚀 Quick Start

### 3-Line Integration

```tsx
import SimpleCaptcha from 'nexcaptcha';

function MyForm() {
  const handleVerify = (success) => {
    if (success) {
      console.log('✅ Verification successful! User is human.');
      // Proceed with form submission
    } else {
      console.log('❌ Verification failed. Please try again.');
      // Handle verification failure
    }
  };

  return (
    <form>
      {/* Your form fields */}
      
      <SimpleCaptcha onVerify={handleVerify} />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 🔧 API Reference

### SimpleCaptcha Component

```tsx
<SimpleCaptcha onVerify={handleVerify} />
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onVerify` | `(success: boolean) => void` | Yes | Callback function called when verification completes |

#### Example

```tsx
const handleVerify = (success: boolean) => {
  // success: true if user passed verification, false otherwise
  console.log('Verification result:', success);
};

<SimpleCaptcha onVerify={handleVerify} />
```

## 🛡️ Security Features

### Multi-Layer Protection

1. **Behavioral Analysis**: Tracks mouse movements and interaction patterns
2. **Proof of Work**: Computational challenge to prevent automated attacks
3. **Interactive Puzzle**: Visual challenge requiring human interaction

### How It Works

1. User clicks the "I'm not a robot" checkbox
2. Behavioral analysis runs in the background
3. Interactive puzzle appears for user to complete
4. Proof-of-work computation validates the session
5. Boolean result returned via `onVerify` callback

## 📱 Demo

Try the live demo:

```bash
# Clone the repository
git clone https://github.com/your-username/nexcaptcha.git
cd nexcaptcha

# Start demo server
python -m http.server 8000

# Open http://localhost:8000/simple-demo.html
```

## 🎯 Why Choose NexCaptcha?

### vs Google reCAPTCHA

| Feature | NexCaptcha | Google reCAPTCHA |
|---------|------------|------------------|
| Privacy | ✅ No data collection | ❌ Tracks users |
| Setup | ✅ Zero configuration | ❌ API keys required |
| Dependencies | ✅ Self-contained | ❌ External scripts |
| Customization | ✅ Full control | ❌ Limited options |
| Offline | ✅ Works offline | ❌ Requires internet |

### vs Other Solutions

- **Simpler**: No complex configurations or API keys
- **Faster**: No external network requests
- **Secure**: Multi-layer protection without compromising privacy
- **Reliable**: Works in all environments, including offline

## 🔧 TypeScript Support

Full TypeScript support with complete type definitions:

```tsx
import SimpleCaptcha from 'nexcaptcha';

interface FormData {
  email: string;
  message: string;
  verified: boolean;
}

function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    message: '',
    verified: false
  });

  const handleVerify = (success: boolean): void => {
    setFormData(prev => ({ ...prev, verified: success }));
  };

  return (
    <form>
      <input 
        type="email" 
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
      />
      
      <SimpleCaptcha onVerify={handleVerify} />
      
      <button 
        type="submit" 
        disabled={!formData.verified}
      >
        Submit
      </button>
    </form>
  );
}
```

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📞 Support

- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/your-username/nexcaptcha/issues)
- 💬 [Discussions](https://github.com/your-username/nexcaptcha/discussions)

---

**Made with ❤️ for developers who value simplicity and privacy.**