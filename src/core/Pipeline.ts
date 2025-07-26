import { Node } from "../types";

export class Pipeline {
  constructor(private name: string, private nodes: Node[]) {}

  async execute(): Promise<Record<string, any>> {
    console.log(`🚀 Starting pipeline: ${this.name}`);

    let input: Record<string, any> = {};

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      console.log(
        `📋 Executing node ${i + 1}/${this.nodes.length}: ${node.name()}`
      );

      const output = await node.execute(input);
      input = { ...input, ...output };

      console.log(`✅ Node ${node.name()} completed`);
    }

    console.log(`🎉 Pipeline ${this.name} completed!`);
    return input;
  }

  getNodeById(id: string): Node | undefined {
    return this.nodes.find((n: any) => n["config"]?.id === id);
  }
}
