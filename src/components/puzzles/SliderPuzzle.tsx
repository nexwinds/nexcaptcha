/**
 * Slider Puzzle Component for NexCaptcha
 * Interactive sliding puzzle where users arrange pieces to complete an image
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SliderPuzzleChallengeData, CaptchaTheme } from '../../types/index';

interface SliderPuzzleProps {
  /** Challenge data containing puzzle configuration */
  challenge: SliderPuzzleChallengeData;
  /** Theme configuration for styling */
  theme?: CaptchaTheme;
  /** Callback when puzzle is completed */
  onComplete: (result: { success: boolean; timeSpent: number; moves: number }) => void;
  /** Callback for tracking user interactions */
  onInteraction?: (event: string, data: any) => void;
  /** Whether the puzzle is disabled */
  disabled?: boolean;
}

interface PuzzlePiece {
  id: number;
  position: number;
  correctPosition: number;
  isEmpty: boolean;
  imageUrl?: string;
  backgroundPosition?: string;
}

/**
 * Slider Puzzle Component
 */
export const SliderPuzzle: React.FC<SliderPuzzleProps> = ({
  challenge,
  theme,
  onComplete,
  onInteraction,
  disabled = false,
}) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [emptyPosition, setEmptyPosition] = useState<number>(0);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const gridSizeValue = typeof challenge.gridSize === 'object' ? challenge.gridSize.width : (challenge.gridSize || 3);
  const totalPieces = gridSizeValue * gridSizeValue;
  const puzzleRef = useRef<HTMLDivElement>(null);

  /**
   * Initialize puzzle pieces
   */
  useEffect(() => {
    const initialPieces: PuzzlePiece[] = [];
    
    // Create pieces (last piece is empty)
    for (let i = 0; i < totalPieces; i++) {
      const isEmpty = i === totalPieces - 1;
      const piece: PuzzlePiece = {
        id: i,
        position: i,
        correctPosition: i,
        isEmpty,
        imageUrl: isEmpty ? undefined : challenge.imageUrl,
        backgroundPosition: isEmpty ? undefined : getBackgroundPosition(i, gridSizeValue),
      };
      initialPieces.push(piece);
    }
    
    // Shuffle pieces
    const shuffledPieces = shufflePuzzle(initialPieces, gridSizeValue);
    setPieces(shuffledPieces);
    
    // Find empty position
    const emptyPiece = shuffledPieces.find(p => p.isEmpty);
    setEmptyPosition(emptyPiece?.position || totalPieces - 1);
  }, [challenge, gridSizeValue, totalPieces]);

  /**
   * Get background position for image piece
   */
  const getBackgroundPosition = (pieceId: number, size: number): string => {
    const row = Math.floor(pieceId / size);
    const col = pieceId % size;
    const percentX = (col / (size - 1)) * 100;
    const percentY = (row / (size - 1)) * 100;
    return `${percentX}% ${percentY}%`;
  };

  /**
   * Shuffle puzzle pieces
   */
  const shufflePuzzle = (initialPieces: PuzzlePiece[], size: number): PuzzlePiece[] => {
    const shuffled = [...initialPieces];
    const emptyIndex = shuffled.findIndex(p => p.isEmpty);
    
    // Perform random valid moves to ensure solvability
    let currentEmpty = emptyIndex;
    const moves = 100 + Math.floor(Math.random() * 100);
    
    for (let i = 0; i < moves; i++) {
      const validMoves = getValidMoves(currentEmpty, size);
      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        
        // Swap pieces
        const temp = shuffled[currentEmpty];
        shuffled[currentEmpty] = shuffled[randomMove];
        shuffled[randomMove] = temp;
        
        // Update positions
        shuffled[currentEmpty].position = currentEmpty;
        shuffled[randomMove].position = randomMove;
        
        currentEmpty = randomMove;
      }
    }
    
    return shuffled;
  };

  /**
   * Get valid moves for a position
   */
  const getValidMoves = (position: number, size: number): number[] => {
    const row = Math.floor(position / size);
    const col = position % size;
    const moves: number[] = [];
    
    // Up
    if (row > 0) moves.push(position - size);
    // Down
    if (row < size - 1) moves.push(position + size);
    // Left
    if (col > 0) moves.push(position - 1);
    // Right
    if (col < size - 1) moves.push(position + 1);
    
    return moves;
  };

  /**
   * Handle piece click
   */
  const handlePieceClick = useCallback(
    (clickedPosition: number) => {
      if (disabled || isCompleted || isAnimating) return;
      
      const validMoves = getValidMoves(emptyPosition, gridSizeValue);
      
      if (validMoves.includes(clickedPosition)) {
        setIsAnimating(true);
        
        // Swap pieces
        setPieces(prev => {
          const newPieces = [...prev];
          const emptyPiece = newPieces.find(p => p.position === emptyPosition)!;
          const clickedPiece = newPieces.find(p => p.position === clickedPosition)!;
          
          // Swap positions
          emptyPiece.position = clickedPosition;
          clickedPiece.position = emptyPosition;
          
          return newPieces;
        });
        
        setEmptyPosition(clickedPosition);
        setMoves(prev => prev + 1);
        
        onInteraction?.('piece_moved', {
          from: clickedPosition,
          to: emptyPosition,
          moves: moves + 1,
        });
        
        // Reset animation state
        setTimeout(() => setIsAnimating(false), 200);
      } else {
        onInteraction?.('invalid_move', {
          clickedPosition,
          emptyPosition,
          validMoves,
        });
      }
    },
    [emptyPosition, gridSizeValue, disabled, isCompleted, isAnimating, moves, onInteraction]
  );

  /**
   * Check if puzzle is solved
   */
  useEffect(() => {
    const isSolved = pieces.every(piece => piece.position === piece.correctPosition);
    
    if (isSolved && pieces.length > 0 && !isCompleted) {
      setIsCompleted(true);
      const timeSpent = Date.now() - startTime;
      
      setTimeout(() => {
        onComplete({
          success: true,
          timeSpent,
          moves,
        });
        
        onInteraction?.('puzzle_completed', {
          timeSpent,
          moves,
          gridSize: gridSizeValue,
        });
      }, 500);
    }
  }, [pieces, isCompleted, startTime, moves, gridSizeValue, onComplete, onInteraction]);

  /**
   * Get piece style
   */
  const getPieceStyle = (piece: PuzzlePiece) => {
    const row = Math.floor(piece.position / gridSizeValue);
    const col = piece.position % gridSizeValue;
    const size = 100 / gridSizeValue;
    
    return {
      position: 'absolute' as const,
      left: `${col * size}%`,
      top: `${row * size}%`,
      width: `${size}%`,
      height: `${size}%`,
      backgroundImage: piece.imageUrl ? `url(${piece.imageUrl})` : 'none',
      backgroundSize: `${gridSizeValue * 100}% ${gridSizeValue * 100}%`,
      backgroundPosition: piece.backgroundPosition || '0% 0%',
      transition: isAnimating ? 'all 0.2s ease-in-out' : 'none',
    };
  };

  /**
   * Get piece class names
   */
  const getPieceClassName = (piece: PuzzlePiece) => {
    let className = 'nexcaptcha-puzzle-piece border border-gray-300';
    
    if (piece.isEmpty) {
      className += ' bg-gray-100';
    } else {
      if (disabled || isCompleted) {
        className += ' cursor-default';
      } else {
        const validMoves = getValidMoves(emptyPosition, gridSizeValue);
        if (validMoves.includes(piece.position)) {
          className += ' cursor-pointer hover:border-blue-400 hover:shadow-md';
        } else {
          className += ' cursor-not-allowed';
        }
      }
      
      // Highlight correct position
      if (piece.position === piece.correctPosition) {
        className += ' border-green-400';
      }
    }
    
    return className;
  };

  /**
   * Calculate completion percentage
   */
  const getCompletionPercentage = (): number => {
    const correctPieces = pieces.filter(p => p.position === p.correctPosition).length;
    return Math.round((correctPieces / totalPieces) * 100);
  };

  /**
   * Shuffle puzzle (reset)
   */
  const handleShuffle = useCallback(() => {
    if (disabled || isCompleted || isAnimating) return;
    
    const shuffledPieces = shufflePuzzle(pieces.map(p => ({ ...p, position: p.correctPosition })), gridSizeValue);
    setPieces(shuffledPieces);
    
    const emptyPiece = shuffledPieces.find(p => p.isEmpty);
    setEmptyPosition(emptyPiece?.position || totalPieces - 1);
    setMoves(0);
    
    onInteraction?.('puzzle_shuffled', { gridSize: gridSizeValue });
  }, [pieces, gridSizeValue, totalPieces, disabled, isCompleted, isAnimating, onInteraction]);

  return (
    <div className="nexcaptcha-slider-puzzle">
      <div className="nexcaptcha-puzzle-instructions mb-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          {'Arrange the pieces to complete the image'}
        </h3>
        <p className="text-sm text-gray-600">
          Click on pieces adjacent to the empty space to move them
        </p>
      </div>
      
      <div className="nexcaptcha-puzzle-stats flex justify-between items-center mb-4 text-sm text-gray-600">
        <div>Moves: {moves}</div>
        <div>Progress: {getCompletionPercentage()}%</div>
        <button
          className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          onClick={handleShuffle}
          disabled={disabled || isCompleted || isAnimating}
        >
          Shuffle
        </button>
      </div>
      
      <div 
        ref={puzzleRef}
        className="nexcaptcha-puzzle-grid relative bg-white border-2 border-gray-300 rounded-lg overflow-hidden"
        style={{
          aspectRatio: '1',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        {pieces.map(piece => (
          <div
            key={piece.id}
            className={getPieceClassName(piece)}
            style={getPieceStyle(piece)}
            onClick={() => handlePieceClick(piece.position)}
          >
            {piece.isEmpty && (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                Empty
              </div>
            )}
            
            {/* Piece number for debugging */}
            {!piece.isEmpty && process.env.NODE_ENV === 'development' && (
              <div className="absolute top-0 left-0 text-xs bg-black text-white px-1">
                {piece.id}
              </div>
            )}
          </div>
        ))}
        
        {/* Completion Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-green-100 bg-opacity-90 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-green-600 text-3xl mb-3">🧩</div>
              <div className="text-lg font-medium text-gray-800 mb-2">
                Puzzle completed!
              </div>
              <div className="text-sm text-gray-600">
                {moves} moves in {Math.round((Date.now() - startTime) / 1000)}s
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Hint */}
      <div className="nexcaptcha-puzzle-hint mt-4 text-center">
        <p className="text-xs text-gray-500">
          Tip: Green borders indicate pieces in correct positions
        </p>
      </div>
    </div>
  );
};

export default SliderPuzzle;