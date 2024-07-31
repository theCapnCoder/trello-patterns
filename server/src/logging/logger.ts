import type { Observer } from './types';

// PATTERN:Observer - Publisher
class Logger {
  private observer: Observer[] = [];

  public subscribe(observer: Observer): void {
    this.observer.push(observer);
  }

  public unsubscribe(observer: Observer): void {
    this.observer = this.observer.filter(obs => obs !== observer);
  }

  public log(logLevel: string, message: string): void {
    this.observer.forEach(obs => obs.update(logLevel, message));
  }
}

export { Logger };
