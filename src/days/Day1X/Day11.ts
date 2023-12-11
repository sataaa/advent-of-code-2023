import { AbstractDay } from '../AbstractDay';

export class Day11 extends AbstractDay {
  dayNumber = 11

  protected day(): void {
    console.log('Example    : ' + this.solve(this.example(), true));
    console.log('Real input : ' + this.solve(this.input(), false));
  }

  private solve(input: string, isExample: boolean): number {
    let universe = new Universe(input, isExample);
    universe.expand(2)
    if (isExample) {
      console.log('After expansion "1" map: \n' + universe.toString())
      console.log('After expansion "1" sum: ' + universe.sumDistances())
      universe = new Universe(input, false);
      universe.expand(10)
      console.log('After expansion 10 sum: ' + universe.sumDistances())
      universe = new Universe(input, false);
      universe.expand(100)
      console.log('After expansion 100 sum: ' + universe.sumDistances())
    }
    
    universe = new Universe(input, false);
    universe.expand(1000000)
    return universe.sumDistances();
  }
}

class Universe {
  galaxies: Galaxy[] = [];

  constructor(input: string, isExample: boolean) {
    let grid: string[][] = input.split('\n').map(line => line.split(''));
    let emptyColumns: number[] = [];
    // store empty columns
    col: for (let j = 0; j < grid[0].length; j++) {
      for (let i = 0; i < grid.length; i++) {
        if (grid[i][j] === '#') {
          continue col;
        }
      }
      emptyColumns.push(j);
    }

    let emptyLinesCount: number = 0;
    // store galaxies
    for (let i = 0; i < grid.length; i++) {
      let lineEmpty = true;
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === '#') {
          lineEmpty = false;
          let colRate = emptyColumns.filter(val => val < j).length;
          this.galaxies.push(new Galaxy(i, j, emptyLinesCount, colRate));
        }
      }
      if (lineEmpty) {
        emptyLinesCount++
      }
    }

    if (isExample) {
      console.log(this.toString());
    }
  }

  sumDistances(): number {
    let sum = 0;
    for (let i = 0; i < this.galaxies.length; i++) {
      for (let j = i+1; j < this.galaxies.length; j++) {
        const iLen = Math.abs(this.galaxies[i].line - this.galaxies[j].line);
        const jLen = Math.abs(this.galaxies[i].column - this.galaxies[j].column);
        sum += iLen + jLen;
      }
    }
    return sum;
  }

  expand(expansionRate: number): void {
    // update galaxies
    this.galaxies.forEach(galaxy => {
      galaxy.line += galaxy.lineExpansionRate * (expansionRate-1)
      galaxy.column += galaxy.columnExpansionRate * (expansionRate-1)
    });
  }

  public toString(): string {
    let output = `Galaxies: ${this.galaxies}\n`;

    const galaxyMap = new Map(this.galaxies.map(galaxy => [`${galaxy.line}, ${galaxy.column}`, galaxy]));
    const maxLines = this.galaxies.map(galaxy => galaxy.line).reduce((a, b) => a > b ? a : b) + 1;
    const maxColumns = this.galaxies.map(galaxy => galaxy.column).reduce((a, b) => a > b ? a : b) + 1;

    for (let i = 0; i < maxLines; i++) {
      for (let j = 0; j < maxColumns; j++) {
        if (galaxyMap.has(`${i}, ${j}`)) {
          output += '#';
        } else {
          output += '.';
        }
      }
      output += '\n';
    }

    return output;
  }

}

class Galaxy {
  line: number;
  column: number;
  lineExpansionRate: number;
  columnExpansionRate: number;

  constructor(line: number, column: number, lineExpansionRate: number, columnExpansionRate: number) {
    this.line = line;
    this.column = column;
    this.lineExpansionRate = lineExpansionRate;
    this.columnExpansionRate = columnExpansionRate;
  }

  public toString(): string {
    return `(${this.line}, ${this.column})`
  }
}