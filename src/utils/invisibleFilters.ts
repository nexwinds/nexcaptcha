import { InvisibleFilters, MouseMovement } from '../types';

/**
 * Class to handle invisible bot detection filters
 */
export class InvisibleFiltersTracker {
  private startTime: number;
  private mouseMovements: MouseMovement[] = [];
  private keystrokes = 0;
  private keystrokeStartTime = 0;
  private honeypotValue = '';

  constructor() {
    this.startTime = Date.now();
    this.keystrokeStartTime = Date.now();
  }

  /**
   * Track mouse movement
   */
  trackMouseMovement(x: number, y: number, type: 'move' | 'click' | 'touch' = 'move'): void {
    this.mouseMovements.push({
      x,
      y,
      timestamp: Date.now(),
      type
    });

    // Keep only last 100 movements to prevent memory issues
    if (this.mouseMovements.length > 100) {
      this.mouseMovements = this.mouseMovements.slice(-100);
    }
  }

  /**
   * Track keystroke for typing speed calculation
   */
  trackKeystroke(): void {
    this.keystrokes++;
  }

  /**
   * Set honeypot field value (should remain empty for humans)
   */
  setHoneypotValue(value: string): void {
    this.honeypotValue = value;
  }

  /**
   * Get current typing speed in characters per minute
   */
  getTypingSpeed(): number {
    const timeElapsed = (Date.now() - this.keystrokeStartTime) / 1000 / 60; // minutes
    return timeElapsed > 0 ? this.keystrokes / timeElapsed : 0;
  }

  /**
   * Get time elapsed since tracker initialization
   */
  getTimeElapsed(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Validate invisible filters
   */
  validate(): { isValid: boolean; reasons: string[] } {
    const reasons: string[] = [];
    let isValid = true;

    // Check honeypot field (should be empty)
    if (this.honeypotValue.trim() !== '') {
      isValid = false;
      reasons.push('Honeypot field filled');
    }

    // Check minimum time (3.15 seconds)
    const timeElapsed = this.getTimeElapsed();
    if (timeElapsed < 3150) {
      isValid = false;
      reasons.push('Submission too fast');
    }

    // Check for mouse movements (humans should have some)
    if (this.mouseMovements.length < 3) {
      isValid = false;
      reasons.push('Insufficient mouse activity');
    }

    // Check for realistic mouse movement patterns
    if (this.mouseMovements.length > 0) {
      const movements = this.mouseMovements.filter(m => m.type === 'move');
      if (movements.length > 5) {
        // Check for too linear movements (bot-like)
        const linearMovements = this.detectLinearMovements(movements);
        if (linearMovements > movements.length * 0.8) {
          isValid = false;
          reasons.push('Suspicious movement patterns');
        }
      }
    }

    // Check typing speed (too fast might indicate bot)
    const typingSpeed = this.getTypingSpeed();
    if (typingSpeed > 300) { // More than 300 CPM is suspicious
      isValid = false;
      reasons.push('Typing speed too high');
    }

    return { isValid, reasons };
  }

  /**
   * Detect linear mouse movements (bot-like behavior)
   */
  private detectLinearMovements(movements: MouseMovement[]): number {
    let linearCount = 0;
    
    for (let i = 2; i < movements.length; i++) {
      const prev2 = movements[i - 2];
      const prev1 = movements[i - 1];
      const current = movements[i];
      
      if (!prev2 || !prev1 || !current) continue;
      
      // Calculate if three consecutive points are roughly in a line
      const dx1 = prev1.x - prev2.x;
      const dy1 = prev1.y - prev2.y;
      const dx2 = current.x - prev1.x;
      const dy2 = current.y - prev1.y;
      
      // Check if the direction is very similar (linear movement)
      if (dx1 !== 0 && dx2 !== 0) {
        const slope1 = dy1 / dx1;
        const slope2 = dy2 / dx2;
        if (Math.abs(slope1 - slope2) < 0.1) {
          linearCount++;
        }
      } else if (dx1 === 0 && dx2 === 0) {
        // Vertical line
        linearCount++;
      } else if (dy1 === 0 && dy2 === 0) {
        // Horizontal line
        linearCount++;
      }
    }
    
    return linearCount;
  }

  /**
   * Get current filter data
   */
  getFilterData(): InvisibleFilters {
    return {
      honeypot: this.honeypotValue,
      mouseMovements: [...this.mouseMovements],
      typingSpeed: this.getTypingSpeed(),
      submissionTime: Date.now(),
      startTime: this.startTime
    };
  }

  /**
   * Reset all tracking data
   */
  reset(): void {
    this.startTime = Date.now();
    this.keystrokeStartTime = Date.now();
    this.mouseMovements = [];
    this.keystrokes = 0;
    this.honeypotValue = '';
  }
}

/**
 * Create a new invisible filters tracker instance
 */
export function createInvisibleFiltersTracker(): InvisibleFiltersTracker {
  return new InvisibleFiltersTracker();
}