#![allow(clippy::result_large_err)]

mod instructions;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("CH75SSAuYPUUbudAcvm3bbTdfTkaUTPMYzVZZH6TNR9T");

#[program]
pub mod nsgd {
  use super::*;

  pub fn init(context: Context<Init>) -> Result<()> {
    process_init(context)
  }
}
