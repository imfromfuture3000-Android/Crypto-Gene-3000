/**
 * Dream-mind-lucid Contract Scanner
 * Comprehensive scanner for collecting all real contract addresses and transaction hashes
 * from mainnet deployments of the OneiroBot/GENE 9000 system
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

class DreamMindLucidScanner {
    constructor(config = {}) {
        this.config = {
            networks: config.networks || ['ethereum', 'base', 'skale'],
            outputPath: config.outputPath || './deployment-report.json',
            includeTestnets: config.includeTestnets || false,
            ...config
        };
        
        this.deployments = {
            mainnet: [],
            testnet: [],
            unknown: []
        };
        
        this.contractTypes = [
            'OneiroVault',
            'SwarmController', 
            'Oracle',
            'Phantom',
            'DummySwapAdapter',
            'BridgeClient',
            'MonitorBot'
        ];
        
        this.providers = this.initializeProviders();
        this.scanResults = {
            totalScanned: 0,
            contractsFound: 0,
            deploymentsFound: 0,
            networks: {},
            errors: []
        };
    }

    initializeProviders() {
        const providers = {};
        
        // Initialize providers for different networks
        try {
            // Ethereum mainnet
            if (process.env.ETHEREUM_RPC_URL) {
                providers.ethereum = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
            }
            
            // Base mainnet
            if (process.env.BASE_RPC_URL) {
                providers.base = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
            } else {
                // Use public Base RPC as fallback
                providers.base = new ethers.JsonRpcProvider('https://mainnet.base.org');
            }
            
            // SKALE network
            if (process.env.SKALE_RPC_URL) {
                providers.skale = new ethers.JsonRpcProvider(process.env.SKALE_RPC_URL);
            }
            
        } catch (error) {
            console.warn('⚠️ Warning: Some RPC providers could not be initialized:', error.message);
        }
        
        return providers;
    }

    async scanAllDeployments() {
        console.log('🔍 Starting Dream-mind-lucid Contract Scanner...');
        console.log('============================================');
        
        // Scan known deployment addresses from config
        await this.scanKnownAddresses();
        
        // Scan deployment scripts for addresses
        await this.scanDeploymentScripts();
        
        // Scan contract artifacts
        await this.scanContractArtifacts();
        
        // Scan transaction logs for contract deployments
        await this.scanTransactionLogs();
        
        // Generate comprehensive report
        await this.generateReport();
        
        console.log('✅ Dream-mind-lucid scan complete!');
        return this.scanResults;
    }

    async scanKnownAddresses() {
        console.log('📊 Scanning known addresses from configuration...');
        
        try {
            // Check config/addresses.ts for any hardcoded addresses
            const addressConfig = await this.loadAddressConfig();
            
            if (addressConfig) {
                for (const [key, address] of Object.entries(addressConfig)) {
                    if (this.isValidAddress(address)) {
                        await this.analyzeContract(address, key, 'config');
                    }
                }
            }
        } catch (error) {
            this.scanResults.errors.push(`Error scanning known addresses: ${error.message}`);
        }
    }

    async loadAddressConfig() {
        try {
            const configPath = path.join(__dirname, '../config/addresses.ts');
            if (fs.existsSync(configPath)) {
                const content = fs.readFileSync(configPath, 'utf8');
                
                // Extract addresses from the TypeScript file
                const addressMatches = content.match(/0x[a-fA-F0-9]{40}/g) || [];
                const addresses = {};
                
                addressMatches.forEach((addr, index) => {
                    addresses[`config_address_${index}`] = addr;
                });
                
                return addresses;
            }
        } catch (error) {
            console.warn('⚠️ Could not load address config:', error.message);
        }
        return null;
    }

    async scanDeploymentScripts() {
        console.log('📝 Scanning deployment scripts...');
        
        try {
            const deploymentPaths = [
                './scripts/deploy.js',
                './skale/scripts/deploy.js',
                './scripts/setBots.js'
            ];
            
            for (const scriptPath of deploymentPaths) {
                const fullPath = path.join(__dirname, '..', scriptPath);
                if (fs.existsSync(fullPath)) {
                    await this.analyzeDeploymentScript(fullPath);
                }
            }
        } catch (error) {
            this.scanResults.errors.push(`Error scanning deployment scripts: ${error.message}`);
        }
    }

    async analyzeDeploymentScript(scriptPath) {
        try {
            const content = fs.readFileSync(scriptPath, 'utf8');
            
            // Extract potential contract addresses from deployment logs
            const addressMatches = content.match(/0x[a-fA-F0-9]{40}/g) || [];
            const hashMatches = content.match(/0x[a-fA-F0-9]{64}/g) || [];
            
            for (const address of addressMatches) {
                await this.analyzeContract(address, 'deployment_script', scriptPath);
            }
            
            // Record transaction hashes found in scripts
            for (const hash of hashMatches) {
                this.recordTransactionHash(hash, 'deployment_script', scriptPath);
            }
            
        } catch (error) {
            console.warn(`⚠️ Could not analyze script ${scriptPath}:`, error.message);
        }
    }

    async scanContractArtifacts() {
        console.log('🏗️ Scanning contract artifacts...');
        
        try {
            const artifactPaths = [
                './skale/artifacts/contracts',
                './artifacts/contracts'
            ];
            
            for (const artifactPath of artifactPaths) {
                const fullPath = path.join(__dirname, '..', artifactPath);
                if (fs.existsSync(fullPath)) {
                    await this.scanArtifactDirectory(fullPath);
                }
            }
        } catch (error) {
            this.scanResults.errors.push(`Error scanning artifacts: ${error.message}`);
        }
    }

    async scanArtifactDirectory(dirPath) {
        try {
            const files = fs.readdirSync(dirPath, { recursive: true });
            
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(dirPath, file);
                    await this.analyzeArtifact(filePath);
                }
            }
        } catch (error) {
            console.warn(`⚠️ Could not scan artifact directory ${dirPath}:`, error.message);
        }
    }

    async analyzeArtifact(artifactPath) {
        try {
            const content = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
            
            // Check for deployment information in artifacts
            if (content.networks) {
                for (const [networkId, deployment] of Object.entries(content.networks)) {
                    if (deployment.address) {
                        await this.analyzeContract(
                            deployment.address, 
                            content.contractName || 'unknown',
                            `artifact_network_${networkId}`
                        );
                        
                        if (deployment.transactionHash) {
                            this.recordTransactionHash(
                                deployment.transactionHash,
                                content.contractName || 'unknown',
                                `artifact_network_${networkId}`
                            );
                        }
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Could not analyze artifact ${artifactPath}:`, error.message);
        }
    }

    async scanTransactionLogs() {
        console.log('🔗 Scanning transaction logs for contract deployments...');
        
        for (const [networkName, provider] of Object.entries(this.providers)) {
            try {
                await this.scanNetworkForContracts(networkName, provider);
            } catch (error) {
                this.scanResults.errors.push(`Error scanning ${networkName}: ${error.message}`);
            }
        }
    }

    async scanNetworkForContracts(networkName, provider) {
        try {
            console.log(`🌐 Scanning ${networkName} network...`);
            
            if (!this.scanResults.networks[networkName]) {
                this.scanResults.networks[networkName] = {
                    contracts: [],
                    transactions: [],
                    lastBlock: 0
                };
            }
            
            // Get current block number
            const currentBlock = await provider.getBlockNumber();
            this.scanResults.networks[networkName].lastBlock = currentBlock;
            
            // Scan recent blocks for contract deployments
            const blocksToScan = Math.min(1000, currentBlock); // Last 1000 blocks or all blocks
            const startBlock = Math.max(0, currentBlock - blocksToScan);
            
            console.log(`📊 Scanning blocks ${startBlock} to ${currentBlock} on ${networkName}...`);
            
            for (let blockNumber = startBlock; blockNumber <= currentBlock; blockNumber += 10) {
                const endBlock = Math.min(blockNumber + 9, currentBlock);
                await this.scanBlockRange(networkName, provider, blockNumber, endBlock);
                
                // Update progress every 100 blocks
                if (blockNumber % 100 === 0) {
                    console.log(`📈 Progress: Block ${blockNumber}/${currentBlock} on ${networkName}`);
                }
            }
            
        } catch (error) {
            console.warn(`⚠️ Error scanning ${networkName}:`, error.message);
        }
    }

    async scanBlockRange(networkName, provider, startBlock, endBlock) {
        try {
            // Get all transactions in the block range that create contracts
            for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
                const block = await provider.getBlock(blockNumber, true);
                
                if (block && block.transactions) {
                    for (const tx of block.transactions) {
                        if (tx.to === null) { // Contract creation transaction
                            await this.analyzeContractCreation(networkName, provider, tx);
                        }
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Error scanning blocks ${startBlock}-${endBlock}:`, error.message);
        }
    }

    async analyzeContractCreation(networkName, provider, transaction) {
        try {
            // Get transaction receipt to find contract address
            const receipt = await provider.getTransactionReceipt(transaction.hash);
            
            if (receipt && receipt.contractAddress) {
                const contractInfo = {
                    address: receipt.contractAddress,
                    transactionHash: transaction.hash,
                    blockNumber: receipt.blockNumber,
                    deployer: transaction.from,
                    network: networkName,
                    gasUsed: receipt.gasUsed.toString(),
                    timestamp: null
                };
                
                // Get block timestamp
                const block = await provider.getBlock(receipt.blockNumber);
                if (block) {
                    contractInfo.timestamp = new Date(block.timestamp * 1000).toISOString();
                }
                
                // Try to identify contract type
                contractInfo.contractType = await this.identifyContractType(provider, receipt.contractAddress);
                
                // Categorize as mainnet or testnet
                const category = this.categorizeNetwork(networkName);
                this.deployments[category].push(contractInfo);
                
                this.scanResults.networks[networkName].contracts.push(contractInfo);
                this.scanResults.contractsFound++;
                
                console.log(`📋 Found contract: ${contractInfo.contractType || 'Unknown'} at ${receipt.contractAddress} on ${networkName}`);
            }
        } catch (error) {
            console.warn(`⚠️ Error analyzing contract creation:`, error.message);
        }
    }

    async identifyContractType(provider, contractAddress) {
        try {
            // Get contract code
            const code = await provider.getCode(contractAddress);
            
            if (code === '0x') {
                return 'EOA'; // Not a contract
            }
            
            // Try to identify contract by code patterns
            for (const contractType of this.contractTypes) {
                if (await this.matchesContractType(provider, contractAddress, contractType)) {
                    return contractType;
                }
            }
            
            return 'Unknown Contract';
        } catch (error) {
            return 'Unknown';
        }
    }

    async matchesContractType(provider, contractAddress, contractType) {
        try {
            // Basic pattern matching based on common function signatures
            const patterns = {
                'OneiroVault': ['0x8da5cb5b', '0x27e235e3'], // owner(), balance()
                'SwarmController': ['0x8da5cb5b', '0x1c31f710'], // owner(), addStrategy()
                'Oracle': ['0x8da5cb5b'], // owner()
                'Phantom': ['0x8da5cb5b'], // owner()
            };
            
            if (patterns[contractType]) {
                // Check if contract responds to expected function selectors
                for (const selector of patterns[contractType]) {
                    try {
                        await provider.call({
                            to: contractAddress,
                            data: selector + '0'.repeat(56) // Add padding
                        });
                    } catch (error) {
                        // If any selector fails, it's likely not this contract type
                        return false;
                    }
                }
                return true;
            }
            
            return false;
        } catch (error) {
            return false;
        }
    }

    async analyzeContract(address, name, source) {
        if (!this.isValidAddress(address)) {
            return;
        }

        this.scanResults.totalScanned++;
        
        const contractInfo = {
            address: address,
            name: name,
            source: source,
            network: 'unknown',
            verified: false,
            deploymentTx: null
        };

        // Try to determine which network this contract is on
        for (const [networkName, provider] of Object.entries(this.providers)) {
            try {
                const code = await provider.getCode(address);
                if (code !== '0x') {
                    contractInfo.network = networkName;
                    contractInfo.verified = true;
                    
                    // Try to find deployment transaction
                    contractInfo.deploymentTx = await this.findDeploymentTransaction(provider, address);
                    break;
                }
            } catch (error) {
                // Continue to next provider
            }
        }

        const category = this.categorizeNetwork(contractInfo.network);
        this.deployments[category].push(contractInfo);
        
        if (contractInfo.verified) {
            this.scanResults.contractsFound++;
            console.log(`✅ Verified contract: ${name} at ${address} on ${contractInfo.network}`);
        }
    }

    async findDeploymentTransaction(provider, contractAddress) {
        try {
            // This is a simplified approach - in practice, you'd need to scan blocks
            // or use specialized APIs to find the deployment transaction
            const currentBlock = await provider.getBlockNumber();
            const startBlock = Math.max(0, currentBlock - 10000); // Last 10k blocks
            
            // Note: This is computationally expensive for large ranges
            // In production, you'd use event filtering or external APIs
            
            return null; // Placeholder - would implement full block scanning
        } catch (error) {
            return null;
        }
    }

    recordTransactionHash(hash, contractType, source) {
        if (this.isValidHash(hash)) {
            this.scanResults.deploymentsFound++;
            console.log(`📋 Found deployment hash: ${hash} (${contractType})`);
        }
    }

    categorizeNetwork(networkName) {
        const mainnets = ['ethereum', 'base', 'skale'];
        const testnets = ['goerli', 'sepolia', 'base-goerli', 'skale-testnet'];
        
        if (mainnets.includes(networkName)) {
            return 'mainnet';
        } else if (testnets.includes(networkName)) {
            return 'testnet';
        } else {
            return 'unknown';
        }
    }

    isValidAddress(address) {
        return typeof address === 'string' && /^0x[a-fA-F0-9]{40}$/.test(address);
    }

    isValidHash(hash) {
        return typeof hash === 'string' && /^0x[a-fA-F0-9]{64}$/.test(hash);
    }

    async generateReport() {
        console.log('📊 Generating comprehensive Dream-mind-lucid deployment report...');
        
        const report = {
            scanTimestamp: new Date().toISOString(),
            scanner: 'Dream-mind-lucid Contract Scanner',
            version: '1.0.0',
            summary: {
                totalContractsScanned: this.scanResults.totalScanned,
                verifiedContracts: this.scanResults.contractsFound,
                deploymentsFound: this.scanResults.deploymentsFound,
                networksScanned: Object.keys(this.scanResults.networks).length,
                errors: this.scanResults.errors.length
            },
            deployments: this.deployments,
            networkDetails: this.scanResults.networks,
            errors: this.scanResults.errors,
            contractTypes: this.contractTypes,
            metadata: {
                scannerConfig: this.config,
                networksConfigured: Object.keys(this.providers)
            }
        };

        // Save to file
        fs.writeFileSync(this.config.outputPath, JSON.stringify(report, null, 2));
        
        // Display summary
        this.displaySummary(report);
        
        return report;
    }

    displaySummary(report) {
        console.log('\n🔍 DREAM-MIND-LUCID DEPLOYMENT SCAN RESULTS');
        console.log('==========================================');
        console.log(`📊 Scan completed at: ${report.scanTimestamp}`);
        console.log(`🔢 Total contracts scanned: ${report.summary.totalContractsScanned}`);
        console.log(`✅ Verified contracts found: ${report.summary.verifiedContracts}`);
        console.log(`🚀 Deployments identified: ${report.summary.deploymentsFound}`);
        console.log(`🌐 Networks scanned: ${report.summary.networksScanned}`);
        
        console.log('\n📋 MAINNET DEPLOYMENTS:');
        if (report.deployments.mainnet.length > 0) {
            report.deployments.mainnet.forEach((deployment, index) => {
                console.log(`  ${index + 1}. ${deployment.name || deployment.contractType || 'Unknown'}`);
                console.log(`     Address: ${deployment.address}`);
                console.log(`     Network: ${deployment.network}`);
                if (deployment.transactionHash) {
                    console.log(`     Deployment Tx: ${deployment.transactionHash}`);
                }
                if (deployment.timestamp) {
                    console.log(`     Deployed: ${deployment.timestamp}`);
                }
                console.log('');
            });
        } else {
            console.log('  No mainnet deployments found.');
        }
        
        if (report.summary.errors > 0) {
            console.log('\n⚠️ ERRORS ENCOUNTERED:');
            report.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
        }
        
        console.log(`\n💾 Full report saved to: ${this.config.outputPath}`);
        console.log('==========================================\n');
    }
}

// CLI interface
if (require.main === module) {
    require('dotenv').config();
    
    const scanner = new DreamMindLucidScanner({
        outputPath: './dream-mind-lucid-deployment-report.json',
        includeTestnets: process.argv.includes('--include-testnets')
    });
    
    scanner.scanAllDeployments()
        .then((results) => {
            console.log('🎯 Dream-mind-lucid scan completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Scanner error:', error);
            process.exit(1);
        });
}

module.exports = { DreamMindLucidScanner };