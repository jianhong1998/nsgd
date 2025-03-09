#![allow(clippy::result_large_err)]

mod constants;
mod instructions;
mod states;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("Cyq8xw2mP2hCy62voStd5WEHTkPC1yyMoNiv5267m2W5");

#[program]
pub mod nsgd {
  use super::*;

  pub fn init_bank(context: Context<InitBank>) -> Result<()> {
    process_init_bank(context)
  }

  pub fn init_token(context: Context<InitToken>) -> Result<()> {
    process_init_token(context)
  }
}
