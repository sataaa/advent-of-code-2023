import { AbstractDay } from '../AbstractDay';

export class Day12 extends AbstractDay {
  dayNumber = 12

  protected day(): void {
    console.log('Example    p1: ' + this.solve(this.example(), true, true));
    console.log('Real input p1: ' + this.solve(this.input(), false, true));
    console.log('Example    p2: ' + this.solve(this.example(), false, false));
    console.log('Real input p2: ' + this.solve(this.input(), false, false));
  }

  private solve(input: string, isExample: boolean, isPart1: boolean): number {
    const rows: SpringRow[] = input.split('\n').map(line => new SpringRow(line, isPart1))
    
    return rows.map(row => row.countPossibleArrangements(isExample)).reduce((a, b) => a + b)
  }
}

class SpringRow {
  records: string[];
  originalInput: string;
  sanity: number[];
  static validArrangements: Map<string, number> = new Map<string, number>()

  constructor(input: string, isPart1: boolean) {
    let inputParts = input.split(' ');
    this.originalInput = input;
    if (!isPart1) {
      inputParts[0] = (inputParts[0] + '?').repeat(4) + inputParts[0];
      inputParts[1] = (inputParts[1] + ',').repeat(4) + inputParts[1];
    }
    this.records = inputParts[0].split('')
    if (inputParts[1].length !== 0) {
      this.sanity = inputParts[1].split(',').map(n => +n);
    } else {
      this.sanity = []
    }
  }

  countPossibleArrangements(isExample: boolean): number {
    if (this.sanity.length === 0) {
      return this.records.includes('#') ? 0 : 1;
    }

    let currWalker = 0;
    while (currWalker < this.records.length && this.records[currWalker] === '.') {
      currWalker++;
    }

    if (this.records[currWalker] === '?') {
      // we try to start a block and to NOT start a block ('#' or '.'):
      this.records[currWalker] = '#';
      let flippedNext = false;
      if (this.sanity[0] === 1) {
        // then we also have to make sure that if the next one is a ?, it is turned to .
        if (currWalker < this.records.length && this.records[currWalker + 1] === '?') {
          this.records[currWalker + 1] = '.'
          flippedNext = true
        }
      }

      let newInput = this.records.join('').substring(currWalker) + ' ' + this.sanity.join(',')
      const part1 = this.calculateOrGet(newInput, isExample)

      this.records[currWalker] = '.';
      if (flippedNext) {
        this.records[currWalker + 1] = '?'
      }

      newInput = this.records.join('').substring(currWalker) + ' ' + this.sanity.join(',')
      const part2 = this.calculateOrGet(newInput, isExample)
      return part1 + part2;
    }

    let startedBlock = false
    let blockSize = 0
    if (this.records[currWalker] === '#') {
      startedBlock = true
    }

    while (currWalker < this.records.length && this.records[currWalker] === '#') {
      blockSize++
      currWalker++
    }
    if (blockSize > this.sanity[0]) {
      return 0;
    }

    // found the correct size, repeat for smaller problem
    if (blockSize === this.sanity[0]) {
      if (currWalker < this.records.length && this.records[currWalker] === '?') { 
        // then if the next is a ? it has to be a .
        this.records[currWalker] = '.'
      }
      
      const newSanity = this.sanity.slice(1, this.sanity.length)
      const newInput = this.records.join('').substring(currWalker) + ' ' + newSanity.join(',')
      const returnVal = this.calculateOrGet(newInput, isExample);

      return returnVal;
    }

    // if there is still something left on the first sanity check
    if (currWalker < this.records.length && this.records[currWalker] === '.') {
      return 0;
    }

    // finally, it is a "?" and we still have sanity size left to check, so assume it is a # and continue
    while (currWalker < this.records.length && blockSize < this.sanity[0] 
           && (this.records[currWalker] === '?' || this.records[currWalker] === '#')) {
      currWalker++;
      blockSize++;
    }
    
    if (blockSize === this.sanity[0]) {
      // make sure the next one isn't a #
      if (currWalker === this.records.length || this.records[currWalker] !== '#') {
        // if the next one is a '?', then set it to '.'
        if (currWalker < this.records.length && this.records[currWalker] === '?') {
          this.records[currWalker] = '.'
        } 
        
        const newSanity = this.sanity.slice(1, this.sanity.length)
        const newInput = this.records.join('').substring(currWalker) + ' ' + newSanity.join(',')
        const returnVal = this.calculateOrGet(newInput, isExample)

        return returnVal
      }
      // if it is a #, then we got 0 matches down this road
    }
    return 0;
  }

  calculateOrGet(newInput: string, isExample: boolean): number {
    if (!SpringRow.validArrangements.has(newInput)) {
      const newResult = new SpringRow(newInput, true).countPossibleArrangements(isExample);
      SpringRow.validArrangements.set(newInput, newResult);
    }
    return SpringRow.validArrangements.get(newInput)!;
  }

  toString(): string {
    return `${this.records.join('')} ${this.sanity.join(',')}`
  }
}