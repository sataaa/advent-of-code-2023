import now from "performance-now";
import fs from 'fs'

export abstract class AbstractDay {
  protected abstract day(): void;
  abstract dayNumber: number;

  main(): void {
    const startTime: number = now();
    this.day();
    const endTime: number = now();

    console.info(`Day ${this.dayNumber} execution took ${this.formatTime(endTime - startTime)}.`);
  }

  protected input(): string {
    const fileName: string = `build/${this.getDayName()}.input`
    return fs.readFileSync(fileName, 'utf-8');
  }

  protected example(suffix?: string): string {
    let fileName: string = `build/${this.getDayName()}.example${suffix || ''}`;
    return fs.readFileSync(fileName, 'utf-8');
  }

  private getDayName(): string {
    return `Day${this.dayNumber < 10 ? 0 : ''}${this.dayNumber}`;
  }

  private formatTime(elapsed: number): string {
    if (elapsed > 60000) {
      return (Math.round(elapsed/60)/1000) + 'mins';
    }

    if (elapsed > 1000) {
      return (Math.round(elapsed)/1000) + 's';
    }

    return Math.round(elapsed*1000)/1000 + 'ms';
  }
}