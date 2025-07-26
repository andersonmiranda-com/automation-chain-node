import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ChainConfig, LangChainConfig } from "../types";

export class OpenAIService {
  private llm!: ChatOpenAI;
  private config: LangChainConfig;

  constructor() {
    this.config = {
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      maxTokens: 300,
    };
  }

  loadConfig(config: Record<string, any>): void {
    this.config = {
      model: config.model || this.config.model,
      temperature: config.temperature || this.config.temperature,
      maxTokens: config.max_tokens || this.config.maxTokens,
      systemPrompt: config.system_prompt,
    };

    if (!config.api_key) {
      throw new Error("OpenAI API key is required");
    }

    this.llm = new ChatOpenAI({
      openAIApiKey: config.api_key,
      modelName: this.config.model,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
    });
  }

  isReady(): boolean {
    return !!this.llm;
  }

  async generateText(
    prompt: string,
    chainConfig?: ChainConfig
  ): Promise<string> {
    if (!this.isReady()) {
      throw new Error("OpenAI service is not initialized");
    }

    if (chainConfig?.type === "conversational" && chainConfig.memory) {
      return this.generateWithMemory(prompt);
    }

    if (chainConfig?.type === "agent" && chainConfig.tools) {
      return this.generateWithAgent(prompt);
    }

    return this.generateWithLLMChain(prompt);
  }

  private async generateWithLLMChain(prompt: string): Promise<string> {
    const response = await this.llm.invoke(prompt);
    const text = response.content as string;
    return text.replace(/^"|"$/g, "");
  }

  private async generateWithMemory(prompt: string): Promise<string> {
    const memory = new BufferMemory();
    const chain = new ConversationChain({ llm: this.llm, memory: memory });
    const result = await chain.call({ input: prompt });
    return result.response;
  }

  private async generateWithAgent(prompt: string): Promise<string> {
    const response = await this.llm.invoke(prompt);
    const text = response.content as string;
    return text.replace(/^"|"$/g, "");
  }
}
