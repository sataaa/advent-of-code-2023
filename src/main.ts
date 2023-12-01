#!/usr/bin/env node
import { AdventOfCode } from './AdventOfCode'

class Main {
  main() {
    try {
      new AdventOfCode().main()
    } catch (e) {
      console.error(e);
    }
  }
}

const app = new Main()
app.main()