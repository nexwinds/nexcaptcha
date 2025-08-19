/**
 * Number Sorting Puzzle Component for NexCaptcha
 * Interactive puzzle where users sort numbers in ascending or descending order
 */

import React, { useState, useEffect, useCallback } from 'react';
import { NumberSortingChallengeData, CaptchaTheme } from '../../types/index';

interface NumberSortingPuzzleProps {
  /** Challenge data containing numbers and sorting criteria */
  challenge: NumberSortingChallengeData;
  /** Theme configuration for styling */
  theme?: CaptchaTheme;
  /** Callback when puzzle is completed */
  onComplete: (result: { success: boolean; timeSpent: number; swaps: number }) => void;
  /** Callback for tracking user interactions */
  onInteraction?: (event: string, data: any) => void;
  /** Whether the puzzle is disabled */
  disabled?: boolean;
}

interface NumberItem {
  id: string;
  value: number;
  position: number;
  isSelected: boolean;
  isCorrectPosition: boolean;
}

/**
 * Number Sorting Puzzle Component
 */
export const NumberSortingPuzzle: React.FC<NumberSortingPuzzleProps> = ({
  challenge,
  theme,
  onComplete,
  onInteraction,
  disabled = false,
}) => {
  const [numbers, setNumbers] = useState<NumberItem[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [swaps, setSwaps] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  /**
   * Initialize number items
   */
  useEffect(() => {
    const items: NumberItem[] = challenge.numbers.map((num, index) => ({
      id: `num-${index}`,
      value: num,
      position: index,
      isSelected: false,
      isCorrectPosition: false,
    }));

    setNumbers(items);
    updateCorrectPositions(items);
  }, [challenge]);

  /**
   * Update correct position indicators
   */
  const updateCorrectPositions = useCallback((items: NumberItem[]) => {
    const sortedValues = [...challenge.numbers].sort((a, b) => 
      challenge.sortOrder === 'asc' ? a - b : b - a
    );
    
    const updatedItems = items.map(item => ({
      ...item,
      isCorrectPosition: sortedValues[item.position] === item.value,
    }));
    
    setNumbers(updatedItems);
    
    // Check if puzzle is completed
    const isComplete = updatedItems.every(item => item.isCorrectPosition);
    if (isComplete && !isCompleted) {
      setIsCompleted(true);
      const timeSpent = Date.now() - startTime;
      
      setTimeout(() => {
        onComplete({
          success: true,
          timeSpent,
          swaps,
        });
        
        onInteraction?.('puzzle_completed', {
          timeSpent,
          swaps,
          totalNumbers: items.length,
          order: challenge.sortOrder,
        });
      }, 500);
    }
  }, [challenge.numbers, challenge.sortOrder, isCompleted, startTime, swaps, onComplete, onInteraction]);

  /**
   * Handle number selection
   */
  const handleNumberClick = useCallback(
    (numberId: string) => {
      if (disabled || isCompleted) return;

      setSelectedNumbers(prev => {
        const newSelected = [...prev];
        const index = newSelected.indexOf(numberId);
        
        if (index > -1) {
          // Deselect
          newSelected.splice(index, 1);
        } else {
          // Select (max 2 numbers for swapping)
          if (newSelected.length < 2) {
            newSelected.push(numberId);
          } else {
            // Replace first selection
            newSelected[0] = newSelected[1];
            newSelected[1] = numberId;
          }
        }
        
        // Auto-swap when 2 numbers are selected
        if (newSelected.length === 2) {
          setTimeout(() => {
            handleSwap(newSelected[0], newSelected[1]);
            setSelectedNumbers([]);
          }, 100);
        }
        
        return newSelected;
      });

      // Update visual selection
      setNumbers(prev => prev.map(item => ({
        ...item,
        isSelected: selectedNumbers.includes(item.id) || item.id === numberId,
      })));

      onInteraction?.('number_selected', {
        numberId,
        selectedCount: selectedNumbers.length + 1,
      });
    },
    [selectedNumbers, disabled, isCompleted, onInteraction]
  );

  /**
   * Handle number swap
   */
  const handleSwap = useCallback(
    (id1: string, id2: string) => {
      if (disabled || isCompleted) return;

      setNumbers(prev => {
        const newNumbers = [...prev];
        const index1 = newNumbers.findIndex(n => n.id === id1);
        const index2 = newNumbers.findIndex(n => n.id === id2);
        
        if (index1 !== -1 && index2 !== -1) {
          // Swap positions
          const temp = newNumbers[index1].position;
          newNumbers[index1].position = newNumbers[index2].position;
          newNumbers[index2].position = temp;
          
          // Sort by position to maintain order
          newNumbers.sort((a, b) => a.position - b.position);
        }
        
        return newNumbers;
      });

      setSwaps(prev => prev + 1);
      
      onInteraction?.('numbers_swapped', {
        id1,
        id2,
        swaps: swaps + 1,
      });

      // Update correct positions after swap
      setTimeout(() => {
        setNumbers(prev => {
          updateCorrectPositions(prev);
          return prev;
        });
      }, 0);
    },
    [disabled, isCompleted, swaps, onInteraction, updateCorrectPositions]
  );

  /**
   * Handle drag start
   */
  const handleDragStart = useCallback(
    (e: React.DragEvent, numberId: string) => {
      if (disabled || isCompleted) return;
      
      setDraggedItem(numberId);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', numberId);
      
      onInteraction?.('drag_start', { numberId });
    },
    [disabled, isCompleted, onInteraction]
  );

  /**
   * Handle drag over
   */
  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      if (disabled || isCompleted) return;
      
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOverIndex(index);
    },
    [disabled, isCompleted]
  );

  /**
   * Handle drop
   */
  const handleDrop = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      if (disabled || isCompleted) return;
      
      e.preventDefault();
      const draggedId = e.dataTransfer.getData('text/plain');
      const targetNumber = numbers[targetIndex];
      
      if (draggedId && targetNumber && draggedId !== targetNumber.id) {
        handleSwap(draggedId, targetNumber.id);
      }
      
      setDraggedItem(null);
      setDragOverIndex(null);
      
      onInteraction?.('drag_drop', {
        draggedId,
        targetId: targetNumber?.id,
        targetIndex,
      });
    },
    [numbers, disabled, isCompleted, handleSwap, onInteraction]
  );

  /**
   * Handle drag leave
   */
  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  /**
   * Get number item class names
   */
  const getNumberClassName = (item: NumberItem, index: number) => {
    let className = 'nexcaptcha-number-item w-16 h-16 flex items-center justify-center text-lg font-bold border-2 rounded-lg transition-all duration-200 cursor-pointer select-none';
    
    if (disabled || isCompleted) {
      className += ' cursor-not-allowed opacity-75';
    } else {
      className += ' hover:scale-105 hover:shadow-md';
    }
    
    if (item.isSelected) {
      className += ' border-blue-500 bg-blue-100 shadow-blue-200';
    } else if (item.isCorrectPosition) {
      className += ' border-green-500 bg-green-100 text-green-800';
    } else {
      className += ' border-gray-300 bg-white hover:border-gray-400';
    }
    
    if (draggedItem === item.id) {
      className += ' opacity-50 scale-95';
    }
    
    if (dragOverIndex === index && draggedItem !== item.id) {
      className += ' border-blue-400 bg-blue-50';
    }
    
    return className;
  };

  /**
   * Get sorting instruction text
   */
  const getSortingInstruction = () => {
    const orderText = challenge.sortOrder === 'asc' ? 'smallest to largest' : 'largest to smallest';
    return `Sort the numbers from ${orderText}`;
  };

  /**
   * Get progress percentage
   */
  const getProgressPercentage = (): number => {
    const correctCount = numbers.filter(n => n.isCorrectPosition).length;
    return Math.round((correctCount / numbers.length) * 100);
  };

  /**
   * Reset puzzle
   */
  const handleReset = useCallback(() => {
    if (disabled || isCompleted) return;
    
    // Shuffle numbers
    const shuffled = [...challenge.numbers].sort(() => Math.random() - 0.5);
    const resetItems: NumberItem[] = shuffled.map((num, index) => ({
      id: `num-${index}`,
      value: num,
      position: index,
      isSelected: false,
      isCorrectPosition: false,
    }));
    
    setNumbers(resetItems);
    setSelectedNumbers([]);
    setSwaps(0);
    updateCorrectPositions(resetItems);
    
    onInteraction?.('puzzle_reset', { totalNumbers: resetItems.length });
  }, [challenge.numbers, disabled, isCompleted, updateCorrectPositions, onInteraction]);

  return (
    <div className="nexcaptcha-number-sorting-puzzle">
      <div className="nexcaptcha-puzzle-instructions mb-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          {getSortingInstruction()}
        </h3>
        <p className="text-sm text-gray-600">
          Click two numbers to swap them, or drag and drop to rearrange
        </p>
      </div>
      
      <div className="nexcaptcha-puzzle-stats flex justify-between items-center mb-4 text-sm text-gray-600">
        <div>Swaps: {swaps}</div>
        <div>Progress: {getProgressPercentage()}%</div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            onClick={() => setShowHint(!showHint)}
            disabled={disabled || isCompleted}
          >
            {showHint ? 'Hide' : 'Show'} Hint
          </button>
          <button
            className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            onClick={handleReset}
            disabled={disabled || isCompleted}
          >
            Reset
          </button>
        </div>
      </div>
      
      {showHint && (
        <div className="nexcaptcha-hint mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            Target order: {[...challenge.numbers]
              .sort((a, b) => challenge.sortOrder === 'asc' ? a - b : b - a)
              .join(' → ')}
          </p>
        </div>
      )}
      
      <div className="nexcaptcha-numbers-container">
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          {numbers.map((item, index) => (
            <div
              key={item.id}
              className={getNumberClassName(item, index)}
              onClick={() => handleNumberClick(item.id)}
              draggable={!disabled && !isCompleted}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragLeave={handleDragLeave}
              title={`Number ${item.value}${item.isCorrectPosition ? ' (correct position)' : ''}`}
            >
              {item.value}
              {item.isCorrectPosition && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {selectedNumbers.length > 0 && (
          <div className="text-center text-sm text-gray-600 mb-4">
            Selected: {selectedNumbers.length}/2 numbers
            {selectedNumbers.length === 1 && ' (select one more to swap)'}
          </div>
        )}
      </div>
      
      {/* Completion Overlay */}
      {isCompleted && (
        <div className="nexcaptcha-completion-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm mx-4">
            <div className="text-green-600 text-4xl mb-3">🎯</div>
            <div className="text-xl font-bold text-gray-800 mb-2">
              Perfect Sort!
            </div>
            <div className="text-gray-600 mb-4">
              Completed in {swaps} swap{swaps !== 1 ? 's' : ''}
            </div>
            <div className="text-sm text-gray-500">
              Time: {Math.round((Date.now() - startTime) / 1000)}s
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NumberSortingPuzzle;