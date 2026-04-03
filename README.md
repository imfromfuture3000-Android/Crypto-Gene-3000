
🚀 **Cryptonout-9-voults** is a next-generation blockchain vaults project, designed with security, automation, and fair royalty-sharing.

## 🔒 PRIVATE SYSTEM - Access Controlled

This is a private trading system with restricted access. Valid authentication credentials are required for operation.

## Features
- 🏦 Secure vaults with programmatic control
- 🤖 Agent registration & automated trading strategies
- 💰 Automatic 5% royalty routing to owner wallet
- ⚡ Cross-chain SKALE + Solana compatibility
- 📊 Real-time arbitrage monitoring
- 🌉 Cross-chain bridge operations
- 🧠 Oracle & Phantom strategy execution
- 🌐 **Web Interface for GitHub Codespaces compatibility**

## GENE 9000 System Components

### Core Infrastructure
- **OneiroVault**: Secure ETH vault with owner controls
- **SwarmController**: Multi-bot strategy execution engine
- **Oracle Strategy**: Private price feed analysis and automated trading
- **Phantom Strategy**: Stealth arbitrage and liquidity capture

### Autonomous Intelligence (Private Access)
- **Monitor Swarm**: Private market scanning for arbitrage opportunities
- **Bridge Client**: Secure cross-chain asset transfers
- **Royalty System**: Private fee collection system
- **Dream-mind-lucid Scanner**: Comprehensive contract deployment tracker

## Dream-mind-lucid Contract Scanner

The Dream-mind-lucid scanner is a comprehensive tool for collecting all real contract addresses and transaction hashes from mainnet deployments of the GENE 9000 ecosystem.

### Features
- 🔍 **Multi-Network Scanning**: Scans Ethereum, Base, and SKALE networks
- 📊 **Comprehensive Reporting**: Generates detailed JSON reports with deployment data
- 🔒 **Access Control Integration**: Requires admin access for full functionality
- 🌐 **Real-time Analysis**: Analyzes deployment scripts, artifacts, and transaction logs
- 📋 **Contract Type Detection**: Identifies OneiroVault, Oracle, Phantom, and other contracts

### 1. Start the GENE 9000 System

#### Option A: Web Interface (Recommended for GitHub Codespaces)
```bash
npm install
npm run web
```
Then open your browser to `http://localhost:3000` or use the forwarded port in GitHub Codespaces.

#### Option B: Console Mode
```bash
# Scan all mainnet deployments
npm run scan

# Include testnet deployments  
npm run scan:testnets

# View detailed report
npm run scan:report
```

See `scripts/SCANNER_README.md` for complete documentation.

## Quick Start (Authorized Personnel Only)

### Prerequisites
- Valid access credentials (GENE9000_ACCESS_TOKEN)
- Environment configuration file
- Node.js 16+ installed

### 1. Configure Private Environment
```bash
cp .env.example .env
# Edit .env with your private credentials
```

### 2. Start the Private GENE 9000 System
```bash
npm install
npm start
```

### 3. Deploy Smart Contracts (Admin Access Required)
```bash
cd skale
npm install
# Set environment variables for private keys
npx hardhat run scripts/deploy.js --network skale
```

### 4. Register New Bots (Admin Only)
```bash
# Set private environment variables
CONTROLLER_ADDR=[PRIVATE] BOT_ADDR=[PRIVATE] npx hardhat run scripts/setBots.js
```

### 5. Run Dream-mind-lucid Contract Scanner
```bash
# Scan all mainnet deployments (Admin Access Required)
npm run scan

# Include testnet deployments
npm run scan:testnets

# View detailed report
npm run scan:report

# Direct CLI usage
node scripts/dream-scan.js scan --help
```

## 🌐 GitHub Codespaces Usage

When running in GitHub Codespaces or any web-based development environment:

1. **Install dependencies**: `npm install`
2. **Start web server**: `npm run web`
3. **Access via browser**: Use the forwarded port URL (typically port 3000)
4. **Full web interface**: 
   - Real-time system monitoring
   - Start/stop controls
   - Live log streaming  
   - Performance statistics
   - Visual status indicators

The web interface provides the same functionality as the console version but with a user-friendly dashboard perfect for browser-based environments.

## File Tree

```
Crypto-Gene-3000/
├─ package.json             # 📦 Main project dependencies
├─ server.js                # 🌐 Web server for browser access  
├─ gene9000.js              # 🤖 Main GENE 9000 orchestrator
├─ public/
│  └─ index.html            # 🖥️ Web interface dashboard
├─ cross-chain/             # Cross-chain operations
│  ├─ Monitorbots.js        # 📊 Autonomous monitoring swarm
│  └─ bridgeClient.js       # 🌉 Cross-chain bridge client
├─ skale/                   # SKALE chain contracts
Crypto-Gene-3000/
├─ gene9000.js              # 🤖 Main GENE 9000 orchestrator (Private)
├─ package.json             # 📦 Private system dependencies
├─ .env.example             # 🔐 Environment template (NO SECRETS)
├─ cross-chain/             # Cross-chain operations (Access Controlled)
│  ├─ Monitorbots.js        # 📊 Private monitoring swarm
│  └─ bridgeClient.js       # 🌉 Secure cross-chain bridge client
├─ skale/                   # SKALE chain contracts (Private)
│  ├─ contracts/
│  │  ├─ OneiroVault.sol    # 🏦 Private vault contract
│  │  ├─ SwarmController.sol # 🎮 Private strategy controller
│  │  ├─ Oracle.sol         # 🔮 Private oracle strategy
│  │  ├─ Phantom.sol        # 👻 Private phantom strategy
│  │  └─ Istrategy.sol      # 📋 Strategy interface
│  └─ test/
│     └─ swarm.test.js      # 🧪 Private contract tests
├─ solana/                  # Solana program (Private)
│  └─ programs/oneirobot/
│     └─ src/lib.rs         # 📦 Private Solana program
├─ config/                  # Private configuration
│  └─ addresses.ts          # 🔐 Secure address management
├─ scripts/                 # Deployment & management (Admin)
   ├─ deploy.js             # 🚀 Private contract deployment
   ├─ setBots.js            # 🤖 Private bot registration
   ├─ contractScanner.js    # 🔍 Dream-mind-lucid scanner
   ├─ dream-scan.js         # 📊 Scanner CLI interface
   └─ SCANNER_README.md     # 📖 Scanner documentation
```

## System Status: 🔒 PRIVATE & SECURED

The ONEIROBOT/GITHUB GENE 9000 operates as a private system with authenticated access controls for all trading and cross-chain operations.
