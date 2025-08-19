/**
 * Simple Demo - Streamlined NexCaptcha Usage
 * Demonstrates minimal integration with fewer than 10 lines of code
 */

import React from 'react';
import SimpleCaptcha from './src/index';

// Minimal usage example - just like Google reCAPTCHA
const App: React.FC = () => {
  const handleVerify = (success: boolean) => {
    alert(success ? 'Verification successful!' : 'Verification failed!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>NexCaptcha - Simple Demo</h1>
      <p>Integration with fewer than 10 lines of code:</p>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        <div>import SimpleCaptcha from 'nexcaptcha';</div>
        <div>const handleVerify = (success) => alert(success ? 'Success!' : 'Failed!');</div>
        <div>&lt;SimpleCaptcha onVerify={handleVerify} /&gt;</div>
      </div>

      <div style={{ 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        padding: '20px',
        backgroundColor: 'white'
      }}>
        <h3>Live Demo:</h3>
        <SimpleCaptcha onVerify={handleVerify} />
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
        <p><strong>Features included out-of-the-box:</strong></p>
        <ul>
          <li>Behavioral analysis (mouse movement tracking)</li>
          <li>Proof-of-work computational challenge</li>
          <li>Interactive puzzle verification</li>
          <li>Google reCAPTCHA-like interface</li>
          <li>No configuration required</li>
        </ul>
      </div>
    </div>
  );
};

export default App;