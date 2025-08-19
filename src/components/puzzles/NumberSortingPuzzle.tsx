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
   * Handle number click (disabled for drag-only mode)
   */
  const handleNumberClick = useCallback(
    (numberId: string) => {
      // Disabled - only drag and drop allowed
      return;
    },
    []
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
    let className = 'nexcaptcha-number-item w-20 h-20 flex items-center justify-center text-xl font-bold border-2 rounded-lg transition-all duration-200 select-none relative';
    
    if (disabled || isCompleted) {
      className += ' cursor-not-allowed opacity-75';
    } else {
      className += ' cursor-grab hover:scale-105 hover:shadow-lg';
    }
    
    if (item.isCorrectPosition) {
      className += ' border-green-500 bg-green-100 text-green-800';
    } else {
      className += ' border-gray-300 bg-white hover:border-blue-400';
    }
    
    if (draggedItem === item.id) {
      className += ' opacity-50 scale-95 cursor-grabbing';
    }
    
    if (dragOverIndex === index && draggedItem !== item.id) {
      className += ' border-blue-500 bg-blue-50 scale-105';
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
          Sort the numbers in ascending order
        </h3>
        <p className="text-sm text-gray-600">
          Drag and drop the numbers to arrange them from smallest to largest
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
        
        <div className="text-center text-sm text-gray-500 mb-4">
          Drag the numbers to sort them in ascending order
        </div>
      </div>
      

    </div>
  );
};

export default NumberSortingPuzzle;