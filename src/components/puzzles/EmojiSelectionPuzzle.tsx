/**
 * Emoji Selection Puzzle Component for NexCaptcha
 * Interactive puzzle where users select specific emojis based on criteria
 */

import React, { useState, useEffect, useCallback } from 'react';
import { EmojiSelectionChallengeData, CaptchaTheme } from '../../types/index';

interface EmojiSelectionPuzzleProps {
  /** Challenge data containing emojis and selection criteria */
  challenge: EmojiSelectionChallengeData;
  /** Theme configuration for styling */
  theme?: CaptchaTheme;
  /** Callback when puzzle is completed */
  onComplete: (result: { success: boolean; timeSpent: number; attempts: number }) => void;
  /** Callback for tracking user interactions */
  onInteraction?: (event: string, data: any) => void;
  /** Whether the puzzle is disabled */
  disabled?: boolean;
}

interface EmojiItem {
  id: string;
  emoji: string;
  category: string;
  isSelected: boolean;
  isCorrect: boolean;
}

/**
 * Emoji Selection Puzzle Component
 */
export const EmojiSelectionPuzzle: React.FC<EmojiSelectionPuzzleProps> = ({
  challenge,
  theme,
  onComplete,
  onInteraction,
  disabled = false,
}) => {
  const [emojiItems, setEmojiItems] = useState<EmojiItem[]>([]);
  const [selectedEmojis, setSelectedEmojis] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Initialize emoji items
   */
  useEffect(() => {
    const items: EmojiItem[] = challenge.emojis.map(emoji => ({
      id: emoji.id,
      emoji: emoji.emoji,
      category: emoji.category,
      isSelected: false,
      isCorrect: challenge.correctEmojis.includes(emoji.id),
    }));

    // Shuffle emojis for better security
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    setEmojiItems(shuffledItems);
  }, [challenge]);

  /**
   * Handle emoji selection
   */
  const handleEmojiClick = useCallback(
    (emojiId: string) => {
      if (disabled || isCompleted || isValidating) return;

      const newSelected = new Set(selectedEmojis);
      
      if (newSelected.has(emojiId)) {
        newSelected.delete(emojiId);
      } else {
        newSelected.add(emojiId);
      }

      setSelectedEmojis(newSelected);
      setEmojiItems(prev => prev.map(item => 
        item.id === emojiId 
          ? { ...item, isSelected: newSelected.has(emojiId) }
          : item
      ));

      onInteraction?.('emoji_toggle', {
        emojiId,
        selected: newSelected.has(emojiId),
        totalSelected: newSelected.size,
      });
    },
    [selectedEmojis, disabled, isCompleted, isValidating, onInteraction]
  );

  /**
   * Validate selection
   */
  const validateSelection = useCallback(() => {
    if (disabled || isCompleted || isValidating) return;

    setIsValidating(true);
    setAttempts(prev => prev + 1);

    // Check if selection matches correct emojis
    const correctSet = new Set(challenge.correctEmojis);
    const selectedArray = Array.from(selectedEmojis);
    
    const isCorrect = 
      selectedArray.length === correctSet.size &&
      selectedArray.every(id => correctSet.has(id));

    setShowFeedback(true);

    if (isCorrect) {
      setIsCompleted(true);
      const timeSpent = Date.now() - startTime;
      
      setTimeout(() => {
        setIsValidating(false);
        onComplete({
          success: true,
          timeSpent,
          attempts,
        });
        
        onInteraction?.('puzzle_completed', {
          timeSpent,
          attempts,
          correctSelections: selectedArray.length,
          totalEmojis: emojiItems.length,
        });
      }, 1500);
    } else {
      onInteraction?.('validation_failed', {
        selectedEmojis: selectedArray,
        correctEmojis: challenge.correctEmojis,
        attempts,
      });
      
      // Reset after showing feedback
      setTimeout(() => {
        setShowFeedback(false);
        setIsValidating(false);
        setSelectedEmojis(new Set());
        setEmojiItems(prev => prev.map(item => ({ ...item, isSelected: false })));
      }, 2000);
    }
  }, [challenge.correctEmojis, selectedEmojis, disabled, isCompleted, isValidating, startTime, attempts, emojiItems.length, onComplete, onInteraction]);

  /**
   * Handle submit button click
   */
  const handleSubmit = useCallback(() => {
    if (selectedEmojis.size === 0) return;
    validateSelection();
  }, [selectedEmojis.size, validateSelection]);

  /**
   * Get emoji button class names
   */
  const getEmojiButtonStyle = (item: EmojiItem): React.CSSProperties => {
    let style: React.CSSProperties = {
      width: '64px',
      height: '64px',
      fontSize: '24px',
      border: '2px solid',
      borderRadius: '8px',
      backgroundColor: 'white',
      cursor: disabled || isValidating ? 'not-allowed' : 'pointer',
      opacity: disabled || isValidating ? 0.5 : 1,
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    };
    
    if (item.isSelected) {
      if (showFeedback) {
        if (item.isCorrect) {
          style.borderColor = '#10b981';
          style.backgroundColor = '#d1fae5';
        } else {
          style.borderColor = '#ef4444';
          style.backgroundColor = '#fee2e2';
        }
      } else {
        style.borderColor = '#3b82f6';
        style.backgroundColor = '#dbeafe';
      }
    } else {
      if (showFeedback && item.isCorrect) {
        style.borderColor = '#10b981';
        style.backgroundColor = '#f0fdf4';
      } else {
        style.borderColor = '#d1d5db';
        style.backgroundColor = 'white';
      }
    }
    
    return style;
  };

  /**
   * Get progress information
   */
  const getProgressInfo = () => {
    const requiredCount = challenge.correctEmojis.length;
    const selectedCount = selectedEmojis.size;
    
    return {
      requiredCount,
      selectedCount,
      canSubmit: selectedCount > 0 && selectedCount <= requiredCount,
    };
  };

  const progressInfo = getProgressInfo();

  return (
    <div className="nexcaptcha-emoji-selection-puzzle">
      <div className="nexcaptcha-puzzle-instructions mb-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          {challenge.instruction || 'Select all emojis that match the criteria'}
        </h3>
        <p className="text-sm text-gray-600">
          {challenge.instruction}
        </p>
      </div>
      
      <div className="nexcaptcha-emoji-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '24px',
        maxWidth: '400px'
      }}>
        {emojiItems.map(item => (
          <button
            key={item.id}
            style={getEmojiButtonStyle(item)}
            onClick={() => handleEmojiClick(item.id)}
            disabled={disabled || isValidating}
            aria-label={`${item.emoji} emoji${item.isSelected ? ', selected' : ''}`}
            title={`Category: ${item.category}`}
          >
            {item.emoji}
            {showFeedback && item.isSelected && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs">
                {item.isCorrect ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <span className="text-red-600">✗</span>
                )}
              </div>
            )}
          </button>
        ))}
      </div>
      
      <div className="nexcaptcha-puzzle-controls">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Selected: {progressInfo.selectedCount} / {progressInfo.requiredCount}
            {attempts > 0 && (
              <span className="ml-2 text-gray-500">
                (Attempt {attempts + 1})
              </span>
            )}
          </div>
          
          {progressInfo.selectedCount > progressInfo.requiredCount && (
            <div className="text-sm text-orange-600">
              Too many selected
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            className={`nexcaptcha-submit-button px-6 py-2 rounded-md font-medium transition-colors ${
              progressInfo.canSubmit && !isValidating
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleSubmit}
            disabled={!progressInfo.canSubmit || isValidating}
          >
            {isValidating ? 'Checking...' : 'Submit'}
          </button>
          
          <button
            className="nexcaptcha-clear-button px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-400 transition-colors"
            onClick={() => {
              if (disabled || isValidating) return;
              setSelectedEmojis(new Set());
              setEmojiItems(prev => prev.map(item => ({ ...item, isSelected: false })));
              onInteraction?.('selection_cleared', { previousCount: selectedEmojis.size });
            }}
            disabled={disabled || isValidating || selectedEmojis.size === 0}
          >
            Clear
          </button>
        </div>
      </div>
      
      {/* Feedback Messages */}
      {showFeedback && (
        <div className="nexcaptcha-feedback mt-4 p-3 rounded-md">
          {isCompleted ? (
            <div className="bg-green-100 border border-green-300 text-green-800">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span className="font-medium">Correct! Puzzle completed.</span>
              </div>
              <div className="text-sm mt-1">
                Completed in {attempts} attempt{attempts !== 1 ? 's' : ''}
              </div>
            </div>
          ) : (
            <div className="bg-red-100 border border-red-300 text-red-800">
              <div className="flex items-center">
                <span className="text-red-600 mr-2">✗</span>
                <span className="font-medium">Incorrect selection. Try again!</span>
              </div>
              <div className="text-sm mt-1">
                Make sure to select the correct emojis
              </div>
            </div>
          )}
        </div>
      )}
      

    </div>
  );
};

export default EmojiSelectionPuzzle;