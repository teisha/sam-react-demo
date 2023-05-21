import ICognitoConfig from '../models/ICognitoConfig';
import { ILoggerLevel, isOfTypeLoggerLevel } from '../models/ILoggerLevel';

interface IConfig {
  log_level: string;
  cognito_config: ICognitoConfig;
  environment: string;
  api_url: string;
}

export class EnvironmentService {
  private cfg: IConfig = null as any;
  constructor() {
    this.cfg = {} as IConfig;
  }

  public async load() {
    if (!this.cfg || !this.cfg.api_url) {
      const response = await fetch('config.json');
      this.cfg = await response.json();
    }
  }

  get environment(): string {
    return this.cfg.environment;
  }

  get logLevel(): ILoggerLevel {
    if (isOfTypeLoggerLevel(this.cfg.log_level)) {
      return this.cfg.log_level;
    }
    throw new Error('Logging Level Not supplied correctly.');
  }

  get cognitoConfig(): ICognitoConfig {
    return this.cfg.cognito_config;
  }

  get backendUrl(): string {
    return this.cfg.api_url;
  }
}
