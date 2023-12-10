import { AbstractDay } from '../AbstractDay';

export class Day09 extends AbstractDay {
  dayNumber = 9;

  protected day(): void {
    console.log('Example 1  : ' + this.solve(this.example(), true, true));
    console.log('Real input : ' + this.solve(this.input(), true, false));
    console.log('Example 1  : ' + this.solve(this.example(), false, true));
    console.log('Real input : ' + this.solve(this.input(), false, false));
  }

  private solve(input: string, isPartOne: boolean, isExample: boolean): number {
    return input.split('\n')
      .map(valueHistory => valueHistory.split(' ').map(n => +n))
      .map(valueHistory => {
        const nextVal = this.findNextValue(valueHistory, isPartOne);
        if (isExample) {
          console.log(`${isPartOne? 'Next' : 'Previous'} val for the history ${valueHistory} is ${nextVal}`);
        }
        return nextVal})
      .reduce((a, b) => a + b)
  }

  private findNextValue(valueHistory: number[], isPartOne: boolean): number {
    const diffs: number[] = this.generateDiffs(valueHistory)

    if (diffs.every(n => n === 0)) {
      return isPartOne? valueHistory[valueHistory.length - 1] : valueHistory[0]
    }

    return isPartOne? valueHistory[valueHistory.length - 1] + this.findNextValue(diffs, isPartOne) 
      : valueHistory[0] - this.findNextValue(diffs, isPartOne);
  }

  private generateDiffs(valueHistory: number[]): number[] {
    const diffs: number[] = new Array(valueHistory.length-1)
    for (let i = 1; i < valueHistory.length; i++) {
      diffs[i - 1] = valueHistory[i] - valueHistory[i - 1]
    }
    return diffs
  }
}
