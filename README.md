# Crypto-Gene-3000

🚀 **Crypto-Gene-3000** is a next-generation blockchain vaults project, designed with security, automation, and fair royalty-sharing.

## 🤖 ONEIROBOT/GITHUB GENE 9000 - ACTIVATED

The autonomous trading swarm intelligence system is now OPERATIONAL!

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
- **Oracle Strategy**: Price feed analysis and automated trading
- **Phantom Strategy**: Stealth arbitrage and liquidity capture

### Autonomous Intelligence
- **Monitor Swarm**: Real-time market scanning for arbitrage opportunities
- **Bridge Client**: Cross-chain asset transfers between SKALE and Solana
- **Royalty System**: Automatic 5% fee collection to owner wallet

## Quick Start

### 1. Start the GENE 9000 System

#### Option A: Web Interface (Recommended for GitHub Codespaces)
```bash
npm install
npm run web
```
Then open your browser to `http://localhost:3000` or use the forwarded port in GitHub Codespaces.

#### Option B: Console Mode
```bash
node gene9000.js
```

### 2. Deploy Smart Contracts (when network available)
```bash
cd skale
npm install
npx hardhat run scripts/deploy.js --network skale
```

### 3. Register New Bots
```bash
CONTROLLER_ADDR=0x... BOT_ADDR=0x... npx hardhat run scripts/setBots.js
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
│  ├─ contracts/
│  │  ├─ OneiroVault.sol    # 🏦 Main vault contract
│  │  ├─ SwarmController.sol # 🎮 Strategy controller
│  │  ├─ Oracle.sol         # 🔮 Oracle strategy
│  │  ├─ Phantom.sol        # 👻 Phantom strategy
│  │  └─ Istrategy.sol      # 📋 Strategy interface
│  └─ test/
│     └─ swarm.test.js      # 🧪 Smart contract tests
├─ solana/                  # Solana program
│  └─ programs/oneirobot/
│     └─ src/lib.rs         # 📦 Solana Oneirobot program
└─ scripts/                 # Deployment & management
   ├─ deploy.js             # 🚀 Contract deployment
   └─ setBots.js            # 🤖 Bot registration
```

## System Status: ✅ OPERATIONAL

The ONEIROBOT/GITHUB GENE 9000 is actively hunting for profitable arbitrage opportunities across SKALE and Solana ecosystems with autonomous swarm intelligence.
