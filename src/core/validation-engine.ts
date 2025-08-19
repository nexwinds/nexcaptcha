/**
 * Core validation engine for NexCaptcha
 * Handles challenge generation, validation, and scoring
 */

import {
  CaptchaConfig,
  ChallengeData,
  ChallengeType,
  CaptchaResult,
  ValidationResult,
  SecurityLayer,
  DragDropPuzzle,
  EmojiSelectionPuzzle,
  SliderPuzzle,
  NumberSortingPuzzle,
  AudioMatchingPuzzle,
  ProofOfWorkChallenge,
} from '../types';

/**
 * Main validation engine class
 */
export class ValidationEngine {
  private config: CaptchaConfig;
  private securityLayers: SecurityLayer[];
  private challengeHistory: ChallengeData[];

  constructor(config: CaptchaConfig) {
    this.config = config;
    this.securityLayers = [];
    this.challengeHistory = [];
    this.initializeSecurityLayers();
  }

  /**
   * Initialize security layers based on configuration
   */
  private initializeSecurityLayers(): void {
    if (this.config.enableBehavioralAnalysis) {
      this.securityLayers.push({
        name: 'behavioral',
        weight: 0.3,
        validate: this.validateBehavioral.bind(this),
      });
    }

    if (this.config.enableProofOfWork) {
      this.securityLayers.push({
        name: 'proof-of-work',
        weight: 0.3,
        validate: this.validateProofOfWork.bind(this),
      });
    }

    if (this.config.enableInteractivePuzzles) {
      this.securityLayers.push({
        name: 'interactive',
        weight: 0.4,
        validate: this.validateInteractive.bind(this),
      });
    }
  }

  /**
   * Generate a new challenge based on configuration
   */
  public generateChallenge(): ChallengeData {
    const challengeTypes = this.getAvailableChallengeTypes();
    const randomType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    
    const challenge: ChallengeData = {
      id: this.generateChallengeId(),
      type: randomType,
      difficulty: this.config.difficulty || 3,
      data: this.generateChallengeData(randomType),
      timeLimit: this.calculateTimeLimit(randomType),
      attempts: 0,
      maxAttempts: 3,
    };

    this.challengeHistory.push(challenge);
    return challenge;
  }

  /**
   * Validate a challenge response
   */
  public async validateChallenge(
    challengeId: string,
    response: any,
    metadata?: any
  ): Promise<CaptchaResult> {
    const challenge = this.challengeHistory.find(c => c.id === challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    const startTime = Date.now();
    const validationResults: ValidationResult[] = [];

    // Validate with all applicable security layers
    for (const layer of this.securityLayers) {
      try {
        const result = await layer.validate({
          challenge,
          response,
          metadata,
        });
        validationResults.push(result);
      } catch (error) {
        console.error(`Validation error in layer ${layer.name}:`, error);
        validationResults.push({
          isValid: false,
          score: 0,
          confidence: 0,
          reasons: [`Layer ${layer.name} validation failed`],
        });
      }
    }

    const timeSpent = Date.now() - startTime;
    const finalScore = this.calculateFinalScore(validationResults);
    const success = finalScore >= 0.7; // 70% threshold

    return {
      success,
      challengeId,
      score: finalScore,
      timeSpent,
      behavioralScore: this.getLayerScore(validationResults, 'behavioral'),
      proofOfWorkScore: this.getLayerScore(validationResults, 'proof-of-work'),
      interactiveScore: this.getLayerScore(validationResults, 'interactive'),
      metadata: {
        validationResults,
        challenge,
      },
    };
  }

  /**
   * Get available challenge types based on configuration
   */
  private getAvailableChallengeTypes(): ChallengeType[] {
    const types: ChallengeType[] = [];

    if (this.config.enableInteractivePuzzles) {
      types.push('drag-drop', 'emoji-selection', 'slider', 'number-sorting', 'audio-matching');
    }

    if (this.config.enableProofOfWork) {
      types.push('proof-of-work');
    }

    if (this.config.enableBehavioralAnalysis) {
      types.push('behavioral');
    }

    return types.length > 0 ? types : ['drag-drop']; // Default fallback
  }

  /**
   * Generate challenge-specific data
   */
  private generateChallengeData(type: ChallengeType): any {
    switch (type) {
      case 'drag-drop':
        return this.generateDragDropData();
      case 'emoji-selection':
        return this.generateEmojiSelectionData();
      case 'slider':
        return this.generateSliderPuzzleData();
      case 'number-sorting':
        return this.generateNumberSortingData();
      case 'audio-matching':
        return this.generateAudioMatchingData();
      case 'proof-of-work':
        return this.generateProofOfWorkData();
      case 'behavioral':
        return this.generateBehavioralData();
      default:
        throw new Error(`Unknown challenge type: ${type}`);
    }
  }

  /**
   * Generate drag-drop puzzle data
   */
  private generateDragDropData(): DragDropPuzzle {
    const categories = ['Animals', 'Colors', 'Shapes', 'Numbers'];
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const items = this.generateItemsForCategory(selectedCategory);
    const targets = this.generateTargetsForCategory(selectedCategory);
    const correctMappings = this.generateCorrectMappings(items, targets);

    return { items, targets, correctMappings };
  }

  /**
   * Generate emoji selection puzzle data
   */
  private generateEmojiSelectionData(): EmojiSelectionPuzzle {
    const categories = ['animals', 'food', 'vehicles', 'nature'];
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const allEmojis = this.getEmojisForCategory(selectedCategory);
    const correctEmojis = allEmojis.slice(0, 3).map(e => e.id);
    const decoyEmojis = this.getEmojisForCategory('mixed').slice(0, 6);
    
    return {
      instruction: `Select all ${selectedCategory}`,
      emojis: [...allEmojis.slice(0, 3), ...decoyEmojis],
      correctEmojis,
      maxSelections: 3,
    };
  }

  /**
   * Generate slider puzzle data
   */
  private generateSliderPuzzleData(): SliderPuzzle {
    const gridSize = { width: 3, height: 3 };
    const pieces = this.generatePuzzlePieces(gridSize);
    
    return {
      imageUrl: '/api/captcha/puzzle-image',
      pieces,
      gridSize,
      tolerance: 10,
    };
  }

  /**
   * Generate number sorting puzzle data
   */
  private generateNumberSortingData(): NumberSortingPuzzle {
    const count = 5 + Math.floor(Math.random() * 3); // 5-7 numbers
    const numbers = Array.from({ length: count }, () => Math.floor(Math.random() * 100));
    const sortOrder = Math.random() > 0.5 ? 'asc' : 'desc';
    
    return {
      numbers,
      sortOrder,
      timeLimit: 30000, // 30 seconds
    };
  }

  /**
   * Generate audio matching puzzle data
   */
  private generateAudioMatchingData(): AudioMatchingPuzzle {
    const categories = ['birds', 'farm-animals', 'jungle-animals'];
    const audioFiles = categories.flatMap(category => 
      this.getAudioFilesForCategory(category)
    );
    
    const correctMappings: Record<string, string> = {};
    audioFiles.forEach(file => {
      correctMappings[file.id] = file.category;
    });
    
    return {
      audioFiles,
      categories,
      correctMappings,
    };
  }

  /**
   * Generate proof-of-work challenge data
   */
  private generateProofOfWorkData(): ProofOfWorkChallenge {
    const difficulty = Math.min(this.config.difficulty || 3, 4); // Cap at 4 for performance
    const target = '0'.repeat(difficulty) + 'f'.repeat(64 - difficulty);
    
    return {
      difficulty,
      target,
      nonce: 0,
      data: this.generateRandomString(32),
      algorithm: 'sha256',
    };
  }

  /**
   * Generate behavioral analysis data
   */
  private generateBehavioralData(): any {
    return {
      trackingEnabled: true,
      minInteractionTime: 2000, // 2 seconds
      requiredActions: ['mouse-movement', 'click'],
    };
  }

  /**
   * Validate behavioral analysis
   */
  private async validateBehavioral(data: any): Promise<ValidationResult> {
    const { metadata } = data;
    const behavioralData = metadata?.behavioralData;
    
    if (!behavioralData) {
      return {
        isValid: false,
        score: 0,
        confidence: 0,
        reasons: ['No behavioral data provided'],
      };
    }

    const score = this.analyzeBehavioralPatterns(behavioralData);
    
    return {
      isValid: score > 0.5,
      score,
      confidence: 0.8,
      reasons: score > 0.5 ? ['Human-like behavior detected'] : ['Suspicious behavior patterns'],
    };
  }

  /**
   * Validate proof-of-work
   */
  private async validateProofOfWork(data: any): Promise<ValidationResult> {
    const { challenge, response } = data;
    const { nonce, hash } = response;
    
    const isValid = await this.verifyProofOfWork(
      challenge.data.data,
      nonce,
      hash,
      challenge.data.target
    );
    
    return {
      isValid,
      score: isValid ? 1 : 0,
      confidence: 0.9,
      reasons: isValid ? ['Valid proof-of-work'] : ['Invalid proof-of-work'],
    };
  }

  /**
   * Validate interactive puzzle
   */
  private async validateInteractive(data: any): Promise<ValidationResult> {
    const { challenge, response } = data;
    
    switch (challenge.type) {
      case 'drag-drop':
        return this.validateDragDrop(challenge.data, response);
      case 'emoji-selection':
        return this.validateEmojiSelection(challenge.data, response);
      case 'slider-puzzle':
        return this.validateSliderPuzzle(challenge.data, response);
      case 'number-sorting':
        return this.validateNumberSorting(challenge.data, response);
      case 'audio-matching':
        return this.validateAudioMatching(challenge.data, response);
      default:
        return {
          isValid: false,
          score: 0,
          confidence: 0,
          reasons: ['Unknown interactive challenge type'],
        };
    }
  }

  // Helper methods for validation
  private validateDragDrop(challengeData: DragDropPuzzle, response: any): ValidationResult {
    const { mappings } = response;
    const correctCount = Object.entries(mappings).filter(
      ([itemId, targetId]) => challengeData.correctMappings[itemId] === targetId
    ).length;
    
    const score = correctCount / Object.keys(challengeData.correctMappings).length;
    
    return {
      isValid: score >= 0.8,
      score,
      confidence: 0.9,
      reasons: [`${correctCount}/${Object.keys(challengeData.correctMappings).length} correct mappings`],
    };
  }

  private validateEmojiSelection(challengeData: EmojiSelectionPuzzle, response: any): ValidationResult {
    const { selectedEmojis } = response;
    const correctSelections = selectedEmojis.filter((id: string) => 
      challengeData.correctEmojis.includes(id)
    ).length;
    
    const score = correctSelections / challengeData.correctEmojis.length;
    
    return {
      isValid: score >= 0.8,
      score,
      confidence: 0.9,
      reasons: [`${correctSelections}/${challengeData.correctEmojis.length} correct selections`],
    };
  }

  private validateSliderPuzzle(challengeData: SliderPuzzle, response: any): ValidationResult {
    const { pieces } = response;
    const correctPieces = pieces.filter((piece: any) => {
      const correctPiece = challengeData.pieces.find(p => p.id === piece.id);
      if (!correctPiece) return false;
      
      const distance = Math.sqrt(
        Math.pow(piece.currentPosition.x - correctPiece.correctPosition.x, 2) +
        Math.pow(piece.currentPosition.y - correctPiece.correctPosition.y, 2)
      );
      
      return distance <= challengeData.tolerance;
    }).length;
    
    const score = correctPieces / challengeData.pieces.length;
    
    return {
      isValid: score >= 0.9,
      score,
      confidence: 0.95,
      reasons: [`${correctPieces}/${challengeData.pieces.length} pieces correctly placed`],
    };
  }

  private validateNumberSorting(challengeData: NumberSortingPuzzle, response: any): ValidationResult {
    const { sortedNumbers } = response;
    const expectedOrder = [...challengeData.numbers].sort((a, b) => 
      challengeData.sortOrder === 'asc' ? a - b : b - a
    );
    
    const isCorrect = JSON.stringify(sortedNumbers) === JSON.stringify(expectedOrder);
    
    return {
      isValid: isCorrect,
      score: isCorrect ? 1 : 0,
      confidence: 0.95,
      reasons: [isCorrect ? 'Numbers sorted correctly' : 'Incorrect sorting'],
    };
  }

  private validateAudioMatching(challengeData: AudioMatchingPuzzle, response: any): ValidationResult {
    const { mappings } = response;
    const correctCount = Object.entries(mappings).filter(
      ([audioId, category]) => challengeData.correctMappings[audioId] === category
    ).length;
    
    const score = correctCount / Object.keys(challengeData.correctMappings).length;
    
    return {
      isValid: score >= 0.8,
      score,
      confidence: 0.85,
      reasons: [`${correctCount}/${Object.keys(challengeData.correctMappings).length} correct audio matches`],
    };
  }

  // Utility methods
  private generateChallengeId(): string {
    return `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateTimeLimit(type: ChallengeType): number {
    const baseTimes: Record<ChallengeType, number> = {
      'center-click': 15000,
      'drag-drop': 60000,
      'emoji-selection': 30000,
      'slider': 120000,
      'number-sorting': 45000,
      'audio-matching': 90000,
      'proof-of-work': 30000,
      'behavioral': 0,
    };
    
    return baseTimes[type] || 60000;
  }

  private calculateFinalScore(results: ValidationResult[]): number {
    let totalScore = 0;
    let totalWeight = 0;
    
    results.forEach((result, index) => {
      const layer = this.securityLayers[index];
      if (layer) {
        totalScore += result.score * layer.weight;
        totalWeight += layer.weight;
      }
    });
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  private getLayerScore(results: ValidationResult[], layerName: string): number | undefined {
    const layerIndex = this.securityLayers.findIndex(layer => layer.name === layerName);
    return layerIndex >= 0 ? results[layerIndex]?.score : undefined;
  }

  private analyzeBehavioralPatterns(data: any): number {
    // Simplified behavioral analysis - in production, this would be more sophisticated
    const { mouseMovements, keystrokes, clickPatterns } = data;
    
    let score = 0;
    
    // Check for human-like mouse movements
    if (mouseMovements && mouseMovements.length > 10) {
      const avgVelocity = mouseMovements.reduce((sum: number, m: any) => sum + (m.velocity || 0), 0) / mouseMovements.length;
      score += avgVelocity > 0 && avgVelocity < 1000 ? 0.3 : 0;
    }
    
    // Check for natural keystroke patterns
    if (keystrokes && keystrokes.length > 0) {
      const avgDuration = keystrokes.reduce((sum: number, k: any) => sum + k.duration, 0) / keystrokes.length;
      score += avgDuration > 50 && avgDuration < 500 ? 0.3 : 0;
    }
    
    // Check for human-like click patterns
    if (clickPatterns && clickPatterns.length > 0) {
      const avgClickDuration = clickPatterns.reduce((sum: number, c: any) => sum + c.duration, 0) / clickPatterns.length;
      score += avgClickDuration > 50 && avgClickDuration < 300 ? 0.4 : 0;
    }
    
    return Math.min(score, 1);
  }

  private async verifyProofOfWork(data: string, nonce: number, hash: string, target: string): Promise<boolean> {
    // Simplified proof-of-work verification
    // In production, use proper crypto libraries
    const input = data + nonce.toString();
    const expectedHash = await this.sha256(input);
    return expectedHash === hash && hash < target;
  }

  private async sha256(message: string): Promise<string> {
    // Simplified SHA-256 implementation
    // In production, use crypto.subtle.digest or a proper crypto library
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Placeholder methods for data generation
  private generateItemsForCategory(category: string): any[] {
    // Implementation would generate appropriate items based on category
    return [];
  }

  private generateTargetsForCategory(category: string): any[] {
    // Implementation would generate appropriate targets based on category
    return [];
  }

  private generateCorrectMappings(items: any[], targets: any[]): Record<string, string> {
    // Implementation would create correct item-to-target mappings
    return {};
  }

  private getEmojisForCategory(category: string): any[] {
    // Implementation would return emojis for the specified category
    return [];
  }

  private generatePuzzlePieces(gridSize: { width: number; height: number }): any[] {
    // Implementation would generate puzzle pieces
    return [];
  }

  private getAudioFilesForCategory(category: string): any[] {
    // Implementation would return audio files for the specified category
    return [];
  }
}