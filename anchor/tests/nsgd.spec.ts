import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Nsgd } from '../target/types/nsgd';
import { describe, it } from 'vitest';

describe('nsgd', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Nsgd as Program<Nsgd>;

  const nsgdKeypair = Keypair.generate();

  it('should ', async () => {});
});
