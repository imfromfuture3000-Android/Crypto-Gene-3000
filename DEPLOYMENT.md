# Crypto-Gene-3000 Deployment Guide

## 🚀 Complete Deployment Instructions

This guide provides detailed instructions for deploying the Crypto-Gene-3000 system in various environments.

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: For cloning the repository
- **Rust** (optional): For Solana program development
- **Docker** (optional): For containerized deployment

## Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/imfromfuture3000-Android/Crypto-Gene-3000.git
cd Crypto-Gene-3000
```

### 2. One-Click Deployment
```bash
./deploy.sh
```

That's it! The system will be deployed and ready to run.

## Deployment Options

### Option A: Standard Deployment

1. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

2. **Deploy System**
```bash
./deploy.sh
```

3. **Start System**
```bash
node gene9000.js
```

### Option B: Using Manager Script

```bash
# Deploy everything
./gene9000-manager.sh deploy

# Start system
./gene9000-manager.sh start

# Check status  
./gene9000-manager.sh status

# Stop system
./gene9000-manager.sh stop
```

### Option C: Docker Deployment

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f crypto-gene-3000

# Stop containers
docker-compose down
```

### Option D: Production Deployment

For production environments, consider:

1. **Use Docker for isolation**
2. **Set up reverse proxy (nginx)**
3. **Configure monitoring and logging**
4. **Set up SSL certificates**
5. **Use environment-specific configuration**

## Environment Configuration

### Required Variables

```bash
# .env file
GENE9000_OWNER_WALLET=0x742d35Cc6671C0532925a3b8D25Bd78F1AB8C542
SKALE_ENDPOINT=https://mainnet.skalenodes.com/v1/parallel-stormy-spica
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### Optional Variables

```bash
GENE9000_ROYALTY_RATE=0.05
GENE9000_AUTO_START=true
GENE9000_MONITORING_ENABLED=true
GENE9000_BRIDGE_ENABLED=true
PRIVATE_KEY=your_private_key_here
```

## Network Deployment

### SKALE Network

1. **Install Dependencies**
```bash
cd skale
npm install
```

2. **Deploy Contracts**
```bash
npx hardhat run scripts/deploy.js --network skale
```

3. **Register Bots**
```bash
CONTROLLER_ADDR=0x... BOT_ADDR=0x... npx hardhat run scripts/setBots.js --network skale
```

### Solana Network

1. **Install Solana CLI**
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.14.7/install)"
```

2. **Build Program**
```bash
cd solana
anchor build
```

3. **Deploy Program**
```bash
anchor deploy
```

## Monitoring and Management

### System Health Check
```bash
./gene9000-manager.sh health
```

### View System Status
```bash
./gene9000-manager.sh status
```

### View Logs
```bash
./gene9000-manager.sh logs
```

## Troubleshooting

### Common Issues

1. **Permission Denied on Scripts**
```bash
chmod +x deploy.sh gene9000-manager.sh
```

2. **Node Modules Missing**
```bash
cd skale && npm install
```

3. **Environment Variables Not Set**
```bash
cp .env.example .env
# Edit .env file
```

4. **Port Already in Use**
```bash
./gene9000-manager.sh stop
# Or kill existing processes
pkill -f "node gene9000.js"
```

### Debug Mode

Run with debug output:
```bash
DEBUG=* node gene9000.js
```

### Network Issues

If deployment fails due to network restrictions:
```bash
# Deploy without contracts
./deploy.sh --skip-contracts

# Deploy without Solana
./deploy.sh --skip-solana
```

## Security Considerations

1. **Private Keys**: Never commit private keys to version control
2. **Environment Files**: Keep .env files secure and environment-specific
3. **Network Access**: Restrict network access to required endpoints only
4. **Monitoring**: Set up monitoring for unauthorized access attempts
5. **Updates**: Keep dependencies updated for security patches

## Performance Optimization

1. **Resource Allocation**: Ensure adequate CPU and memory for the system
2. **Network Latency**: Deploy close to target blockchain networks
3. **Database**: Consider using persistent storage for historical data
4. **Caching**: Implement caching for frequently accessed data
5. **Load Balancing**: Use load balancers for high-availability deployments

## Backup and Recovery

1. **Configuration Backup**: Regularly backup .env and configuration files
2. **Wallet Backup**: Secure backup of wallet private keys
3. **State Backup**: Backup any persistent state data
4. **Recovery Testing**: Regularly test recovery procedures

## Support

For deployment issues:
1. Check the troubleshooting section
2. Run health checks
3. Review system logs
4. Check network connectivity
5. Verify environment configuration

## Deployment Checklist

- [ ] Prerequisites installed (Node.js, npm)
- [ ] Repository cloned
- [ ] Environment configured (.env file)
- [ ] Dependencies installed
- [ ] System deployed successfully
- [ ] Health check passed
- [ ] System started
- [ ] Monitoring configured (optional)
- [ ] Backup procedures in place (production)

🎉 **Your Crypto-Gene-3000 system is now deployed and operational!**