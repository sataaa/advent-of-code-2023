import { AbstractDay } from '../AbstractDay';

export class Day01 extends AbstractDay {
  dayNumber = 1

  protected day(): void {
    console.log('Example   : ' + this.solve(this.example('1'), true))
    console.log('Example   : ' + this.solve(this.example('2'), true))
    console.log('Real input: ' + this.solve(this.input(), false))
  }

  private solve(input: string, isExample: boolean): number {
    return input.split('\n')
                .map(line => this.getDigits(line, isExample))
                .reduce((a, b) => a + b)
  }

  private findDigit(slice: string, isExample: boolean): string {
    const references: string[][] = [['one',   '1'],
                                    ['two',   '2'], 
                                    ['three', '3'], 
                                    ['four',  '4'],
                                    ['five',  '5'],
                                    ['six',   '6'],
                                    ['seven', '7'],
                                    ['eight', '8'],
                                    ['nine',  '9']]

    for (let check of references) {
      if (slice.startsWith(check[0]) || slice[0] === check[1]) {
        if (isExample) {
          console.log(`Found ${check[1]} at the beginning of ${slice}!`)
        }
        return check[1]
      }
    }
    
    return ''
  }

  private getDigits(line: string, isExample: boolean): number {
    let firstDigit = '0';
    for (let i = 0; i < line.length; i++) {
      let slice = line.substring(i, line.length)
      let digitFound = this.findDigit(slice, isExample)
      if (digitFound !== '') {
        firstDigit = digitFound
        break;
      }
    }
    let lastDigit = '0';
    for (let i = line.length-1; i >= 0; i--) {
      let slice = line.substring(i, line.length)
      let digitFound = this.findDigit(slice, isExample)
      if (digitFound !== '') {
        lastDigit = digitFound
        break;
      }
    }
    if (isExample) {
      console.log(`digits found on line ${line}: ${firstDigit} ${lastDigit}`)
    }
    return +(firstDigit + lastDigit)
  }

}