export type AnimationState = 'initial' | 'opening' | 'rolling' | 'zooming' | 'transitioning' | 'complete';

export interface AnimationPhase {
  state: AnimationState;
  duration: number;
  delay?: number;
}

export class AnimationTimeline {
  private currentState: AnimationState = 'initial';
  private timeouts: NodeJS.Timeout[] = [];
  private isPaused: boolean = false;
  private pauseStartTime: number = 0;
  private remainingTime: number = 0;
  
  constructor(
    private phases: AnimationPhase[],
    private onStateChange: (state: AnimationState) => void
  ) {}

  start() {
    this.scheduleNextPhase(0);
  }

  private scheduleNextPhase(currentIndex: number) {
    if (currentIndex >= this.phases.length || this.isPaused) return;

    const phase = this.phases[currentIndex];
    
    if (!phase) return; // Skip if phase is undefined
    
    const timeout = setTimeout(() => {
      this.currentState = phase.state;
      this.onStateChange(phase.state);
      this.scheduleNextPhase(currentIndex + 1);
    }, (phase.delay || 0) + phase.duration);

    this.timeouts.push(timeout);
  }

  pause() {
    if (this.isPaused) return;
    
    this.isPaused = true;
    this.pauseStartTime = Date.now();
    this.clearTimeouts();
  }

  resume() {
    if (!this.isPaused) return;
    
    this.isPaused = false;
    const currentPhaseIndex = this.phases.findIndex(phase => phase.state === this.currentState);
    if (currentPhaseIndex >= 0) {
      const pauseDuration = Date.now() - this.pauseStartTime;
      this.remainingTime -= pauseDuration;
      this.scheduleNextPhase(currentPhaseIndex + 1);
    }
  }

  skip() {
    this.clearTimeouts();
    this.currentState = 'complete';
    this.onStateChange('complete');
  }

  private clearTimeouts() {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
  }

  cleanup() {
    this.clearTimeouts();
  }
} 