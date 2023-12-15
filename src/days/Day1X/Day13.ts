import { AbstractDay } from '../AbstractDay';

export class Day13 extends AbstractDay {
  dayNumber = 13

  protected day(): void {
    console.log('Example      : ' + this.solve(this.example(), true, false));
    console.log('Real input   : ' + this.solve(this.input(), false, false));
    console.log('Example    p2: ' + this.solve(this.example(), true, true));
    console.log('Real input p2: ' + this.solve(this.input(), false, true));
  }

  private solve(input: string, isExample: boolean, isPart2: boolean): number {
    let patterns: Pattern[] = input.split('\n\n').map(pattern => new Pattern(pattern))

    return patterns.map(p => p.getMirrorScore(isExample, isPart2)).reduce((a, b) => a + b);
  }
}

class Pattern {
  floor: string[][]

  constructor(input: string) {
    this.floor = input.split('\n').map(line => line.split(''))
  }

  getDifferences(firstPart: string[], secondPart: string[]): number {
    let differences = 0
    for (let i = 0; i < firstPart.length; i++) {
      if (firstPart[i] !== secondPart[i]) {
        differences++
      }
    }
    return differences
  }

  getMirrorLocation(floor: string[][], isPart2: boolean): number {
    for (let i = 0; i < floor.length - 1; i++) {
      let differences = 0;
      for (let k = 1; k + i < floor.length && (i - k + 1 >= 0); k++) {
        differences += this.getDifferences(floor[i - k + 1], floor[i + k])
      }
      if ((isPart2 && differences === 1) || (!isPart2 && differences === 0)) {
        return i+1
      }
    }
    return 0
  }

  getMirrorScore(isExample: boolean, isPart2: boolean): number {
    if (isExample) {
      console.log(`Checking pattern\n${this.floor.map(lines => lines.join('')).join('\n')}`)
    }
    // check lines reflection
    let linesCheck = this.getMirrorLocation(this.floor, isPart2)
    if (linesCheck > 0) {
      if (isExample) {
        console.log(`Found mirror at line ${linesCheck}`)
      }
      return linesCheck * 100
    }
    
    const transposed = this.floor[0].map((_, j) => this.floor.map(row => row[j]));
    if (isExample) {
      console.log(`Checking columns`)
    }
    linesCheck = this.getMirrorLocation(transposed, isPart2)
    if (linesCheck > 0) {
      if (isExample) {
        console.log(`Found mirror at column ${linesCheck}`)
      }
      return linesCheck
    }
    
    return 0
  }
}