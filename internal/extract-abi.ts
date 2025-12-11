import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { join, basename } from "path";

interface ForgeArtifact {
  abi: unknown[];
  bytecode?: {
    object: string;
  };
}

/**
 * Extract ABIs from Foundry build artifacts and save them to the abi directory
 */
function extractAbis(outDir: string, abiDir: string): void {
  // Create abi directory if it doesn't exist
  mkdirSync(abiDir, { recursive: true });

  console.log("🔍 Searching for contract artifacts...\n");

  // Recursively find all .json files in out directory
  const jsonFiles = findJsonFiles(outDir);

  let extractedCount = 0;

  for (const jsonFile of jsonFiles) {
    // Skip metadata and debug files
    if (jsonFile.endsWith(".metadata.json") || jsonFile.endsWith(".dbg.json")) {
      continue;
    }

    try {
      // Read the artifact file
      const content = readFileSync(jsonFile, "utf-8");
      const artifact: ForgeArtifact = JSON.parse(content);

      // Check if the artifact has an ABI
      if (!artifact.abi || artifact.abi.length === 0) {
        continue;
      }

      // Skip if no bytecode (interface, library, or abstract contract)
      if (!artifact.bytecode?.object || artifact.bytecode.object === "0x") {
        console.log(`⏭️  Skipping ${basename(jsonFile)} (no bytecode - likely interface/abstract)`);
        continue;
      }

      // Extract contract name from file path
      // out/ContractName.sol/ContractName.json -> ContractName
      const contractName = basename(jsonFile, ".json");

      // Create ABI file path
      const abiFilePath = join(abiDir, `${contractName}.abi.json`);

      // Write ABI to file
      writeFileSync(abiFilePath, JSON.stringify(artifact.abi, null, 2));

      console.log(`✅ Extracted ABI for ${contractName} -> ${abiFilePath}`);
      extractedCount++;
    } catch (error) {
      console.error(`❌ Error processing ${jsonFile}:`, error);
    }
  }

  console.log(`\n📦 Total ABIs extracted: ${extractedCount}`);
}

/**
 * Recursively find all .json files in a directory
 */
function findJsonFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...findJsonFiles(fullPath));
      } else if (entry.endsWith(".json")) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return files;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run the script
const outDir = process.argv[2] || path.join(__dirname, "..", "out");
const abiDir = process.argv[3] || path.join(__dirname, "..", "abi");

extractAbis(outDir, abiDir);
