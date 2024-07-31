import type { Observer } from './types';

// PATTERN:Observer - Subscriber
class ConsoleErrorLogger implements Observer {
  public update(logLevel: string, message: string): void {
    if (logLevel === 'error') {
      // eslint-disable-next-line no-console
      console.error(`[${logLevel}] ${new Date().toISOString()}:  ${message}`);
    }
  }
}

export { ConsoleErrorLogger };
