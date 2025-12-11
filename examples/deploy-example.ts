/**
 * Example: Deploy a contract using viem and Forge artifacts
 *
 * This example demonstrates how to deploy a smart contract using
 * the viem-foundry utilities with Forge-compiled artifacts.
 */

import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { localhost } from 'viem/chains';
import { loadAndDeploy, deployContract, loadArtifact } from '../src/index.js';

// Example deployment function
async function main() {
  // 1. Setup clients
  const account = privateKeyToAccount(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' // Anvil test account
  );

  const walletClient = createWalletClient({
    account,
    chain: localhost,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: localhost,
    transport: http(),
  });

  console.log('Deploying from account:', account.address);

  // Method 1: Load and deploy in one step
  console.log('\n--- Method 1: loadAndDeploy ---');
  try {
    const result1 = await loadAndDeploy(
      walletClient,
      publicClient,
      'Counter', // Contract name
      'Counter.sol', // Contract file path
      {
        args: [], // Constructor arguments
        confirmations: 1,
      }
    );

    console.log('✅ Contract deployed!');
    console.log('  Address:', result1.address);
    console.log('  Transaction:', result1.transactionHash);
    console.log('  Block:', result1.blockNumber);
  } catch (error) {
    console.error('❌ Deployment failed:', error);
  }

  // Method 2: Load artifact separately, then deploy
  console.log('\n--- Method 2: loadArtifact + deployContract ---');
  try {
    // Load the artifact
    const artifact = loadArtifact('Counter', 'Counter.sol');
    console.log('Loaded artifact for Counter');
    console.log('  ABI entries:', artifact.abi.length);
    console.log('  Bytecode size:', artifact.bytecode.object.length / 2, 'bytes');

    // Deploy using the loaded artifact
    const result2 = await deployContract(walletClient, publicClient, artifact, {
      args: [],
      confirmations: 1,
    });

    console.log('✅ Contract deployed!');
    console.log('  Address:', result2.address);
    console.log('  Transaction:', result2.transactionHash);
    console.log('  Block:', result2.blockNumber);
  } catch (error) {
    console.error('❌ Deployment failed:', error);
  }

  // Method 3: Deploy contract with constructor arguments
  console.log('\n--- Method 3: Deploy with constructor args ---');
  try {
    const result3 = await loadAndDeploy(
      walletClient,
      publicClient,
      'MyToken', // Example contract with constructor
      'MyToken.sol',
      {
        args: ['My Token', 'MTK', 18], // name, symbol, decimals
        confirmations: 1,
      }
    );

    console.log('✅ Contract deployed with args!');
    console.log('  Address:', result3.address);
    console.log('  Transaction:', result3.transactionHash);
  } catch (error) {
    console.error('❌ Deployment failed:', error);
  }
}

// Run the example
main().catch(console.error);
