/**
 * Promisfied setTimeout
 */
export const sleep = (duration: number): Promise<unknown> =>
  new Promise((resolve: TimerHandler) => setTimeout(resolve, duration));
