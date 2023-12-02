import { AbstractDay } from '../AbstractDay';

export class Day02 extends AbstractDay {
  dayNumber = 2

  protected day(): void {
    console.log('Example   : ' + this.solve(this.example()))
    console.log('Real input: ' + this.solve(this.input()))
  }

  private solve(input: string): number {
    const maxRed = 12
    const maxGreen = 13
    const maxBlue = 14

    const games: Game[] = input.split('\n').map(line => new Game(line.split(': ')))

    const powers: number = games.map(game => Math.max(...game.rolls.map(roll => roll.reds))
                                             * Math.max(...game.rolls.map(roll => roll.greens))
                                             * Math.max(...game.rolls.map(roll => roll.blues)))
                                .reduce((power1, power2) => power1 + power2)

    console.log('Power: ' + powers)

    return games.filter(game => game.rolls.every(roll => roll.blues <= maxBlue
                                                         && roll.reds <= maxRed
                                                         && roll.greens <= maxGreen))
         .map(game => game.id)
         .reduce((id1, id2) => id1 + id2)
  }
}

class Game {
  id: number
  rolls: Roll[]

  constructor(line: string[]) {
    this.id = +line[0].split(' ')[1]
    this.rolls = line[1].split('; ').map(roll => new Roll(roll))
  }
}

class Roll {
  reds: number = 0
  greens: number = 0
  blues: number = 0

  constructor(roll: string) {
    for (let vals of roll.split(', ')) {
      const current = vals.split(' ')
      switch (current[1]) {
        case 'red':
          this.reds = +current[0]
          break;
        case 'blue':
          this.blues = +current[0]
          break;
        case 'green':
          this.greens = +current[0]
      }
    }
  }
}