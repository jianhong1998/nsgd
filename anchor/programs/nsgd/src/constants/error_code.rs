use anchor_lang::prelude::*;

#[error_code()]
pub enum ErrorCode {
  #[msg("Bank is already initialized. Cannot be initialized again.")]
  BankAlreadyInitialized,
}
