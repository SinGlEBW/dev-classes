export interface NumbersProps {
  randomNumber: () => number;
  getOnlyTheStringNumbers(dirtyString: string): string;
  isNumber(charStr: string | number): boolean;
}