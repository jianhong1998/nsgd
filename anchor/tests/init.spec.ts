import { Program } from '@coral-xyz/anchor';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { beforeAll, describe, expect, it } from 'vitest';
import { ProgramUtil } from './utils/program.util';
import {
  BANK_SEED,
  IS_TESTING_ON_CHAIN,
  TEST_FEE_PAYER_ID_FILE_PATH,
  TEST_PROGRAM_OWNER_ID_FILE_PATH,
  TOKEN_MINT_SEED,
} from './constants';
import { AccountUtil } from './utils/account.util';
import { Nsgd } from '../target/types/nsgd';
import { BN } from 'bn.js';

interface ITestData {
  programContext: {
    program: Program<Nsgd>;
    connection: Connection;
  };
  keypairs: {
    programOwner: Keypair;
    feePayer: Keypair;
  };
  publicKeys: {
    bank: PublicKey;
    mint: PublicKey;
  };
}

describe('Test Init', () => {
  let testData: ITestData;

  beforeAll(async () => {
    const programOwnerKeypair = await AccountUtil.getAccount(
      TEST_PROGRAM_OWNER_ID_FILE_PATH
    );
    const feePayerKeypair = await AccountUtil.getAccount(
      TEST_FEE_PAYER_ID_FILE_PATH
    );

    const programUtil = new ProgramUtil<Nsgd>(
      ProgramUtil.generateConstructorParams({
        isTestingOnChain: IS_TESTING_ON_CHAIN,
        addedAccounts: [
          AccountUtil.createAddedAccount(programOwnerKeypair.publicKey, {
            lamports: 10 * LAMPORTS_PER_SOL,
          }),
          AccountUtil.createAddedAccount(feePayerKeypair.publicKey, {
            lamports: 10 * LAMPORTS_PER_SOL,
          }),
        ],
        addedPrograms: [],
        anchorRootPath: '',
      })
    );

    const program = await programUtil.getProgram();
    const connection = await programUtil.getConnection();

    const programId = program.programId;

    const [bankPublicKey] = PublicKey.findProgramAddressSync(
      [BANK_SEED],
      programId
    );
    const [mintPublicKey] = PublicKey.findProgramAddressSync(
      [TOKEN_MINT_SEED],
      programId
    );

    testData = {
      keypairs: {
        feePayer: feePayerKeypair,
        programOwner: programOwnerKeypair,
      },
      programContext: {
        program,
        connection,
      },
      publicKeys: {
        bank: bankPublicKey,
        mint: mintPublicKey,
      },
    };
  });

  it('should be able to init bank and token', async () => {
    const {
      programContext: { program, connection },
      keypairs: { feePayer },
    } = testData;
    const testLiquidationThresholdPercentage = 50;
    const testLiquidationBonusPercentage = 5;
    const testMinHealthFactor = 1;

    const initBankInstruction = await program.methods
      .initBank(
        new BN(testLiquidationThresholdPercentage),
        new BN(testLiquidationBonusPercentage),
        new BN(testMinHealthFactor)
      )
      .accounts({
        signer: feePayer.publicKey,
      })
      .signers([feePayer])
      .instruction();

    const initTokenInstruction = await program.methods
      .initToken()
      .accounts({
        authority: feePayer.publicKey,
      })
      .signers([feePayer])
      .instruction();

    let { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transactionMessage = new TransactionMessage({
      instructions: [initBankInstruction, initTokenInstruction],
      payerKey: feePayer.publicKey,
      recentBlockhash: blockhash,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(transactionMessage);
    transaction.sign([feePayer]);

    const transactionId = await connection.sendTransaction(transaction);
    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: transactionId,
    });

    const bank = await program.account.bank.fetch(testData.publicKeys.bank);

    console.log({ transactionId, endpointUrl: connection.rpcEndpoint });

    expect(bank.isInitialized).toBeTruthy();
    expect(bank.authority.toBase58()).toBe(feePayer.publicKey.toBase58());
    expect(bank.tokenMint.toBase58()).toBe(testData.publicKeys.mint.toBase58());
    expect(bank.liquidationThresholdPercentage.toNumber()).toEqual(
      testLiquidationThresholdPercentage
    );
    expect(bank.liquidationBonusPercentage.toNumber()).toEqual(
      testLiquidationBonusPercentage
    );
    expect(bank.minHealthFactor.toNumber()).toEqual(testMinHealthFactor);
  });

  it.skip('should be able to update bank config', async () => {
    const testLiquidationBonusPercentage = 10;
    const {
      keypairs: { feePayer },
      programContext: { program, connection },
      publicKeys: { bank: bankPublicKey },
    } = testData;

    const currentBank = await program.account.bank.fetch(bankPublicKey);

    const instruction = await program.methods
      .updateBank(
        currentBank.liquidationThresholdPercentage,
        new BN(testLiquidationBonusPercentage),
        currentBank.minHealthFactor
      )
      .signers([feePayer])
      .instruction();

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transactionMessage = new TransactionMessage({
      instructions: [instruction],
      payerKey: feePayer.publicKey,
      recentBlockhash: blockhash,
    }).compileToV0Message();
    const transaction = new VersionedTransaction(transactionMessage);
    transaction.sign([feePayer]);
    const transactionId = await connection.sendTransaction(transaction);
    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: transactionId,
    });

    console.log({
      transactionId,
    });
  });
});
