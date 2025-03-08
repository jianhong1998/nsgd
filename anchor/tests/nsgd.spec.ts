import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Nsgd } from '../target/types/nsgd'

describe('nsgd', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Nsgd as Program<Nsgd>

  const nsgdKeypair = Keypair.generate()

  it('Initialize Nsgd', async () => {
    await program.methods
      .initialize()
      .accounts({
        nsgd: nsgdKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([nsgdKeypair])
      .rpc()

    const currentCount = await program.account.nsgd.fetch(nsgdKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Nsgd', async () => {
    await program.methods.increment().accounts({ nsgd: nsgdKeypair.publicKey }).rpc()

    const currentCount = await program.account.nsgd.fetch(nsgdKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Nsgd Again', async () => {
    await program.methods.increment().accounts({ nsgd: nsgdKeypair.publicKey }).rpc()

    const currentCount = await program.account.nsgd.fetch(nsgdKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Nsgd', async () => {
    await program.methods.decrement().accounts({ nsgd: nsgdKeypair.publicKey }).rpc()

    const currentCount = await program.account.nsgd.fetch(nsgdKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set nsgd value', async () => {
    await program.methods.set(42).accounts({ nsgd: nsgdKeypair.publicKey }).rpc()

    const currentCount = await program.account.nsgd.fetch(nsgdKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the nsgd account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        nsgd: nsgdKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.nsgd.fetchNullable(nsgdKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
