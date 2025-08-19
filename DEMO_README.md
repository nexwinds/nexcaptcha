# NexCaptcha Demo

A simple demonstration of the NexCaptcha component showing minimal integration and zero-configuration setup.

## 📁 Demo File

### `simple-demo.html`

A standalone HTML file demonstrating the streamlined NexCaptcha integration with just 3 lines of code.

**Location**: `./simple-demo.html`

## 🚀 Running the Demo

### Quick Start

1. **Start a local server**:
   ```bash
   # Using Python (recommended)
   python -m http.server 8000
   
   # Or using Node.js
   npx serve .
   
   # Or using PHP
   php -S localhost:8000
   ```

2. **Open in browser**:
   ```
   http://localhost:8000/simple-demo.html
   ```

3. **Test the CAPTCHA**:
   - Click the "I'm not a robot" checkbox
   - Complete the interactive puzzle that appears
   - Observe the verification result in the browser alert

## 🔍 Demo Features

### Zero Configuration
- No API keys required
- No external dependencies
- Works completely offline
- Embedded security configuration

### Interactive Elements
- **Checkbox**: Initial "I'm not a robot" verification
- **Puzzle**: Interactive drag-and-drop challenge
- **Feedback**: Real-time visual feedback during interaction
- **Result**: Boolean verification result via callback

### Security Layers
1. **Behavioral Analysis**: Tracks mouse movements and interaction patterns
2. **Interactive Puzzle**: Visual challenge requiring human coordination
3. **Proof of Work**: Background computational validation

## 📋 Code Example

The demo shows this minimal integration:

```tsx
import SimpleCaptcha from 'nexcaptcha';

function App() {
  const handleVerify = (success) => {
    if (success) {
      alert('✅ Verification successful! User is human.');
    } else {
      alert('❌ Verification failed. Please try again.');
    }
  };

  return (
    <div>
      <h1>NexCaptcha Demo</h1>
      <SimpleCaptcha onVerify={handleVerify} />
    </div>
  );
}
```

## 🎯 What to Expect

### Successful Verification
- User completes the puzzle correctly
- `onVerify` callback receives `true`
- Success message displayed
- Ready for form submission

### Failed Verification
- User fails to complete puzzle or behaves suspiciously
- `onVerify` callback receives `false`
- Failure message displayed
- User can retry verification

## 🔧 Customization

While the demo uses default settings, you can customize the component by:

1. **Styling**: Add CSS classes or inline styles
2. **Callbacks**: Handle verification results as needed
3. **Integration**: Embed within forms or custom workflows

```tsx
// Example with custom styling
<SimpleCaptcha 
  onVerify={handleVerify}
  className="my-custom-captcha"
  style={{ margin: '20px 0' }}
/>
```

## 🌐 Browser Compatibility

The demo works in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Testing

The demo is fully responsive and touch-optimized:
- Touch-friendly puzzle interactions
- Mobile-optimized UI elements
- Responsive layout for all screen sizes

## 🐛 Troubleshooting

### Common Issues

**Demo not loading:**
- Ensure you're running a local server (not opening file:// directly)
- Check browser console for any JavaScript errors
- Verify the server is running on the correct port

**CAPTCHA not appearing:**
- Check that JavaScript is enabled in your browser
- Ensure no ad blockers are interfering
- Try refreshing the page

**Verification always fails:**
- Complete the puzzle by dragging the piece to the correct position
- Ensure you're interacting naturally (not too fast/robotic)
- Try a different browser if issues persist

## 🔍 Understanding the Demo Code

### HTML Structure
```html
<!DOCTYPE html>
<html>
<head>
  <title>NexCaptcha Demo</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
</head>
<body>
  <div id="root"></div>
  <!-- Demo implementation -->
</body>
</html>
```

### React Integration
```jsx
// Simulated SimpleCaptcha component for demo purposes
const SimpleCaptcha = ({ onVerify }) => {
  // Component implementation with embedded security features
};

// App component showing integration
const App = () => {
  const handleVerify = (success) => {
    // Handle verification result
  };
  
  return <SimpleCaptcha onVerify={handleVerify} />;
};
```

## 🚀 Next Steps

After testing the demo:

1. **Install the package**: `npm install nexcaptcha`
2. **Import in your project**: `import SimpleCaptcha from 'nexcaptcha'`
3. **Add to your forms**: Use the same 3-line integration pattern
4. **Customize as needed**: Style and integrate with your application

## 📖 Additional Resources

- **Main README**: `./README.md` - Complete package documentation
- **API Reference**: Full component props and usage examples
- **GitHub Issues**: Report bugs or request features
- **Discussions**: Community Q&A and support

---

**Ready to integrate? The demo shows exactly how simple it is!** 🎉