import { TelegramService } from "../../services/TelegramService";
import { Node, NodeDefinition } from "../../types";

export class TelegramPublisherNode implements Node {
  private telegramService: TelegramService;
  private config: NodeDefinition;

  constructor(config: NodeDefinition) {
    this.config = config;
    this.telegramService = new TelegramService();

    if (config.config.telegram) {
      this.telegramService.loadConfig(config.config.telegram);
    }
  }

  static create(
    nodeDef: NodeDefinition,
    credentials: Record<string, any>
  ): Node {
    if (!nodeDef.credentials) {
      throw new Error("telegram_publisher node requires credentials field");
    }
    const telegramConfig = credentials.telegram?.[nodeDef.credentials] || {};
    const nodeConfig = { ...nodeDef.config, telegram: telegramConfig };
    return new TelegramPublisherNode({ ...nodeDef, config: nodeConfig });
  }

  name(): string {
    return this.config.name;
  }

  async validate(): Promise<void> {
    if (!this.telegramService.isReady()) {
      throw new Error("Telegram service is not initialized");
    }
  }

  async execute(input: Record<string, any>): Promise<Record<string, any>> {
    console.log("📤 Publishing to Telegram...");

    await this.validate();

    const messageTemplate =
      this.config.config.message_template ||
      "💪 *Daily Motivation*\n\n{generated_text}\n\n✨ Have an amazing day!";

    const message = this.interpolateTemplate(messageTemplate, input);
    await this.telegramService.sendMessage(message);

    console.log("✅ Message published successfully");

    return {
      published: true,
      platform: "telegram",
      message_length: message.length,
    };
  }

  private interpolateTemplate(
    template: string,
    data: Record<string, any>
  ): string {
    return template.replace(/\{([^}]+)\}/g, (match, key) => {
      const value = this.getNestedValue(data, key.trim());
      return value !== undefined ? String(value) : match;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }
}
