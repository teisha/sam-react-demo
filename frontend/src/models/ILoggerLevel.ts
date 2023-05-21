export type ILoggerLevel = 'DEBUG' | 'INFO' | 'ERROR';
export const isOfTypeLoggerLevel = (value: string): value is ILoggerLevel => {
  return ['DEBUG', 'INFO', 'ERROR'].includes(value);
};
