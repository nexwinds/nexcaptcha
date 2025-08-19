/**
 * Behavioral analysis layer for NexCaptcha
 * Tracks mouse movements, typing patterns, and click behaviors
 */

import {
  BehavioralData,
  MouseMovement,
  Keystroke,
  ClickPattern,
  TimingData,
} from '../types';

/**
 * Behavioral analysis tracker
 */
export class BehavioralAnalyzer {
  private isTracking: boolean = false;
  private startTime: number = 0;
  private mouseMovements: MouseMovement[] = [];
  private keystrokes: Keystroke[] = [];
  private clickPatterns: ClickPattern[] = [];
  private pauseStartTime: number = 0;
  private pauseDurations: number[] = [];
  private lastActivityTime: number = 0;
  private element: HTMLElement | null = null;

  // Event listeners
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  private keyDownHandler: ((e: KeyboardEvent) => void) | null = null;
  private keyUpHandler: ((e: KeyboardEvent) => void) | null = null;
  private clickHandler: ((e: MouseEvent) => void) | null = null;
  private mouseDownHandler: ((e: MouseEvent) => void) | null = null;
  private mouseUpHandler: ((e: MouseEvent) => void) | null = null;

  // Tracking state
  private keyDownTimes: Map<string, number> = new Map();
  private mouseDownTime: number = 0;
  private lastMousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private lastMouseTime: number = 0;

  /**
   * Start behavioral tracking
   */
  public startTracking(element?: HTMLElement): void {
    if (this.isTracking) {
      this.stopTracking();
    }

    this.isTracking = true;
    this.startTime = Date.now();
    this.lastActivityTime = this.startTime;
    this.element = element || document.body;
    
    this.resetData();
    this.attachEventListeners();
  }

  /**
   * Stop behavioral tracking
   */
  public stopTracking(): void {
    if (!this.isTracking) return;

    this.isTracking = false;
    this.detachEventListeners();
    
    // Record final pause if there was one
    if (this.pauseStartTime > 0) {
      this.pauseDurations.push(Date.now() - this.pauseStartTime);
    }
  }

  /**
   * Get current behavioral data
   */
  public getBehavioralData(): BehavioralData {
    const endTime = Date.now();
    
    return {
      mouseMovements: [...this.mouseMovements],
      keystrokes: [...this.keystrokes],
      clickPatterns: [...this.clickPatterns],
      timingData: {
        startTime: this.startTime,
        endTime,
        pauseDurations: [...this.pauseDurations],
        totalTime: endTime - this.startTime,
      },
    };
  }

  /**
   * Calculate behavioral score (0-1)
   */
  public calculateScore(): number {
    const data = this.getBehavioralData();
    return this.analyzeBehavioralPatterns(data);
  }

  /**
   * Reset tracking data
   */
  private resetData(): void {
    this.mouseMovements = [];
    this.keystrokes = [];
    this.clickPatterns = [];
    this.pauseDurations = [];
    this.keyDownTimes.clear();
    this.pauseStartTime = 0;
    this.mouseDownTime = 0;
    this.lastMousePosition = { x: 0, y: 0 };
    this.lastMouseTime = 0;
  }

  /**
   * Attach event listeners
   */
  private attachEventListeners(): void {
    if (!this.element) return;

    // Mouse movement tracking
    this.mouseMoveHandler = (e: MouseEvent) => this.handleMouseMove(e);
    this.element.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });

    // Keyboard tracking
    this.keyDownHandler = (e: KeyboardEvent) => this.handleKeyDown(e);
    this.keyUpHandler = (e: KeyboardEvent) => this.handleKeyUp(e);
    this.element.addEventListener('keydown', this.keyDownHandler);
    this.element.addEventListener('keyup', this.keyUpHandler);

    // Click tracking
    this.mouseDownHandler = (e: MouseEvent) => this.handleMouseDown(e);
    this.mouseUpHandler = (e: MouseEvent) => this.handleMouseUp(e);
    this.clickHandler = (e: MouseEvent) => this.handleClick(e);
    this.element.addEventListener('mousedown', this.mouseDownHandler);
    this.element.addEventListener('mouseup', this.mouseUpHandler);
    this.element.addEventListener('click', this.clickHandler);
  }

  /**
   * Detach event listeners
   */
  private detachEventListeners(): void {
    if (!this.element) return;

    if (this.mouseMoveHandler) {
      this.element.removeEventListener('mousemove', this.mouseMoveHandler);
    }
    if (this.keyDownHandler) {
      this.element.removeEventListener('keydown', this.keyDownHandler);
    }
    if (this.keyUpHandler) {
      this.element.removeEventListener('keyup', this.keyUpHandler);
    }
    if (this.mouseDownHandler) {
      this.element.removeEventListener('mousedown', this.mouseDownHandler);
    }
    if (this.mouseUpHandler) {
      this.element.removeEventListener('mouseup', this.mouseUpHandler);
    }
    if (this.clickHandler) {
      this.element.removeEventListener('click', this.clickHandler);
    }

    // Clear handlers
    this.mouseMoveHandler = null;
    this.keyDownHandler = null;
    this.keyUpHandler = null;
    this.mouseDownHandler = null;
    this.mouseUpHandler = null;
    this.clickHandler = null;
  }

  /**
   * Handle mouse movement
   */
  private handleMouseMove(e: MouseEvent): void {
    if (!this.isTracking) return;

    const now = Date.now();
    const rect = this.element?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : e.clientX;
    const y = rect ? e.clientY - rect.top : e.clientY;

    // Calculate velocity and acceleration
    let velocity = 0;
    let acceleration = 0;

    if (this.lastMouseTime > 0) {
      const timeDiff = now - this.lastMouseTime;
      const distance = Math.sqrt(
        Math.pow(x - this.lastMousePosition.x, 2) + 
        Math.pow(y - this.lastMousePosition.y, 2)
      );
      velocity = timeDiff > 0 ? distance / timeDiff : 0;

      // Calculate acceleration (change in velocity)
      if (this.mouseMovements.length > 0) {
        const lastVelocity = this.mouseMovements[this.mouseMovements.length - 1].velocity || 0;
        acceleration = timeDiff > 0 ? (velocity - lastVelocity) / timeDiff : 0;
      }
    }

    this.mouseMovements.push({
      x,
      y,
      timestamp: now,
      velocity,
      acceleration,
    });

    this.lastMousePosition = { x, y };
    this.lastMouseTime = now;
    this.updateActivityTime(now);

    // Limit array size for performance
    if (this.mouseMovements.length > 1000) {
      this.mouseMovements = this.mouseMovements.slice(-800);
    }
  }

  /**
   * Handle key down
   */
  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.isTracking) return;

    const now = Date.now();
    this.keyDownTimes.set(e.key, now);
    this.updateActivityTime(now);
  }

  /**
   * Handle key up
   */
  private handleKeyUp(e: KeyboardEvent): void {
    if (!this.isTracking) return;

    const now = Date.now();
    const keyDownTime = this.keyDownTimes.get(e.key);
    
    if (keyDownTime) {
      const duration = now - keyDownTime;
      
      this.keystrokes.push({
        key: e.key,
        timestamp: now,
        duration,
        pressure: this.estimateKeyPressure(duration),
      });
      
      this.keyDownTimes.delete(e.key);
    }

    this.updateActivityTime(now);

    // Limit array size for performance
    if (this.keystrokes.length > 500) {
      this.keystrokes = this.keystrokes.slice(-400);
    }
  }

  /**
   * Handle mouse down
   */
  private handleMouseDown(e: MouseEvent): void {
    if (!this.isTracking) return;

    this.mouseDownTime = Date.now();
    this.updateActivityTime(this.mouseDownTime);
  }

  /**
   * Handle mouse up
   */
  private handleMouseUp(e: MouseEvent): void {
    if (!this.isTracking || this.mouseDownTime === 0) return;

    const now = Date.now();
    const duration = now - this.mouseDownTime;
    
    this.updateActivityTime(now);
    this.mouseDownTime = 0;
  }

  /**
   * Handle click
   */
  private handleClick(e: MouseEvent): void {
    if (!this.isTracking) return;

    const now = Date.now();
    const rect = this.element?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : e.clientX;
    const y = rect ? e.clientY - rect.top : e.clientY;
    
    // Estimate click duration from recent mouse down/up events
    const duration = this.mouseDownTime > 0 ? now - this.mouseDownTime : 100;

    this.clickPatterns.push({
      x,
      y,
      timestamp: now,
      duration,
      button: e.button,
    });

    this.updateActivityTime(now);

    // Limit array size for performance
    if (this.clickPatterns.length > 200) {
      this.clickPatterns = this.clickPatterns.slice(-150);
    }
  }

  /**
   * Update activity time and handle pauses
   */
  private updateActivityTime(now: number): void {
    const timeSinceLastActivity = now - this.lastActivityTime;
    
    // If there was a significant pause (>500ms), record it
    if (timeSinceLastActivity > 500 && this.pauseStartTime === 0) {
      this.pauseStartTime = this.lastActivityTime;
    }
    
    // If activity resumed after a pause, record the pause duration
    if (this.pauseStartTime > 0 && timeSinceLastActivity <= 500) {
      this.pauseDurations.push(now - this.pauseStartTime);
      this.pauseStartTime = 0;
    }
    
    this.lastActivityTime = now;
  }

  /**
   * Estimate key pressure based on duration
   */
  private estimateKeyPressure(duration: number): number {
    // Normalize duration to pressure (0-1)
    // Typical key press: 50-200ms
    // Longer press might indicate more pressure or hesitation
    return Math.min(duration / 200, 1);
  }

  /**
   * Analyze behavioral patterns and return a score
   */
  private analyzeBehavioralPatterns(data: BehavioralData): number {
    let score = 0;
    let factors = 0;

    // Analyze mouse movement patterns
    const mouseScore = this.analyzeMouseMovements(data.mouseMovements);
    if (mouseScore >= 0) {
      score += mouseScore * 0.4;
      factors += 0.4;
    }

    // Analyze keystroke patterns
    const keystrokeScore = this.analyzeKeystrokes(data.keystrokes);
    if (keystrokeScore >= 0) {
      score += keystrokeScore * 0.3;
      factors += 0.3;
    }

    // Analyze click patterns
    const clickScore = this.analyzeClickPatterns(data.clickPatterns);
    if (clickScore >= 0) {
      score += clickScore * 0.2;
      factors += 0.2;
    }

    // Analyze timing patterns
    const timingScore = this.analyzeTimingPatterns(data.timingData);
    if (timingScore >= 0) {
      score += timingScore * 0.1;
      factors += 0.1;
    }

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Analyze mouse movement patterns
   */
  private analyzeMouseMovements(movements: MouseMovement[]): number {
    if (movements.length < 10) return -1; // Not enough data

    let score = 0;
    let checks = 0;

    // Check for natural velocity variations
    const velocities = movements.map(m => m.velocity || 0).filter(v => v > 0);
    if (velocities.length > 5) {
      const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
      const velocityVariance = this.calculateVariance(velocities);
      
      // Human movements have moderate velocity with natural variation
      if (avgVelocity > 0.1 && avgVelocity < 5 && velocityVariance > 0.01) {
        score += 0.3;
      }
      checks += 0.3;
    }

    // Check for smooth curves vs. straight lines
    const curvature = this.calculateMovementCurvature(movements);
    if (curvature > 0.1 && curvature < 2) {
      score += 0.4; // Natural mouse movements have some curvature
    }
    checks += 0.4;

    // Check for pauses and hesitations
    const pauseCount = this.countMovementPauses(movements);
    if (pauseCount > 0 && pauseCount < movements.length * 0.1) {
      score += 0.3; // Some pauses are natural
    }
    checks += 0.3;

    return checks > 0 ? score / checks : 0;
  }

  /**
   * Analyze keystroke patterns
   */
  private analyzeKeystrokes(keystrokes: Keystroke[]): number {
    if (keystrokes.length < 3) return -1; // Not enough data

    let score = 0;
    let checks = 0;

    // Check keystroke duration patterns
    const durations = keystrokes.map(k => k.duration);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    
    if (avgDuration > 50 && avgDuration < 300) {
      score += 0.4; // Natural keystroke duration
    }
    checks += 0.4;

    // Check for rhythm variations
    const intervals = this.calculateKeystrokeIntervals(keystrokes);
    if (intervals.length > 1) {
      const intervalVariance = this.calculateVariance(intervals);
      if (intervalVariance > 100) {
        score += 0.3; // Natural typing has rhythm variations
      }
    }
    checks += 0.3;

    // Check pressure variations
    const pressures = keystrokes.map(k => k.pressure || 0.5);
    const pressureVariance = this.calculateVariance(pressures);
    if (pressureVariance > 0.01) {
      score += 0.3; // Natural pressure variations
    }
    checks += 0.3;

    return checks > 0 ? score / checks : 0;
  }

  /**
   * Analyze click patterns
   */
  private analyzeClickPatterns(clicks: ClickPattern[]): number {
    if (clicks.length < 2) return -1; // Not enough data

    let score = 0;
    let checks = 0;

    // Check click duration patterns
    const durations = clicks.map(c => c.duration);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    
    if (avgDuration > 50 && avgDuration < 250) {
      score += 0.4; // Natural click duration
    }
    checks += 0.4;

    // Check for spatial distribution
    const spatialVariance = this.calculateSpatialVariance(clicks);
    if (spatialVariance > 100) {
      score += 0.3; // Clicks should be somewhat distributed
    }
    checks += 0.3;

    // Check timing between clicks
    const intervals = this.calculateClickIntervals(clicks);
    if (intervals.length > 0) {
      const avgInterval = intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
      if (avgInterval > 200 && avgInterval < 5000) {
        score += 0.3; // Natural click intervals
      }
    }
    checks += 0.3;

    return checks > 0 ? score / checks : 0;
  }

  /**
   * Analyze timing patterns
   */
  private analyzeTimingPatterns(timing: TimingData): number {
    let score = 0;
    let checks = 0;

    // Check total interaction time
    if (timing.totalTime > 2000 && timing.totalTime < 300000) {
      score += 0.4; // Reasonable interaction time
    }
    checks += 0.4;

    // Check pause patterns
    if (timing.pauseDurations.length > 0) {
      const avgPause = timing.pauseDurations.reduce((sum, p) => sum + p, 0) / timing.pauseDurations.length;
      if (avgPause > 500 && avgPause < 10000) {
        score += 0.3; // Natural pause durations
      }
    }
    checks += 0.3;

    // Check for consistent activity
    const activeTime = timing.totalTime - timing.pauseDurations.reduce((sum, p) => sum + p, 0);
    const activityRatio = activeTime / timing.totalTime;
    if (activityRatio > 0.3 && activityRatio < 0.9) {
      score += 0.3; // Balanced activity/pause ratio
    }
    checks += 0.3;

    return checks > 0 ? score / checks : 0;
  }

  // Helper methods for analysis
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length;
  }

  private calculateMovementCurvature(movements: MouseMovement[]): number {
    if (movements.length < 3) return 0;
    
    let totalCurvature = 0;
    for (let i = 1; i < movements.length - 1; i++) {
      const prev = movements[i - 1];
      const curr = movements[i];
      const next = movements[i + 1];
      
      // Calculate angle change
      const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
      const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);
      const angleDiff = Math.abs(angle2 - angle1);
      
      totalCurvature += Math.min(angleDiff, 2 * Math.PI - angleDiff);
    }
    
    return totalCurvature / (movements.length - 2);
  }

  private countMovementPauses(movements: MouseMovement[]): number {
    let pauseCount = 0;
    for (let i = 1; i < movements.length; i++) {
      const timeDiff = movements[i].timestamp - movements[i - 1].timestamp;
      if (timeDiff > 200) { // 200ms pause threshold
        pauseCount++;
      }
    }
    return pauseCount;
  }

  private calculateKeystrokeIntervals(keystrokes: Keystroke[]): number[] {
    const intervals: number[] = [];
    for (let i = 1; i < keystrokes.length; i++) {
      intervals.push(keystrokes[i].timestamp - keystrokes[i - 1].timestamp);
    }
    return intervals;
  }

  private calculateSpatialVariance(clicks: ClickPattern[]): number {
    if (clicks.length === 0) return 0;
    
    const xValues = clicks.map(c => c.x);
    const yValues = clicks.map(c => c.y);
    
    return this.calculateVariance(xValues) + this.calculateVariance(yValues);
  }

  private calculateClickIntervals(clicks: ClickPattern[]): number[] {
    const intervals: number[] = [];
    for (let i = 1; i < clicks.length; i++) {
      intervals.push(clicks[i].timestamp - clicks[i - 1].timestamp);
    }
    return intervals;
  }
}