use anchor_lang::prelude::*;

#[account()]
#[derive(InitSpace)]
pub struct Bank {
  pub authority: Pubkey,
  pub token_mint: Pubkey,
  pub collection_token_account: Pubkey,
  pub is_initialized: bool,
  pub bump: u8,
  pub mint_bump: u8,
  pub collection_token_account_bump: u8,
}
