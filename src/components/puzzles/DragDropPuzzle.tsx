/**
 * Drag and Drop Puzzle Component for NexCaptcha
 * Interactive puzzle where users drag items to correct positions
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DragDropChallengeData, CaptchaTheme, PuzzlePiece, PuzzleSlot } from '../../types/index';

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
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [puzzleSlots, setPuzzleSlots] = useState<PuzzleSlot[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  /**
   * Initialize puzzle from challenge data
   */
  useEffect(() => {
    if (!challenge || !challenge.puzzlePieces || !challenge.puzzleSlots) return;
    
    // Use challenge data from ChallengeManager
    setPuzzlePieces([...challenge.puzzlePieces]);
    setPuzzleSlots([...challenge.puzzleSlots]);
    
    onInteraction?.('puzzle_initialized', {
      pieceCount: challenge.puzzlePieces.length,
      slotCount: challenge.puzzleSlots.length,
    });
  }, [challenge, onInteraction]);

  /**
   * Handle mouse down on puzzle piece
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, pieceId: string) => {
      if (disabled || isCompleted) return;

      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (!containerRect) return;

      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      setDraggedPiece(pieceId);
      setPuzzlePieces(prev => prev.map(piece => 
        piece.id === pieceId ? { ...piece, isDragging: true } : piece
      ));

      onInteraction?.('piece_drag_start', { pieceId, position: { x: e.clientX, y: e.clientY } });
    },
    [disabled, isCompleted, onInteraction]
  );

  /**
   * Handle mouse move for dragging
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggedPiece || disabled || isCompleted) return;

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const newX = e.clientX - containerRect.left - dragOffsetRef.current.x;
      const newY = e.clientY - containerRect.top - dragOffsetRef.current.y;

      setPuzzlePieces(prev => prev.map(piece => 
        piece.id === draggedPiece 
          ? { ...piece, position: { x: newX, y: newY } }
          : piece
      ));
    },
    [draggedPiece, disabled, isCompleted]
  );

  /**
   * Handle mouse up to drop piece
   */
  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!draggedPiece || disabled || isCompleted) return;

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const dropX = e.clientX - containerRect.left;
      const dropY = e.clientY - containerRect.top;

      // Find puzzle slot under cursor
      const targetSlot = puzzleSlots.find(slot => 
        dropX >= slot.position.x &&
        dropX <= slot.position.x + slot.size.width &&
        dropY >= slot.position.y &&
        dropY <= slot.position.y + slot.size.height &&
        !slot.hasItem
      );

      setAttempts(prev => prev + 1);

      if (targetSlot) {
        // Check if piece matches expected piece for this slot
        const isCorrect = targetSlot.expectedPieceId === draggedPiece;
        
        if (isCorrect) {
          // Place piece in slot
          setPuzzlePieces(prev => prev.map(piece => 
            piece.id === draggedPiece 
              ? { 
                  ...piece, 
                  position: {
                    x: targetSlot.position.x + 10,
                    y: targetSlot.position.y + 10,
                  },
                  isDragging: false,
                  isPlaced: true,
                }
              : piece
          ));

          setPuzzleSlots(prev => prev.map(slot => 
            slot.id === targetSlot.id ? { ...slot, hasItem: true } : slot
          ));

          onInteraction?.('drop_success', { 
            pieceId: draggedPiece, 
            slotId: targetSlot.id,
            attempts,
          });
        } else {
          // Wrong piece, return to original position
          onInteraction?.('drop_failure', { 
            pieceId: draggedPiece, 
            slotId: targetSlot.id,
            attempts,
          });
        }
      }

      // Reset dragging state
      setPuzzlePieces(prev => prev.map(piece => 
        piece.id === draggedPiece ? { ...piece, isDragging: false } : piece
      ));
      setDraggedPiece(null);
    },
    [draggedPiece, puzzleSlots, disabled, isCompleted, attempts, onInteraction]
  );

  /**
   * Set up mouse event listeners
   */
  useEffect(() => {
    if (draggedPiece) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedPiece, handleMouseMove, handleMouseUp]);

  /**
   * Check if puzzle is completed
   */
  useEffect(() => {
    const allPlaced = puzzlePieces.every(piece => piece.isPlaced);
    
    if (allPlaced && puzzlePieces.length > 0 && !isCompleted) {
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
        totalPieces: puzzlePieces.length,
      });
    }
  }, [puzzlePieces, isCompleted, startTime, attempts, onComplete, onInteraction]);

  /**
   * Get puzzle piece style based on state
   */
  const getPieceStyle = (piece: PuzzlePiece) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${piece.position.x}px`,
      top: `${piece.position.y}px`,
      width: '60px',
      height: '60px',
      cursor: disabled || isCompleted ? 'default' : 'grab',
      zIndex: piece.isDragging ? 1000 : 1,
      transform: `scale(${piece.isDragging ? 1.1 : 1}) rotate(${piece.rotation}deg)`,
      transition: piece.isDragging ? 'none' : 'transform 0.2s ease',
    };

    return baseStyle;
  };

  /**
   * Get puzzle slot style
   */
  const getSlotStyle = (slot: PuzzleSlot) => ({
    position: 'absolute' as const,
    left: `${slot.position.x}px`,
    top: `${slot.position.y}px`,
    width: `${slot.size.width}px`,
    height: `${slot.size.height}px`,
  });

  /**
   * Render shape based on type
   */
  const renderShape = (shape: string, color: string, size: number = 60) => {
    const shapeStyle = {
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (shape) {
      case 'circle':
        return <div style={{ ...shapeStyle, borderRadius: '50%' }} />;
      case 'square':
        return <div style={{ ...shapeStyle, borderRadius: '4px' }} />;
      case 'triangle':
        return (
          <div style={{ 
            width: 0, 
            height: 0, 
            borderLeft: `${size/2}px solid transparent`,
            borderRight: `${size/2}px solid transparent`,
            borderBottom: `${size}px solid ${color}`,
          }} />
        );
      default:
        return <div style={{ ...shapeStyle, borderRadius: '4px' }} />;
    }
  };

  return (
    <div className="nexcaptcha-drag-drop-puzzle">
      <div className="nexcaptcha-puzzle-instructions">
        <p className="text-sm text-gray-600 mb-4">
          {'Drag the puzzle pieces to their matching slots'}
        </p>
      </div>
      
      <div 
        ref={containerRef}
        className="nexcaptcha-puzzle-container relative w-full h-80 bg-gray-50 border-2 border-gray-200 rounded-lg overflow-hidden"
        style={{ userSelect: 'none' }}
      >
        {/* Puzzle Slots */}
        {puzzleSlots.map(slot => (
          <div
            key={slot.id}
            className={`nexcaptcha-puzzle-slot border-2 border-dashed rounded-md flex items-center justify-center text-xs text-gray-400 ${
              slot.hasItem 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 bg-white'
            }`}
            style={getSlotStyle(slot)}
          >
            <div className="nexcaptcha-puzzle-slot-outline">
              {renderShape(slot.shape, '#ddd', 50)}
            </div>
          </div>
        ))}
        
        {/* Puzzle Pieces */}
        {puzzlePieces.map(piece => (
          <div
            key={piece.id}
            className={`nexcaptcha-puzzle-piece bg-white border-2 rounded-md shadow-sm flex items-center justify-center text-sm font-medium select-none ${
              piece.isDragging 
                ? 'border-blue-400 shadow-lg' 
                : piece.isPlaced
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${
              disabled || isCompleted ? 'opacity-50' : ''
            }`}
            style={getPieceStyle(piece)}
            onMouseDown={(e) => handleMouseDown(e, piece.id)}
          >
            {renderShape(piece.shape, piece.color)}
          </div>
        ))}
        

      </div>
    </div>
  );
};

export default DragDropPuzzle;