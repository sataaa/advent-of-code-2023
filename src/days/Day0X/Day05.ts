import { AbstractDay } from '../AbstractDay';

export class Day05 extends AbstractDay {
  dayNumber = 5

  protected day(): void {
    console.log('Example    : ' + this.solve(this.example(), true))
    // takes almost 6mins
    // console.log('Real input : ' + this.solve(this.input(), false))
  }

  private solve(input: string, isExample: boolean): number {
    const almanac: Almanac = new Almanac(input, isExample)
    const part1 = Math.min(...almanac.seedsToLocation(almanac.seeds, isExample))
    const part2 = almanac.seedRangesToMinLocation(isExample)
    console.log (`Part one   : ${part1}`)
    return part2
  }
}

class Almanac {
  seeds: number[]
  seedToSoilRanges: RangeConversion[]
  soilToFertilizerRanges: RangeConversion[]
  fertilizerToWaterRanges: RangeConversion[]
  waterToLightRanges: RangeConversion[]
  lightToTemperatureRanges: RangeConversion[]
  temperatureToHumidityRanges: RangeConversion[]
  humidityToLocationRanges: RangeConversion[]

  constructor(input: string, isExample: boolean) {
    const inputParts = input.split('\n\n')
    this.seeds = inputParts[0].split(': ')[1].split(' ').map(n => +n)
    if (isExample) {
      console.log("Parsed seeds: " + JSON.stringify(this.seeds))
    }

    this.seedToSoilRanges =            this.parseRanges(inputParts[1])
    this.soilToFertilizerRanges =      this.parseRanges(inputParts[2])
    this.fertilizerToWaterRanges =     this.parseRanges(inputParts[3])
    this.waterToLightRanges =          this.parseRanges(inputParts[4])
    this.lightToTemperatureRanges =    this.parseRanges(inputParts[5])
    this.temperatureToHumidityRanges = this.parseRanges(inputParts[6])
    this.humidityToLocationRanges =    this.parseRanges(inputParts[7])

    if (isExample) {
      console.log("seed-to-soil ranges           : " + JSON.stringify(this.seedToSoilRanges.map(e => e.toString())))
      console.log("soil-to-fertilizer ranges     : " + JSON.stringify(this.soilToFertilizerRanges.map(e => e.toString())))
      console.log("fertilizer-to-water ranges    : " + JSON.stringify(this.fertilizerToWaterRanges.map(e => e.toString())))
      console.log("water-to-light ranges         : " + JSON.stringify(this.waterToLightRanges.map(e => e.toString())))
      console.log("light-to-temperature ranges   : " + JSON.stringify(this.lightToTemperatureRanges.map(e => e.toString())))
      console.log("temperature-to-humidity ranges: " + JSON.stringify(this.temperatureToHumidityRanges.map(e => e.toString())))
      console.log("humidity-to-location ranges   : " + JSON.stringify(this.humidityToLocationRanges.map(e => e.toString())))
    }
  }

  private parseRanges(inputBlock: string): RangeConversion[] {
    return inputBlock.split('\n')
      .splice(1)
      .map(line => new RangeConversion(line))
      .sort((r1, r2) => r1.sourceRangeStart - r2.sourceRangeStart)
  }

  public seedsToLocation(seeds: number[], isExample: boolean): number[] {
    return seeds.map(seed => this.seedToLocation(seed, isExample))
  }

  private seedToLocation(seed: number, isExample: boolean): number {
    const soil        = this.findConvertOrDefault(seed,        this.seedToSoilRanges)
    const fertilizer  = this.findConvertOrDefault(soil,        this.soilToFertilizerRanges)
    const water       = this.findConvertOrDefault(fertilizer,  this.fertilizerToWaterRanges)
    const light       = this.findConvertOrDefault(water,       this.waterToLightRanges)
    const temperature = this.findConvertOrDefault(light,       this.lightToTemperatureRanges)
    const humidity    = this.findConvertOrDefault(temperature, this.temperatureToHumidityRanges)
    const location    = this.findConvertOrDefault(humidity,    this.humidityToLocationRanges)
    if (isExample) {
      console.log(`Seed ${seed}, soil ${soil}, fertilizer ${fertilizer}, water ${water}, light ${light}, temperature ${temperature}, humidity ${humidity}, location ${location}`)
    }
    return location
  }

  public seedRangesToMinLocation(isExample: boolean): number {
    let minLocation = -1
    let totalSeeds = 0
    for (let i = 0; i < this.seeds.length; i += 2) {
      const rangeStart = this.seeds[i]
      const rangeEnd = this.seeds[i] + this.seeds[i + 1]
      for (let seed = rangeStart; seed < rangeEnd; seed++) {
        totalSeeds++
        const newLocation = this.seedToLocation(seed, false)
        if (newLocation < minLocation || minLocation === -1) {
          if (isExample) {
            console.log(`New minLocation found with seed ${seed}: ${newLocation}`)
            this.seedToLocation(seed, true)
          }
          minLocation = newLocation
        }
      }
      if (isExample) {
        console.log(`Range ${(i/2)+1} contained numbers [${rangeStart} to ${rangeEnd-1}] (${rangeEnd-rangeStart} values)`)
      }
    }

    console.log(`Total seeds converted: ${totalSeeds}`)

    return minLocation
  }

  private findConvertOrDefault(source: number, ranges: RangeConversion[]): number {
    const matchingRange = ranges.find(range => range.sourceIsInRange(source))
    return matchingRange ? matchingRange.convertSource(source) : source
  }
}

class RangeConversion {
  destRangeStart: number
  destRangeEnd: number
  sourceRangeStart: number
  sourceRangeEnd: number
  rangeLength: number

  constructor(line: string) {
    const numbers = line.split(' ')
    this.destRangeStart = +numbers[0]
    this.sourceRangeStart =  +numbers[1]
    this.rangeLength = +numbers[2]
    this.destRangeEnd = this.destRangeStart + this.rangeLength
    this.sourceRangeEnd = this.sourceRangeStart + this.rangeLength
  }

  public sourceIsInRange(source: number): boolean {
    return source >= this.sourceRangeStart && source < this.sourceRangeEnd
  }

  public convertSource(source: number): number {
    return source - this.sourceRangeStart + this.destRangeStart
  }

  public toString(): string {
    return `{${this.sourceRangeStart} <= x < ${this.sourceRangeEnd} -> diff ${this.destRangeStart - this.sourceRangeStart})}`
  }
}

