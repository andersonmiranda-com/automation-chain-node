export interface Node {
  execute(input: Record<string, any>): Promise<Record<string, any>>;
  name(): string;
  validate(): Promise<void>;
}

export interface NodeDefinition {
  id: string;
  type: string;
  name: string;
  credentials?: string;
  config: Record<string, any>;
}

export interface PipelineConfig {
  name: string;
  description: string;
  schedule: string;
  nodes: NodeDefinition[];
}

export interface LangChainConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
}

export interface ChainConfig {
  type: "llm" | "conversational" | "agent";
  tools?: string[];
  memory?: boolean;
  promptTemplate?: string;
}
