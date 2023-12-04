import { AbstractDay } from '../AbstractDay';

export class Day04 extends AbstractDay {
  dayNumber = 4

  protected day(): void {
    console.log('Example    : ' + this.solve(this.example(), true))
    console.log('Real input : ' + this.solve(this.input(), false))
  }

  private solve(input: string, isExample: boolean): number {
    const cards = input.split('\n')
      .map(cardLine => new Card(cardLine, isExample));

    let totalCards = new Array<number>(cards.length).fill(1)
    for (let i = 0; i < cards.length; i++) {
      for (let j = 1; j <= cards[i].winnings; j++) { 
        totalCards[j + i] += totalCards[i]
      }
    }
    console.log(`Total cards: ${totalCards.reduce((a, b) => a + b)}`)
    return cards.map(card => card.points)
      .reduce((a, b) => a + b)
  }
}

class Card {
  cardNumber: number
  winningNumbers: number[]
  numbersYouHave: number[]
  winnings: number = 0
  points: number = 0
  constructor(cardLine: string, isExample: boolean) {
    const splitLine = cardLine.replace(/\s\s+/g, ' ').split(': ')
    this.cardNumber = +(splitLine[0].split(' ')[1])

    const numbers = splitLine[1].split(' | ')
    this.winningNumbers = numbers[0].split(' ').map(n => +(n))
    this.numbersYouHave = numbers[1].split(' ').map(n => +(n))
    
    this.winnings = this.numbersYouHave.filter(n => this.winningNumbers.includes(n)).length
    this.points = (this.winnings === 0 ? 0 : Math.pow(2, this.winnings - 1))

    if (isExample) {
      console.log(`Card ${this.cardNumber} scored ${this.points} with ${this.winnings} winnings, Winning numbers: (${JSON.stringify(this.winningNumbers)}) Numbers you have: (${JSON.stringify(this.numbersYouHave)})`)
    }
  }
}
