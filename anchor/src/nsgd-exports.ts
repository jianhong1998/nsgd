// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import NsgdIDL from '../target/idl/nsgd.json'
import type { Nsgd } from '../target/types/nsgd'

// Re-export the generated IDL and type
export { Nsgd, NsgdIDL }

// The programId is imported from the program IDL.
export const NSGD_PROGRAM_ID = new PublicKey(NsgdIDL.address)

// This is a helper function to get the Nsgd Anchor program.
export function getNsgdProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...NsgdIDL, address: address ? address.toBase58() : NsgdIDL.address } as Nsgd, provider)
}

// This is a helper function to get the program ID for the Nsgd program depending on the cluster.
export function getNsgdProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Nsgd program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return NSGD_PROGRAM_ID
  }
}
