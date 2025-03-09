import { join } from 'path';

/**
 * @note `APP_NAME` must be same with the IDL JSON file name in folder `./anchor/target/idl`
 */
export const APP_NAME = 'nsgd';
export const IS_TESTING_ON_CHAIN = process.env.IS_TESTING_ON_CHAIN
  ? process.env.IS_TESTING_ON_CHAIN === 'true'
  : false;

export const TEST_PROGRAM_OWNER_ID_FILE_PATH = join(
  __dirname,
  '../fixtures/keys/program-owner.json'
);

export const TEST_FEE_PAYER_ID_FILE_PATH = join(
  __dirname,
  '../fixtures/keys/payer.json'
);
