#![allow(clippy::result_large_err)]

mod instructions;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod nsgd {
  use super::*;

  pub fn init(context: Context<Init>) -> Result<()> {
    process_init(context)
  }
}
