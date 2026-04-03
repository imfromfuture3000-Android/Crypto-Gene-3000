# Private System Security Guide

## ACCESS CONTROL

This system implements multi-level access control:

### USER LEVEL
- Basic monitoring and reporting access
- Read-only operations
- Requires: `GENE9000_ACCESS_TOKEN`

### ADMIN LEVEL  
- Full system control
- Royalty system access
- Cross-chain operations
- Requires: `GENE9000_ACCESS_TOKEN` + `GENE9000_ADMIN_KEY`

## REQUIRED ENVIRONMENT VARIABLES

### Access Control (Required)
```
GENE9000_ACCESS_TOKEN=your_private_access_token_here
GENE9000_ADMIN_KEY=your_admin_key_here (for admin access)
```

### Wallet Configuration (Private)
```
WALLET_OWNER_BASE=your_ethereum_wallet_address
SOLANA_OWNER_WALLET=your_solana_wallet_address
```

### Network Configuration
```
SKALE_ENDPOINT=your_private_skale_endpoint
PRIVATE_KEY=your_private_key_for_transactions
```

### External Services (Optional)
```
BICONOMY_BUNDLER_URL=your_biconomy_endpoint
BICONOMY_API_KEY=your_biconomy_api_key
```

## SECURITY FEATURES

1. **Access Token Validation**: All operations require valid access tokens
2. **Admin-Only Operations**: Sensitive operations restricted to admin level
3. **Private Key Protection**: No hardcoded private keys or wallet addresses
4. **Environment Variable Security**: All sensitive data loaded from environment
5. **Sanitized Logging**: Wallet addresses are truncated in logs
6. **Configuration Validation**: System validates all required environment variables

## STARTUP

1. Copy `.env.example` to `.env`
2. Configure all required environment variables
3. Run: `npm start`

The system will validate access credentials before initialization.