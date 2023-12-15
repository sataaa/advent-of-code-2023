
import { AbstractDay } from '../AbstractDay';

export class Day14 extends AbstractDay {
  dayNumber = 14

  protected day(): void {
    console.log('Example      : ' + this.solve(this.example()));
    console.log('Real input   : ' + this.solve(this.input()));
  }

  private solve(input: string): number {
    let platform: Dish = new Dish(input);
    platform.tiltNorth();
    console.log('Part 1       : ' + platform.calculateNorthLoad());

    platform = new Dish(input);
    platform.spinCycle();
    const seenCycles: Set<string> = new Set<string>();
    seenCycles.add(platform.toString());
    const maxLoop = 1000000000;
    let diff = 0;
    for (let i = 1; i < maxLoop; i++) {
      platform.spinCycle();
      const newCycle = platform.toString();
      if (seenCycles.has(newCycle)) {
        diff = i;
        break;
      }
      seenCycles.add(newCycle);
    }

    // found a seen cycle at "diff"
    // see how long it takes for it to be seen again:
    const seenCycle = platform.toString();
    platform.spinCycle();
    let loopSize = 1;
    while (platform.toString() !== seenCycle) {
      platform.spinCycle();
      loopSize++;
    }
    // walk the remaining steps needed (-1 because we already walked 1 more)
    for (let j = 0; j < (maxLoop - diff - 1) % loopSize; j++) {
      platform.spinCycle();
    }
    return platform.calculateNorthLoad();
  }
}

class Dish {
  platform: string[][];

  constructor(input: string) {
    this.platform = input.split('\n').map(line => line.split(''));
  }

  spinCycle(): void {
    this.tiltNorth();
    this.tiltWest();
    this.tiltSouth();
    this.tiltEast();
  }

  tiltWest(): void {
    for (let j = 1; j < this.platform[0].length; j++) {
      for (let i = 0; i < this.platform.length; i++) {
        if (this.platform[i][j] === 'O') {
          // roll left
          for (let k = j; j > 0 && this.platform[i][k - 1] === '.'; k--) {
            this.platform[i][k] = '.';
            this.platform[i][k - 1] = 'O';
          }
        }
      }
    }
  }

  tiltSouth(): void {
    for (let i = this.platform.length - 2; i >= 0; i--) {
      for (let j = 0; j < this.platform[0].length; j++) {
        if (this.platform[i][j] === 'O') {
          // roll down
          for (let k = i; k < this.platform.length - 1 && this.platform[k + 1][j] === '.'; k++) {
            this.platform[k][j] = '.';
            this.platform[k + 1][j] = 'O';
          }
        }
      }
    }
  }

  tiltEast(): void {
    for (let j = this.platform[0].length - 2; j >= 0; j--) {
      for (let i = 0; i < this.platform.length; i++) {
        if (this.platform[i][j] === 'O') {
          // roll right
          for (let k = j; j < this.platform[0].length - 1 && this.platform[i][k + 1] === '.'; k++) {
            this.platform[i][k] = '.';
            this.platform[i][k + 1] = 'O';
          }
        }
      }
    }
  }

  tiltNorth(): void {
    for (let i = 1; i < this.platform.length; i++) {
      for (let j = 0; j < this.platform[0].length; j++) {
        if (this.platform[i][j] === 'O') {
          // roll up
          for (let k = i; k > 0 && this.platform[k - 1][j] === '.'; k--) {
            this.platform[k][j] = '.';
            this.platform[k - 1][j] = 'O';
          }
        }
      }
    }
  }

  calculateNorthLoad(): number {
    let sum = 0;
    for (let i = 0; i < this.platform.length; i++) {
      for (let j = 0; j < this.platform.length; j++) {
        if (this.platform[i][j] === 'O') {
          sum += this.platform.length - i;
        }
      }
    }
    return sum;
  }

  toString(): string {
    return this.platform.map(line => line.join('')).join('\n');
  }
}



