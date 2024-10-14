export class Numbers {
  static getOnlyTheStringNumbers(dirtyString){
    return dirtyString.split('').filter((itemStr) => !Number.isNaN(Number.parseInt((itemStr)))).join('')
  }
  static isNumber(charStr){
    try {
      if(charStr.length > 1){
        throw new Error('Передали < 1 значения')
      }
      return !Number.isNaN(Number.parseInt((charStr)))
      
    } catch (error) {
      console.error(error)
    }
  }
  static randomNumber = () => {
    const date = new Date();
    return Math.floor(Math.random() * date.getTime())
  }
}