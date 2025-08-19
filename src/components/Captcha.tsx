import React, { useEffect, useRef, useState } from 'react';
import { CaptchaProps, DragDropChallenge, AudioChallenge, EmojiChallenge } from '../types';
import { useCaptcha } from '../hooks/useCaptcha';
import { getTranslation, formatTranslation } from '../translations';
import { generateAudioDataUrl } from '../utils/challenges';

export const Captcha: React.FC<CaptchaProps> = ({
  lang = 'en',
  onValidate,
  className = '',
  difficulty = 'medium'
}) => {
  const captchaRef = useRef<HTMLDivElement>(null);
  const [_draggedItem, setDraggedItem] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);
  const [_selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  
  const {
    isLoading,
    isVerifying,
    isCompleted,
    error,
    challengeType,
    challenge,
    startChallenge,
    submitAnswer,
    reset,
    trackMouseMovement,
    trackKeystroke,
    setHoneypotValue: _setHoneypotValue,
    result
  } = useCaptcha({ 
    difficulty, 
    onValidate
  });
  
  // Track mouse movements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (captchaRef.current) {
        const rect = captchaRef.current.getBoundingClientRect();
        trackMouseMovement(e.clientX - rect.left, e.clientY - rect.top, 'move');
      }
    };
    
    const handleClick = (e: MouseEvent) => {
      if (captchaRef.current) {
        const rect = captchaRef.current.getBoundingClientRect();
        trackMouseMovement(e.clientX - rect.left, e.clientY - rect.top, 'click');
      }
    };
    
    const handleKeyDown = () => {
      trackKeystroke();
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [trackMouseMovement, trackKeystroke]);
  
  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, emoji: string) => {
    setDraggedItem(emoji);
    e.dataTransfer.setData('text/plain', emoji);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, targetEmoji: string) => {
    e.preventDefault();
    const draggedEmoji = e.dataTransfer.getData('text/plain');
    
    if (challenge && challengeType === 'drag-drop') {
      const dragChallenge = challenge as DragDropChallenge;
      const isCorrect = draggedEmoji === dragChallenge.sourceEmoji && targetEmoji === dragChallenge.targetEmoji;
      submitAnswer(isCorrect).catch(console.error);
    }
    
    setDraggedItem(null);
  };
  
  // Audio challenge handlers
  const playAudio = (soundType: string) => {
    const audioUrl = generateAudioDataUrl(soundType);
    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
  };
  
  const handleAudioSelect = (soundType: string) => {
    setSelectedAudio(soundType);
  };
  
  const handleAudioSubmit = () => {
    if (selectedAudio) {
      submitAnswer(selectedAudio).catch(console.error);
    }
  };
  
  // Emoji challenge handlers
  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    submitAnswer(emoji).catch(console.error);
  };
  
  // Reset selections when challenge changes
  useEffect(() => {
    setDraggedItem(null);
    setSelectedAudio(null);
    setSelectedEmoji(null);
  }, [challengeType, challenge]);

  // Modal step content
  const getModalStepContent = () => {
    const steps = [
      {
        title: getTranslation(lang, 'modalWelcomeTitle'),
        content: getTranslation(lang, 'modalWelcomeContent'),
        showNext: true
      },
      {
        title: getTranslation(lang, 'modalInstructionsTitle'),
        content: getTranslation(lang, 'modalInstructionsContent'),
        showNext: true
      },
      {
        title: getTranslation(lang, 'modalAudioTitle'),
        content: getTranslation(lang, 'modalAudioContent'),
        showNext: true
      },
      {
        title: getTranslation(lang, 'modalReadyTitle'),
        content: getTranslation(lang, 'modalReadyContent'),
        showNext: false,
        showStart: true
      }
    ];
    
    return steps[modalStep] ?? steps[0];
  };

  const handleModalNext = () => {
    if (modalStep < 3) {
      setModalStep(modalStep + 1);
    }
  };

  const handleModalStart = () => {
    setModalStep(0);
    void startChallenge();
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalStep(0);
  };

  const renderModal = () => {
    if (!showModal) return null;
    
    // Show challenge in modal if challenge is active or just completed
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (challenge || (isCompleted && result)) {
      return (
        <div className="nexcaptcha-modal-overlay" onClick={handleModalClose}>
          <div className="nexcaptcha-modal nexcaptcha-challenge-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nexcaptcha-modal-header">
              <h3>{getTranslation(lang, 'title')}</h3>
              <button 
                className="nexcaptcha-modal-close"
                onClick={handleModalClose}
                type="button"
              >
                ×
              </button>
            </div>
            
            <div className="nexcaptcha-modal-body">
              {isLoading && (
                <div className="nexcaptcha-loading">
                  <div className="nexcaptcha-spinner"></div>
                  <div>{getTranslation(lang, 'loading')}</div>
                </div>
              )}
              
              {isVerifying && (
                <div className="nexcaptcha-verifying">
                  <div className="nexcaptcha-spinner"></div>
                  <div>{getTranslation(lang, 'verifying')}</div>
                </div>
              )}
              
              {isCompleted && result && result.success && (
                <div className="nexcaptcha-success">
                  <div className="nexcaptcha-checkmark">✓</div>
                  <div>{getTranslation(lang, 'success')}</div>
                  <button
                    className="nexcaptcha-btn nexcaptcha-btn-primary nexcaptcha-btn-lg"
                    onClick={() => {
                      setShowModal(false);
                    }}
                    type="button"
                  >
                    {getTranslation(lang, 'close')}
                  </button>
                </div>
              )}
              
              {isCompleted && result && !result.success && (
                <div className="nexcaptcha-error">
                  <div className="nexcaptcha-error-icon">✗</div>
                  <div>{error ?? getTranslation(lang, 'failed')}</div>
                  <div className="nexcaptcha-error-details">
                    {result.errors?.map((err, index) => (
                      <div key={index} className="nexcaptcha-error-item">{err}</div>
                    ))}
                  </div>
                  <button
                    className="nexcaptcha-btn nexcaptcha-btn-primary nexcaptcha-btn-lg"
                    onClick={() => {
                      reset();
                      setModalStep(0);
                    }}
                    type="button"
                  >
                    {getTranslation(lang, 'retry')}
                  </button>
                </div>
              )}
              
              {!isLoading && !isVerifying && !isCompleted && challenge && (
                <div className="nexcaptcha-challenge">
                  <div className="nexcaptcha-challenge-content">
                    {challengeType === 'drag-drop' && renderDragDropChallenge()}
                    {challengeType === 'audio' && renderAudioChallenge()}
                    {challengeType === 'emoji-selection' && renderEmojiChallenge()}
                  </div>
                  <div className="nexcaptcha-challenge-actions">
                    <button
                      className="nexcaptcha-btn nexcaptcha-btn-secondary nexcaptcha-regenerate-btn"
                      onClick={handleRegenerate}
                      type="button"
                      title={getTranslation(lang, 'regenerate')}
                    >
                      🔄 {getTranslation(lang, 'regenerate')}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="nexcaptcha-modal-footer">
              <div className="nexcaptcha-attribution">
                {getTranslation(lang, 'attribution')}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Show intro steps
    const stepContent = getModalStepContent();
    if (!stepContent) return null;
    
    return (
      <div className="nexcaptcha-modal-overlay" onClick={handleModalClose}>
        <div className="nexcaptcha-modal" onClick={(e) => e.stopPropagation()}>
          <div className="nexcaptcha-modal-header">
            <h3>{stepContent.title}</h3>
            <button 
              className="nexcaptcha-modal-close"
              onClick={handleModalClose}
              type="button"
            >
              ×
            </button>
          </div>
          
          <div className="nexcaptcha-modal-body">
            <div className="nexcaptcha-modal-content">
              <div>{stepContent.content}</div>
            </div>
            
            {modalStep === 2 && (
              <div className="nexcaptcha-audio-instructions">
                <h4>{getTranslation(lang, 'audioIntegrationTitle')}</h4>
                <ol>
                  <li>{getTranslation(lang, 'audioStep1')}</li>
                  <li>{getTranslation(lang, 'audioStep2')}</li>
                  <li>{getTranslation(lang, 'audioStep3')}</li>
                  <li>{getTranslation(lang, 'audioStep4')}</li>
                </ol>
                <div className="nexcaptcha-audio-example">
                  <button 
                    className="nexcaptcha-btn nexcaptcha-btn-primary"
                    onClick={() => playAudio('cat')}
                    type="button"
                  >
                    🔊 {getTranslation(lang, 'playExample')}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="nexcaptcha-modal-footer">
            <div className="nexcaptcha-modal-progress">
              {Array.from({ length: 4 }, (_, i) => (
                <div 
                  key={i} 
                  className={`nexcaptcha-progress-dot ${
                    i <= modalStep ? 'active' : ''
                  }`}
                />
              ))}
            </div>
            
            <div className="nexcaptcha-modal-actions">
              {stepContent.showNext && (
                <button 
                  className="nexcaptcha-btn nexcaptcha-btn-primary"
                  onClick={handleModalNext}
                  type="button"
                >
                  {getTranslation(lang, 'next')}
                </button>
              )}
              
              {stepContent.showStart && (
                <button 
                  className="nexcaptcha-btn nexcaptcha-btn-primary"
                  onClick={handleModalStart}
                  type="button"
                >
                  {getTranslation(lang, 'startChallenge')}
                </button>
              )}
            </div>
          </div>
          
          <div className="nexcaptcha-modal-branding">
            <a 
              href="https://nexwinds.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nexcaptcha-branding-link"
            >
              by nexwinds.com
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  const renderDragDropChallenge = () => {
    if (!challenge || challengeType !== 'drag-drop') return null;
    
    const dragChallenge = challenge as DragDropChallenge;
    
    return (
      <div className="nexcaptcha-drag-drop">
        <div className="nexcaptcha-instruction">
          {formatTranslation(lang, 'dragInstruction', {
            source: dragChallenge.sourceEmoji,
            target: dragChallenge.targetEmoji
          })}
        </div>
        
        <div className="nexcaptcha-drag-area">
          <div className="nexcaptcha-source-area">
            <div
              className="nexcaptcha-draggable"
              draggable
              onDragStart={(e) => handleDragStart(e, dragChallenge.sourceEmoji)}
            >
              {dragChallenge.sourceEmoji}
            </div>
          </div>
          
          <div className="nexcaptcha-arrow">→</div>
          
          <div
            className="nexcaptcha-drop-zone"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, dragChallenge.targetEmoji)}
          >
            {dragChallenge.targetEmoji}
          </div>
        </div>
      </div>
    );
  };
  
  const renderAudioChallenge = () => {
    if (!challenge || challengeType !== 'audio') return null;
    
    const audioChallenge = challenge as AudioChallenge;
    
    return (
      <div className="nexcaptcha-audio">
        <div className="nexcaptcha-instruction">
          {audioChallenge.instruction}
        </div>
        
        <div className="nexcaptcha-audio-options">
          {audioChallenge.audioOptions.map((soundType, index) => (
            <div key={index} className="nexcaptcha-audio-option">
              <button
                className="nexcaptcha-btn nexcaptcha-btn-primary nexcaptcha-btn-sm"
                onClick={() => playAudio(soundType)}
                type="button"
              >
                ▶ {getTranslation(lang, 'playSound')}
              </button>
              <button
                className={`nexcaptcha-select-button ${
                  selectedAudio === soundType ? 'selected' : ''
                }`}
                onClick={() => handleAudioSelect(soundType)}
                type="button"
              >
                {selectedAudio === soundType ? '✓' : '○'}
              </button>
            </div>
          ))}
        </div>
        
        {selectedAudio && (
          <button
            className="nexcaptcha-btn nexcaptcha-btn-success nexcaptcha-btn-full"
            onClick={handleAudioSubmit}
            type="button"
          >
            {getTranslation(lang, 'submitAnswer')}
          </button>
        )}
      </div>
    );
  };
  
  const renderEmojiChallenge = () => {
    if (!challenge || challengeType !== 'emoji-selection') return null;
    
    const emojiChallenge = challenge as EmojiChallenge;
    
    return (
      <div className="nexcaptcha-emoji">
        <div className="nexcaptcha-instruction">
          {formatTranslation(lang, 'emojiInstruction', {
            target: emojiChallenge.targetEmoji
          })}
        </div>
        
        <div className="nexcaptcha-emoji-grid">
          {emojiChallenge.emojiOptions.map((emoji, index) => (
            <button
              key={index}
              className="nexcaptcha-emoji-option"
              onClick={() => handleEmojiSelect(emoji)}
              type="button"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  const handleRegenerate = () => {
    reset();
    startChallenge();
  };

  const _renderContent = () => {
    if (isLoading) {
      return (
        <div className="nexcaptcha-loading">
          <div className="nexcaptcha-spinner"></div>
          <div>{getTranslation(lang, 'loading')}</div>
        </div>
      );
    }
    
    if (isVerifying) {
      return (
        <div className="nexcaptcha-verifying">
          <div className="nexcaptcha-spinner"></div>
          <div>{getTranslation(lang, 'verifying')}</div>
        </div>
      );
    }
    
    if (isCompleted && result) {
      if (result.success) {
        return (
          <div className="nexcaptcha-success">
            <div className="nexcaptcha-checkmark">✓</div>
            <div>{getTranslation(lang, 'success')}</div>
          </div>
        );
      } else {
        return (
          <div className="nexcaptcha-error">
            <div className="nexcaptcha-error-icon">✗</div>
            <div>{error ?? getTranslation(lang, 'failed')}</div>
            <button
              className="nexcaptcha-btn nexcaptcha-btn-primary nexcaptcha-btn-lg"
              onClick={() => {
                reset();
                startChallenge();
              }}
              type="button"
            >
              {getTranslation(lang, 'retry')}
            </button>
          </div>
        );
      }
    }
    
    return (
      <div className="nexcaptcha-challenge">
        <div className="nexcaptcha-challenge-content">
          {renderDragDropChallenge()}
          {renderAudioChallenge()}
          {renderEmojiChallenge()}
        </div>
        <div className="nexcaptcha-challenge-actions">
          <button
            className="nexcaptcha-btn nexcaptcha-btn-secondary nexcaptcha-regenerate-btn"
            onClick={handleRegenerate}
            type="button"
            title={getTranslation(lang, 'regenerate')}
          >
            🔄 {getTranslation(lang, 'regenerate')}
          </button>
        </div>
      </div>
    );
  };
  
  if (!challenge && !isLoading && !isCompleted) {
    return (
      <div className={`nexcaptcha ${className}`} ref={captchaRef}>
        <div className="nexcaptcha-start">
          <button
            className="nexcaptcha-circular-trigger"
            onClick={() => setShowModal(true)}
            type="button"
          >
            <div className="nexcaptcha-checkmark-icon">✓</div>
          </button>
          <div className="nexcaptcha-start-text">
            {getTranslation(lang, 'clickToVerify')}
          </div>
        </div>
        {renderModal()}
      </div>
    );
  }

  return (
    <div className={`nexcaptcha ${className}`} ref={captchaRef}>
      {_renderContent()}
      {renderModal()}
    </div>
  );
};