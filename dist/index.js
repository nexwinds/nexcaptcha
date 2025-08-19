'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

/**
 * Drag and Drop Puzzle Component for NexCaptcha
 * Interactive puzzle where users drag items to correct positions
 */
/**
 * Drag and Drop Puzzle Component
 */
const DragDropPuzzle = ({ challenge, theme, onComplete, onInteraction, disabled = false, }) => {
    const [puzzlePieces, setPuzzlePieces] = React.useState([]);
    const [puzzleSlots, setPuzzleSlots] = React.useState([]);
    const [draggedPiece, setDraggedPiece] = React.useState(null);
    const [attempts, setAttempts] = React.useState(0);
    const [startTime] = React.useState(Date.now());
    const [isCompleted, setIsCompleted] = React.useState(false);
    const containerRef = React.useRef(null);
    const dragOffsetRef = React.useRef({ x: 0, y: 0 });
    /**
     * Initialize puzzle from challenge data
     */
    React.useEffect(() => {
        if (!challenge || !challenge.puzzlePieces || !challenge.puzzleSlots)
            return;
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
    const handleMouseDown = React.useCallback((e, pieceId) => {
        if (disabled || isCompleted)
            return;
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect)
            return;
        dragOffsetRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        setDraggedPiece(pieceId);
        setPuzzlePieces(prev => prev.map(piece => piece.id === pieceId ? { ...piece, isDragging: true } : piece));
        onInteraction?.('piece_drag_start', { pieceId, position: { x: e.clientX, y: e.clientY } });
    }, [disabled, isCompleted, onInteraction]);
    /**
     * Handle mouse move for dragging
     */
    const handleMouseMove = React.useCallback((e) => {
        if (!draggedPiece || disabled || isCompleted)
            return;
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect)
            return;
        const newX = e.clientX - containerRect.left - dragOffsetRef.current.x;
        const newY = e.clientY - containerRect.top - dragOffsetRef.current.y;
        setPuzzlePieces(prev => prev.map(piece => piece.id === draggedPiece
            ? { ...piece, position: { x: newX, y: newY } }
            : piece));
    }, [draggedPiece, disabled, isCompleted]);
    /**
     * Handle mouse up to drop piece
     */
    const handleMouseUp = React.useCallback((e) => {
        if (!draggedPiece || disabled || isCompleted)
            return;
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect)
            return;
        const dropX = e.clientX - containerRect.left;
        const dropY = e.clientY - containerRect.top;
        // Find puzzle slot under cursor
        const targetSlot = puzzleSlots.find(slot => dropX >= slot.position.x &&
            dropX <= slot.position.x + slot.size.width &&
            dropY >= slot.position.y &&
            dropY <= slot.position.y + slot.size.height &&
            !slot.hasItem);
        setAttempts(prev => prev + 1);
        if (targetSlot) {
            // Check if piece matches expected piece for this slot
            const isCorrect = targetSlot.expectedPieceId === draggedPiece;
            if (isCorrect) {
                // Place piece in slot
                setPuzzlePieces(prev => prev.map(piece => piece.id === draggedPiece
                    ? {
                        ...piece,
                        position: {
                            x: targetSlot.position.x + 10,
                            y: targetSlot.position.y + 10,
                        },
                        isDragging: false,
                        isPlaced: true,
                    }
                    : piece));
                setPuzzleSlots(prev => prev.map(slot => slot.id === targetSlot.id ? { ...slot, hasItem: true } : slot));
                onInteraction?.('drop_success', {
                    pieceId: draggedPiece,
                    slotId: targetSlot.id,
                    attempts,
                });
            }
            else {
                // Wrong piece, return to original position
                onInteraction?.('drop_failure', {
                    pieceId: draggedPiece,
                    slotId: targetSlot.id,
                    attempts,
                });
            }
        }
        // Reset dragging state
        setPuzzlePieces(prev => prev.map(piece => piece.id === draggedPiece ? { ...piece, isDragging: false } : piece));
        setDraggedPiece(null);
    }, [draggedPiece, puzzleSlots, disabled, isCompleted, attempts, onInteraction]);
    /**
     * Set up mouse event listeners
     */
    React.useEffect(() => {
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
    React.useEffect(() => {
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
    const getPieceStyle = (piece) => {
        const baseStyle = {
            position: 'absolute',
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
    const getSlotStyle = (slot) => ({
        position: 'absolute',
        left: `${slot.position.x}px`,
        top: `${slot.position.y}px`,
        width: `${slot.size.width}px`,
        height: `${slot.size.height}px`,
    });
    /**
     * Render shape based on type
     */
    const renderShape = (shape, color, size = 60) => {
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
                return React.createElement("div", { style: { ...shapeStyle, borderRadius: '50%' } });
            case 'square':
                return React.createElement("div", { style: { ...shapeStyle, borderRadius: '4px' } });
            case 'triangle':
                return (React.createElement("div", { style: {
                        width: 0,
                        height: 0,
                        borderLeft: `${size / 2}px solid transparent`,
                        borderRight: `${size / 2}px solid transparent`,
                        borderBottom: `${size}px solid ${color}`,
                    } }));
            default:
                return React.createElement("div", { style: { ...shapeStyle, borderRadius: '4px' } });
        }
    };
    return (React.createElement("div", { className: "nexcaptcha-drag-drop-puzzle" },
        React.createElement("div", { className: "nexcaptcha-puzzle-instructions" },
            React.createElement("p", { className: "text-sm text-gray-600 mb-4" }, 'Drag the puzzle pieces to their matching slots')),
        React.createElement("div", { ref: containerRef, className: "nexcaptcha-puzzle-container relative w-full h-80 bg-gray-50 border-2 border-gray-200 rounded-lg overflow-hidden", style: { userSelect: 'none' } },
            puzzleSlots.map(slot => (React.createElement("div", { key: slot.id, className: `nexcaptcha-puzzle-slot border-2 border-dashed rounded-md flex items-center justify-center text-xs text-gray-400 ${slot.hasItem
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 bg-white'}`, style: getSlotStyle(slot) },
                React.createElement("div", { className: "nexcaptcha-puzzle-slot-outline" }, renderShape(slot.shape, '#ddd', 50))))),
            puzzlePieces.map(piece => (React.createElement("div", { key: piece.id, className: `nexcaptcha-puzzle-piece bg-white border-2 rounded-md shadow-sm flex items-center justify-center text-sm font-medium select-none ${piece.isDragging
                    ? 'border-blue-400 shadow-lg'
                    : piece.isPlaced
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'} ${disabled || isCompleted ? 'opacity-50' : ''}`, style: getPieceStyle(piece), onMouseDown: (e) => handleMouseDown(e, piece.id) }, renderShape(piece.shape, piece.color)))))));
};

/**
 * Emoji Selection Puzzle Component for NexCaptcha
 * Interactive puzzle where users select specific emojis based on criteria
 */
/**
 * Emoji Selection Puzzle Component
 */
const EmojiSelectionPuzzle = ({ challenge, theme, onComplete, onInteraction, disabled = false, }) => {
    const [emojiItems, setEmojiItems] = React.useState([]);
    const [selectedEmojis, setSelectedEmojis] = React.useState(new Set());
    const [attempts, setAttempts] = React.useState(0);
    const [startTime] = React.useState(Date.now());
    const [isCompleted, setIsCompleted] = React.useState(false);
    const [showFeedback, setShowFeedback] = React.useState(false);
    const [isValidating, setIsValidating] = React.useState(false);
    /**
     * Initialize emoji items
     */
    React.useEffect(() => {
        const items = challenge.emojis.map(emoji => ({
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
    const handleEmojiClick = React.useCallback((emojiId) => {
        if (disabled || isCompleted || isValidating)
            return;
        const newSelected = new Set(selectedEmojis);
        if (newSelected.has(emojiId)) {
            newSelected.delete(emojiId);
        }
        else {
            newSelected.add(emojiId);
        }
        setSelectedEmojis(newSelected);
        setEmojiItems(prev => prev.map(item => item.id === emojiId
            ? { ...item, isSelected: newSelected.has(emojiId) }
            : item));
        onInteraction?.('emoji_toggle', {
            emojiId,
            selected: newSelected.has(emojiId),
            totalSelected: newSelected.size,
        });
    }, [selectedEmojis, disabled, isCompleted, isValidating, onInteraction]);
    /**
     * Validate selection
     */
    const validateSelection = React.useCallback(() => {
        if (disabled || isCompleted || isValidating)
            return;
        setIsValidating(true);
        setAttempts(prev => prev + 1);
        // Check if selection matches correct emojis
        const correctSet = new Set(challenge.correctEmojis);
        const selectedArray = Array.from(selectedEmojis);
        const isCorrect = selectedArray.length === correctSet.size &&
            selectedArray.every(id => correctSet.has(id));
        setShowFeedback(true);
        if (isCorrect) {
            setIsCompleted(true);
            const timeSpent = Date.now() - startTime;
            setTimeout(() => {
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
        }
        else {
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
    const handleSubmit = React.useCallback(() => {
        if (selectedEmojis.size === 0)
            return;
        validateSelection();
    }, [selectedEmojis.size, validateSelection]);
    /**
     * Get emoji button class names
     */
    const getEmojiButtonStyle = (item) => {
        let style = {
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
                }
                else {
                    style.borderColor = '#ef4444';
                    style.backgroundColor = '#fee2e2';
                }
            }
            else {
                style.borderColor = '#3b82f6';
                style.backgroundColor = '#dbeafe';
            }
        }
        else {
            if (showFeedback && item.isCorrect) {
                style.borderColor = '#10b981';
                style.backgroundColor = '#f0fdf4';
            }
            else {
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
    return (React.createElement("div", { className: "nexcaptcha-emoji-selection-puzzle" },
        React.createElement("div", { className: "nexcaptcha-puzzle-instructions mb-4" },
            React.createElement("h3", { className: "text-lg font-medium text-gray-800 mb-2" }, challenge.instruction || 'Select all emojis that match the criteria'),
            React.createElement("p", { className: "text-sm text-gray-600" }, challenge.instruction)),
        React.createElement("div", { className: "nexcaptcha-emoji-grid", style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                marginBottom: '24px',
                maxWidth: '400px'
            } }, emojiItems.map(item => (React.createElement("button", { key: item.id, style: getEmojiButtonStyle(item), onClick: () => handleEmojiClick(item.id), disabled: disabled || isValidating, "aria-label": `${item.emoji} emoji${item.isSelected ? ', selected' : ''}`, title: `Category: ${item.category}` },
            item.emoji,
            showFeedback && item.isSelected && (React.createElement("div", { className: "absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs" }, item.isCorrect ? (React.createElement("span", { className: "text-green-600" }, "\u2713")) : (React.createElement("span", { className: "text-red-600" }, "\u2717")))))))),
        React.createElement("div", { className: "nexcaptcha-puzzle-controls" },
            React.createElement("div", { className: "flex items-center justify-between mb-4" },
                React.createElement("div", { className: "text-sm text-gray-600" },
                    "Selected: ",
                    progressInfo.selectedCount,
                    " / ",
                    progressInfo.requiredCount,
                    attempts > 0 && (React.createElement("span", { className: "ml-2 text-gray-500" },
                        "(Attempt ",
                        attempts + 1,
                        ")"))),
                progressInfo.selectedCount > progressInfo.requiredCount && (React.createElement("div", { className: "text-sm text-orange-600" }, "Too many selected"))),
            React.createElement("div", { className: "flex gap-3" },
                React.createElement("button", { className: `nexcaptcha-submit-button px-6 py-2 rounded-md font-medium transition-colors ${progressInfo.canSubmit && !isValidating
                        ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`, onClick: handleSubmit, disabled: !progressInfo.canSubmit || isValidating }, isValidating ? 'Checking...' : 'Submit'),
                React.createElement("button", { className: "nexcaptcha-clear-button px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-400 transition-colors", onClick: () => {
                        if (disabled || isValidating)
                            return;
                        setSelectedEmojis(new Set());
                        setEmojiItems(prev => prev.map(item => ({ ...item, isSelected: false })));
                        onInteraction?.('selection_cleared', { previousCount: selectedEmojis.size });
                    }, disabled: disabled || isValidating || selectedEmojis.size === 0 }, "Clear"))),
        showFeedback && (React.createElement("div", { className: "nexcaptcha-feedback mt-4 p-3 rounded-md" }, isCompleted ? (React.createElement("div", { className: "bg-green-100 border border-green-300 text-green-800" },
            React.createElement("div", { className: "flex items-center" },
                React.createElement("span", { className: "text-green-600 mr-2" }, "\u2713"),
                React.createElement("span", { className: "font-medium" }, "Correct! Puzzle completed.")),
            React.createElement("div", { className: "text-sm mt-1" },
                "Completed in ",
                attempts,
                " attempt",
                attempts !== 1 ? 's' : ''))) : (React.createElement("div", { className: "bg-red-100 border border-red-300 text-red-800" },
            React.createElement("div", { className: "flex items-center" },
                React.createElement("span", { className: "text-red-600 mr-2" }, "\u2717"),
                React.createElement("span", { className: "font-medium" }, "Incorrect selection. Try again!")),
            React.createElement("div", { className: "text-sm mt-1" }, "Make sure to select the correct emojis")))))));
};

/**
 * Slider Puzzle Component for NexCaptcha
 * Interactive sliding puzzle where users arrange pieces to complete an image
 */
/**
 * Slider Puzzle Component
 */
const SliderPuzzle = ({ challenge, theme, onComplete, onInteraction, disabled = false, }) => {
    const [pieces, setPieces] = React.useState([]);
    const [emptyPosition, setEmptyPosition] = React.useState(0);
    const [moves, setMoves] = React.useState(0);
    const [startTime] = React.useState(Date.now());
    const [isCompleted, setIsCompleted] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const gridSizeValue = typeof challenge.gridSize === 'object' ? challenge.gridSize.width : (challenge.gridSize || 3);
    const totalPieces = gridSizeValue * gridSizeValue;
    const puzzleRef = React.useRef(null);
    /**
     * Initialize puzzle pieces
     */
    React.useEffect(() => {
        const initialPieces = [];
        // Create pieces (last piece is empty)
        for (let i = 0; i < totalPieces; i++) {
            const isEmpty = i === totalPieces - 1;
            const piece = {
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
    const getBackgroundPosition = (pieceId, size) => {
        const row = Math.floor(pieceId / size);
        const col = pieceId % size;
        const percentX = (col / (size - 1)) * 100;
        const percentY = (row / (size - 1)) * 100;
        return `${percentX}% ${percentY}%`;
    };
    /**
     * Shuffle puzzle pieces
     */
    const shufflePuzzle = (initialPieces, size) => {
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
    const getValidMoves = (position, size) => {
        const row = Math.floor(position / size);
        const col = position % size;
        const moves = [];
        // Up
        if (row > 0)
            moves.push(position - size);
        // Down
        if (row < size - 1)
            moves.push(position + size);
        // Left
        if (col > 0)
            moves.push(position - 1);
        // Right
        if (col < size - 1)
            moves.push(position + 1);
        return moves;
    };
    /**
     * Handle piece click
     */
    const handlePieceClick = React.useCallback((clickedPosition) => {
        if (disabled || isCompleted || isAnimating)
            return;
        const validMoves = getValidMoves(emptyPosition, gridSizeValue);
        if (validMoves.includes(clickedPosition)) {
            setIsAnimating(true);
            // Swap pieces
            setPieces(prev => {
                const newPieces = [...prev];
                const emptyPiece = newPieces.find(p => p.position === emptyPosition);
                const clickedPiece = newPieces.find(p => p.position === clickedPosition);
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
        }
        else {
            onInteraction?.('invalid_move', {
                clickedPosition,
                emptyPosition,
                validMoves,
            });
        }
    }, [emptyPosition, gridSizeValue, disabled, isCompleted, isAnimating, moves, onInteraction]);
    /**
     * Check if puzzle is solved
     */
    React.useEffect(() => {
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
    const getPieceStyle = (piece) => {
        const row = Math.floor(piece.position / gridSizeValue);
        const col = piece.position % gridSizeValue;
        const size = 100 / gridSizeValue;
        return {
            position: 'absolute',
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
    const getPieceClassName = (piece) => {
        let className = 'nexcaptcha-puzzle-piece border border-gray-300';
        if (piece.isEmpty) {
            className += ' bg-gray-100';
        }
        else {
            if (disabled || isCompleted) {
                className += ' cursor-default';
            }
            else {
                const validMoves = getValidMoves(emptyPosition, gridSizeValue);
                if (validMoves.includes(piece.position)) {
                    className += ' cursor-pointer hover:border-blue-400 hover:shadow-md';
                }
                else {
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
    const getCompletionPercentage = () => {
        const correctPieces = pieces.filter(p => p.position === p.correctPosition).length;
        return Math.round((correctPieces / totalPieces) * 100);
    };
    /**
     * Shuffle puzzle (reset)
     */
    const handleShuffle = React.useCallback(() => {
        if (disabled || isCompleted || isAnimating)
            return;
        const shuffledPieces = shufflePuzzle(pieces.map(p => ({ ...p, position: p.correctPosition })), gridSizeValue);
        setPieces(shuffledPieces);
        const emptyPiece = shuffledPieces.find(p => p.isEmpty);
        setEmptyPosition(emptyPiece?.position || totalPieces - 1);
        setMoves(0);
        onInteraction?.('puzzle_shuffled', { gridSize: gridSizeValue });
    }, [pieces, gridSizeValue, totalPieces, disabled, isCompleted, isAnimating, onInteraction]);
    return (React.createElement("div", { className: "nexcaptcha-slider-puzzle" },
        React.createElement("div", { className: "nexcaptcha-puzzle-instructions mb-4" },
            React.createElement("h3", { className: "text-lg font-medium text-gray-800 mb-2" }, 'Arrange the pieces to complete the image'),
            React.createElement("p", { className: "text-sm text-gray-600" }, "Click on pieces adjacent to the empty space to move them")),
        React.createElement("div", { className: "nexcaptcha-puzzle-stats flex justify-between items-center mb-4 text-sm text-gray-600" },
            React.createElement("div", null,
                "Moves: ",
                moves),
            React.createElement("div", null,
                "Progress: ",
                getCompletionPercentage(),
                "%"),
            React.createElement("button", { className: "px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors", onClick: handleShuffle, disabled: disabled || isCompleted || isAnimating }, "Shuffle")),
        React.createElement("div", { ref: puzzleRef, className: "nexcaptcha-puzzle-grid relative bg-white border-2 border-gray-300 rounded-lg overflow-hidden", style: {
                aspectRatio: '1',
                maxWidth: '400px',
                margin: '0 auto',
            } }, pieces.map(piece => (React.createElement("div", { key: piece.id, className: getPieceClassName(piece), style: getPieceStyle(piece), onClick: () => handlePieceClick(piece.position) },
            piece.isEmpty && (React.createElement("div", { className: "w-full h-full flex items-center justify-center text-gray-400 text-xs" }, "Empty")),
            !piece.isEmpty && process.env.NODE_ENV === 'development' && (React.createElement("div", { className: "absolute top-0 left-0 text-xs bg-black text-white px-1" }, piece.id)))))),
        React.createElement("div", { className: "nexcaptcha-puzzle-hint mt-4 text-center" },
            React.createElement("p", { className: "text-xs text-gray-500" }, "Tip: Green borders indicate pieces in correct positions"))));
};

/**
 * Number Sorting Puzzle Component for NexCaptcha
 * Interactive puzzle where users sort numbers in ascending or descending order
 */
/**
 * Number Sorting Puzzle Component
 */
const NumberSortingPuzzle = ({ challenge, theme, onComplete, onInteraction, disabled = false, }) => {
    const [numbers, setNumbers] = React.useState([]);
    const [selectedNumbers, setSelectedNumbers] = React.useState([]);
    const [swaps, setSwaps] = React.useState(0);
    const [startTime] = React.useState(Date.now());
    const [isCompleted, setIsCompleted] = React.useState(false);
    const [showHint, setShowHint] = React.useState(false);
    const [draggedItem, setDraggedItem] = React.useState(null);
    const [dragOverIndex, setDragOverIndex] = React.useState(null);
    /**
     * Initialize number items
     */
    React.useEffect(() => {
        const items = challenge.numbers.map((num, index) => ({
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
    const updateCorrectPositions = React.useCallback((items) => {
        const sortedValues = [...challenge.numbers].sort((a, b) => challenge.sortOrder === 'asc' ? a - b : b - a);
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
    const handleNumberClick = React.useCallback((numberId) => {
        // Disabled - only drag and drop allowed
        return;
    }, []);
    /**
     * Handle number swap
     */
    const handleSwap = React.useCallback((id1, id2) => {
        if (disabled || isCompleted)
            return;
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
    }, [disabled, isCompleted, swaps, onInteraction, updateCorrectPositions]);
    /**
     * Handle drag start
     */
    const handleDragStart = React.useCallback((e, numberId) => {
        if (disabled || isCompleted)
            return;
        setDraggedItem(numberId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', numberId);
        onInteraction?.('drag_start', { numberId });
    }, [disabled, isCompleted, onInteraction]);
    /**
     * Handle drag over
     */
    const handleDragOver = React.useCallback((e, index) => {
        if (disabled || isCompleted)
            return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    }, [disabled, isCompleted]);
    /**
     * Handle drop
     */
    const handleDrop = React.useCallback((e, targetIndex) => {
        if (disabled || isCompleted)
            return;
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
    }, [numbers, disabled, isCompleted, handleSwap, onInteraction]);
    /**
     * Handle drag leave
     */
    const handleDragLeave = React.useCallback(() => {
        setDragOverIndex(null);
    }, []);
    /**
     * Get number item class names
     */
    const getNumberClassName = (item, index) => {
        let className = 'nexcaptcha-number-item w-20 h-20 flex items-center justify-center text-xl font-bold border-2 rounded-lg transition-all duration-200 select-none relative';
        if (disabled || isCompleted) {
            className += ' cursor-not-allowed opacity-75';
        }
        else {
            className += ' cursor-grab hover:scale-105 hover:shadow-lg';
        }
        if (item.isCorrectPosition) {
            className += ' border-green-500 bg-green-100 text-green-800';
        }
        else {
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
     * Get progress percentage
     */
    const getProgressPercentage = () => {
        const correctCount = numbers.filter(n => n.isCorrectPosition).length;
        return Math.round((correctCount / numbers.length) * 100);
    };
    /**
     * Reset puzzle
     */
    const handleReset = React.useCallback(() => {
        if (disabled || isCompleted)
            return;
        // Shuffle numbers
        const shuffled = [...challenge.numbers].sort(() => Math.random() - 0.5);
        const resetItems = shuffled.map((num, index) => ({
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
    return (React.createElement("div", { className: "nexcaptcha-number-sorting-puzzle" },
        React.createElement("div", { className: "nexcaptcha-puzzle-instructions mb-4" },
            React.createElement("h3", { className: "text-lg font-medium text-gray-800 mb-2" }, "Sort the numbers in ascending order"),
            React.createElement("p", { className: "text-sm text-gray-600" }, "Drag and drop the numbers to arrange them from smallest to largest")),
        React.createElement("div", { className: "nexcaptcha-puzzle-stats flex justify-between items-center mb-4 text-sm text-gray-600" },
            React.createElement("div", null,
                "Swaps: ",
                swaps),
            React.createElement("div", null,
                "Progress: ",
                getProgressPercentage(),
                "%"),
            React.createElement("div", { className: "flex gap-2" },
                React.createElement("button", { className: "px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors", onClick: () => setShowHint(!showHint), disabled: disabled || isCompleted },
                    showHint ? 'Hide' : 'Show',
                    " Hint"),
                React.createElement("button", { className: "px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors", onClick: handleReset, disabled: disabled || isCompleted }, "Reset"))),
        showHint && (React.createElement("div", { className: "nexcaptcha-hint mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md" },
            React.createElement("p", { className: "text-sm text-blue-800" },
                "Target order: ",
                [...challenge.numbers]
                    .sort((a, b) => challenge.sortOrder === 'asc' ? a - b : b - a)
                    .join(' → ')))),
        React.createElement("div", { className: "nexcaptcha-numbers-container" },
            React.createElement("div", { className: "flex flex-wrap gap-3 justify-center mb-4" }, numbers.map((item, index) => (React.createElement("div", { key: item.id, className: getNumberClassName(item, index), onClick: () => handleNumberClick(item.id), draggable: !disabled && !isCompleted, onDragStart: (e) => handleDragStart(e, item.id), onDragOver: (e) => handleDragOver(e, index), onDrop: (e) => handleDrop(e, index), onDragLeave: handleDragLeave, title: `Number ${item.value}${item.isCorrectPosition ? ' (correct position)' : ''}` },
                item.value,
                item.isCorrectPosition && (React.createElement("div", { className: "absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center" },
                    React.createElement("span", { className: "text-white text-xs" }, "\u2713"))))))),
            React.createElement("div", { className: "text-center text-sm text-gray-500 mb-4" }, "Drag the numbers to sort them in ascending order"))));
};

/**
 * Audio Matching Puzzle Component for NexCaptcha
 * Interactive puzzle where users listen to animal sounds and choose the correct animal
 */
/**
 * Audio Matching Puzzle Component
 */
const AudioMatchingPuzzle = ({ challenge, theme, onComplete, onInteraction, disabled = false, }) => {
    const [animalSounds, setAnimalSounds] = React.useState([]);
    const [animalOptions, setAnimalOptions] = React.useState([]);
    const [currentAudioId, setCurrentAudioId] = React.useState(null);
    const [selectedAnimal, setSelectedAnimal] = React.useState(null);
    const [currentSoundIndex, setCurrentSoundIndex] = React.useState(0);
    const [attempts, setAttempts] = React.useState(0);
    const [startTime] = React.useState(Date.now());
    const [isCompleted, setIsCompleted] = React.useState(false);
    const [showFeedback, setShowFeedback] = React.useState(false);
    const [audioLoadingStates, setAudioLoadingStates] = React.useState(new Map());
    const audioRefs = React.useRef(new Map());
    const [volume, setVolume] = React.useState(0.7);
    const [correctAnswers, setCorrectAnswers] = React.useState(0);
    const [selectedMatches, setSelectedMatches] = React.useState(new Map());
    const [matchOptions, setMatchOptions] = React.useState([]);
    /**
     * Initialize animal sounds and options
     */
    React.useEffect(() => {
        // Define animal sounds with their corresponding audio files
        const sounds = [
            {
                id: 'sound-1',
                audioUrl: '/assets/audio/birds/red-parrot.mp3',
                animalName: 'Bird',
                isPlaying: false,
                hasBeenPlayed: false,
            },
            {
                id: 'sound-2',
                audioUrl: '/assets/audio/farm-animals/cow.mp3',
                animalName: 'Cow',
                isPlaying: false,
                hasBeenPlayed: false,
            },
            {
                id: 'sound-3',
                audioUrl: '/assets/audio/jungle-animals/lion.mp3',
                animalName: 'Lion',
                isPlaying: false,
                hasBeenPlayed: false,
            }
        ];
        // Define animal options with emojis
        const options = [
            { id: 'bird', name: 'Bird', emoji: '🦜', isSelected: false, isCorrect: false },
            { id: 'cow', name: 'Cow', emoji: '🐄', isSelected: false, isCorrect: false },
            { id: 'lion', name: 'Lion', emoji: '🦁', isSelected: false, isCorrect: false },
            { id: 'dog', name: 'Dog', emoji: '🐕', isSelected: false, isCorrect: false },
            { id: 'cat', name: 'Cat', emoji: '🐱', isSelected: false, isCorrect: false },
            { id: 'duck', name: 'Duck', emoji: '🦆', isSelected: false, isCorrect: false },
        ];
        // Shuffle options for better security
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        setAnimalSounds(sounds);
        setAnimalOptions(shuffledOptions);
        // Preload audio files
        sounds.forEach(sound => {
            const audio = new Audio(sound.audioUrl);
            audio.preload = 'auto';
            audio.volume = volume;
            audio.addEventListener('loadstart', () => {
                setAudioLoadingStates(prev => new Map(prev.set(sound.id, true)));
            });
            audio.addEventListener('canplaythrough', () => {
                setAudioLoadingStates(prev => new Map(prev.set(sound.id, false)));
            });
            audio.addEventListener('error', () => {
                console.error(`Failed to load audio: ${sound.audioUrl}`);
                setAudioLoadingStates(prev => new Map(prev.set(sound.id, false)));
            });
            audioRefs.current.set(sound.id, audio);
        });
        return () => {
            // Cleanup audio elements
            audioRefs.current.forEach(audio => {
                audio.pause();
                audio.src = '';
            });
            audioRefs.current.clear();
        };
    }, [volume]);
    /**
     * Play animal sound
     */
    const playAnimalSound = React.useCallback(async (soundId) => {
        if (disabled || isCompleted)
            return;
        const audio = audioRefs.current.get(soundId);
        if (!audio)
            return;
        try {
            // Stop any currently playing audio
            audioRefs.current.forEach((audioElement, id) => {
                if (id !== soundId && !audioElement.paused) {
                    audioElement.pause();
                    audioElement.currentTime = 0;
                }
            });
            // Update playing states
            setAnimalSounds(prev => prev.map(sound => ({
                ...sound,
                isPlaying: sound.id === soundId,
                hasBeenPlayed: sound.id === soundId ? true : sound.hasBeenPlayed,
            })));
            setCurrentAudioId(soundId);
            // Play audio
            audio.currentTime = 0;
            await audio.play();
            // Handle audio end
            const handleEnded = () => {
                setAnimalSounds(prev => prev.map(sound => sound.id === soundId ? { ...sound, isPlaying: false } : sound));
                setCurrentAudioId(null);
                audio.removeEventListener('ended', handleEnded);
            };
            audio.addEventListener('ended', handleEnded);
            onInteraction?.('audio_played', {
                soundId,
                duration: audio.duration,
                currentTime: audio.currentTime,
            });
        }
        catch (error) {
            console.error('Error playing audio:', error);
            setAnimalSounds(prev => prev.map(sound => sound.id === soundId ? { ...sound, isPlaying: false } : sound));
            setCurrentAudioId(null);
        }
    }, [disabled, isCompleted, onInteraction]);
    /**
     * Stop audio playback
     */
    const stopAudio = React.useCallback((soundId) => {
        const audio = audioRefs.current.get(soundId);
        if (audio && !audio.paused) {
            audio.pause();
            audio.currentTime = 0;
            setAnimalSounds(prev => prev.map(sound => sound.id === soundId ? { ...sound, isPlaying: false } : sound));
            setCurrentAudioId(null);
            onInteraction?.('audio_stopped', { soundId });
        }
    }, [onInteraction]);
    /**
     * Handle animal selection
     */
    const handleAnimalSelection = React.useCallback((animalId) => {
        if (disabled || isCompleted)
            return;
        const currentSound = animalSounds[currentSoundIndex];
        if (!currentSound)
            return;
        setSelectedAnimal(animalId);
        setAttempts(prev => prev + 1);
        // Check if selection is correct
        const isCorrect = animalId.toLowerCase() === currentSound.animalName.toLowerCase();
        setAnimalOptions(prev => prev.map(option => ({
            ...option,
            isSelected: option.id === animalId,
            isCorrect: option.id === animalId ? isCorrect : false,
        })));
        setShowFeedback(true);
        onInteraction?.('animal_selected', {
            animalId,
            soundId: currentSound.id,
            isCorrect,
            attempts,
        });
        // Move to next sound or complete puzzle
        setTimeout(() => {
            if (isCorrect) {
                setCorrectAnswers(prev => prev + 1);
                if (currentSoundIndex < animalSounds.length - 1) {
                    // Move to next sound
                    setCurrentSoundIndex(prev => prev + 1);
                    setSelectedAnimal(null);
                    setShowFeedback(false);
                    setAnimalOptions(prev => prev.map(option => ({
                        ...option,
                        isSelected: false,
                        isCorrect: false,
                    })));
                }
                else {
                    // All sounds completed
                    setIsCompleted(true);
                    const timeSpent = Date.now() - startTime;
                    onComplete({
                        success: true,
                        timeSpent,
                        attempts: attempts + 1,
                    });
                }
            }
            else {
                // Reset for retry
                setSelectedAnimal(null);
                setShowFeedback(false);
                setAnimalOptions(prev => prev.map(option => ({
                    ...option,
                    isSelected: false,
                    isCorrect: false,
                })));
            }
        }, 2000);
    }, [disabled, isCompleted, animalSounds, currentSoundIndex, attempts, startTime, onComplete, onInteraction]);
    /**
     * Handle match selection
     */
    React.useCallback((audioId, optionId) => {
        if (disabled || isCompleted)
            return;
        const newMatches = new Map(selectedMatches);
        // Remove previous match for this audio if exists
        const previousMatch = newMatches.get(audioId);
        if (previousMatch) {
            setMatchOptions(prev => prev.map(option => option.id === previousMatch ? { ...option, isSelected: false } : option));
        }
        // Set new match
        newMatches.set(audioId, optionId);
        setSelectedMatches(newMatches);
        // Update option selection state
        setMatchOptions(prev => prev.map(option => ({
            ...option,
            isSelected: Array.from(newMatches.values()).includes(option.id),
        })));
        onInteraction?.('match_selected', {
            audioId,
            optionId,
            totalMatches: newMatches.size,
        });
    }, [selectedMatches, disabled, isCompleted, onInteraction]);
    /**
     * Validate matches
     */
    const validateMatches = React.useCallback(() => {
        if (disabled || isCompleted)
            return;
        setAttempts(prev => prev + 1);
        setShowFeedback(true);
        // Check if all matches are correct
        let correctCount = 0;
        const totalRequired = animalSounds.length;
        animalSounds.forEach(sound => {
            const selectedMatch = selectedMatches.get(sound.id);
            if (selectedMatch === sound.animalName.toLowerCase()) {
                correctCount++;
            }
        });
        // Update match options with correct/incorrect indicators
        setMatchOptions(prev => prev.map(option => {
            const isCorrectForAnyAudio = animalSounds.some(sound => sound.animalName.toLowerCase() === option.id && selectedMatches.get(sound.id) === option.id);
            return {
                ...option,
                isCorrect: isCorrectForAnyAudio,
            };
        }));
        const isAllCorrect = correctCount === totalRequired;
        if (isAllCorrect) {
            setIsCompleted(true);
            const timeSpent = Date.now() - startTime;
            setTimeout(() => {
                onComplete({
                    success: true,
                    timeSpent,
                    attempts,
                });
                onInteraction?.('puzzle_completed', {
                    timeSpent,
                    attempts,
                    correctMatches: correctCount,
                    totalAnimalSounds: totalRequired,
                });
            }, 1500);
        }
        else {
            onInteraction?.('validation_failed', {
                correctMatches: correctCount,
                totalRequired,
                attempts,
            });
            // Reset after showing feedback
            setTimeout(() => {
                setShowFeedback(false);
                setSelectedMatches(new Map());
                setMatchOptions(prev => prev.map(option => ({
                    ...option,
                    isSelected: false,
                    isCorrect: false,
                })));
            }, 3000);
        }
    }, [animalSounds, selectedMatches, disabled, isCompleted, startTime, attempts, onComplete, onInteraction]);
    /**
     * Handle submit
     */
    React.useCallback(() => {
        if (selectedMatches.size !== animalSounds.length)
            return;
        validateMatches();
    }, [selectedMatches.size, animalSounds.length, validateMatches]);
    /**
     * Update volume
     */
    React.useCallback((newVolume) => {
        setVolume(newVolume);
        audioRefs.current.forEach(audio => {
            audio.volume = newVolume;
        });
    }, []);
    const currentSound = animalSounds[currentSoundIndex];
    const progressText = `${currentSoundIndex + 1} of ${animalSounds.length}`;
    return (React.createElement("div", { className: "nexcaptcha-audio-matching-puzzle", style: {
            padding: '20px',
            border: `1px solid ${theme?.borderColor || '#e2e8f0'}`,
            borderRadius: theme?.borderRadius || '8px',
            backgroundColor: theme?.backgroundColor || '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
        } },
        React.createElement("div", { className: "nexcaptcha-puzzle-instructions", style: { marginBottom: '16px' } },
            React.createElement("h3", { style: {
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '8px',
                    margin: '0 0 8px 0'
                } }, "Click on the sound that matches the instruction"),
            React.createElement("p", { style: {
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '0'
                } },
                "Listen to the sound and choose the correct animal (",
                progressText,
                ")")),
        currentSound && (React.createElement("div", { style: {
                marginBottom: '20px',
                padding: '16px',
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                textAlign: 'center',
                backgroundColor: '#f9fafb'
            } },
            React.createElement("div", { style: { marginBottom: '12px', fontSize: '16px', fontWeight: '500' } }, "What animal makes this sound?"),
            React.createElement("button", { onClick: () => currentSound.isPlaying ? stopAudio(currentSound.id) : playAnimalSound(currentSound.id), disabled: disabled || isCompleted, style: {
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: currentSound.isPlaying ? '#ef4444' : theme?.primaryColor || '#3b82f6',
                    color: 'white',
                    fontSize: '24px',
                    cursor: disabled || isCompleted ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    transition: 'all 0.2s ease',
                    opacity: disabled || isCompleted ? 0.5 : 1
                }, onMouseOver: (e) => {
                    if (!disabled && !isCompleted) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }
                }, onMouseOut: (e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                } }, currentSound.isPlaying ? '⏹' : '🔊'),
            React.createElement("div", { style: { marginTop: '8px', fontSize: '12px', color: '#6b7280' } }, currentSound.isPlaying ? 'Playing...' : 'Click here (audio-matching)'))),
        React.createElement("div", { style: { marginBottom: '20px' } },
            React.createElement("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px'
                } }, animalOptions.map(option => {
                let buttonStyle = {
                    padding: '16px',
                    border: '2px solid',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: disabled || isCompleted ? 'not-allowed' : 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    opacity: disabled || isCompleted ? 0.5 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                };
                if (showFeedback) {
                    if (option.isSelected && option.isCorrect) {
                        buttonStyle.borderColor = '#10b981';
                        buttonStyle.backgroundColor = '#d1fae5';
                    }
                    else if (option.isSelected && !option.isCorrect) {
                        buttonStyle.borderColor = '#ef4444';
                        buttonStyle.backgroundColor = '#fee2e2';
                    }
                    else {
                        buttonStyle.borderColor = '#d1d5db';
                    }
                }
                else {
                    if (option.isSelected) {
                        buttonStyle.borderColor = theme?.primaryColor || '#3b82f6';
                        buttonStyle.backgroundColor = '#dbeafe';
                    }
                    else {
                        buttonStyle.borderColor = '#d1d5db';
                    }
                }
                return (React.createElement("button", { key: option.id, onClick: () => handleAnimalSelection(option.id), disabled: disabled || isCompleted || showFeedback, style: buttonStyle, onMouseOver: (e) => {
                        if (!disabled && !isCompleted && !showFeedback) {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.borderColor = theme?.primaryColor || '#3b82f6';
                        }
                    }, onMouseOut: (e) => {
                        if (!disabled && !isCompleted && !showFeedback) {
                            e.currentTarget.style.transform = 'scale(1)';
                            if (!option.isSelected) {
                                e.currentTarget.style.borderColor = '#d1d5db';
                            }
                        }
                    } },
                    React.createElement("div", { style: { fontSize: '32px' } }, option.emoji),
                    React.createElement("div", { style: {
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#374151'
                        } }, option.name),
                    showFeedback && option.isSelected && (React.createElement("div", { style: {
                            fontSize: '12px',
                            color: option.isCorrect ? '#10b981' : '#ef4444',
                            fontWeight: '500'
                        } }, option.isCorrect ? '✓ Correct!' : '✗ Wrong'))));
            }))),
        React.createElement("div", { style: { marginBottom: '16px' } },
            React.createElement("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '8px'
                } },
                React.createElement("span", null,
                    "Attempts: ",
                    attempts),
                React.createElement("span", null,
                    "Progress: ",
                    currentSoundIndex + 1,
                    "/",
                    animalSounds.length)),
            showFeedback && !isCompleted && (React.createElement("div", { style: {
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '6px',
                    textAlign: 'center'
                } },
                React.createElement("div", { style: {
                        fontSize: '14px',
                        color: '#374151',
                        marginBottom: '8px'
                    } }, selectedAnimal && animalOptions.find(opt => opt.id === selectedAnimal)?.isCorrect
                    ? 'Great! Moving to next sound...'
                    : 'Try again!'))))));
};

/**
 * Challenge Manager - Modular challenge selection and generation
 * Handles all challenge-related logic separately from the main component
 */
/**
 * Challenge Manager Class
 * Handles challenge selection, generation, and validation
 */
class ChallengeManager {
    constructor(config = {}) {
        this.config = config;
        this.availableTypes = config.enabledTypes || [
            'center-click',
            'drag-drop',
            'emoji-selection',
            'slider',
            'number-sorting',
            'audio-matching'
        ];
    }
    /**
     * Get a random challenge type
     */
    getRandomChallengeType() {
        // If a specific type is forced, return it
        if (this.config.forceType) {
            console.log('Forced challenge type:', this.config.forceType);
            return this.config.forceType;
        }
        // Select random from available types
        const randomIndex = Math.floor(Math.random() * this.availableTypes.length);
        const selectedType = this.availableTypes[randomIndex];
        console.log('Available challenge types:', this.availableTypes);
        console.log('Random index:', randomIndex);
        console.log('Selected challenge type:', selectedType);
        return selectedType;
    }
    /**
     * Generate challenge data for a specific type
     */
    generateChallengeData(challengeType) {
        console.log('Generating challenge data for:', challengeType);
        switch (challengeType) {
            case 'center-click':
                return null; // No data needed for center-click
            case 'drag-drop':
                return this.generateDragDropData();
            case 'emoji-selection':
                return this.generateEmojiSelectionData();
            case 'slider':
                return this.generateSliderData();
            case 'number-sorting':
                return this.generateNumberSortingData();
            case 'audio-matching':
                return this.generateAudioMatchingData();
            default:
                console.warn('Unknown challenge type:', challengeType);
                return null;
        }
    }
    /**
     * Generate drag-drop challenge data (puzzle piece fitting)
     */
    generateDragDropData() {
        return {
            puzzlePieces: [
                { id: 'piece1', shape: 'circle', color: '#ff6b6b', position: { x: 50, y: 50 }, rotation: 0, isDragging: false, isPlaced: false },
                { id: 'piece2', shape: 'square', color: '#4ecdc4', position: { x: 150, y: 50 }, rotation: 0, isDragging: false, isPlaced: false },
                { id: 'piece3', shape: 'triangle', color: '#45b7d1', position: { x: 250, y: 50 }, rotation: 0, isDragging: false, isPlaced: false }
            ],
            puzzleSlots: [
                { id: 'slot1', shape: 'circle', position: { x: 80, y: 180 }, size: { width: 80, height: 80 }, expectedPieceId: 'piece1', hasItem: false },
                { id: 'slot2', shape: 'square', position: { x: 180, y: 180 }, size: { width: 80, height: 80 }, expectedPieceId: 'piece2', hasItem: false },
                { id: 'slot3', shape: 'triangle', position: { x: 280, y: 180 }, size: { width: 80, height: 80 }, expectedPieceId: 'piece3', hasItem: false }
            ]
        };
    }
    /**
     * Generate emoji selection challenge data
     */
    generateEmojiSelectionData() {
        return {
            instruction: 'Select all animals',
            emojis: [
                { id: '1', emoji: '🐶', category: 'animal' },
                { id: '2', emoji: '🚗', category: 'vehicle' },
                { id: '3', emoji: '🐱', category: 'animal' },
                { id: '4', emoji: '🏠', category: 'building' },
                { id: '5', emoji: '🐭', category: 'animal' },
                { id: '6', emoji: '🌳', category: 'nature' },
                { id: '7', emoji: '🐸', category: 'animal' },
                { id: '8', emoji: '📱', category: 'technology' }
            ],
            correctEmojis: ['1', '3', '5', '7'],
            maxSelections: 4
        };
    }
    /**
     * Generate slider puzzle challenge data
     */
    generateSliderData() {
        return {
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyMCI+U2xpZGVyIFB1enpsZTwvdGV4dD48L3N2Zz4=',
            pieces: [
                { id: '1', currentPosition: { x: 0, y: 0 }, correctPosition: { x: 0, y: 0 }, imageData: '' },
                { id: '2', currentPosition: { x: 100, y: 0 }, correctPosition: { x: 100, y: 0 }, imageData: '' },
                { id: '3', currentPosition: { x: 200, y: 0 }, correctPosition: { x: 200, y: 0 }, imageData: '' },
                { id: '4', currentPosition: { x: 0, y: 100 }, correctPosition: { x: 0, y: 100 }, imageData: '' },
                { id: '5', currentPosition: { x: 200, y: 100 }, correctPosition: { x: 100, y: 100 }, imageData: '' },
                { id: '6', currentPosition: { x: 100, y: 100 }, correctPosition: { x: 200, y: 100 }, imageData: '' },
                { id: '7', currentPosition: { x: 0, y: 200 }, correctPosition: { x: 0, y: 200 }, imageData: '' },
                { id: '8', currentPosition: { x: 100, y: 200 }, correctPosition: { x: 100, y: 200 }, imageData: '' },
                { id: '9', currentPosition: { x: 200, y: 200 }, correctPosition: { x: 200, y: 200 }, imageData: '' }
            ],
            gridSize: { width: 3, height: 3 },
            tolerance: 10
        };
    }
    /**
     * Generate number sorting challenge data
     */
    generateNumberSortingData() {
        // Generate 3 random numbers between 1-9 for simpler drag-and-drop sorting
        const numbers = [];
        while (numbers.length < 3) {
            const num = Math.floor(Math.random() * 9) + 1;
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        return {
            numbers: numbers,
            sortOrder: 'asc',
            timeLimit: 30000
        };
    }
    /**
     * Generate audio matching challenge data (animal sounds)
     */
    generateAudioMatchingData() {
        const animalSounds = [
            { id: 'cat', url: '/assets/audio/farm-animals/cat.mp3', category: 'cat', duration: 2000 },
            { id: 'cow', url: '/assets/audio/farm-animals/cow.mp3', category: 'cow', duration: 2000 },
            { id: 'dog', url: '/assets/audio/farm-animals/dog.mp3', category: 'dog', duration: 2000 },
            { id: 'duck', url: '/assets/audio/farm-animals/duck.mp3', category: 'duck', duration: 2000 },
            { id: 'lion', url: '/assets/audio/jungle-animals/lion.mp3', category: 'lion', duration: 2000 },
            { id: 'tiger', url: '/assets/audio/jungle-animals/tiger.mp3', category: 'tiger', duration: 2000 }
        ];
        // Randomly select 3 animal sounds for the challenge
        const shuffled = [...animalSounds].sort(() => Math.random() - 0.5);
        const selectedSounds = shuffled.slice(0, 3);
        return {
            audioFiles: selectedSounds,
            categories: selectedSounds.map(sound => sound.category),
            correctMappings: selectedSounds.reduce((acc, sound) => {
                acc[sound.id] = sound.category;
                return acc;
            }, {}),
            animalSounds: selectedSounds,
            animalOptions: [
                { id: 'cat', name: 'Cat', emoji: '🐱' },
                { id: 'cow', name: 'Cow', emoji: '🐄' },
                { id: 'dog', name: 'Dog', emoji: '🐶' },
                { id: 'duck', name: 'Duck', emoji: '🦆' },
                { id: 'lion', name: 'Lion', emoji: '🦁' },
                { id: 'tiger', name: 'Tiger', emoji: '🐅' }
            ]
        };
    }
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        if (newConfig.enabledTypes) {
            this.availableTypes = newConfig.enabledTypes;
        }
    }
    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
}
// Export a default instance for convenience
new ChallengeManager();

/**
 * SimpleCaptcha - Streamlined CAPTCHA Component
 * A single, out-of-the-box CAPTCHA solution with embedded configuration
 */
// Embedded transient configuration - not exposed to end users
const EMBEDDED_CONFIG = {
    difficulty: 5, // High difficulty (1-5 scale)
    theme: {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
    },
};
/**
 * SimpleCaptcha Component - Google reCAPTCHA-like simplicity
 *
 * Usage:
 * ```tsx
 * import SimpleCaptcha from 'nexcaptcha';
 *
 * const handleVerify = (success: boolean) => {
 *   console.log('Verification:', success);
 * };
 *
 * <SimpleCaptcha onVerify={handleVerify} />
 * ```
 */
const SimpleCaptcha = ({ onVerify, className = '', disabled = false, }) => {
    // Initialize challenge manager
    const challengeManager = React.useRef(new ChallengeManager()).current;
    const [state, setState] = React.useState({
        isVisible: false,
        isLoading: false,
        isVerified: false,
        attempts: 0,
        startTime: 0,
        behavioralScore: 0,
        proofOfWorkCompleted: false,
        puzzleCompleted: false,
        currentChallengeType: 'center-click',
        challengeData: null,
        lastChallengeTime: 0,
    });
    const containerRef = React.useRef(null);
    const mouseMovements = React.useRef([]);
    const keystrokes = React.useRef([]);
    // Challenge generation using modular ChallengeManager
    const generateChallengeData = React.useCallback((challengeType) => {
        return challengeManager.generateChallengeData(challengeType);
    }, [challengeManager]);
    // Challenge type randomization using modular ChallengeManager
    const getRandomChallengeType = React.useCallback(() => {
        return challengeManager.getRandomChallengeType();
    }, [challengeManager]);
    // Behavioral analysis - track mouse movements and timing
    const trackMouseMovement = React.useCallback((e) => {
        if (state.isVisible && !state.isVerified) {
            mouseMovements.current.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now(),
            });
        }
    }, [state.isVisible, state.isVerified]);
    // Simple proof of work - computational challenge
    const performProofOfWork = React.useCallback(async () => {
        return new Promise((resolve) => {
            const target = Math.floor(Math.random() * 1000000);
            let nonce = 0;
            const startTime = Date.now();
            const worker = () => {
                const hash = (nonce + target).toString().split('').reduce((a, b) => {
                    a = ((a << 5) - a) + b.charCodeAt(0);
                    return a & a;
                }, 0);
                if (Math.abs(hash) % 10000 < EMBEDDED_CONFIG.difficulty * 10) {
                    resolve(Date.now() - startTime > 100); // Ensure minimum time
                }
                else {
                    nonce++;
                    if (nonce < 100000) {
                        setTimeout(worker, 0);
                    }
                    else {
                        resolve(false);
                    }
                }
            };
            worker();
        });
    }, []);
    // Simple interactive puzzle - click sequence
    const handlePuzzleInteraction = React.useCallback((event) => {
        if (state.isVerified || disabled)
            return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // Simple pattern recognition - click in specific areas
        const isValidClick = x > rect.width * 0.3 && x < rect.width * 0.7 &&
            y > rect.height * 0.3 && y < rect.height * 0.7;
        if (isValidClick) {
            setState(prev => ({ ...prev, puzzleCompleted: true }));
        }
    }, [state.isVerified, disabled]);
    // Behavioral score calculation
    const calculateBehavioralScore = React.useCallback(() => {
        const movements = mouseMovements.current;
        if (movements.length < 3)
            return 0;
        // Calculate movement smoothness and human-like patterns
        let smoothnessScore = 0;
        let timingScore = 0;
        for (let i = 1; i < movements.length; i++) {
            const prev = movements[i - 1];
            const curr = movements[i];
            const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
            const timeDiff = curr.timestamp - prev.timestamp;
            // Human-like movement patterns
            if (distance > 0 && distance < 200 && timeDiff > 10 && timeDiff < 500) {
                smoothnessScore += 1;
            }
            if (timeDiff > 50 && timeDiff < 300) {
                timingScore += 1;
            }
        }
        return Math.min(100, (smoothnessScore + timingScore) / movements.length * 100);
    }, []);
    // Main verification process
    const performVerification = React.useCallback(async () => {
        if (state.isVerified || state.isLoading || disabled)
            return;
        setState(prev => ({ ...prev, isLoading: true, startTime: Date.now() }));
        try {
            // Step 1: Behavioral analysis
            const behavioralScore = calculateBehavioralScore();
            // Step 2: Proof of work
            const proofOfWorkResult = await performProofOfWork();
            // Step 3: Check puzzle completion
            const puzzleResult = state.puzzleCompleted;
            // Calculate overall success
            const success = behavioralScore > 30 && proofOfWorkResult && puzzleResult;
            setState(prev => ({
                ...prev,
                isLoading: false,
                isVerified: success,
                behavioralScore,
                proofOfWorkCompleted: proofOfWorkResult,
                attempts: prev.attempts + 1,
            }));
            // Return simple boolean result
            onVerify?.(success);
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                attempts: prev.attempts + 1,
            }));
            onVerify?.(false);
        }
    }, [state.isVerified, state.isLoading, state.puzzleCompleted, disabled, calculateBehavioralScore, performProofOfWork, onVerify]);
    // Initialize behavioral tracking
    React.useEffect(() => {
        if (state.isVisible) {
            document.addEventListener('mousemove', trackMouseMovement);
            return () => document.removeEventListener('mousemove', trackMouseMovement);
        }
    }, [state.isVisible, trackMouseMovement]);
    // Handle checkbox click
    const handleCheckboxClick = React.useCallback(() => {
        if (disabled || state.isVerified)
            return;
        const challengeType = getRandomChallengeType();
        const challengeData = generateChallengeData(challengeType);
        // Debug logging
        console.log('Selected challenge type:', challengeType);
        console.log('Challenge data:', challengeData);
        setState(prev => ({
            ...prev,
            isVisible: true,
            isLoading: true,
            startTime: Date.now(),
            attempts: prev.attempts + 1,
            behavioralScore: 0,
            proofOfWorkCompleted: false,
            puzzleCompleted: false,
            currentChallengeType: challengeType,
            challengeData: challengeData,
            lastChallengeTime: Date.now(),
        }));
        // Start proof of work
        setTimeout(() => {
            performProofOfWork();
        }, 100);
    }, [disabled, state.isVerified, getRandomChallengeType, generateChallengeData, performProofOfWork]);
    // Reset function
    React.useCallback(() => {
        setState({
            isVisible: false,
            isLoading: false,
            isVerified: false,
            attempts: 0,
            startTime: 0,
            behavioralScore: 0,
            proofOfWorkCompleted: false,
            puzzleCompleted: false,
            currentChallengeType: 'center-click',
            challengeData: null,
            lastChallengeTime: 0,
        });
        mouseMovements.current = [];
        keystrokes.current = [];
    }, []);
    return (React.createElement("div", { ref: containerRef, className: `nexcaptcha-container ${className}`, style: {
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: EMBEDDED_CONFIG.theme.fontSize,
        } },
        React.createElement("div", { style: {
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                border: `1px solid ${EMBEDDED_CONFIG.theme.borderColor}`,
                borderRadius: EMBEDDED_CONFIG.theme.borderRadius,
                backgroundColor: EMBEDDED_CONFIG.theme.backgroundColor,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
            }, onClick: handleCheckboxClick },
            React.createElement("div", { style: {
                    width: '20px',
                    height: '20px',
                    border: `2px solid ${state.isVerified ? EMBEDDED_CONFIG.theme.primaryColor : EMBEDDED_CONFIG.theme.borderColor}`,
                    borderRadius: '3px',
                    marginRight: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: state.isVerified ? EMBEDDED_CONFIG.theme.primaryColor : 'transparent',
                    transition: 'all 0.2s ease',
                } },
                state.isLoading && (React.createElement("div", { style: {
                        width: '12px',
                        height: '12px',
                        border: '2px solid transparent',
                        borderTop: `2px solid ${EMBEDDED_CONFIG.theme.primaryColor}`,
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    } })),
                state.isVerified && !state.isLoading && (React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none" },
                    React.createElement("path", { d: "M2 6L5 9L10 3", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })))),
            React.createElement("span", { style: { color: EMBEDDED_CONFIG.theme.secondaryColor } }, "I'm not a robot")),
        state.isVisible && !state.isVerified && (React.createElement("div", { style: {
                marginTop: '8px',
                padding: '16px',
                border: `1px solid ${EMBEDDED_CONFIG.theme.borderColor}`,
                borderRadius: EMBEDDED_CONFIG.theme.borderRadius,
                backgroundColor: EMBEDDED_CONFIG.theme.backgroundColor,
            } },
            state.currentChallengeType === 'center-click' && (React.createElement(React.Fragment, null,
                React.createElement("div", { style: { marginBottom: '12px', fontSize: '14px', fontWeight: '500' } }, "Click in the center area to verify"),
                React.createElement("div", { onClick: handlePuzzleInteraction, style: {
                        width: '100%',
                        height: '120px',
                        border: `2px dashed ${EMBEDDED_CONFIG.theme.borderColor}`,
                        borderRadius: EMBEDDED_CONFIG.theme.borderRadius,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backgroundColor: state.puzzleCompleted ? '#f0f9ff' : '#fafafa',
                        transition: 'all 0.2s ease',
                    } }, state.puzzleCompleted ? (React.createElement("span", { style: { color: EMBEDDED_CONFIG.theme.primaryColor, fontWeight: '500' } }, "\u2713 Puzzle completed")) : (React.createElement("span", { style: { color: EMBEDDED_CONFIG.theme.secondaryColor } }, "Click here"))))),
            state.currentChallengeType === 'drag-drop' && state.challengeData && (React.createElement(DragDropPuzzle, { challenge: state.challengeData, theme: EMBEDDED_CONFIG.theme, onComplete: () => {
                    setState(prev => ({ ...prev, puzzleCompleted: true }));
                    setTimeout(() => performVerification(), 500);
                }, onInteraction: () => { }, disabled: state.puzzleCompleted })),
            state.currentChallengeType === 'emoji-selection' && state.challengeData && (React.createElement(EmojiSelectionPuzzle, { challenge: state.challengeData, theme: EMBEDDED_CONFIG.theme, onComplete: () => {
                    setState(prev => ({ ...prev, puzzleCompleted: true }));
                    setTimeout(() => performVerification(), 500);
                }, onInteraction: () => { }, disabled: state.puzzleCompleted })),
            state.currentChallengeType === 'slider' && state.challengeData && (React.createElement(SliderPuzzle, { challenge: state.challengeData, theme: EMBEDDED_CONFIG.theme, onComplete: () => {
                    setState(prev => ({ ...prev, puzzleCompleted: true }));
                    setTimeout(() => performVerification(), 500);
                }, onInteraction: () => { }, disabled: state.puzzleCompleted })),
            state.currentChallengeType === 'number-sorting' && state.challengeData && (React.createElement(NumberSortingPuzzle, { challenge: state.challengeData, theme: EMBEDDED_CONFIG.theme, onComplete: () => {
                    setState(prev => ({ ...prev, puzzleCompleted: true }));
                    setTimeout(() => performVerification(), 500);
                }, onInteraction: () => { }, disabled: state.puzzleCompleted })),
            state.currentChallengeType === 'audio-matching' && state.challengeData && (React.createElement(AudioMatchingPuzzle, { challenge: state.challengeData, theme: EMBEDDED_CONFIG.theme, onComplete: () => {
                    setState(prev => ({ ...prev, puzzleCompleted: true }));
                    setTimeout(() => performVerification(), 500);
                }, onInteraction: () => { }, disabled: state.puzzleCompleted })),
            state.puzzleCompleted && (React.createElement("button", { onClick: performVerification, disabled: state.isLoading, style: {
                    marginTop: '12px',
                    padding: '8px 16px',
                    backgroundColor: EMBEDDED_CONFIG.theme.primaryColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: EMBEDDED_CONFIG.theme.borderRadius,
                    cursor: state.isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: state.isLoading ? 0.6 : 1,
                } }, state.isLoading ? 'Verifying...' : 'Verify')))),
        React.createElement("style", null, `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `)));
};

/**
 * NexCaptcha - Streamlined CAPTCHA solution
 *
 * @fileoverview Simplified entry point for easy integration
 * @version 2.0.0
 * @author NexCaptcha Team
 */
// Main Component - Single export for simplicity
// Package information
const PACKAGE_INFO = {
    name: 'nexcaptcha',
    version: '2.0.0',
    description: 'Streamlined CAPTCHA solution with minimal configuration',
    author: 'NexCaptcha Team',
    license: 'MIT',
    keywords: [
        'captcha',
        'security',
        'react',
        'typescript',
        'simple',
        'streamlined',
    ],
};

exports.PACKAGE_INFO = PACKAGE_INFO;
exports.SimpleCaptcha = SimpleCaptcha;
exports.default = SimpleCaptcha;
//# sourceMappingURL=index.js.map
