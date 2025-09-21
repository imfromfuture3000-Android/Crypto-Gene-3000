# Dream-mind-lucid Contract Scanner

Comprehensive scanner for collecting all real contract addresses and transaction hashes from mainnet deployments of the OneiroBot/GENE 9000 system.

## Overview

The Dream-mind-lucid scanner is designed to comprehensively analyze and collect deployment data for all contracts related to the GENE 9000 ecosystem, including:

- **OneiroVault** contracts (secure private vaults)
- **SwarmController** contracts (multi-bot strategy execution)
- **Oracle** strategy contracts (price feed analysis)
- **Phantom** strategy contracts (stealth arbitrage)
- **Bridge** contracts (cross-chain operations)
- **Monitor** contracts (automated scanning)

## Features

### 🔍 Comprehensive Scanning
- Scans multiple blockchain networks (Ethereum, Base, SKALE)
- Identifies contract deployments from various sources
- Analyzes deployment scripts and artifacts
- Detects transaction logs for contract creation

### 📊 Detailed Reporting
- Generates comprehensive JSON reports
- Categorizes mainnet vs testnet deployments
- Includes transaction hashes and deployment details
- Provides network-specific analysis

### 🌐 Multi-Network Support
- Ethereum mainnet
- Base mainnet  
- SKALE network
- Configurable for additional networks

### 🔒 Access Control Integration
- Integrates with GENE 9000 access control system
- Requires admin privileges for full functionality
- Respects private system security protocols

## Installation

The scanner is integrated into the GENE 9000 system. Install dependencies:

```bash
npm install
```

## Usage

### Command Line Interface

The scanner provides a comprehensive CLI tool:

```bash
# Basic scan for mainnet deployments only
npm run scan

# Include testnet deployments  
npm run scan:testnets

# Generate and view detailed report
npm run scan:report

# Direct CLI usage
node scripts/dream-scan.js scan --help
```

### CLI Commands

#### Scan Command
```bash
# Basic scan
dream-scan scan

# Custom output path
dream-scan scan --output ./my-report.json

# Include testnets
dream-scan scan --include-testnets

# Scan specific networks
dream-scan scan --networks ethereum,base
```

#### Report Command
```bash
# View latest report
dream-scan report

# View specific report
dream-scan report ./path/to/report.json
```

### Programmatic Usage

```javascript
const { DreamMindLucidScanner } = require('./scripts/contractScanner');

// Initialize scanner
const scanner = new DreamMindLucidScanner({
    outputPath: './deployments.json',
    includeTestnets: false,
    networks: ['ethereum', 'base', 'skale']
});

// Run comprehensive scan
const results = await scanner.scanAllDeployments();
console.log(`Found ${results.contractsFound} contracts`);
```

### Integration with GENE 9000

The scanner is integrated into the main GENE 9000 system:

```javascript
const { OneiroGene9000System } = require('./gene9000');

const gene9000 = new OneiroGene9000System();
await gene9000.initialize();

// Execute Dream-mind-lucid scan (requires admin access)
const scanResults = await gene9000.executeDreamMindLucidScan();
```

## Configuration

### Environment Variables

Set up the following environment variables in your `.env` file:

```bash
# Required for GENE 9000 access
GENE9000_ACCESS_TOKEN=your_access_token_here
GENE9000_ADMIN_KEY=your_admin_key_here

# Network RPC endpoints (optional - will use defaults if not provided)
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_key
BASE_RPC_URL=https://mainnet.base.org
SKALE_RPC_URL=https://your-skale-endpoint

# Wallet addresses (for address scanning)
WALLET_OWNER_BASE=0x...
SOLANA_OWNER_WALLET=...
```

### Scanner Configuration

```javascript
const config = {
    networks: ['ethereum', 'base', 'skale'],        // Networks to scan
    outputPath: './report.json',                     // Output file path
    includeTestnets: false,                         // Include testnet data
    refreshInterval: 10000,                         // Scanning interval (ms)
    profitThreshold: 0.001                          // Minimum profit threshold
};
```

## Output Format

The scanner generates detailed JSON reports with the following structure:

```json
{
  "scanTimestamp": "2024-01-01T00:00:00.000Z",
  "scanner": "Dream-mind-lucid Contract Scanner",
  "version": "1.0.0",
  "summary": {
    "totalContractsScanned": 50,
    "verifiedContracts": 12,
    "deploymentsFound": 8,
    "networksScanned": 3,
    "errors": 0
  },
  "deployments": {
    "mainnet": [
      {
        "address": "0x1234...",
        "name": "OneiroVault",
        "network": "ethereum",
        "transactionHash": "0xabcd...",
        "blockNumber": 18500000,
        "deployer": "0x5678...",
        "timestamp": "2024-01-01T00:00:00.000Z",
        "gasUsed": "2100000"
      }
    ],
    "testnet": [],
    "unknown": []
  },
  "networkDetails": {
    "ethereum": {
      "contracts": [...],
      "lastBlock": 18500000
    }
  }
}
```

## Contract Types Detected

The scanner identifies the following contract types:

1. **OneiroVault** - Secure private vault contracts
2. **SwarmController** - Multi-bot strategy execution engine
3. **Oracle** - Price feed analysis and trading strategies  
4. **Phantom** - Stealth arbitrage and liquidity capture
5. **DummySwapAdapter** - Swap operation adapters
6. **BridgeClient** - Cross-chain bridge operations
7. **MonitorBot** - Automated monitoring systems

## Security Considerations

- **Private System**: Scanner respects GENE 9000 access controls
- **Admin Access**: Full functionality requires admin privileges
- **Rate Limiting**: Implements appropriate delays for RPC calls
- **Error Handling**: Graceful degradation when networks are unavailable

## Troubleshooting

### Common Issues

1. **RPC Connection Errors**
   - Verify RPC endpoints in environment variables
   - Check network connectivity
   - Ensure API keys are valid

2. **Access Denied Errors**
   - Verify GENE9000_ACCESS_TOKEN is set
   - Check admin privileges for full scans
   - Ensure environment is properly configured

3. **No Contracts Found**
   - Verify network selection
   - Check block range settings
   - Ensure contracts exist on target networks

### Debug Mode

Enable verbose logging:

```bash
DEBUG=dream-scan* npm run scan
```

## Integration Points

The scanner integrates with:

- **GENE 9000 Main System** - Core orchestration
- **Monitor Swarm** - Trading bot monitoring
- **Bridge Client** - Cross-chain operations
- **Configuration Management** - Address and network config

## Contributing

This scanner is part of the private GENE 9000 system. Contact system administrators for access and contribution guidelines.

## License

Private system - See LICENSE file for details.