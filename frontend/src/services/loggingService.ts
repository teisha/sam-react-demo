import { ILoggerLevel } from '../models/ILoggerLevel';

export class Logger {
  constructor(private name: string, private logLevel: string) {}

  private outputToLog(logLevel: ILoggerLevel): boolean {
    if (logLevel === 'ERROR') {
      return true;
    }
    if (logLevel === 'DEBUG' && this.logLevel === 'DEBUG') {
      return true;
    }
    if (logLevel === 'INFO' && ['DEBUG', 'INFO'].includes(this.logLevel)) {
      return true;
    }
    return false;
  }

  private outputText(logFunction: typeof console.log, properties: any[], message: string) {
    if (properties.length) {
      logFunction(`${this.name}: ${message}`, ...properties);
    } else {
      logFunction(`${this.name}: ${message}`);
    }
  }

  log(message: string, ...properties: any[]) {
    if (this.outputToLog('INFO')) {
      this.outputText(console.log, properties, message);
    }
  }

  debug(message: string, ...properties: any[]) {
    if (this.outputToLog('DEBUG')) {
      this.outputText(console.debug, properties, message);
    }
  }

  error(message: string, ...properties: any[]) {
    this.outputText(console.error, properties, message);
  }

  errorObj(error: unknown) {
    console.error(this.name, JSON.stringify(error, Object.getOwnPropertyNames(error)));
  }
}

const loggers: { [name: string]: Logger } = {};

export const getLogger = (serviceName: string, logLevel: string): Logger => {
  if (!loggers[serviceName]) {
    loggers[serviceName] = new Logger(serviceName, logLevel);
  }
  return loggers[serviceName];
};
