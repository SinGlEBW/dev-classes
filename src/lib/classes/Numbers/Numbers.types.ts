export interface NumbersProps {
  randomNumber: () => number;
  getOnlyTheStringNumbers(dirtyString: string): string;
  isNumber(charStr: string | number): boolean;
  random(): number;
  randomMinMax(min: number, max: number): number;
}