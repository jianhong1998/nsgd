use crate::{
  constants::{
    ErrorCode, ACCOUNT_DISCRIMINATOR, BANK_SEED, METADATA_SEED, TOKEN_METADATA_URL,
    TOKEN_MINT_SEED, TOKEN_NAME, TOKEN_SYMBOL,
  },
  states::Bank,
};
use anchor_lang::prelude::*;
use anchor_spl::{
  associated_token::AssociatedToken,
  metadata::Metadata,
  token_interface::{Mint, Token2022},
};
use mpl_token_metadata::{instructions::CreateV1CpiBuilder, types::TokenStandard};

#[derive(Accounts)]
pub struct InitBank<'info> {
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token2022>,

  #[account(mut)]
  pub signer: Signer<'info>,

  #[account(
    init,
    payer = signer,
    seeds = [
      TOKEN_MINT_SEED,
    ],
    bump,
    mint::decimals = 6,
    mint::authority = mint,
    mint::freeze_authority = mint
  )]
  pub mint: Box<InterfaceAccount<'info, Mint>>,

  #[account(
    init,
    payer = signer,
    space = ACCOUNT_DISCRIMINATOR + Bank::INIT_SPACE,
    seeds = [
      BANK_SEED
    ],
    bump
  )]
  pub bank: Box<Account<'info, Bank>>,
}

#[derive(Accounts)]
pub struct InitToken<'info> {
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token2022>,
  pub token_metadata_program: Program<'info, Metadata>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub rent: Sysvar<'info, Rent>,

  #[account(mut)]
  pub authority: Signer<'info>,

  #[account(
    mut,
    seeds = [
      TOKEN_MINT_SEED,
    ],
    bump = bank.mint_bump,
  )]
  pub mint: Box<InterfaceAccount<'info, Mint>>,

  #[account(
    seeds = [
      BANK_SEED
    ],
    bump = bank.bump,
    has_one = authority,
  )]
  pub bank: Box<Account<'info, Bank>>,

  #[account(
    mut,
    seeds = [
      METADATA_SEED,
      token_metadata_program.key().as_ref(),
      mint.key().as_ref(),
    ],
    bump,
    seeds::program = token_metadata_program.key()
  )]
  /// CHECK: This account is handled and checked by metadata smart contract
  pub metadata: UncheckedAccount<'info>,
}

pub fn process_init_bank(context: Context<InitBank>) -> Result<()> {
  let signer = &context.accounts.signer;
  let mint = &context.accounts.mint;
  let bank = &mut context.accounts.bank;

  if bank.is_initialized {
    return Err(ErrorCode::BankAlreadyInitialized.into());
  }

  msg!("Processing bank initialization...");
  bank.authority = signer.key();
  bank.token_mint = mint.key();
  bank.is_initialized = true;
  bank.bump = context.bumps.bank;
  bank.mint_bump = context.bumps.mint;
  msg!("Bank initialized ✅");

  Ok(())
}

pub fn process_init_token(context: Context<InitToken>) -> Result<()> {
  let signer = &context.accounts.authority;
  let mint = &context.accounts.mint;

  let token_metadata_program_account_info =
    context.accounts.token_metadata_program.to_account_info();
  let token_program_accunt_info = context.accounts.token_program.to_account_info();
  let system_program_account_info = context.accounts.system_program.to_account_info();
  let metadata_account_info = context.accounts.metadata.to_account_info();
  let mint_account_info = mint.to_account_info();
  let signer_account_info = signer.to_account_info();
  let rent_account_info = context.accounts.rent.to_account_info();

  let signer_seeds: &[&[&[u8]]] = &[&[TOKEN_MINT_SEED, &[context.accounts.bank.mint_bump]]];

  let mut create_metadata_cpi = CreateV1CpiBuilder::new(&token_metadata_program_account_info);
  create_metadata_cpi.metadata(&metadata_account_info);
  create_metadata_cpi.mint(&mint_account_info, true);
  create_metadata_cpi.authority(&mint_account_info);
  create_metadata_cpi.payer(&signer_account_info);
  create_metadata_cpi.update_authority(&signer_account_info, false);
  create_metadata_cpi.spl_token_program(Some(&token_program_accunt_info));
  create_metadata_cpi.system_program(&system_program_account_info);
  create_metadata_cpi.uri(TOKEN_METADATA_URL.to_string());
  create_metadata_cpi.name(TOKEN_NAME.to_string());
  create_metadata_cpi.symbol(TOKEN_SYMBOL.to_string());
  create_metadata_cpi.decimals(mint.decimals);
  create_metadata_cpi.is_mutable(true);
  create_metadata_cpi.seller_fee_basis_points(0);
  create_metadata_cpi.token_standard(TokenStandard::Fungible);
  create_metadata_cpi.sysvar_instructions(&rent_account_info);

  create_metadata_cpi.invoke_signed(signer_seeds)?;

  Ok(())
}
