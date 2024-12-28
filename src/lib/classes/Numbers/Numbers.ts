import { NumbersProps } from './Numbers.types';

export class Numbers {
  static getOnlyTheStringNumbers:NumbersProps['getOnlyTheStringNumbers'] = (dirtyString)=>{
    return dirtyString.split('').filter((itemStr) => !Number.isNaN(Number.parseInt((itemStr)))).join('')
  }
  static isNumber:NumbersProps['isNumber'] = (charStr) => {
    switch (typeof charStr) {
      case 'string':
        return [...charStr].every((item) => !Number.isNaN(Number(item)));
      case 'number': return true;
      default: return false; 
    }
  }
  static randomNumber:NumbersProps['randomNumber'] = () => {
    const date = new Date();
    return Math.floor(Math.random() * date.getTime())
  }
}