/**
 * Audio Matching Puzzle Component for NexCaptcha
 * Interactive puzzle where users listen to animal sounds and choose the correct animal
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

interface AnimalSound {
  id: string;
  audioUrl: string;
  animalName: string;
  isPlaying: boolean;
  hasBeenPlayed: boolean;
}

interface AnimalOption {
  id: string;
  name: string;
  emoji: string;
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
  const [animalSounds, setAnimalSounds] = useState<AnimalSound[]>([]);
  const [animalOptions, setAnimalOptions] = useState<AnimalOption[]>([]);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [audioLoadingStates, setAudioLoadingStates] = useState<Map<string, boolean>>(new Map());
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [volume, setVolume] = useState(0.7);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedMatches, setSelectedMatches] = useState<Map<string, string>>(new Map());
  const [matchOptions, setMatchOptions] = useState<AnimalOption[]>([]);

  /**
   * Initialize animal sounds and options
   */
  useEffect(() => {
    // Define animal sounds with their corresponding audio files
    const sounds: AnimalSound[] = [
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
    const options: AnimalOption[] = [
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
  const playAnimalSound = useCallback(
    async (soundId: string) => {
      if (disabled || isCompleted) return;

      const audio = audioRefs.current.get(soundId);
      if (!audio) return;

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
          setAnimalSounds(prev => prev.map(sound => 
            sound.id === soundId ? { ...sound, isPlaying: false } : sound
          ));
          setCurrentAudioId(null);
          audio.removeEventListener('ended', handleEnded);
        };

        audio.addEventListener('ended', handleEnded);

        onInteraction?.('audio_played', {
          soundId,
          duration: audio.duration,
          currentTime: audio.currentTime,
        });
      } catch (error) {
        console.error('Error playing audio:', error);
        setAnimalSounds(prev => prev.map(sound => 
          sound.id === soundId ? { ...sound, isPlaying: false } : sound
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
    (soundId: string) => {
      const audio = audioRefs.current.get(soundId);
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        
        setAnimalSounds(prev => prev.map(sound => 
          sound.id === soundId ? { ...sound, isPlaying: false } : sound
        ));
        setCurrentAudioId(null);

        onInteraction?.('audio_stopped', { soundId });
      }
    },
    [onInteraction]
  );

  /**
   * Handle animal selection
   */
  const handleAnimalSelection = useCallback(
    (animalId: string) => {
      if (disabled || isCompleted) return;

      const currentSound = animalSounds[currentSoundIndex];
      if (!currentSound) return;

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
          } else {
            // All sounds completed
            setIsCompleted(true);
            const timeSpent = Date.now() - startTime;
            onComplete({
              success: true,
              timeSpent,
              attempts: attempts + 1,
            });
          }
        } else {
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
    },
    [disabled, isCompleted, animalSounds, currentSoundIndex, attempts, startTime, onComplete, onInteraction]
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
    const totalRequired = animalSounds.length;

    animalSounds.forEach(sound => {
      const selectedMatch = selectedMatches.get(sound.id);
      if (selectedMatch === sound.animalName.toLowerCase()) {
        correctCount++;
      }
    });

    // Update match options with correct/incorrect indicators
    setMatchOptions(prev => prev.map(option => {
      const isCorrectForAnyAudio = animalSounds.some(sound => 
        sound.animalName.toLowerCase() === option.id && selectedMatches.get(sound.id) === option.id
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
          totalAnimalSounds: totalRequired,
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
  }, [animalSounds, selectedMatches, disabled, isCompleted, startTime, attempts, onComplete, onInteraction]);

  /**
   * Handle submit
   */
  const handleSubmit = useCallback(() => {
    if (selectedMatches.size !== animalSounds.length) return;
    validateMatches();
  }, [selectedMatches.size, animalSounds.length, validateMatches]);

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
  const getAudioButtonClass = (clip: AnimalSound) => {
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
  const getMatchOptionClass = (option: AnimalOption) => {
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

  const currentSound = animalSounds[currentSoundIndex];
  const progressText = `${currentSoundIndex + 1} of ${animalSounds.length}`;

  return (
    <div 
      className="nexcaptcha-audio-matching-puzzle"
      style={{
        padding: '20px',
        border: `1px solid ${theme?.borderColor || '#e2e8f0'}`,
        borderRadius: theme?.borderRadius || '8px',
        backgroundColor: theme?.backgroundColor || '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div className="nexcaptcha-puzzle-instructions" style={{ marginBottom: '16px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#1f2937', 
          marginBottom: '8px',
          margin: '0 0 8px 0'
        }}>
          Click on the sound that matches the instruction
        </h3>
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          margin: '0'
        }}>
          Listen to the sound and choose the correct animal ({progressText})
        </p>
      </div>
      
      {/* Current Sound Player */}
      {currentSound && (
        <div style={{
          marginBottom: '20px',
          padding: '16px',
          border: '2px dashed #d1d5db',
          borderRadius: '8px',
          textAlign: 'center',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '500' }}>
            What animal makes this sound?
          </div>
          <button
            onClick={() => currentSound.isPlaying ? stopAudio(currentSound.id) : playAnimalSound(currentSound.id)}
            disabled={disabled || isCompleted}
            style={{
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
            }}
            onMouseOver={(e) => {
              if (!disabled && !isCompleted) {
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {currentSound.isPlaying ? '⏹' : '🔊'}
          </button>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
            {currentSound.isPlaying ? 'Playing...' : 'Click here (audio-matching)'}
          </div>
        </div>
      )}
      
      {/* Animal Options */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px'
        }}>
          {animalOptions.map(option => {
            let buttonStyle: React.CSSProperties = {
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
              } else if (option.isSelected && !option.isCorrect) {
                buttonStyle.borderColor = '#ef4444';
                buttonStyle.backgroundColor = '#fee2e2';
              } else {
                buttonStyle.borderColor = '#d1d5db';
              }
            } else {
              if (option.isSelected) {
                buttonStyle.borderColor = theme?.primaryColor || '#3b82f6';
                buttonStyle.backgroundColor = '#dbeafe';
              } else {
                buttonStyle.borderColor = '#d1d5db';
              }
            }
            
            return (
              <button
                key={option.id}
                onClick={() => handleAnimalSelection(option.id)}
                disabled={disabled || isCompleted || showFeedback}
                style={buttonStyle}
                onMouseOver={(e) => {
                  if (!disabled && !isCompleted && !showFeedback) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.borderColor = theme?.primaryColor || '#3b82f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (!disabled && !isCompleted && !showFeedback) {
                    e.currentTarget.style.transform = 'scale(1)';
                    if (!option.isSelected) {
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }
                  }
                }}
              >
                <div style={{ fontSize: '32px' }}>{option.emoji}</div>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {option.name}
                </div>
                {showFeedback && option.isSelected && (
                  <div style={{
                    fontSize: '12px',
                    color: option.isCorrect ? '#10b981' : '#ef4444',
                    fontWeight: '500'
                  }}>
                    {option.isCorrect ? '✓ Correct!' : '✗ Wrong'}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Progress and Status */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '8px'
        }}>
          <span>Attempts: {attempts}</span>
          <span>Progress: {currentSoundIndex + 1}/{animalSounds.length}</span>
        </div>
        

        
        {showFeedback && !isCompleted && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#374151',
              marginBottom: '8px'
            }}>
              {selectedAnimal && animalOptions.find(opt => opt.id === selectedAnimal)?.isCorrect 
                ? 'Great! Moving to next sound...' 
                : 'Try again!'}
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default AudioMatchingPuzzle;