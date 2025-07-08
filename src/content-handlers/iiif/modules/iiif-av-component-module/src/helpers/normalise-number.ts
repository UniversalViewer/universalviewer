export function normalise(num: number, min: number, max: number): number {
  return (num - min) / (max - min);
}
