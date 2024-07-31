import type { Observer } from './types';
import { appendFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// PATTERN: Observer - Subscriber
class FileLogger implements Observer {
  private logFilePath: string;

  public constructor() {
    this.logFilePath = join(process.cwd(), 'logs.txt');
    writeFileSync(this.logFilePath, '');
  }

  public update(logLevel: string, message: string): void {
    const logMessage = `[${logLevel}] ${new Date().toISOString()}: ${message}\n`;
    appendFileSync(this.logFilePath, logMessage);
  }
}

export { FileLogger };
