import { AbstractDay } from '../AbstractDay';

export class Day03 extends AbstractDay {
  dayNumber = 3

  protected day(): void {
    console.log('Example   : ' + this.solve(this.example(), true))
    console.log('Real input: ' + this.solve(this.input(), false))
  }

  private solve(input: string, isExample: boolean): number {
    const schematic = new Schematic(input, isExample)
    let parts = schematic.parts
    let gearsSum = 0
    partsSearch: for (let i = 0; i < parts.length; i++) {
      if (parts[i].symbol === '*') {
        let copiesFound = 0
        let gearRatio = parts[i].partNumber
        for (let j = i+1; j < parts.length; j++) {
          if (parts[i].locI === parts[j].locI && parts[i].locJ === parts[j].locJ) {
            gearRatio *= parts[j].partNumber
            copiesFound++
          } 
        }
        if (copiesFound === 1) {
          gearsSum += gearRatio
          if (isExample) {
            console.log(`Found one gear at (${parts[i].locI}, ${parts[i].locJ}) with two numbers, with ratio ${gearRatio}`)
          }
        } else {
          if (isExample) {
            console.log(`Found one * at (${parts[i].locI}, ${parts[i].locJ}) but it had ${copiesFound} copy/copies`)
          }
        }
      }
    }
    console.log("Sum of gear ratios is " + gearsSum)
    return schematic.parts.map(part => part.partNumber).reduce((a, b) => a + b)
  }
}

class Schematic {
  fullGrid: string[][]
  unpairedNumbers: number[] = []
  parts: Part[] = [];

  constructor(input: string, isExample: boolean) {
    this.fullGrid = input.split('\n').map(line => line.split(''))
    const lineLen = this.fullGrid.length
    const colLen = this.fullGrid[0].length
    for (let i: number = 0; i < lineLen; i++) {
      for (let j: number = 0; j < colLen; j++) {
        if (/\d/.test(this.fullGrid[i][j])) {
          
          // find part number beginning and end
          const startJ = j
          while (j < this.fullGrid[0].length && /\d/.test(this.fullGrid[i][j+1])) {
            j++
          }
          // parse the number
          const partNumber = +this.fullGrid[i].slice(startJ, j+1).join('')

          // look for the symbol
          const colStart = (startJ === 0 ? 0 : startJ - 1)
          const colEnd = (j + 1 === colLen ? colLen : j + 2)

          let symbol
          let symbolLocI = -1
          let symbolLocJ = -1
          symbolSearch: for (let w = i-1; w < i+2; w++) {
            if (w > 0 && w < lineLen) {
              for (let k: number = colStart; k < colEnd; k++) {
                if (!/\d/.test(this.fullGrid[w][k]) && !/\./.test(this.fullGrid[w][k])) {
                  symbol = this.fullGrid[w][k]
                  symbolLocI = w
                  symbolLocJ = k
                  break symbolSearch;
                }
              }
            }
          }
          
          if (symbol) {
            this.parts.push(new Part(symbol, symbolLocI, symbolLocJ, partNumber))
            if (isExample) {
              console.log(`Found a number at (${i},${startJ}) = ${this.fullGrid[i][startJ]} to (${i},${j}) = ${this.fullGrid[i][j]}, forming ${partNumber} with symbol ${symbol} at (${symbolLocI}, ${symbolLocJ})`)
            }
          } else {
            this.unpairedNumbers.push(partNumber)
            if (isExample) {
              console.log(`Found a number at (${i},${startJ}) = ${this.fullGrid[i][startJ]} to (${i},${j}) = ${this.fullGrid[i][j]}, forming ${partNumber} with no symbol`)
            }
          }
        }
      }
    }
  }
}

class Part {
  symbol: string
  locI: number
  locJ: number
  partNumber: number


  constructor(symbol: string, locI: number, locJ: number, partNumber: number) {
    this.symbol = symbol
    this.partNumber = partNumber
    this.locI = locI
    this.locJ = locJ
  }
}
