/**
 * Proof-of-work computational challenge system for NexCaptcha
 * Implements background computational challenges to verify human interaction
 */

import {
  ProofOfWorkChallenge,
  ProofOfWorkResult,
} from '../types';

/**
 * Proof-of-work challenge processor
 */
export class ProofOfWorkProcessor {
  private worker: Worker | null = null;
  private isProcessing: boolean = false;
  private currentChallenge: ProofOfWorkChallenge | null = null;
  private startTime: number = 0;
  private onComplete: ((result: ProofOfWorkResult) => void) | null = null;
  private onError: ((error: Error) => void) | null = null;

  /**
   * Start proof-of-work challenge
   */
  public async startChallenge(
    challenge: ProofOfWorkChallenge,
    onComplete: (result: ProofOfWorkResult) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    if (this.isProcessing) {
      throw new Error('Proof-of-work challenge already in progress');
    }

    this.currentChallenge = challenge;
    this.onComplete = onComplete;
    this.onError = onError;
    this.isProcessing = true;
    this.startTime = Date.now();

    try {
      if (this.supportsWebWorkers()) {
        await this.startWorkerChallenge(challenge);
      } else {
        await this.startMainThreadChallenge(challenge);
      }
    } catch (error) {
      this.isProcessing = false;
      onError(error as Error);
    }
  }

  /**
   * Stop current challenge
   */
  public stopChallenge(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.isProcessing = false;
    this.currentChallenge = null;
    this.onComplete = null;
    this.onError = null;
  }

  /**
   * Check if currently processing
   */
  public isRunning(): boolean {
    return this.isProcessing;
  }

  /**
   * Verify proof-of-work result
   */
  public static async verifyResult(
    challenge: ProofOfWorkChallenge,
    result: ProofOfWorkResult
  ): Promise<boolean> {
    try {
      const input = challenge.data + result.nonce.toString();
      const hash = await this.computeHash(input, challenge.algorithm);
      
      return hash === result.hash && this.meetsTarget(hash, challenge.target);
    } catch (error) {
      console.error('Proof-of-work verification error:', error);
      return false;
    }
  }

  /**
   * Generate a new proof-of-work challenge
   */
  public static generateChallenge(difficulty: number = 3): ProofOfWorkChallenge {
    const target = this.generateTarget(difficulty);
    const data = this.generateRandomData();
    
    return {
      difficulty,
      target,
      nonce: 0,
      data,
      algorithm: 'sha256',
    };
  }

  /**
   * Check if web workers are supported
   */
  private supportsWebWorkers(): boolean {
    return typeof Worker !== 'undefined';
  }

  /**
   * Start challenge using web worker
   */
  private async startWorkerChallenge(challenge: ProofOfWorkChallenge): Promise<void> {
    const workerCode = this.generateWorkerCode();
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    
    this.worker = new Worker(workerUrl);
    
    this.worker.onmessage = (event) => {
      const { type, data } = event.data;
      
      if (type === 'result') {
        this.handleWorkerResult(data);
      } else if (type === 'error') {
        this.handleWorkerError(new Error(data.message));
      }
    };
    
    this.worker.onerror = (error) => {
      this.handleWorkerError(new Error(`Worker error: ${error.message}`));
    };
    
    // Start the challenge
    this.worker.postMessage({
      type: 'start',
      challenge,
    });
    
    // Clean up blob URL
    URL.revokeObjectURL(workerUrl);
  }

  /**
   * Start challenge on main thread (fallback)
   */
  private async startMainThreadChallenge(challenge: ProofOfWorkChallenge): Promise<void> {
    try {
      const result = await this.solveChallenge(challenge);
      this.handleResult(result);
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * Handle worker result
   */
  private handleWorkerResult(data: any): void {
    const result: ProofOfWorkResult = {
      nonce: data.nonce,
      hash: data.hash,
      timeSpent: Date.now() - this.startTime,
      iterations: data.iterations,
    };
    
    this.handleResult(result);
  }

  /**
   * Handle worker error
   */
  private handleWorkerError(error: Error): void {
    this.handleError(error);
  }

  /**
   * Handle successful result
   */
  private handleResult(result: ProofOfWorkResult): void {
    this.isProcessing = false;
    if (this.onComplete) {
      this.onComplete(result);
    }
    this.cleanup();
  }

  /**
   * Handle error
   */
  private handleError(error: Error): void {
    this.isProcessing = false;
    if (this.onError) {
      this.onError(error);
    }
    this.cleanup();
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.currentChallenge = null;
    this.onComplete = null;
    this.onError = null;
  }

  /**
   * Solve proof-of-work challenge
   */
  private async solveChallenge(challenge: ProofOfWorkChallenge): Promise<ProofOfWorkResult> {
    let nonce = 0;
    let iterations = 0;
    const maxIterations = 1000000; // Prevent infinite loops
    
    while (iterations < maxIterations) {
      const input = challenge.data + nonce.toString();
      const hash = await ProofOfWorkProcessor.computeHash(input, challenge.algorithm);
      
      iterations++;
      
      if (ProofOfWorkProcessor.meetsTarget(hash, challenge.target)) {
        return {
          nonce,
          hash,
          timeSpent: Date.now() - this.startTime,
          iterations,
        };
      }
      
      nonce++;
      
      // Yield control periodically to prevent blocking
      if (iterations % 1000 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    throw new Error('Maximum iterations reached without finding solution');
  }

  /**
   * Generate web worker code
   */
  private generateWorkerCode(): string {
    return `
      // Web Worker for proof-of-work computation
      
      let isRunning = false;
      
      self.onmessage = async function(event) {
        const { type, challenge } = event.data;
        
        if (type === 'start' && !isRunning) {
          isRunning = true;
          try {
            const result = await solveChallenge(challenge);
            self.postMessage({ type: 'result', data: result });
          } catch (error) {
            self.postMessage({ type: 'error', data: { message: error.message } });
          } finally {
            isRunning = false;
          }
        }
      };
      
      async function solveChallenge(challenge) {
        let nonce = 0;
        let iterations = 0;
        const maxIterations = 1000000;
        
        while (iterations < maxIterations) {
          const input = challenge.data + nonce.toString();
          const hash = await computeHash(input, challenge.algorithm);
          
          iterations++;
          
          if (meetsTarget(hash, challenge.target)) {
            return {
              nonce,
              hash,
              iterations,
            };
          }
          
          nonce++;
          
          // Yield control periodically
          if (iterations % 1000 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }
        
        throw new Error('Maximum iterations reached without finding solution');
      }
      
      async function computeHash(input, algorithm) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        
        let hashBuffer;
        switch (algorithm) {
          case 'sha256':
            hashBuffer = await crypto.subtle.digest('SHA-256', data);
            break;
          case 'sha1':
            hashBuffer = await crypto.subtle.digest('SHA-1', data);
            break;
          default:
            throw new Error('Unsupported hash algorithm: ' + algorithm);
        }
        
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
      
      function meetsTarget(hash, target) {
        return hash <= target;
      }
    `;
  }

  /**
   * Compute hash using Web Crypto API
   */
  private static async computeHash(input: string, algorithm: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    
    let hashBuffer: ArrayBuffer;
    switch (algorithm) {
      case 'sha256':
        hashBuffer = await crypto.subtle.digest('SHA-256', data);
        break;
      case 'sha1':
        hashBuffer = await crypto.subtle.digest('SHA-1', data);
        break;
      default:
        throw new Error(`Unsupported hash algorithm: ${algorithm}`);
    }
    
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Check if hash meets target difficulty
   */
  private static meetsTarget(hash: string, target: string): boolean {
    return hash <= target;
  }

  /**
   * Generate target based on difficulty
   */
  private static generateTarget(difficulty: number): string {
    // Generate target with leading zeros based on difficulty
    const leadingZeros = Math.min(difficulty, 8); // Cap at 8 for performance
    const zeros = '0'.repeat(leadingZeros);
    const remaining = 'f'.repeat(64 - leadingZeros);
    return zeros + remaining;
  }

  /**
   * Generate random data for challenge
   */
  private static generateRandomData(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

/**
 * Adaptive proof-of-work manager
 * Adjusts difficulty based on device performance
 */
export class AdaptiveProofOfWork {
  private static performanceCache: Map<string, number> = new Map();
  private static readonly TARGET_TIME_MS = 5000; // Target 5 seconds
  private static readonly MIN_DIFFICULTY = 1;
  private static readonly MAX_DIFFICULTY = 6;

  /**
   * Get adaptive difficulty based on device performance
   */
  public static async getAdaptiveDifficulty(): Promise<number> {
    const deviceKey = this.getDeviceKey();
    const cachedDifficulty = this.performanceCache.get(deviceKey);
    
    if (cachedDifficulty) {
      return cachedDifficulty;
    }
    
    // Benchmark device performance
    const difficulty = await this.benchmarkDevice();
    this.performanceCache.set(deviceKey, difficulty);
    
    return difficulty;
  }

  /**
   * Update difficulty based on completion time
   */
  public static updateDifficulty(currentDifficulty: number, completionTime: number): number {
    const ratio = completionTime / this.TARGET_TIME_MS;
    
    let newDifficulty = currentDifficulty;
    
    if (ratio < 0.5) {
      // Too fast, increase difficulty
      newDifficulty = Math.min(currentDifficulty + 1, this.MAX_DIFFICULTY);
    } else if (ratio > 2) {
      // Too slow, decrease difficulty
      newDifficulty = Math.max(currentDifficulty - 1, this.MIN_DIFFICULTY);
    }
    
    // Update cache
    const deviceKey = this.getDeviceKey();
    this.performanceCache.set(deviceKey, newDifficulty);
    
    return newDifficulty;
  }

  /**
   * Benchmark device performance
   */
  private static async benchmarkDevice(): Promise<number> {
    const startTime = Date.now();
    const testChallenge = ProofOfWorkProcessor.generateChallenge(2); // Start with difficulty 2
    
    try {
      const processor = new ProofOfWorkProcessor();
      
      return new Promise<number>((resolve) => {
        processor.startChallenge(
          testChallenge,
          (result) => {
            const completionTime = Date.now() - startTime;
            const difficulty = this.calculateDifficultyFromTime(completionTime);
            processor.stopChallenge();
            resolve(difficulty);
          },
          (error) => {
            console.warn('Benchmark failed, using default difficulty:', error);
            processor.stopChallenge();
            resolve(3); // Default difficulty
          }
        );
        
        // Timeout after 10 seconds
        setTimeout(() => {
          processor.stopChallenge();
          resolve(1); // Low difficulty for slow devices
        }, 10000);
      });
    } catch (error) {
      console.warn('Benchmark error, using default difficulty:', error);
      return 3; // Default difficulty
    }
  }

  /**
   * Calculate difficulty based on completion time
   */
  private static calculateDifficultyFromTime(completionTime: number): number {
    if (completionTime < 1000) {
      return this.MAX_DIFFICULTY;
    } else if (completionTime < 3000) {
      return 5;
    } else if (completionTime < 5000) {
      return 4;
    } else if (completionTime < 8000) {
      return 3;
    } else if (completionTime < 12000) {
      return 2;
    } else {
      return this.MIN_DIFFICULTY;
    }
  }

  /**
   * Generate device key for caching
   */
  private static getDeviceKey(): string {
    // Create a simple device fingerprint
    const navigator = window.navigator;
    const screen = window.screen;
    
    const components = [
      navigator.userAgent,
      navigator.language,
      navigator.hardwareConcurrency || 4,
      screen.width,
      screen.height,
      screen.colorDepth,
    ];
    
    return btoa(components.join('|')).slice(0, 16);
  }

  /**
   * Clear performance cache
   */
  public static clearCache(): void {
    this.performanceCache.clear();
  }
}