/**
 * Audio Matching Puzzle Component for NexCaptcha
 * Interactive puzzle where users match audio clips to visual representations
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AudioMatchingChallengeData, CaptchaTheme } from '../../types/index';

interface AudioMatchingPuzzleProps {
  /** Challenge data containing audio clips and matching options */
  challenge: AudioMatchingChallengeData;
  /** Theme configuration for styling */
  theme?: CaptchaTheme;
  /** Callback when puzzle is completed */
  onComplete: (result: { success: boolean; timeSpent: number; attempts: number }) => void;
  /** Callback for tracking user interactions */
  onInteraction?: (event: string, data: any) => void;
  /** Whether the puzzle is disabled */
  disabled?: boolean;
}

interface AudioClip {
  id: string;
  audioUrl: string;
  correctMatchId: string;
  isPlaying: boolean;
  hasBeenPlayed: boolean;
}

interface MatchOption {
  id: string;
  label: string;
  imageUrl?: string;
  description?: string;
  isSelected: boolean;
  isCorrect: boolean;
}

/**
 * Audio Matching Puzzle Component
 */
export const AudioMatchingPuzzle: React.FC<AudioMatchingPuzzleProps> = ({
  challenge,
  theme,
  onComplete,
  onInteraction,
  disabled = false,
}) => {
  const [audioClips, setAudioClips] = useState<AudioClip[]>([]);
  const [matchOptions, setMatchOptions] = useState<MatchOption[]>([]);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const [selectedMatches, setSelectedMatches] = useState<Map<string, string>>(new Map());
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [audioLoadingStates, setAudioLoadingStates] = useState<Map<string, boolean>>(new Map());
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [volume, setVolume] = useState(0.7);

  /**
   * Initialize audio clips and match options
   */
  useEffect(() => {
    const clips: AudioClip[] = challenge.audioFiles.map(clip => ({
      id: clip.id,
      audioUrl: clip.url,
      correctMatchId: challenge.correctMappings[clip.id] || '',
      isPlaying: false,
      hasBeenPlayed: false,
    }));

    const options: MatchOption[] = challenge.categories.map((category, index) => ({
      id: `category-${index}`,
      label: category,
      imageUrl: undefined,
      description: undefined,
      isSelected: false,
      isCorrect: false,
    }));

    // Shuffle options for better security
    const shuffledOptions = [...options].sort(() => Math.random() - 0.5);

    setAudioClips(clips);
    setMatchOptions(shuffledOptions);

    // Preload audio files
    clips.forEach(clip => {
      const audio = new Audio(clip.audioUrl);
      audio.preload = 'auto';
      audio.volume = volume;
      
      audio.addEventListener('loadstart', () => {
        setAudioLoadingStates(prev => new Map(prev.set(clip.id, true)));
      });
      
      audio.addEventListener('canplaythrough', () => {
        setAudioLoadingStates(prev => new Map(prev.set(clip.id, false)));
      });
      
      audio.addEventListener('error', () => {
        console.error(`Failed to load audio: ${clip.audioUrl}`);
        setAudioLoadingStates(prev => new Map(prev.set(clip.id, false)));
      });
      
      audioRefs.current.set(clip.id, audio);
    });

    return () => {
      // Cleanup audio elements
      audioRefs.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current.clear();
    };
  }, [challenge, volume]);

  /**
   * Play audio clip
   */
  const playAudio = useCallback(
    async (clipId: string) => {
      if (disabled || isCompleted) return;

      const audio = audioRefs.current.get(clipId);
      if (!audio) return;

      try {
        // Stop any currently playing audio
        audioRefs.current.forEach((audioElement, id) => {
          if (id !== clipId && !audioElement.paused) {
            audioElement.pause();
            audioElement.currentTime = 0;
          }
        });

        // Update playing states
        setAudioClips(prev => prev.map(clip => ({
          ...clip,
          isPlaying: clip.id === clipId,
          hasBeenPlayed: clip.id === clipId ? true : clip.hasBeenPlayed,
        })));

        setCurrentAudioId(clipId);

        // Play audio
        audio.currentTime = 0;
        await audio.play();

        // Handle audio end
        const handleEnded = () => {
          setAudioClips(prev => prev.map(clip => 
            clip.id === clipId ? { ...clip, isPlaying: false } : clip
          ));
          setCurrentAudioId(null);
          audio.removeEventListener('ended', handleEnded);
        };

        audio.addEventListener('ended', handleEnded);

        onInteraction?.('audio_played', {
          clipId,
          duration: audio.duration,
          currentTime: audio.currentTime,
        });
      } catch (error) {
        console.error('Error playing audio:', error);
        setAudioClips(prev => prev.map(clip => 
          clip.id === clipId ? { ...clip, isPlaying: false } : clip
        ));
        setCurrentAudioId(null);
      }
    },
    [disabled, isCompleted, onInteraction]
  );

  /**
   * Stop audio playback
   */
  const stopAudio = useCallback(
    (clipId: string) => {
      const audio = audioRefs.current.get(clipId);
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        
        setAudioClips(prev => prev.map(clip => 
          clip.id === clipId ? { ...clip, isPlaying: false } : clip
        ));
        setCurrentAudioId(null);

        onInteraction?.('audio_stopped', { clipId });
      }
    },
    [onInteraction]
  );

  /**
   * Handle match selection
   */
  const handleMatchSelection = useCallback(
    (audioId: string, optionId: string) => {
      if (disabled || isCompleted) return;

      const newMatches = new Map(selectedMatches);
      
      // Remove previous match for this audio if exists
      const previousMatch = newMatches.get(audioId);
      if (previousMatch) {
        setMatchOptions(prev => prev.map(option => 
          option.id === previousMatch ? { ...option, isSelected: false } : option
        ));
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
    },
    [selectedMatches, disabled, isCompleted, onInteraction]
  );

  /**
   * Validate matches
   */
  const validateMatches = useCallback(() => {
    if (disabled || isCompleted) return;

    setAttempts(prev => prev + 1);
    setShowFeedback(true);

    // Check if all matches are correct
    let correctCount = 0;
    const totalRequired = audioClips.length;

    audioClips.forEach(clip => {
      const selectedMatch = selectedMatches.get(clip.id);
      if (selectedMatch === clip.correctMatchId) {
        correctCount++;
      }
    });

    // Update match options with correct/incorrect indicators
    setMatchOptions(prev => prev.map(option => {
      const isCorrectForAnyAudio = audioClips.some(clip => 
        clip.correctMatchId === option.id && selectedMatches.get(clip.id) === option.id
      );
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
          totalAudioClips: totalRequired,
        });
      }, 1500);
    } else {
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
  }, [audioClips, selectedMatches, disabled, isCompleted, startTime, attempts, onComplete, onInteraction]);

  /**
   * Handle submit
   */
  const handleSubmit = useCallback(() => {
    if (selectedMatches.size !== audioClips.length) return;
    validateMatches();
  }, [selectedMatches.size, audioClips.length, validateMatches]);

  /**
   * Update volume
   */
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    audioRefs.current.forEach(audio => {
      audio.volume = newVolume;
    });
  }, []);

  /**
   * Get audio button class names
   */
  const getAudioButtonClass = (clip: AudioClip) => {
    let className = 'nexcaptcha-audio-button flex items-center gap-3 p-3 border-2 rounded-lg transition-all duration-200';
    
    if (disabled || isCompleted) {
      className += ' cursor-not-allowed opacity-50';
    } else {
      className += ' cursor-pointer hover:shadow-md';
    }
    
    if (clip.isPlaying) {
      className += ' border-blue-500 bg-blue-100';
    } else if (clip.hasBeenPlayed) {
      className += ' border-green-300 bg-green-50';
    } else {
      className += ' border-gray-300 bg-white hover:border-gray-400';
    }
    
    return className;
  };

  /**
   * Get match option class names
   */
  const getMatchOptionClass = (option: MatchOption) => {
    let className = 'nexcaptcha-match-option p-3 border-2 rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md';
    
    if (disabled || isCompleted) {
      className += ' cursor-not-allowed opacity-50';
    }
    
    if (showFeedback) {
      if (option.isSelected && option.isCorrect) {
        className += ' border-green-500 bg-green-100';
      } else if (option.isSelected && !option.isCorrect) {
        className += ' border-red-500 bg-red-100';
      } else if (!option.isSelected && option.isCorrect) {
        className += ' border-green-300 bg-green-50';
      } else {
        className += ' border-gray-300 bg-white';
      }
    } else {
      if (option.isSelected) {
        className += ' border-blue-500 bg-blue-100';
      } else {
        className += ' border-gray-300 bg-white hover:border-gray-400';
      }
    }
    
    return className;
  };

  return (
    <div className="nexcaptcha-audio-matching-puzzle">
      <div className="nexcaptcha-puzzle-instructions mb-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          {'Listen to each audio clip and match it to the correct option'}
        </h3>
        <p className="text-sm text-gray-600">
          Click the play button to listen, then select the matching option below
        </p>
      </div>
      
      {/* Volume Control */}
      <div className="nexcaptcha-volume-control mb-4 flex items-center gap-2">
        <span className="text-sm text-gray-600">🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-xs text-gray-500">{Math.round(volume * 100)}%</span>
      </div>
      
      {/* Audio Clips */}
      <div className="nexcaptcha-audio-clips mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Audio Clips:</h4>
        <div className="space-y-3">
          {audioClips.map((clip, index) => {
            const selectedOption = selectedMatches.get(clip.id);
            const selectedOptionLabel = matchOptions.find(opt => opt.id === selectedOption)?.label;
            const isLoading = audioLoadingStates.get(clip.id) || false;
            
            return (
              <div key={clip.id} className={getAudioButtonClass(clip)}>
                <button
                  className={`nexcaptcha-play-button w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    clip.isPlaying 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => clip.isPlaying ? stopAudio(clip.id) : playAudio(clip.id)}
                  disabled={disabled || isCompleted || isLoading}
                  title={clip.isPlaying ? 'Stop' : 'Play'}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : clip.isPlaying ? (
                    '⏹'
                  ) : (
                    '▶'
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    Audio Clip {index + 1}
                  </div>
                  {selectedOptionLabel && (
                    <div className="text-sm text-gray-600">
                      Matched to: {selectedOptionLabel}
                    </div>
                  )}
                  {clip.hasBeenPlayed && (
                    <div className="text-xs text-green-600">✓ Played</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Match Options */}
      <div className="nexcaptcha-match-options mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Match Options:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {matchOptions.map(option => {
            const matchedAudioId = Array.from(selectedMatches.entries())
              .find(([_, optionId]) => optionId === option.id)?.[0];
            
            return (
              <div
                key={option.id}
                className={getMatchOptionClass(option)}
                onClick={() => {
                  if (currentAudioId && !disabled && !isCompleted) {
                    handleMatchSelection(currentAudioId, option.id);
                  }
                }}
              >
                {option.imageUrl && (
                  <img
                    src={option.imageUrl}
                    alt={option.label}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                )}
                <div className="font-medium text-sm text-gray-800">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-xs text-gray-600 mt-1">
                    {option.description}
                  </div>
                )}
                {matchedAudioId && (
                  <div className="text-xs text-blue-600 mt-1">
                    ← Audio {audioClips.findIndex(c => c.id === matchedAudioId) + 1}
                  </div>
                )}
                {showFeedback && option.isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    {option.isCorrect ? (
                      <span className="text-green-600 bg-white rounded-full w-full h-full flex items-center justify-center">✓</span>
                    ) : (
                      <span className="text-red-600 bg-white rounded-full w-full h-full flex items-center justify-center">✗</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Instructions */}
      {currentAudioId && (
        <div className="nexcaptcha-current-instruction mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            Now select the option that matches Audio Clip {audioClips.findIndex(c => c.id === currentAudioId) + 1}
          </p>
        </div>
      )}
      
      {/* Submit Button */}
      <div className="nexcaptcha-puzzle-controls">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Matched: {selectedMatches.size} / {audioClips.length}
            {attempts > 0 && (
              <span className="ml-2 text-gray-500">
                (Attempt {attempts + 1})
              </span>
            )}
          </div>
        </div>
        
        <button
          className={`nexcaptcha-submit-button px-6 py-2 rounded-md font-medium transition-colors ${
            selectedMatches.size === audioClips.length && !showFeedback
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleSubmit}
          disabled={selectedMatches.size !== audioClips.length || showFeedback}
        >
          Submit Matches
        </button>
      </div>
      
      {/* Feedback */}
      {showFeedback && (
        <div className="nexcaptcha-feedback mt-4 p-3 rounded-md">
          {isCompleted ? (
            <div className="bg-green-100 border border-green-300 text-green-800">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span className="font-medium">Perfect! All matches are correct.</span>
              </div>
            </div>
          ) : (
            <div className="bg-red-100 border border-red-300 text-red-800">
              <div className="flex items-center">
                <span className="text-red-600 mr-2">✗</span>
                <span className="font-medium">Some matches are incorrect. Try again!</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Completion Overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-green-100 bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-green-600 text-3xl mb-3">🎵</div>
            <div className="text-lg font-medium text-gray-800 mb-2">
              Audio puzzle completed!
            </div>
            <div className="text-sm text-gray-600">
              {attempts} attempt{attempts !== 1 ? 's' : ''} in {Math.round((Date.now() - startTime) / 1000)}s
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioMatchingPuzzle;