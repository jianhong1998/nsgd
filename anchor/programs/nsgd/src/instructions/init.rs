pub use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Init<'info> {
  pub system_program: Program<'info, System>,

  #[account(mut)]
  pub signer: Signer<'info>,
}

pub fn process_init(_context: Context<Init>) -> Result<()> {
  Ok(())
}
