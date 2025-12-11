# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository is intended for deploying Ethereum Smart Contracts, upgrading via UUPS, and calling functions from the `hyperledger-labs/yui-ibc-solidity` and `datachainalab/lcp-solidity` repositories.

## Instructions for Claude
Requirements for Claude:

1. Keep answers concise and provide code examples when necessary
2. Always explain reasons when proposing breaking changes
3. Do not make incorrect assumptions about file structures
4. Ask questions to clarify when unsure
5. Prioritize conservative decisions for security-related matters

## Codebase Overview
- /contracts: Solidity smart contracts (source)
- /src: TypeScript library source code
  - /src/index.ts: Main entry point
  - /src/deploy.ts: Contract deployment utilities using viem
- /tests: Foundry and TypeScript tests
- /scripts: Development utility scripts (not published)
- /examples: Usage examples (not published)
- /internal: Internal scripts like extract-abi.ts (not published)
- /out: Forge build artifacts (generated, temporary)
- /cache_forge: Foundry cache (generated)
- /dist: Published package contents (generated)
  - /dist/index.js: Compiled TypeScript library
  - /dist/index.d.ts: TypeScript type definitions
  - /dist/abi/: Extracted ABI JSON files
  - /dist/contracts/: Full contract artifacts (bytecode, ABI, metadata)

## Constraints
- Generating or inferring confidential information is prohibited
- Generating code that violates licenses is prohibited
- Do not output production secrets
- Do not arbitrarily create filenames or API keys

## Common Commands

### Foundry (Smart Contracts)
```bash
forge build              # Compile contracts
forge test               # Run all tests
forge test --match-test testName  # Run specific test
forge test -vvvv         # Run tests with max verbosity
anvil                    # Start local Ethereum node
```

### Node.js/TypeScript
```bash
npm install              # Install dependencies
npm run compile:contracts # Compile Solidity contracts with forge
npm run copy:contracts   # Copy contract artifacts to dist/contracts/
npm run abi              # Extract ABIs to dist/abi/
npm run build:ts         # Build TypeScript library only
npm run build:artifacts  # Build contracts + copy + extract ABIs
npm run build            # Build everything (TypeScript + artifacts)
npm run example:deploy   # Run deployment example (requires anvil)
npm test                 # Run tests
npm run clean            # Remove all generated files
```

### Publishing as npm module
```bash
npm run prepublishOnly   # Build everything for publishing
npm pack                 # Create tarball for local testing
npm publish              # Publish to npm registry (if private: false)
```

## Architecture

### As an npm Module
This package can be used as an npm dependency in other projects:
- **Main entry**: `dist/index.js` - Compiled TypeScript library
- **Type definitions**: `dist/index.d.ts` - TypeScript types
- **ABI exports**: `dist/abi/*.abi.json` - Contract ABIs for viem
- **Contract artifacts**: `dist/contracts/**/*.json` - Full contract artifacts

#### Features
- **Contract Deployment**: Deploy contracts using Forge artifacts and viem
  - `loadArtifact()`: Load Forge artifact from out directory
  - `deployContract()`: Deploy contract using viem wallet client
  - `loadAndDeploy()`: Load artifact and deploy in one step

#### Example Usage
```typescript
// Import utilities
import { loadAndDeploy, VERSION } from 'viem-foundry';

// Import ABIs
import counterAbi from 'viem-foundry/abi/Counter.abi.json';

// Import full artifacts
import counterArtifact from 'viem-foundry/contracts/Counter.sol/Counter.json';

// Deploy contract
const { address } = await loadAndDeploy(
  walletClient,
  publicClient,
  'Counter',
  'Counter.sol',
  { args: [], confirmations: 1 }
);
```

### Build Process
1. TypeScript sources in `/src` are compiled with tsc → `/dist/*.js`, `/dist/*.d.ts`
2. Solidity contracts in `/contracts` are compiled with forge → `/out`
3. Contract artifacts are copied from `/out` → `/dist/contracts/`
4. ABIs are extracted from `/out` → `/dist/abi/*.abi.json`
5. Package includes: `dist/` (with all subdirectories), `README.md`, `LICENSE`
