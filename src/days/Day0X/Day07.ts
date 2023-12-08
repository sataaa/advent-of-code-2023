import { AbstractDay } from '../AbstractDay';

export class Day07 extends AbstractDay {
  dayNumber = 7;

  protected day(): void {
    console.log('Example game 1    : ' + this.solve(this.example(), false, true));
    console.log('Example game 2    : ' + this.solve(this.example(), true, true));
    console.log('Real input game 1 : ' + this.solve(this.input(), false, false));
    console.log('Real input game 2 : ' + this.solve(this.input(), true, false));
  }

  private solve(input: string, jokerGame: boolean, isExample: boolean): number {
    const hands = input.split('\n')
      .map(line => new Hand(line, jokerGame))
      .sort(Hand.compareHands);
    
    // set ranks
    for (let i = 0; i < hands.length; i++) {
      hands[i].rank = i + 1;
    }

    if (isExample) {
      console.log(hands.map(hand => JSON.stringify(hand)).join('\n'));
    }

    return hands.map(hand => hand.bid * hand.rank).reduce((a, b) => a + b);
  }

}

class Hand {
  literalCards: string;
  cardsPower: number[];
  bid: number;
  counter: number[];
  handPower: HandKind;
  handName: string;
  rank: number = -1;
  constructor(line: string, jokerGame: boolean) {
    const cardToPower = jokerGame ? new Map<string, number>([
        ['J', 0], ['2', 1], ['3', 2], ['4', 3], ['5', 4],
        ['6', 5], ['7', 6], ['8', 7], ['9', 8],
        ['T', 9], ['Q', 10], ['K', 11], ['A', 12]])
     : new Map<string, number>([
        ['2', 0], ['3', 1], ['4', 2], ['5', 3],
        ['6', 4], ['7', 5], ['8', 6], ['9', 7],
        ['T', 8], ['J', 9], ['Q', 10], ['K', 11], ['A', 12]]);

    const parts = line.split(' ');
    this.literalCards = parts[0];
    this.bid = +parts[1];
    this.cardsPower = this.literalCards.split('').map(card => cardToPower.get(card) || 0);
    this.counter = new Array(13).fill(0);
    this.cardsPower.forEach(card => this.counter[card]++);
    this.handPower = this.calculateHandPower(this.counter, this.cardsPower, jokerGame);
    this.handName = HandKind[this.handPower];
  }

  private calculateHandPower(counter: number[], cardsPower: number[], jokerGame: boolean): HandKind { 
    if (!jokerGame || !this.literalCards.includes('J') || this.literalCards === 'JJJJJ') {
      return this.calculateNormalHandPower(counter, cardsPower);
    }
    // has a Joker in hand during a Joker Game
    return [... new Set(this.literalCards.split('')
      .filter(card => card !== 'J')
      .map(card => this.literalCards.replace(/J/g, card)))] // at this point use a set to avoid duplicates
      .map(newHand => new Hand(newHand, false))
      .sort(Hand.compareHands)
      // peek
      // .map(item => {
      //   console.log(`New hand for original hand ${this.literalCards} found with joker: ${item.literalCards} -> ${JSON.stringify(item)}`)
      //   return item
      // })
      .pop()?.handPower || -1;
  }

  private calculateNormalHandPower(counter: number[], cardsPower: number[]): HandKind {
    if (counter[cardsPower[0]] === 5) {
      return HandKind.FIVE_OF_A_KIND;
    }
    if (counter[cardsPower[0]] === 4 || counter[cardsPower[1]] === 4) {
      return HandKind.FOUR_OF_A_KIND;
    }

    let pairs = 0;
    let triplets = 0;
    this.counter.forEach(count => {
      if (count === 2) {
        pairs++;
      } else if (count === 3) {
        triplets++;
      }
    })

    if (triplets === 1) {
      if (pairs === 1) {
        return HandKind.FULL_HOUSE;
      }
      return HandKind.THREE_OF_A_KIND;
    }

    if (pairs === 2) {
      return HandKind.TWO_PAIRS;
    }

    if (pairs === 1) {
      return HandKind.ONE_PAIR;
    }

    return HandKind.HIGH_CARD;
  }

  static compareHands = (hand1: Hand, hand2: Hand): number => {
    if (hand1.handPower !== hand2.handPower) {
      return hand1.handPower - hand2.handPower;
    }
    for (let i = 0; i < hand1.cardsPower.length; i++) {
      if (hand1.cardsPower[i] !== hand2.cardsPower[i]) {
        return hand1.cardsPower[i] - hand2.cardsPower[i];
      }
    }
    return 0;
  }
}

enum HandKind {
  FIVE_OF_A_KIND  = 7,
  FOUR_OF_A_KIND  = 6,
  FULL_HOUSE      = 5,
  THREE_OF_A_KIND = 4,
  TWO_PAIRS       = 3,
  ONE_PAIR        = 2,
  HIGH_CARD       = 1
}