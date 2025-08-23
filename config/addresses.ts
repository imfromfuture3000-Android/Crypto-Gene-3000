export const ADDRESSES = {
  // Private configuration - loaded from environment variables only
  solanaOwner: process.env.SOLANA_OWNER_WALLET || "",
  baseOwner: process.env.WALLET_OWNER_BASE || "",
  ancTokenBase: process.env.ANC_TOKEN_BASE || "",
  wormholeRelayerBase: process.env.WORMHOLE_RELAYER_BASE || "",

  // Biconomy Bundler setup (Account Abstraction) - Private
  biconomyBundlerUrl: process.env.BICONOMY_BUNDLER_URL || "",
  biconomyApiKey: process.env.BICONOMY_API_KEY || "",
  
  // Access control
  gene9000AccessToken: process.env.GENE9000_ACCESS_TOKEN || "",
  gene9000AdminKey: process.env.GENE9000_ADMIN_KEY || "",
};

// Validation function for private configuration
export function validatePrivateConfig() {
  const required = ['SOLANA_OWNER_WALLET', 'WALLET_OWNER_BASE', 'GENE9000_ACCESS_TOKEN'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Private configuration missing: ${missing.join(', ')}. Please set these environment variables.`);
  }
}
