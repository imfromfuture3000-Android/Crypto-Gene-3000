use anchor_lang::prelude::*;

declare_id!("Oneirobot111111111111111111111111111111111");

#[program]
pub mod oneirobot {
    use super::*;

    pub fn init(ctx: Context<Init>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.admin = *ctx.accounts.admin.key;
        Ok(())
    }
}

#[account]
pub struct State {
    pub admin: Pubkey,
}

#[derive(Accounts)]
pub struct Init<'info> {
    #[account(init, payer = admin, space = 8 + 32)]
    pub state: Account<'info, State>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}
