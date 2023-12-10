import { AbstractDay } from '../AbstractDay';

export class Day10 extends AbstractDay {
  dayNumber = 10;

  protected day(): void {
    console.log('Example 1  : ' + this.solve(this.example('1'), true));
    console.log('Example 2  : ' + this.solve(this.example('2'), true));
    console.log('Real input : ' + this.solve(this.input(), false));
  }

  private solve(input: string, isExample: boolean): number {
    const grid = new PipeMap(input, isExample);
    if (isExample) {
      console.log(grid.toString());
    }
    return Math.max(...grid.pipeMap.flat().map(pipe => pipe.depth));
  }
}

class PipeMap {
  pipeMap: Pipe[][];
  startingPipe?: Pipe;
  vertices: Pipe[] = new Array<Pipe>();
  innerArea: number;
  innerSpaces: number;

  constructor(input: string, isExample: boolean) {
    const grid = input.split('\n').map(line => line.split(''));
    this.pipeMap = new Array<Pipe[]>(grid.length);
    for (let i = 0; i < grid.length; i++) {
      this.pipeMap[i] = new Array<Pipe>(grid[i].length);
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === '.') {
          continue;
        }

        if (grid[i][j] === 'S') {
          this.pipeMap[i][j] = new Pipe(this.getStartPipeRealRepresentation(grid, i, j), i, j);
          this.startingPipe = this.pipeMap[i][j];
          continue;
        }
        this.pipeMap[i][j] = new Pipe(grid[i][j], i, j);
      }
    }
    this.calculateDepths();
    // part 2:
    // calculate area with shoelace formula using the pipe vertices
    let sum = 0;
    for (let i = 0; i < this.vertices.length; i++) {
      let nextVertex = this.vertices[(i + 1) % this.vertices.length];
      sum += this.vertices[i].col * nextVertex.line - this.vertices[i].line * nextVertex.col;
    }
    this.innerArea = Math.abs(sum / 2);

    // remove the length of all pipes in the loop:
    const loopLength = this.pipeMap.flat().filter(pipe => pipe.depth !== -1).length
    // isolating 'i' in pick's theorem:
    this.innerSpaces = this.innerArea - ((loopLength / 2) - 1)
    console.log("Inner spaces: " + this.innerSpaces)
  }

  isVertex(representation: string): boolean {
    switch (representation) {
      case '-':
      case '|':
        return false;
    }
    return true;
  }

  calculateDepths() {
    const startingPipe = this.startingPipe!
    if (this.isVertex(startingPipe.representation)) {
      this.vertices.push(startingPipe);
    }

    for (let dir = 0; dir <= 1; dir++) {
      let lastPipe = startingPipe;
      let nextDirection = lastPipe.possibleDirections[dir];

      let currentDepth = 0;
      lastPipe.depth = currentDepth;
      let walkingPipe = this.pipeMap[lastPipe.line + nextDirection.di][lastPipe.col + nextDirection.dj];

      while (walkingPipe !== startingPipe) {
        currentDepth++;
        if (walkingPipe.depth === -1 || currentDepth < walkingPipe.depth) {
          walkingPipe.depth = currentDepth;
        }
        nextDirection = walkingPipe.possibleDirections[0];
        if (this.pipeMap[nextDirection.di + walkingPipe.line][nextDirection.dj + walkingPipe.col] === lastPipe) {
          nextDirection = walkingPipe.possibleDirections[1];
        }
        if (dir === 0) { // only need to do this once, getting the vertices for part 2
          if (this.isVertex(walkingPipe.representation)) {
            this.vertices.push(walkingPipe);
          }
        }
        lastPipe = walkingPipe;
        walkingPipe = this.pipeMap[nextDirection.di + walkingPipe.line][nextDirection.dj + walkingPipe.col];
      }
    }
  }

  getStartPipeRealRepresentation(grid: string[][], i: number, j: number): string {
    const connectsToNorth = this.connectsToNorth(grid[i - 1][j]);
    const connectsToWest = this.connectsToWest(grid[i][j - 1]);
    const connectsToEast = this.connectsToEast(grid[i][j + 1]);

    if (connectsToNorth) {
      if (connectsToWest) {
        return 'J' // N + W
      }
      if (connectsToEast) {
        return 'L' // N + E
      }
      return '|' // N + S
    }
    if (connectsToWest) {
      if (connectsToEast) {
        return '-' // W + E
      }
      return '7' // W + S
    }
    return 'F' // S + E
  }

  connectsToEast(east: string) {
    switch (east) {
      case '-':
      case '7':
      case 'J':
        return true;
    }
    return false;
  }

  connectsToWest(west: string) {
    switch (west) {
      case '-':
      case 'F':
      case 'L':
        return true;
    }
    return false;
  }

  connectsToNorth(north: string) {
    switch (north) {
      case '|':
      case '7':
      case 'F':
        return true;
    }
    return false;
  }

  public toString(): string {
    let output = 'map:'
    output += ' '.repeat(this.pipeMap.length - output.length + 1)
    output += 'depths:'
    output += '\n'
    for (let i = 0; i < this.pipeMap.length; i++) {
      for (let j = 0; j < this.pipeMap[i].length; j++) {
        output += (i === this.startingPipe?.line && j === this.startingPipe.col ? 'S' : (this.pipeMap[i][j] ? this.pipeMap[i][j].representation : '.'))
      }
      output += ' ';
      for (let j = 0; j < this.pipeMap[i].length; j++) {
        output += (this.pipeMap[i][j] ? this.pipeMap[i][j].depth : '.')
      }
      output += '\n';
    }
    return output;
  }
}

class Pipe {
  line: number;
  col: number;
  representation: string;
  possibleDirections: Direction[] = new Array<Direction>(2)
  depth: number;

  constructor(representation: string, line: number, col: number) {
    this.representation = representation;
    this.line = line;
    this.col = col;
    this.depth = -1
    switch (representation) {
      case '|':
        this.possibleDirections[0] = new Direction(-1, 0)
        this.possibleDirections[1] = new Direction(1, 0)
        break;
      case '-':
        this.possibleDirections[0] = new Direction(0, 1)
        this.possibleDirections[1] = new Direction(0, -1)
        break;
      case 'L':
        this.possibleDirections[0] = new Direction(-1, 0)
        this.possibleDirections[1] = new Direction(0, 1)
        break;
      case 'J':
        this.possibleDirections[0] = new Direction(-1, 0)
        this.possibleDirections[1] = new Direction(0, -1)
        break;
      case '7':
        this.possibleDirections[0] = new Direction(1, 0)
        this.possibleDirections[1] = new Direction(0, -1)
        break;
      case 'F':
        this.possibleDirections[0] = new Direction(1, 0)
        this.possibleDirections[1] = new Direction(0, 1)
    }
  }
}

class Direction {
  di: number;
  dj: number;
  constructor(di: number, dj: number) {
    this.di = di;
    this.dj = dj;
  }
}