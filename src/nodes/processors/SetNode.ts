import { Node, NodeDefinition } from "../../types";

export class SetNode implements Node {
  private config: NodeDefinition;

  constructor(config: NodeDefinition) {
    this.config = config;
  }

  static create(
    nodeDef: NodeDefinition,
    credentials: Record<string, any>
  ): Node {
    return new SetNode(nodeDef);
  }

  name(): string {
    return this.config.name;
  }

  async validate(): Promise<void> {
    if (
      !this.config.config.values ||
      typeof this.config.config.values !== "object"
    ) {
      throw new Error("SetNode requires a 'values' object in config");
    }
  }

  async execute(input: Record<string, any>): Promise<Record<string, any>> {
    console.log("🧩 SetNode (n8n style) setting values...");
    await this.validate();
    const values = this.config.config.values;
    const output = { ...input };
    for (const [key, rawValue] of Object.entries(values)) {
      output[key] = this.resolveExpression(rawValue, input);
      console.log(`📝 Set ${key} = ${JSON.stringify(output[key])}`);
    }
    return output;
  }

  private resolveExpression(expr: any, input: Record<string, any>): any {
    if (
      typeof expr === "string" &&
      expr.includes("{{") &&
      expr.includes("}}")
    ) {
      // Extraer y ejecutar el JS entre {{ }}
      const match = expr.match(/\{\{([\s\S]*?)\}\}/);
      if (match) {
        const jsCode = match[1].trim();
        const context = this.buildContext(input);
        try {
          // eslint-disable-next-line no-new-func
          return new Function(...Object.keys(context), `return (${jsCode});`)(
            ...Object.values(context)
          );
        } catch (err) {
          throw new Error(
            `Error evaluating expression for SetNode: ${jsCode} - ${err}`
          );
        }
      }
    }
    return expr;
  }

  private buildContext(input: Record<string, any>) {
    return {
      $input: input,
      $json: input,
      $now: new Date(),
      $today: new Date(),
      $random: Math.random(),
      $timestamp: Date.now(),
      $jsonUtil: {
        stringify: JSON.stringify,
        parse: JSON.parse,
      },
    };
  }
}
