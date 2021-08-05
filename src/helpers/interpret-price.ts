/**
 * Converts price strings extracted from Kickbase into numbers
 */
export function interpretPrice(str: string): number {
  const trimmed: string = str.split('\n')[0];
  const splitted: string[] = trimmed.split('.');
  const joined: number = Number(splitted.join('').replace('€ ', ''));
  return joined;
}
