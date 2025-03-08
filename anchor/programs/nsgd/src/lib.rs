#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod nsgd {
    use super::*;

  pub fn close(_ctx: Context<CloseNsgd>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.nsgd.count = ctx.accounts.nsgd.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.nsgd.count = ctx.accounts.nsgd.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeNsgd>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.nsgd.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeNsgd<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Nsgd::INIT_SPACE,
  payer = payer
  )]
  pub nsgd: Account<'info, Nsgd>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseNsgd<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub nsgd: Account<'info, Nsgd>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub nsgd: Account<'info, Nsgd>,
}

#[account]
#[derive(InitSpace)]
pub struct Nsgd {
  count: u8,
}
