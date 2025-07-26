import * as fs from "fs";
import { PipelineBuilder } from "./core/Builder";
import { PipelineConfig } from "./types";

const pipelineName = process.argv[2] || "telegram_pipeline";
const nodeId = process.argv[3]; // Ahora solo por id

async function main(): Promise<void> {
  try {
    const data = fs.readFileSync(
      `config/pipelines/${pipelineName}.json`,
      "utf8"
    );
    const config: PipelineConfig = JSON.parse(data);

    const pipeline = await new PipelineBuilder().buildPipeline(
      config.name,
      config.nodes
    );

    if (nodeId) {
      const node = pipeline.getNodeById(nodeId);
      if (!node) {
        throw new Error(`Nodo con id '${nodeId}' no encontrado en el pipeline`);
      }
      await node.validate();
      const result = await node.execute({});
      console.log(`✅ Nodo '${nodeId}' ejecutado. Resultado:`, result);
    } else {
      const result = await pipeline.execute();
      console.log("✅ Pipeline completed", result);
    }
  } catch (error) {
    console.error("❌ Pipeline failed:", error);
    process.exit(1);
  }
}

main();
