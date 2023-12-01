# advent-of-code-2023

## Input files
Add the input files at `src/days/files`. E.g.: Add a `Day01.input` file for your Day01 input at `src/days/files/Day01.input`.

If you want to use more examples, add them with a suffix: `src/days/files/Day01.exampleSecond` and call them with the
`AbstractDay` method `this.example("Second")`. If there is just one `Day01.example`, then just `this.example()` will
return that file.

IMPORTANT: Input and example files get copied to build directory during build (`npm run build`).

## Running

Change the day you want to run at `AdventOfCode.ts`.

1. Install dependencies with `npm install`. 
1. Build and copy files to `/build` directory with `npm run build`
1. Run the simulation once with `npm start` 
11. Run the simulation in dev-mode from the `src` directory and using nodemon with `npm run dev`.

Check package.json for more scripts.

