import now from "performance-now";
import fs from 'fs'

export abstract class AbstractDay {
  protected abstract day(): void;
  abstract dayNumber: number;

  main(): void {
    let startTime: number = now();
    this.day();
    let endTime: number = now();

    console.info("Day " + this.dayNumber + " execution took " + (endTime - startTime) + "ms.");
  }

  protected input(): string {
    let fileName: string = "build/" + this.getDayName() + ".input";
    return fs.readFileSync(fileName, 'utf-8');
  }

  protected example(suffix?: string): string {
    let fileName: string = "build/" + this.getDayName() + ".example" + (suffix || "");
    return fs.readFileSync(fileName, 'utf-8');
  }

  private getDayName(): string {
    return this.dayNumber < 10 ? "Day0" + this.dayNumber : "Day" + this.dayNumber;
  }
}