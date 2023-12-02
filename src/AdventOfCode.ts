import clear from 'clear';
import figlet from 'figlet';
import { AbstractDay } from './days/AbstractDay';
import { Day01 } from './days/Day0X/Day01';
import { Day02 } from './days/Day0X/Day02';


export class AdventOfCode {
  private day: number = 2

  readonly reference: AbstractDay[] = 
    [new Day01(), new Day02()];

  main(): void {
    clear();
    console.log(figlet.textSync('aoc23 Day' + (this.day < 10 ? '0' + this.day : this.day), { 
      font: 'Small', // 'Standard', 'Big', 'Fire Font-s', 'Rectangles'
      showHardBlanks: false, 
      horizontalLayout: 'default',
    }));

    if (this.day < 1 || this.day > this.reference.length || this.reference[this.day - 1] === undefined) {
      throw new Error(`Specified day ${this.day} does not have an implementation.`);
    }
    console.log(`Starting day ${this.day}`);

    this.reference[this.day - 1].main();
  }
}