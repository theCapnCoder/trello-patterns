import { Observer } from "./types";

// PATTERN:Observer - Subscriber
class ConsoleErrorLogger implements Observer {
  public update(logLevel: string, message: string): void {
    if (logLevel === "error") {
      console.error(`[${logLevel}] ${new Date().toISOString()}:  ${message}`);
    }
  }
}

export { ConsoleErrorLogger };
