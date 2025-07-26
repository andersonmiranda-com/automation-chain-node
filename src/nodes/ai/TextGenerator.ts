import { OpenAIService } from "../../services/OpenAIService";
import { ChainConfig, Node, NodeDefinition } from "../../types";

export class TextGeneratorNode implements Node {
  private openaiService: OpenAIService;
  private config: NodeDefinition;

  constructor(config: NodeDefinition) {
    this.config = config;
    this.openaiService = new OpenAIService();

    if (config.config.openai) {
      this.openaiService.loadConfig(config.config.openai);
    }
  }

  static create(
    nodeDef: NodeDefinition,
    credentials: Record<string, any>
  ): Node {
    const openaiCredential = nodeDef.credentials || "default";
    const openaiConfig = credentials.openai?.[openaiCredential] || {};
    const nodeConfig = { ...nodeDef.config, openai: openaiConfig };
    return new TextGeneratorNode({ ...nodeDef, config: nodeConfig });
  }

  name(): string {
    return this.config.name;
  }

  async validate(): Promise<void> {
    if (!this.openaiService.isReady()) {
      throw new Error("OpenAI service is not initialized");
    }

    if (!this.config.config.prompt_template) {
      throw new Error(
        "Required parameter prompt_template not found in configuration"
      );
    }
  }

  async execute(input: Record<string, any>): Promise<Record<string, any>> {
    console.log("🤖 Generating text with OpenAI...");

    await this.validate();

    // Add default values for common template variables
    const enrichedInput = {
      ...input,
      topic: input.topic || "personal growth and success",
      user: input.user || "everyone",
      goal: input.goal || "achieving their dreams",
    };

    const chainConfig: ChainConfig = {
      type: this.config.config.chain_type || "llm",
      tools: this.config.config.tools,
      memory: this.config.config.memory,
      promptTemplate: this.config.config.prompt_template,
    };

    const promptTemplate = this.config.config.prompt_template as string;
    const prompt = this.processTemplate(promptTemplate, enrichedInput);

    const generatedText = await this.openaiService.generateText(
      prompt,
      chainConfig
    );

    console.log(`📝 Generated text: ${generatedText.substring(0, 100)}...`);

    return {
      generated_text: generatedText,
      chain_type: chainConfig.type,
    };
  }

  private processTemplate(
    template: string,
    input: Record<string, any>
  ): string {
    let result = template;

    for (const [key, value] of Object.entries(input)) {
      const placeholder = `{${key}}`;
      if (result.includes(placeholder)) {
        result = result.replace(new RegExp(placeholder, "g"), String(value));
      }
    }

    return result;
  }
}
