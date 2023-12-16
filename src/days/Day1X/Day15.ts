import { AbstractDay } from '../AbstractDay';

export class Day15 extends AbstractDay {
  dayNumber = 15

  protected day(): void {
    console.log('Example      : ' + this.solve(this.example(), true));
    console.log('Real input   : ' + this.solve(this.input(), false));
  }

  private solve(input: string, isExample: boolean): number {
    const instructions = input.split(',');
    const boxes: Box[] = new Array<Box>(256);
    for (let i = 0; i < 256; i++) {
      boxes[i] = new Box();
    }
    instructions.forEach(instruction => {
      if (instruction.includes('=')) {
        const parts = instruction.split('=');
        boxes[this.calculateHash(parts[0])].placeLens(parts[0], +parts[1]);
      } else { // endsWith('-')
        const label = instruction.split('-')[0];
        boxes[this.calculateHash(label)].removeLens(label)
      }
      if (isExample) {
        console.log(`After "${instruction}":\n${this.boxesToString(boxes)}`);
      }
    })

    let boxesSum = 0
    for (let i = 0; i < boxes.length; i++) {
      for (let j = 0; j < boxes[i].slots.length; j++) {
        boxesSum += (i + 1) * (j + 1) * boxes[i].slots[j].focalLen
      }
    }
    console.log('Part 1       : '
      + instructions.map(step => this.calculateHash(step))
        .reduce((a, b) => a + b));
    return boxesSum
  }

  private boxesToString(boxes: Box[]): string {
    let output = ''
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].slots.length > 0) {
        output += `Box ${i}: ${boxes[i].slots}\n`
      }
    }
    return output;
  }

  private calculateHash(input: string): number {
    const hash = input.split('')
      .map(c => c.charCodeAt(0))
      .reduce((sum, code) => sum = ((sum + code) * 17) % 256, 0);
    return hash
  }
}

class Box {
  slots: Lens[] = new Array<Lens>;
  placeLens(label: string, focalLen: number) {
    for (let i = 0; i < this.slots.length; i++) {
      if (this.slots[i].label === label) {
        this.slots[i].focalLen = focalLen
        return;
      }
    }
    // if we got here, it's not on the list
    this.slots.push(new Lens(label, focalLen))
  }

  removeLens(label: string) {
    this.slots = this.slots.filter(lens => lens.label != label)
  }
}

class Lens {
  label: string;
  focalLen: number;
  constructor(label: string, focalLen: number) {
    this.label = label;
    this.focalLen = focalLen;
  }

  public toString(): string {
    return `[${this.label} ${this.focalLen}]`;
  }
}