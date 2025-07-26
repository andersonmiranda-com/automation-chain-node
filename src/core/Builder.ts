import * as fs from "fs";
import { TextGeneratorNode } from "../nodes/ai/TextGenerator";
import { SetNode } from "../nodes/processors/SetNode";
import { TextFormatterNode } from "../nodes/processors/TextFormatter";
import { TelegramPublisherNode } from "../nodes/publishers/TelegramPublisher";
import { Node, NodeDefinition } from "../types";
import { Pipeline } from "./Pipeline";

export class PipelineBuilder {
  private credentials: Record<string, any>;
  private nodeCreators: Record<
    string,
    (nodeDef: NodeDefinition, credentials: Record<string, any>) => Node
  > = {
    text_generator: TextGeneratorNode.create,
    telegram_publisher: TelegramPublisherNode.create,
    text_formatter: TextFormatterNode.create,
    set: SetNode.create,
  };

  constructor() {
    this.credentials = this.loadCredentials();
  }

  async buildPipeline(
    name: string,
    nodeDefs: NodeDefinition[]
  ): Promise<Pipeline> {
    console.log(`🔨 Building pipeline: ${name}`);

    const nodes = await Promise.all(
      nodeDefs.map((nodeDef) => this.createNode(nodeDef))
    );

    console.log(`✅ Pipeline built with ${nodes.length} nodes`);
    return new Pipeline(name, nodes);
  }

  private async createNode(nodeDef: NodeDefinition): Promise<Node> {
    const creator = this.nodeCreators[nodeDef.type];
    if (!creator) {
      throw new Error(`❌ Unknown node type: ${nodeDef.type}`);
    }
    return creator(nodeDef, this.credentials);
  }

  private loadCredentials(): Record<string, any> {
    try {
      const data = fs.readFileSync("config/credentials.json", "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.log(`⚠️ Warning: Failed to load credentials: ${error}`);
      return {};
    }
  }
}
