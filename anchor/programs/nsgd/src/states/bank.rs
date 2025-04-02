use anchor_lang::prelude::*;

#[account()]
#[derive(InitSpace)]
pub struct Bank {
  pub authority: Pubkey,
  pub token_mint: Pubkey,
  /** Percentage of liquidation threshold. Example: 10 represent 10% */
  pub liquidation_threshold_percentage: u64,
  /** Percentage of liquidation bonus. Example: 10 represent 10% */
  pub liquidation_bonus_percentage: u64,
  pub min_health_factor: u64,
  pub is_initialized: bool,
  pub bump: u8,
  pub mint_bump: u8,
}
