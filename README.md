# viem-foundry

Ethereum smart contract deployment and interaction using viem and Foundry, with support for UUPS upgradeable contracts and IBC/LCP integration.

## Installation

### As an npm package

```bash
npm install viem-foundry
# or
yarn add viem-foundry
# or
pnpm add viem-foundry
```

### Usage in your project

#### Basic Usage

```typescript
import { VERSION, DEFAULT_CONFIG } from 'viem-foundry';

// Import ABIs
import counterAbi from 'viem-foundry/abi/Counter.abi.json';

// Import full contract artifacts (includes bytecode, ABI, metadata)
import counterArtifact from 'viem-foundry/contracts/Counter.sol/Counter.json';

console.log(`Using viem-foundry version ${VERSION}`);
```

#### Deploy Contracts

```typescript
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';
import { loadAndDeploy } from 'viem-foundry';

const account = privateKeyToAccount('0x...');

const walletClient = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
});

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// Deploy a contract
const { address, transactionHash } = await loadAndDeploy(
  walletClient,
  publicClient,
  'Counter',      // Contract name
  'Counter.sol',  // Contract file path
  {
    args: [],     // Constructor arguments
    confirmations: 1,
  }
);

console.log('Contract deployed at:', address);
```

See `examples/deploy-example.ts` for more detailed examples.

## Development Setup

### Prerequisites

### Install Foundry

Foundry is required for compiling and testing Solidity contracts.

#### Linux / macOS / WSL
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### Manual Installation
```bash
# Clone the repository
git clone https://github.com/foundry-rs/foundry.git
cd foundry

# Build from source (requires Rust)
cargo install --path ./cli --profile local --force
```

#### Verify Installation
```bash
forge --version
cast --version
anvil --version
```

### Install Node.js Dependencies

```bash
npm install
```

### Install Foundry Dependencies

```bash
forge install foundry-rs/forge-std@v1.9.5
forge install risc0/risc0-ethereum@aggregation-v0.9.0
```

### Update Foundry Dependencies

To update to a specific version, reinstall with the desired version tag:

```bash
forge install foundry-rs/forge-std@${new_ver}
forge install risc0/risc0-ethereum@${new_ver}
```

## Project Structure

```
├── contracts/          # Solidity smart contracts (source)
├── src/               # TypeScript library source code
├── tests/             # Foundry tests (Solidity) and Vitest tests (TypeScript)
├── scripts/           # Development utility scripts
├── out/               # Forge build artifacts (generated, temporary)
├── cache_forge/       # Foundry cache (generated)
└── dist/              # Published package contents (generated)
    ├── index.js       # Compiled TypeScript library
    ├── index.d.ts     # TypeScript type definitions
    ├── abi/           # Extracted ABI JSON files
    └── contracts/     # Full contract artifacts (bytecode, ABI, metadata)
```

## Development

### Compile Contracts
```bash
forge build
```

or

```bash
npm run compile:contracts
```

### Run Foundry Tests
```bash
forge test              # Run all tests
forge test -vvvv        # Run with maximum verbosity
forge test --match-test testName  # Run specific test
```

### Run TypeScript Tests
```bash
npm test                # Run tests once
npm run test:watch      # Run tests in watch mode
```

### Run Examples
Make sure to start a local Ethereum node (anvil) first:
```bash
# Terminal 1: Start anvil
npm run node

# Terminal 2: Run deployment example
npm run example:deploy
```

### Start Local Ethereum Node
```bash
anvil
```

### Code Quality
```bash
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
forge fmt               # Format Solidity files
```

### Local Package Testing

Test your changes locally before publishing by creating a tarball and installing it in another project.

#### Method 1: Using npm pack (Recommended)

1. **Build and create a tarball:**
   ```bash
   npm run build
   npm pack
   ```
   This creates a file like `viem-foundry-0.1.0.tgz` in the current directory.

2. **Install in your test project:**
   ```bash
   cd /path/to/your/test-project
   npm install /path/to/viem-foundry/viem-foundry-0.1.0.tgz
   ```

3. **After making changes, rebuild and reinstall:**
   ```bash
   # In viem-foundry directory
   npm run build
   npm pack

   # In your test project
   npm uninstall viem-foundry
   npm install /path/to/viem-foundry/viem-foundry-0.1.0.tgz
   ```

#### Method 2: Using npm link

1. **Create a global symlink:**
   ```bash
   # In viem-foundry directory
   npm run build
   npm link
   ```

2. **Link in your test project:**
   ```bash
   cd /path/to/your/test-project
   npm link viem-foundry
   ```

3. **After making changes, just rebuild:**
   ```bash
   # In viem-foundry directory
   npm run build
   # Changes are automatically available in linked projects
   ```

4. **Cleanup when done:**
   ```bash
   # In your test project
   npm unlink viem-foundry

   # In viem-foundry directory
   npm unlink
   ```

**Note:** `npm link` keeps a live symlink, so you only need to rebuild after changes. `npm pack` creates a snapshot, so you need to reinstall after each change.

## Building

### Build Everything
Build TypeScript library and prepare all artifacts for publishing:
```bash
npm run build
```

This will:
1. Compile TypeScript files from `src/` to `dist/`
2. Generate type declarations (`.d.ts` files)
3. Compile Solidity contracts with forge
4. Copy contract artifacts to `dist/contracts/`
5. Extract ABIs to `dist/abi/`

### Build Components Separately

**Build TypeScript only:**
```bash
npm run build:ts
```

**Build contracts and artifacts only:**
```bash
npm run build:artifacts
```

This will compile contracts, copy to `dist/contracts/`, and extract ABIs to `dist/abi/`.

### Clean Build Artifacts
Remove all generated files:
```bash
npm run clean
```

## Publishing

Before publishing to npm:
1. Update version in `package.json`
2. Build all artifacts:
   ```bash
   npm run build
   ```
3. Test the package locally:
   ```bash
   npm pack
   # This creates a .tgz file. Install it in another project to test:
   # cd ../other-project
   # npm install ../viem-foundry/viem-foundry-0.1.0.tgz
   ```
4. Publish (if `private: false` in package.json):
   ```bash
   npm publish
   ```

The `prepublishOnly` script will automatically build everything before publishing.

### What gets published:
- `dist/` directory containing:
  - Compiled TypeScript library (`index.js`, `index.d.ts`)
  - Contract ABIs (`dist/abi/*.abi.json`)
  - Full contract artifacts (`dist/contracts/**/*.json`)
- `README.md`
- `LICENSE`

## License

MIT
