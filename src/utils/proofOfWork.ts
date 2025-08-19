import { ProofOfWorkChallenge } from '../types';

/**
 * Simple hash function for proof of work (similar to hashcash)
 */
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Generate a proof of work challenge
 */
export function generateProofOfWork(difficulty = 4): ProofOfWorkChallenge {
  const timestamp = Date.now();
  const randomData = Math.random().toString(36).substring(2);
  const target = '0'.repeat(difficulty);
  
  return {
    difficulty,
    target,
    // Include timestamp and random data to prevent pre-computation
    nonce: `${timestamp}-${randomData}`
  };
}

/**
 * Solve the proof of work challenge
 */
export function solveProofOfWork(challenge: ProofOfWorkChallenge): Promise<string> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let counter = 0;
    
    const solve = () => {
      const batchSize = 1000; // Process in batches to avoid blocking UI
      
      for (let i = 0; i < batchSize; i++) {
        const nonce = `${challenge.nonce}-${counter}`;
        const hash = simpleHash(nonce);
        
        if (hash.startsWith(challenge.target)) {
          resolve(nonce);
          return;
        }
        
        counter++;
        
        // Prevent infinite loops - max 10 seconds
        if (Date.now() - startTime > 10000) {
          resolve(`timeout-${counter}`);
          return;
        }
      }
      
      // Continue in next tick to avoid blocking
      setTimeout(solve, 0);
    };
    
    solve();
  });
}

/**
 * Validate a proof of work solution
 */
export function validateProofOfWork(challenge: ProofOfWorkChallenge, nonce: string): boolean {
  if (!nonce || nonce.startsWith('timeout-')) {
    return false;
  }
  
  const hash = simpleHash(nonce);
  return hash.startsWith(challenge.target);
}

/**
 * Get difficulty based on user preference
 */
export function getDifficulty(level: 'easy' | 'medium' | 'hard'): number {
  switch (level) {
    case 'easy':
      return 3;
    case 'medium':
      return 4;
    case 'hard':
      return 5;
    default:
      return 4;
  }
}