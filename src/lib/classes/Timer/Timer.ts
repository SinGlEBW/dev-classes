type TimerCallback = () => void;

export class Timer {
  private duration: number;
  private onComplete: TimerCallback;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private startTimeCount: number | null = null;
  private remainingTime: number;
  private isPaused: boolean = false;

  /**
   * @param duration - Время в миллисекундах
   * @param onComplete - Колбэк, вызываемый по истечении времени
   */
  constructor(duration: number, onComplete: TimerCallback) {
    if (duration < 0) {
      throw new Error("Duration cannot be negative");
    }
    this.duration = duration;
    this.remainingTime = duration;
    this.onComplete = onComplete;
  }

  /**
   * Запускает или возобновляет таймер
   */
  startTime() {
    if (this.timerId !== null || this.isPaused) {
      return; // Таймер уже запущен или на паузе
    }

    this.startTimeCount = Date.now();
    this.timerId = setTimeout(() => {
      this.complete();
    }, this.remainingTime);
  }

  /**
   * Ставит таймер на паузу
   */
  pauseTime(): void {
    if (this.timerId === null || this.isPaused) {
      return; // Таймер не запущен или уже на паузе
    }

    clearTimeout(this.timerId);
    this.timerId = null;

    // Вычисляем оставшееся время
    if (this.startTimeCount !== null) {
      const elapsed = Date.now() - this.startTimeCount;
      this.remainingTime = Math.max(0, this.remainingTime - elapsed);
      this.startTimeCount = null;
    }

    this.isPaused = true;
  }

  /**
   * Сбрасывает таймер к начальному состоянию
   */
  resetTime(): void {
    // Очищаем текущий таймер, если он запущен
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    // Сбрасываем все состояния
    this.remainingTime = this.duration;
    this.startTimeCount = null;
    this.isPaused = false;
  }

  /**
   * Завершает таймер и вызывает колбэк
   */
  private complete(): void {
    this.timerId = null;
    this.startTimeCount = null;
    this.remainingTime = this.duration;
    this.isPaused = false;
    this.onComplete();
  }

  /**
   * Проверяет, запущен ли таймер
   */
  isRunning(): boolean {
    return this.timerId !== null && !this.isPaused;
  }

  /**
   * Проверяет, находится ли таймер на паузе
   */
  isPausedState(): boolean {
    return this.isPaused;
  }

  /**
   * Возвращает оставшееся время в миллисекундах
   */
  getRemainingTime(): number {
    if (this.timerId !== null && this.startTimeCount !== null && !this.isPaused) {
      const elapsed = Date.now() - this.startTimeCount;
      return Math.max(0, this.remainingTime - elapsed);
    }
    return this.remainingTime;
  }
}
