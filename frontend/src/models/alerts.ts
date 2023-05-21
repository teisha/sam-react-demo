import { AlertColor } from '@mui/material';

export class ApplicationAlert {
  constructor(public message: string, public type: AlertColor, public timeout?: number) {}
}

export class ApplicationError extends Error {
  constructor(public statusCode: number, public detail: string) {
    super(`${statusCode}: ${detail}`);
    this.name = 'ApplicationError';
  }
}
