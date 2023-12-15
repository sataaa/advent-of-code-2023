import clear from 'clear';
import figlet from 'figlet';
import { AbstractDay } from './days/AbstractDay';
import { Day01 } from './days/Day0X/Day01';
import { Day02 } from './days/Day0X/Day02';
import { Day03 } from './days/Day0X/Day03';
import { Day04 } from './days/Day0X/Day04';
import { Day05 } from './days/Day0X/Day05';
import { Day06 } from './days/Day0X/Day06';
import { Day07 } from './days/Day0X/Day07';
import { Day08 } from './days/Day0X/Day08';
import { Day09 } from './days/Day0X/Day09';
import { Day10 } from './days/Day1X/Day10';
import { Day11 } from './days/Day1X/Day11';
import { Day12 } from './days/Day1X/Day12';
import { Day13 } from './days/Day1X/Day13';
import { Day14 } from './days/Day1X/Day14';
import { Day15 } from './days/Day1X/Day15';


export class AdventOfCode {
  private day: number = 15

  readonly reference: AbstractDay[] = 
    [new Day01(), new Day02(), new Day03(), new Day04(), new Day05(), 
      new Day06(), new Day07(), new Day08(), new Day09(), new Day10(), 
      new Day11(), new Day12(), new Day13(), new Day14(), new Day15()];

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