# Automation Chain

A modular Node.js/TypeScript application that automates content generation and publishing using a flexible pipeline architecture with **LangChain integration**. It allows you to create customizable automation chains that connect different services and APIs to automate complex workflows.

## 🏗️ Architecture Overview

The application uses a **modular node-based architecture** similar to n8n, allowing you to create reusable and configurable automation chains:

- **Input Nodes**: Capture data from external sources (APIs, databases, files)
- **Processing Nodes**: Transform and analyze data (AI with LangChain, formatting, validation)
- **Output Nodes**: Publish content to different platforms (social media, APIs)
- **Pipeline**: Orchestrates sequential node execution
- **PipelineBuilder**: Constructs pipelines from JSON configuration

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd automation-chain
yarn install
```

### 2. Configure Credentials

Copy the example file and create your own credentials:

```bash
cp config/credentials_example.json config/credentials.json
```

Then edit `config/credentials.json` with your actual API keys:

```json
{
  "openai": {
    "default": {
      "api_key": "sk-your-openai-api-key"
    }
  },
  "telegram": {
    "motivational_bot": {
      "token": "your-telegram-bot-token",
      "channel_id": "@your_channel_or_channel_id"
    }
  }
}
```

### 3. Run the Application

```bash
# Run with default pipeline (telegram_pipeline)
yarn dev

# Run with specific pipeline
yarn dev telegram_pipeline
yarn dev conversational_chain
yarn dev agent_chain
```

## 🤖 LangChain Integration

### **Supported Chain Types**

#### **1. LLM Chain (Basic)**
```json
{
  "chain_type": "llm",
  "prompt_template": "Generate a motivational text about {topic}",
  "model": "gpt-3.5-turbo"
}
```

#### **2. Conversational Chain (With Memory)**
```json
{
  "chain_type": "conversational",
  "memory": true,
  "prompt_template": "Continue the conversation about {topic}"
}
```

#### **3. Agent Chain (With Tools)**
```json
{
  "chain_type": "agent",
  "tools": ["web_search", "calculator"],
  "prompt_template": "Research {topic} and create a post"
}
```

### **LangChain Advantages**

- **Advanced Chains**: LLM, Conversational, and Agent chains
- **Automatic Template Processing**: LangChain handles `{variable}` replacement
- **Memory Management**: Conversational chains maintain context
- **Tool Integration**: Agents can use external tools

## 📋 Pipeline Configuration

### **Example: LLM Chain Pipeline**

```json
{
  "name": "telegram_pipeline_pipeline",
  "description": "Generates and publishes motivational texts to Telegram using LangChain",
  "schedule": "0 9 * * *",
  "nodes": [
    {
      "id": "text_generator_llm",
      "type": "text_generator",
      "name": "Generate Motivational Text with LLM Chain",
      "credentials": "default",
      "config": {
        "chain_type": "llm",
        "prompt_template": "Generate a motivational text about {topic}",
        "model": "gpt-3.5-turbo",
        "temperature": 0.8
      }
    },
    {
      "id": "telegram_publisher",
      "type": "telegram_publisher", 
      "name": "Publish to Telegram",
      "credentials": "motivational_bot",
      "config": {
        "message_template": "💪 *Daily Motivational Message*\n\n{generated_text}\n\n✨ Have an amazing day!"
      }
    }
  ]
}
```

### **Available Pipelines**

- **telegram_pipeline**: Generates motivational content with LLM Chain and publishes to Telegram
- **conversational_chain**: Generates conversational content with memory and publishes to Telegram  
- **agent_chain**: Generates content using agents with tools and publishes to Telegram

## 🔧 Configuration Guide

### **OpenAI Setup**

1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)
4. Add it to `config/credentials.json` under `openai.default.api_key`

### **Telegram Bot Setup**

1. Talk to [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot with `/newbot`
3. Save the bot token
4. Add the bot to your channel as administrator
5. Make sure the bot has permission to send messages

### **Get Channel ID**

For public channels:
- Use the channel name with @ (e.g., `@my_channel`)

For private channels:
- Send a message to the channel
- Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
- Find the `chat.id` in the response (it will be a negative number)

## 📁 Project Structure

```
├── src/
│   ├── index.ts                   # Application entry point
│   ├── core/                      # Core pipeline components
│   │   ├── Pipeline.ts           # Pipeline execution logic
│   │   └── Builder.ts            # Pipeline construction
│   ├── nodes/                    # Node implementations
│   │   ├── ai/                  # AI-related nodes
│   │   │   └── TextGenerator.ts # LangChain text generation
│   │   └── publishers/          # Publishing nodes
│   │       └── TelegramPublisher.ts # Telegram publishing
│   ├── services/                # External service clients
│   │   ├── OpenAIService.ts     # OpenAI with LangChain integration
│   │   └── TelegramService.ts   # Telegram Bot API client
│   └── types/                   # TypeScript type definitions
│       └── index.ts            # Core types
├── config/                      # Configuration files
│   ├── credentials.json         # API keys and tokens (create this file)
│   ├── credentials_example.json # Example credentials structure
│   └── pipelines/              # Pipeline definitions
│       ├── telegram_pipeline.json # LangChain LLM pipeline
│       ├── conversational_chain.json # Conversational pipeline
│       └── agent_chain.json    # Agent pipeline
├── package.json                 # Node.js dependencies and scripts
├── yarn.lock                   # Yarn dependencies lock file
├── tsconfig.json               # TypeScript configuration
└── setup.sh                    # Setup script for new project
```

## 🔐 Credential Management

The application uses a **reference-based credential system**:

### **Credential Structure**

```json
{
  "service_name": {
    "credential_name": {
      "api_key": "value",
      "token": "value",
      "channel_id": "value",
      "other_param": "value"
    }
  }
}
```

### **Pipeline References**

Each node in a pipeline references credentials by name:

```json
{
  "id": "text_generator",
  "type": "text_generator",
  "credentials": "default",  // References openai.default
  "config": { ... }
}
```

## 🚀 Usage Examples

### **Expected Output**
```
🚀 Executing pipeline: telegram_pipeline_pipeline
🔨 Building pipeline: telegram_pipeline_pipeline
✅ Pipeline telegram_pipeline_pipeline built successfully with 2 nodes
🚀 Starting pipeline execution: telegram_pipeline_pipeline
📋 Executing node 1/2: Generate Motivational Text with LLM Chain
🤖 Generating text with OpenAI and LangChain...
📝 Generated text: [Generated text]...
✅ Node Generate Motivational Text with LLM Chain completed successfully
📋 Executing node 2/2: Publish to Telegram
📤 Publishing to Telegram...
✅ Message published successfully to channel: @your_channel
✅ Node Publish to Telegram completed successfully
🎉 Pipeline telegram_pipeline_pipeline execution completed successfully!
✅ Pipeline completed successfully
```

## 📚 Adding New Nodes

To add a new node:

1. **Create the node implementation** in `src/nodes/` directory
2. **Implement the Node interface**:
   ```typescript
   interface Node {
     execute(input: Record<string, any>): Promise<Record<string, any>>;
     name(): string;
     validate(): Promise<void>;
   }
   ```
3. **Register the node** in `src/core/Builder.ts`
4. **Add configuration** to your pipeline JSON

### **Example: Adding a Text Formatter Node**

```typescript
// In src/nodes/formatters/TextFormatter.ts
export class TextFormatterNode implements Node {
  constructor(private config: NodeDefinition) {}

  async execute(input: Record<string, any>): Promise<Record<string, any>> {
    const text = input.text as string;
    const formatted = text.toUpperCase();
    return { text: formatted };
  }

  name(): string {
    return this.config.name;
  }

  async validate(): Promise<void> {
    // Validation logic
  }
}
```

Then register it in the builder:

```typescript
case 'text_formatter':
  return new TextFormatterNode(nodeDef);
```

## 🧪 Testing

Run the test suite:

```bash
yarn test
```

Run specific tests:

```bash
yarn test --testPathPattern=pipeline
```

## 🛣️ Development Roadmap

- ✅ **Phase 1**: Basic pipeline with LangChain and Telegram (COMPLETED)
- 🔄 **Phase 2**: Input nodes (TopicSelector, DataFetcher)
- 📋 **Phase 3**: Advanced LangChain nodes (ImageGenerator, ContentAnalyzer)
- 📋 **Phase 4**: Media nodes (ImageUploader, ImageProcessor)
- 📋 **Phase 5**: Publisher nodes (LinkedIn, Instagram, Twitter)
- 📋 **Phase 6**: Google Services (Sheets, Drive)
- 📋 **Phase 7**: Specialized pipelines
- 📋 **Phase 8**: Scheduling system
- 📋 **Phase 9**: Logging and monitoring
- 📋 **Phase 10**: Documentation and optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### **Common Issues**

**"Failed to load credentials"**
- Ensure `config/credentials.json` exists and is valid JSON
- Check that credential names match between pipeline and credentials files

**"Telegram channel not found"**
- Verify the bot is added to the channel as administrator
- Check that the channel ID is correct
- Ensure the bot has permission to send messages
- For private channels, make sure the bot is a member of the channel

**"OpenAI service error"**
- Verify your OpenAI API key is correct and has sufficient credits
- Check that the model name is valid (e.g., "gpt-3.5-turbo", "gpt-4")
- Ensure your OpenAI account has access to the specified model

## 🎉 Features

**LangChain fully integrated** while maintaining:
- ✅ Simplicity of your architecture
- ✅ Your magic of `input = { ...input, ...output }`
- ✅ JSON configuration
- ✅ SOLID principles
- ✅ Easy extensibility

Ready to automate with LangChain? 🚀
