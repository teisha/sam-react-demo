export class Env {
  static get corsOrigin(): string {
    return this.getVal("CORS_ORIGIN");
  }
  static get clientId(): string {
    return this.getVal("REACT_APP_CLIENT_ID");
  }
  static get userPoolId(): string {
    return this.getVal("REACT_APP_USERPOOL_ID");
  }

  static get jwtExpirationMinutes(): number {
    const val = this.getVal("JWT_EXPIRATION_HOURS", "8");
    return parseInt(val, 10) * 60;
  }

  static get dynamoTable(): string {
    return this.getVal("DYNAMO_TABLE");
  }

  static getVal(name: string, defaultValue?: string) {
    return process.env[name] ?? defaultValue ?? "";
  }
}
