import { exit } from 'process';
import { AbstractDay } from '../AbstractDay';

export class Day16 extends AbstractDay {
  dayNumber = 16

  protected day(): void {
    console.log('Example      : ' + this.solve(this.example(), true));
    console.log('Real input   : ' + this.solve(this.input(), false));
  }

  private solve(input: string, isExample: boolean): number {
    let part1Energy = this.calculateEnergy(input, 0, 0, 'E', isExample)
    console.log('Part 1       : ' + part1Energy)

    // for all tiles on north wall, go south
    let totalLines = input.split('\n').length
    let totalCols = input.split('\n')[0].length
    let maxEnergy = 0
    for (let j = 0; j < totalCols; j++) {
      const currEnergy = this.calculateEnergy(input, 0, j, 'S', false);
      if (currEnergy > maxEnergy) {
        maxEnergy = currEnergy
      }
    }

    // for all tiles on south wall, go north
    for (let j = 0; j < totalCols; j++) {
      const currEnergy = this.calculateEnergy(input, totalLines - 1, j, 'N', false);
      if (currEnergy > maxEnergy) {
        maxEnergy = currEnergy
      }
    }

    // for all tiles on west wall, go east
    for (let i = 0; i < totalLines; i++) {
      const currEnergy = this.calculateEnergy(input, i, 0, 'E', false);
      if (currEnergy > maxEnergy) {
        maxEnergy = currEnergy
      }
    }

    // for all tiles on east wall, go west
    for (let i = 0; i < totalLines; i++) {
      const currEnergy = this.calculateEnergy(input, i, totalCols - 1, 'W', false);
      if (currEnergy > maxEnergy) {
        maxEnergy = currEnergy
      }
    }

    return maxEnergy
  }

  private calculateEnergy(input: string, startI: number, startJ: number, startDir: string, isExample: boolean): number {
    let beams = [new Beam(startI, startJ, startDir)];
    const grid = input.split('\n').map(line => line.split('').map(c => new Tile(c)));
    while (beams.some(beam => !grid[beam.i][beam.j].isFloorAndEnergized(beam.direction))) {
      let newBeams: Beam[] = []
      for (let i = 0; i < beams.length; i++) {
        grid[beams[i].i][beams[i].j].energizeDirection(beams[i].direction)

        switch (grid[beams[i].i][beams[i].j].c) {
          case '\\':
            switch (beams[i].direction) {
              case 'E':
                beams[i].updateDirection('S')
                break;
              case 'W':
                beams[i].updateDirection('N')
                break;
              case 'N':
                beams[i].updateDirection('W')
                break;
              case 'S': default:
                beams[i].updateDirection('E')
            }
            break;
          case '/':
            switch (beams[i].direction) {
              case 'E':
                beams[i].updateDirection('N')
                break;
              case 'W':
                beams[i].updateDirection('S')
                break;
              case 'N':
                beams[i].updateDirection('E')
                break;
              case 'S': default:
                beams[i].updateDirection('W')
            }
            break;
          case '|':
            switch (beams[i].direction) {
              case 'E': case 'W':
                beams[i].updateDirection('N')
                if (beams[i].i + 1 < grid.length) {
                  newBeams.push(new Beam(beams[i].i + 1, beams[i].j, 'S'))
                }
                break;
              case 'N': case 'S': default:
            }
            break;
          case '-':
            switch (beams[i].direction) {
              case 'N': case 'S':
                beams[i].updateDirection('W')
                if (beams[i].j + 1 < grid[0].length) {
                  newBeams.push(new Beam(beams[i].i, beams[i].j + 1, 'E'))
                }
                break;
              case 'W': case 'E': default:
            }
          case '.': default:
        }
      }
      // now we know the beams can be moved
      for (let i = 0; i < beams.length; i++) {
        let nextI = beams[i].i + beams[i].di
        let nextJ = beams[i].j + beams[i].dj
        // check if should remove beam
        const outOfBounds = nextI < 0 || nextI >= grid.length || nextJ < 0 || nextJ >= grid[0].length;
        if (outOfBounds || grid[nextI][nextJ].isFloorAndEnergized(beams[i].direction)) {
          beams.splice(i, 1)
          i--;
          continue;
        }
        beams[i].i = nextI;
        beams[i].j = nextJ;
      }
      beams = beams.concat(newBeams)
    }
    if (isExample) {
      console.log(grid.map(line => line.map(tile => tile.isEnergized() ? '#' : '.').join('')).join('\n'))
    }

    return grid.map(line => line.filter(tile => tile.isEnergized()).length).reduce((a, b) => a + b)
  }
}

class Beam {
  i: number;
  j: number;
  di: number = 0;
  dj: number = 0;
  direction: string = 'E';
  constructor(i: number, j: number, direction: string) {
    this.i = i;
    this.j = j;
    this.updateDirection(direction);
  }

  updateDirection(direction: string) {
    this.direction = direction;
    switch (direction) {
      case 'E':
        this.di = 0;
        this.dj = 1;
        break;
      case 'W':
        this.di = 0;
        this.dj = -1;
        break;
      case 'N':
        this.di = -1;
        this.dj = 0;
        break;
      case 'S': default:
        this.di = 1;
        this.dj = 0;
    }
  }

  public toString(): string {
    return `[pos(${this.i},${this.j}), dir(${this.direction} - ${this.di},${this.dj})]`
  }
}

class Tile {
  c: string;
  isEnergizedS: boolean = false
  isEnergizedN: boolean = false
  isEnergizedW: boolean = false
  isEnergizedE: boolean = false
  isFloor: boolean
  constructor(c: string) {
    this.c = c;
    this.isFloor = c === '.'
  }

  isEnergized(): boolean {
    return this.isEnergizedE || this.isEnergizedN || this.isEnergizedS || this.isEnergizedW;
  }

  isFloorAndEnergized(direction: string): boolean {
    if (!this.isFloor) {
      return false
    }

    return (direction === 'E' && this.isEnergizedE)
    || (direction === 'W' && this.isEnergizedW)
    || (direction === 'S' && this.isEnergizedS)
    || (direction === 'N' && this.isEnergizedN)
  }

  energizeDirection(direction: string) {
    switch (direction) {
      case 'E':
        this.isEnergizedE = true;
        return;
      case 'W':
        this.isEnergizedW = true;
        return;
      case 'S':
        this.isEnergizedS = true;
        return;
      case 'N': default:
        this.isEnergizedN = true;
    }
  }
}