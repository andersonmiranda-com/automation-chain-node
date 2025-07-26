import TelegramBot from "node-telegram-bot-api";

export class TelegramService {
  private bot!: TelegramBot;
  private channelId: string = "";
  private token: string = "";

  loadConfig(config: Record<string, any>): void {
    this.token = config.token || "";
    this.channelId = config.channel_id || "";

    if (!this.token) {
      throw new Error("Telegram bot token is required");
    }

    if (!this.channelId) {
      throw new Error("Telegram channel ID is required");
    }

    this.bot = new TelegramBot(this.token, { polling: false });
  }

  isReady(): boolean {
    return !!this.bot && !!this.token && !!this.channelId;
  }

  async sendMessage(message: string): Promise<void> {
    if (!this.isReady()) {
      throw new Error("Telegram service is not initialized");
    }

    await this.bot.sendMessage(this.channelId, message, {
      parse_mode: "HTML",
    });
  }
}
