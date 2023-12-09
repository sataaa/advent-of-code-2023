import { AbstractDay } from '../AbstractDay';

export class Day08 extends AbstractDay {
  dayNumber = 8;

  protected day(): void {
    console.log('Example 1  : ' + this.solve(this.example('1'), false, true));
    console.log('Example 2  : ' + this.solve(this.example('2'), false, true));
    console.log('Real input : ' + this.solve(this.input(),      false, false));
    console.log('Example 3  : ' + this.solve(this.example('3'), true,  true));
    console.log('Real input : ' + this.solve(this.input(),      true,  false));
  }

  private solve(input: string, isPart2: boolean, isExample: boolean): number {
    const inputParts: string[] = input.split('\n\n');
    const stepDirection: number[] = inputParts[0].split('').map(c => c === 'L'? 0 : 1);
    const nodes: Map<string, Node> = this.parseChart(inputParts[1], isExample);
    
    let steps = 0

    if (!isPart2) {
      for (let currNode = nodes.get('AAA')!; currNode.name !== 'ZZZ'; currNode = currNode.nodes[stepDirection[steps++ % stepDirection.length]]);
      return steps;
    }

    let currNodes = [... nodes.values()].filter(node => node.isStart);
    let loopSizes: number[] = [];
    while (currNodes.length > 0) {
      const newDir = stepDirection[steps++ % stepDirection.length];
      currNodes = currNodes.map(node => node.nodes[newDir])
        .filter(node => {
          if (node.isEnd) {
            loopSizes.push(steps);
            if (isExample) {
              console.log(`Removing node ${node.name}, with # of steps ${steps}`);
            }
            return false;
          }
          return true;
        })
    }

    return loopSizes.reduce((a, b) => this.lcm(a, b));
  }

  private gcd(a: number, b: number): number {
    if (b === 0) return a;
    return this.gcd(b, a % b);
  }

  private lcm(a: number, b: number): number {
    return (a * b) / this.gcd(a, b);
  }

  private parseChart(chart: string, isExample: boolean): Map<string, Node> {
    const nodes = new Map<string, Node>();
    chart.split('\n')
      .map(line => line.split(' = '))
      .forEach(lineParts => {
        const currentNode: Node = this.getOrCreate(nodes, lineParts[0]);
        const leftNode: Node = this.getOrCreate(nodes, lineParts[1].substring(1, 4));
        const rightNode: Node = this.getOrCreate(nodes, lineParts[1].substring(6, 9));

        currentNode.nodes[0] = leftNode;
        currentNode.nodes[1] = rightNode;
      });
    if (isExample) {
      console.log('Parsed chart:');
      nodes.forEach(node => console.log(node.toString()));
    }
    return nodes
  }

  private getOrCreate(nodes: Map<string, Node>, nodeName: string): Node {
    if (nodes.has(nodeName)) {
      return nodes.get(nodeName)!;
    }
    const newNode: Node = new Node(nodeName);
    nodes.set(nodeName, newNode);
    return newNode;
  }
}

class Node {
  name: string;
  nodes: Node[] = new Array(2);
  isStart: boolean;
  isEnd: boolean;

  constructor(name: string) {
    this.name = name;
    this.isStart = name.endsWith('A');
    this.isEnd = name.endsWith('Z');
  }

  public toString(): string {
    return `Node: ${ this.name }: (${ this.nodes[0].name }, ${ this.nodes[1].name })`;
  }
}
