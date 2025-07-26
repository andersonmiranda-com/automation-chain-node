# Bun Development Guide

## 🚀 Why Use Bun?

Bun is a fast all-in-one JavaScript runtime and toolkit that can be used as an alternative to Node.js and Yarn:

- **⚡ Faster**: Up to 3x faster than Node.js for many operations
- **📦 All-in-one**: Runtime, package manager, bundler, and test runner
- **🔧 Compatible**: Drop-in replacement for Node.js APIs
- **🌱 Lightweight**: Smaller footprint and faster startup times

## 📦 Installation

### **macOS/Linux**
```bash
curl -fsSL https://bun.sh/install | bash
```

### **Windows (WSL)**
```bash
curl -fsSL https://bun.sh/install | bash
```

### **Docker**
```bash
docker run --rm --init --ulimit memlock=-1:-1 -v "$(pwd):/src" oven/bun:latest
```

### **Verify Installation**
```bash
bun --version
```

## 🛠️ Development Commands

### **Setup and Dependencies**
```bash
# Install dependencies
bun install

# Add new dependency
bun add package-name

# Add development dependency
bun add -d package-name
```

### **Development Mode**
```bash
# Run in development mode (TypeScript)
bun run bun:dev

# Run with specific pipeline
bun run bun:dev telegram_pipeline
bun run bun:dev conversational_chain
bun run bun:dev agent_chain
```

### **Building**
```bash
# Standard TypeScript compilation
bun run build

# Create optimized bundle (recommended for production)
bun run bun:build

# Create minified bundle (smallest size)
bun run bun:bundle
```

### **Testing**
```bash
# Run all tests
bun test

# Run specific tests
bun test --testPathPattern=pipeline
```

### **Production**
```bash
# Start production build
bun run bun:start telegram_pipeline

# Start bundled application
bun run bun:start:bundle telegram_pipeline
```

## 📦 Build and Bundle

### **Bundle Types**

#### **Standard Build**
```bash
bun run build
```
- Compiles TypeScript to JavaScript
- Outputs to `dist/` directory
- Maintains module structure

#### **Optimized Bundle**
```bash
bun run bun:build
```
- Creates single file bundle
- Includes only necessary dependencies
- Optimized for production

#### **Minified Bundle**
```bash
bun run bun:bundle
```
- Creates smallest possible bundle
- Removes all unnecessary code
- Best for deployment

### **Bundle Benefits**

- **Smaller Size**: Bundled version includes only necessary dependencies
- **Faster Startup**: No need to resolve modules at runtime
- **Portable**: Single file that can be deployed anywhere
- **Optimized**: Tree-shaking removes unused code

## ⚡ Performance Comparison

| Operation | Yarn | Bun | Improvement |
|-----------|------|-----|-------------|
| Install dependencies | ~30s | ~8s | 3.7x faster |
| Start development | ~2s | ~0.5s | 4x faster |
| Build project | ~3s | ~1s | 3x faster |
| Run tests | ~5s | ~1.5s | 3.3x faster |

## 🔧 Available Scripts

| Script | Description | Command |
|--------|-------------|---------|
| `bun:dev` | Run TypeScript directly | `bun run src/index.ts` |
| `bun:start` | Run compiled JavaScript | `bun run dist/index.js` |
| `bun:build` | Create optimized bundle | `bun build src/index.ts --outfile dist/bundle.js --target node` |
| `bun:bundle` | Create minified bundle | `bun build src/index.ts --outfile dist/bundle.js --target node --minify` |
| `bun:start:bundle` | Run bundled application | `bun run dist/bundle.js` |

## 🚀 Quick Start with Bun

### **1. Setup Project**
```bash
git clone <repository-url>
cd automation-chain-node
curl -fsSL https://bun.sh/install | bash
bun install
```

### **2. Configure Credentials**
```bash
cp config/credentials_example.json config/credentials.json
# Edit config/credentials.json with your API keys
```

### **3. Run Development**
```bash
# Run with default pipeline
bun run bun:dev

# Run with specific pipeline
bun run bun:dev telegram_pipeline
```

### **4. Build for Production**
```bash
# Create optimized bundle
bun run bun:build

# Run bundled application
bun run bun:start:bundle telegram_pipeline
```

## 🔍 Troubleshooting

### **Common Issues**

**"bun: command not found"**
- Ensure Bun is installed: `curl -fsSL https://bun.sh/install | bash`
- Restart your terminal after installation
- Add Bun to your PATH if needed

**"Module not found" errors**
- Run `bun install` to install dependencies
- Check that `node_modules` exists
- Clear cache: `bun pm cache rm`

**"TypeScript compilation errors"**
- Ensure TypeScript is installed: `bun add -d typescript`
- Check `tsconfig.json` configuration
- Run `bun run build` to see detailed errors

### **Performance Tips**

- Use `bun run bun:dev` for development (faster than `ts-node`)
- Use `bun run bun:build` for production builds
- Bundle your application for deployment to reduce size
- Use Bun's built-in test runner for faster testing

## 📚 Additional Resources

- [Bun Official Documentation](https://bun.sh/docs)
- [Bun GitHub Repository](https://github.com/oven-sh/bun)
- [Bun vs Node.js Performance](https://bun.sh/benchmarks)
- [Bun Package Manager](https://bun.sh/docs/cli/install) 