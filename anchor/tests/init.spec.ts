import { Program } from '@coral-xyz/anchor';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { beforeAll, describe, it } from 'vitest';
import { ProgramUtil } from './utils/program.util';
import {
  IS_TESTING_ON_CHAIN,
  TEST_FEE_PAYER_ID_FILE_PATH,
  TEST_PROGRAM_OWNER_ID_FILE_PATH,
} from './constants';
import { AccountUtil } from './utils/account.util';
import { Nsgd } from '../target/types/nsgd';

interface ITestData {
  programContext: {
    program: Program<Nsgd>;
    connection: Connection;
  };
  keypairs: {
    programOwner: Keypair;
    feePayer: Keypair;
  };
}

describe('nsgd', () => {
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
    const provider = await programUtil.getProvider();
    const connection = provider.connection;

    testData = {
      keypairs: {
        feePayer: feePayerKeypair,
        programOwner: programOwnerKeypair,
      },
      programContext: {
        program,
        connection,
      },
    };
  });

  it('should ', async () => {
    const {
      programContext: { program, connection },
      keypairs: { feePayer },
    } = testData;

    const initBankInstruction = await program.methods
      .initBank()
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

    // console.log({ initBankInstruction, initTokenInstruction });

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

    console.log({ transactionId, endpointUrl: connection.rpcEndpoint });
  });
});
