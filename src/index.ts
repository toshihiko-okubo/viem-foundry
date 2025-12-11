/**
 * viem-foundry - Ethereum smart contract deployment and interaction
 *
 * This package provides utilities for working with Ethereum smart contracts
 * using viem and Foundry, with support for UUPS upgradeable contracts and IBC/LCP integration.
 */

// Re-export commonly used types from viem
export type {
  Address,
  Hash,
  Hex,
  PublicClient,
  WalletClient,
  Account,
  Chain,
  Transport,
} from "viem";

/**
 * Get the version of the viem-foundry package
 */
export const VERSION = "0.1.0";

/**
 * Default configuration for the package
 */
export const DEFAULT_CONFIG = {
  rpcTimeout: 30000,
  confirmations: 1,
} as const;
