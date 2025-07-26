import { Node, NodeDefinition } from "../../types";

export class TextFormatterNode implements Node {
  private config: NodeDefinition;

  constructor(config: NodeDefinition) {
    this.config = config;
  }

  static create(
    nodeDef: NodeDefinition,
    credentials: Record<string, any>
  ): Node {
    // Este nodo no necesita credenciales, pero mantiene la misma interfaz
    return new TextFormatterNode(nodeDef);
  }

  name(): string {
    return this.config.name;
  }

  async validate(): Promise<void> {
    // Validación simple
    if (!this.config.config.format_type) {
      throw new Error("format_type is required in configuration");
    }
  }

  async execute(input: Record<string, any>): Promise<Record<string, any>> {
    console.log("📝 Formatting text...");

    await this.validate();

    const text = input.generated_text || input.text || "";
    const formatType = this.config.config.format_type as string;

    let formattedText = text;
    switch (formatType) {
      case "uppercase":
        formattedText = text.toUpperCase();
        break;
      case "lowercase":
        formattedText = text.toLowerCase();
        break;
      case "capitalize":
        formattedText =
          text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        break;
      default:
        throw new Error(`Unknown format type: ${formatType}`);
    }

    console.log(`✅ Text formatted with ${formatType}`);

    return {
      generated_text: formattedText,
      original_text: text,
      format_type: formatType,
    };
  }
}
