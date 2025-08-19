/**
 * Drag and Drop Puzzle Component for NexCaptcha
 * Interactive puzzle where users drag items to correct positions
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DragDropChallengeData, CaptchaTheme } from '../../types/index';

interface DragDropPuzzleProps {
  /** Challenge data containing items and target positions */
  challenge: DragDropChallengeData;
  /** Theme configuration for styling */
  theme?: CaptchaTheme;
  /** Callback when puzzle is completed */
  onComplete: (result: { success: boolean; timeSpent: number; attempts: number }) => void;
  /** Callback for tracking user interactions */
  onInteraction?: (event: string, data: any) => void;
  /** Whether the puzzle is disabled */
  disabled?: boolean;
}

interface DragItem {
  id: string;
  content: string;
  position: { x: number; y: number };
  isDragging: boolean;
  isPlaced: boolean;
}

interface DropZone {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  expectedItemId: string;
  hasItem: boolean;
}

/**
 * Drag and Drop Puzzle Component
 */
export const DragDropPuzzle: React.FC<DragDropPuzzleProps> = ({
  challenge,
  theme,
  onComplete,
  onInteraction,
  disabled = false,
}) => {
  const [dragItems, setDragItems] = useState<DragItem[]>([]);
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  /**
   * Initialize puzzle items and zones
   */
  useEffect(() => {
    const items: DragItem[] = challenge.items.map((item, index) => ({
      id: item.id,
      content: item.content,
      position: {
        x: 50 + (index % 3) * 120,
        y: 50 + Math.floor(index / 3) * 80,
      },
      isDragging: false,
      isPlaced: false,
    }));

    const zones: DropZone[] = challenge.targets.map((target, index) => ({
      id: target.id,
      position: { x: index * 100, y: 0 },
      size: { width: 100, height: 60 },
      expectedItemId: Object.keys(challenge.correctMappings).find(key => challenge.correctMappings[key] === target.id) || '',
      hasItem: false,
    }));

    setDragItems(items);
    setDropZones(zones);
  }, [challenge]);

  /**
   * Handle mouse down on drag item
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, itemId: string) => {
      if (disabled || isCompleted) return;

      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (!containerRect) return;

      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      setDraggedItem(itemId);
      setDragItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, isDragging: true } : item
      ));

      onInteraction?.('drag_start', { itemId, position: { x: e.clientX, y: e.clientY } });
    },
    [disabled, isCompleted, onInteraction]
  );

  /**
   * Handle mouse move for dragging
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggedItem || disabled || isCompleted) return;

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const newX = e.clientX - containerRect.left - dragOffsetRef.current.x;
      const newY = e.clientY - containerRect.top - dragOffsetRef.current.y;

      setDragItems(prev => prev.map(item => 
        item.id === draggedItem 
          ? { ...item, position: { x: newX, y: newY } }
          : item
      ));
    },
    [draggedItem, disabled, isCompleted]
  );

  /**
   * Handle mouse up to drop item
   */
  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!draggedItem || disabled || isCompleted) return;

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const dropX = e.clientX - containerRect.left;
      const dropY = e.clientY - containerRect.top;

      // Find drop zone under cursor
      const targetZone = dropZones.find(zone => 
        dropX >= zone.position.x &&
        dropX <= zone.position.x + zone.size.width &&
        dropY >= zone.position.y &&
        dropY <= zone.position.y + zone.size.height &&
        !zone.hasItem
      );

      setAttempts(prev => prev + 1);

      if (targetZone) {
        // Check if item matches expected item for this zone
        const isCorrect = targetZone.expectedItemId === draggedItem;
        
        if (isCorrect) {
          // Place item in zone
          setDragItems(prev => prev.map(item => 
            item.id === draggedItem 
              ? { 
                  ...item, 
                  position: {
                    x: targetZone.position.x + 10,
                    y: targetZone.position.y + 10,
                  },
                  isDragging: false,
                  isPlaced: true,
                }
              : item
          ));

          setDropZones(prev => prev.map(zone => 
            zone.id === targetZone.id ? { ...zone, hasItem: true } : zone
          ));

          onInteraction?.('drop_success', { 
            itemId: draggedItem, 
            zoneId: targetZone.id,
            attempts,
          });
        } else {
          // Wrong item, return to original position
          onInteraction?.('drop_failure', { 
            itemId: draggedItem, 
            zoneId: targetZone.id,
            attempts,
          });
        }
      }

      // Reset dragging state
      setDragItems(prev => prev.map(item => 
        item.id === draggedItem ? { ...item, isDragging: false } : item
      ));
      setDraggedItem(null);
    },
    [draggedItem, dropZones, disabled, isCompleted, attempts, onInteraction]
  );

  /**
   * Set up mouse event listeners
   */
  useEffect(() => {
    if (draggedItem) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedItem, handleMouseMove, handleMouseUp]);

  /**
   * Check if puzzle is completed
   */
  useEffect(() => {
    const allPlaced = dragItems.every(item => item.isPlaced);
    
    if (allPlaced && dragItems.length > 0 && !isCompleted) {
      setIsCompleted(true);
      const timeSpent = Date.now() - startTime;
      
      onComplete({
        success: true,
        timeSpent,
        attempts,
      });
      
      onInteraction?.('puzzle_completed', {
        timeSpent,
        attempts,
        totalItems: dragItems.length,
      });
    }
  }, [dragItems, isCompleted, startTime, attempts, onComplete, onInteraction]);

  /**
   * Get item style based on state
   */
  const getItemStyle = (item: DragItem) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${item.position.x}px`,
      top: `${item.position.y}px`,
      width: '80px',
      height: '50px',
      cursor: disabled || isCompleted ? 'default' : 'grab',
      zIndex: item.isDragging ? 1000 : 1,
      transform: item.isDragging ? 'scale(1.05)' : 'scale(1)',
      transition: item.isDragging ? 'none' : 'transform 0.2s ease',
    };

    return baseStyle;
  };

  /**
   * Get drop zone style
   */
  const getDropZoneStyle = (zone: DropZone) => ({
    position: 'absolute' as const,
    left: `${zone.position.x}px`,
    top: `${zone.position.y}px`,
    width: `${zone.size.width}px`,
    height: `${zone.size.height}px`,
  });

  return (
    <div className="nexcaptcha-drag-drop-puzzle">
      <div className="nexcaptcha-puzzle-instructions">
        <p className="text-sm text-gray-600 mb-4">
          {'Drag each item to its correct position'}
        </p>
      </div>
      
      <div 
        ref={containerRef}
        className="nexcaptcha-puzzle-container relative w-full h-80 bg-gray-50 border-2 border-gray-200 rounded-lg overflow-hidden"
        style={{ userSelect: 'none' }}
      >
        {/* Drop Zones */}
        {dropZones.map(zone => (
          <div
            key={zone.id}
            className={`nexcaptcha-drop-zone border-2 border-dashed rounded-md flex items-center justify-center text-xs text-gray-400 ${
              zone.hasItem 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 bg-white'
            }`}
            style={getDropZoneStyle(zone)}
          >
            {zone.hasItem ? '✓' : 'Drop here'}
          </div>
        ))}
        
        {/* Drag Items */}
        {dragItems.map(item => (
          <div
            key={item.id}
            className={`nexcaptcha-drag-item bg-white border-2 rounded-md shadow-sm flex items-center justify-center text-sm font-medium select-none ${
              item.isDragging 
                ? 'border-blue-400 shadow-lg' 
                : item.isPlaced
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${
              disabled || isCompleted ? 'opacity-50' : ''
            }`}
            style={getItemStyle(item)}
            onMouseDown={(e) => handleMouseDown(e, item.id)}
          >
            {item.content}
          </div>
        ))}
        
        {/* Completion Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-green-100 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg text-center">
              <div className="text-green-600 text-2xl mb-2">✓</div>
              <div className="text-sm font-medium text-gray-800">
                Puzzle completed!
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {attempts} attempts in {Math.round((Date.now() - startTime) / 1000)}s
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDropPuzzle;