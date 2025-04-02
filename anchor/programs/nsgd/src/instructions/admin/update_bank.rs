use anchor_lang::prelude::*;

use crate::{
  constants::{ErrorCode, BANK_SEED},
  states::Bank,
};

#[derive(Accounts)]
pub struct UpdateBank<'info> {
  pub system_program: Program<'info, System>,

  #[account(mut)]
  pub authority: Signer<'info>,

  #[account(
    mut,
    seeds = [
      BANK_SEED
    ],
    bump = bank.bump,
    has_one = authority
  )]
  pub bank: Account<'info, Bank>,
}

pub fn process_update_bank(
  context: Context<UpdateBank>,
  liquidation_threshold: u64,
  liquidation_bonus: u64,
  min_health_factor: u64,
) -> Result<()> {
  let bank = &mut context.accounts.bank;

  if !bank.is_initialized {
    return Err(ErrorCode::BankNotInitialized.into());
  }

  msg!("Updating bank data...");
  bank.liquidation_threshold_percentage = liquidation_threshold;
  bank.liquidation_bonus_percentage = liquidation_bonus;
  bank.min_health_factor = min_health_factor;
  msg!(
    "Liquidation threshold: {}\nLiquidation bonus: {}\nMinimum health factor: {}",
    bank.liquidation_threshold_percentage,
    bank.liquidation_bonus_percentage,
    min_health_factor
  );
  msg!("Bank data updated successfully ✅");

  Ok(())
}
