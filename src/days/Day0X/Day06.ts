import { AbstractDay } from '../AbstractDay';

export class Day06 extends AbstractDay {
  dayNumber = 6

  protected day(): void {
    console.log('Example    : ' + this.solve(this.example(), true))
    console.log('Real input : ' + this.solve(this.input(), false))
  }

  private solve(input: string, isExample: boolean): number {
    const parts = input.replace(/\s\s+/g, ' ').split('\n')
    const times =     parts[0].split(': ')[1].split(' ').map(n => +n)
    const distances = parts[1].split(': ')[1].split(' ').map(n => +n)
    if (isExample) {
      console.log(`Times ${times}, Distances ${distances}`)
    }

    let mult = 1
    for (let i = 0; i < times.length; i++) {
      mult *= this.calculateWins(times[i], distances[i], isExample);
    }

    // part 2
    const realTime =     +times.map(n => '' + n).join('')
    const realDist = +distances.map(n => '' + n).join('')
    console.log("Long race: " + this.calculateWins(realTime, realDist, isExample));
    return mult
  }

  // dist = x*(t-x), where t is the race time and x the time the button was held
  // example 1, t = 7 record = 9
  // dist > 9 when x*(7-x) > 9
  // when 7x-x²-9 > 0 or more traditionally -1x² +7x -9 > 0
  // delta = sqrt(b²-4ac) = sqrt(7² - 4*(-1)(-9)) = sqrt(7²-4*9) (ref I)
  // delta = sqrt(49 - 36) = sqrt(13) =~ 3.6
  // r1 = (-7 + 3.6)/2*(-1)     | r2 = (-7 - 3.6)/2*(-1)
  // r1 = (7 - 3.6)/2 (ref II)  | r2 = (7 + 3.6)/ 2 (ref III)
  // r1 = 1.7                   | r2 = 5.3
  // so every integer x such that r1 < x < r2 wins the race
  // the number of possible wins is floor(r2) - ceiling(r1) + 1
  // note that if a root arrives at the record, subtract it from the total
  private calculateWins(time: number, dist: number, isExample: boolean) {
    const d = Math.sqrt(time * time - 4 * dist); // ref I above
    const r1 = (time - d) / 2; // ref II above
    const r2 = (time + d) / 2; // ref III above
    if (isExample) {
      console.log(`(time ${time} and dist ${dist}): r1 = ${r1}, r2 = ${r2}`);
      console.log(`wins = ${Math.floor(r2)} - ${Math.ceil(r1)} + 1 = ${Math.floor(r2) - Math.ceil(r1) + 1} (may change due to integer roots)`);
    }
    let wins = Math.floor(r2) - Math.ceil(r1) + 1 
               - (Math.ceil(r1) === r1 ? 1 : 0) 
               - (Math.floor(r2) === r2 ? 1 : 0)
    
    return wins;
  }
}
