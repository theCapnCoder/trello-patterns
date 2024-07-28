export interface Observer {
  update(logLevel: string, message: string): void;
}