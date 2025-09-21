/**
 * Mock test for Dream-mind-lucid Scanner
 * Demonstrates scanner functionality with simulated data
 */

const { DreamMindLucidScanner } = require('./contractScanner');
const fs = require('fs');

class MockDreamMindLucidScanner extends DreamMindLucidScanner {
    constructor(config = {}) {
        super(config);
        this.mockMode = true;
    }

    initializeProviders() {
        // Return mock providers for testing
        return {
            ethereum: { mock: true, name: 'ethereum' },
            base: { mock: true, name: 'base' },
            skale: { mock: true, name: 'skale' }
        };
    }

    async scanNetworkForContracts(networkName, provider) {
        console.log(`🌐 Mock scanning ${networkName} network...`);
        
        if (!this.scanResults.networks[networkName]) {
            this.scanResults.networks[networkName] = {
                contracts: [],
                transactions: [],
                lastBlock: 0
            };
        }

        // Simulate finding contracts
        const mockContracts = this.generateMockContracts(networkName);
        
        for (const contract of mockContracts) {
            this.scanResults.networks[networkName].contracts.push(contract);
            this.scanResults.contractsFound++;
            
            const category = this.categorizeNetwork(networkName);
            this.deployments[category].push(contract);
            
            console.log(`📋 Found contract: ${contract.contractType} at ${contract.address} on ${networkName}`);
        }

        this.scanResults.networks[networkName].lastBlock = 18500000 + Math.floor(Math.random() * 1000);
    }

    generateMockContracts(networkName) {
        const contractTypes = ['OneiroVault', 'SwarmController', 'Oracle', 'Phantom'];
        const contracts = [];

        // Generate 2-3 mock contracts per network
        const numContracts = Math.floor(Math.random() * 2) + 2;
        
        for (let i = 0; i < numContracts; i++) {
            const contractType = contractTypes[i % contractTypes.length];
            const contract = {
                address: this.generateMockAddress(),
                contractType: contractType,
                transactionHash: this.generateMockHash(),
                blockNumber: 18500000 + Math.floor(Math.random() * 1000),
                deployer: this.generateMockAddress(),
                network: networkName,
                gasUsed: (2000000 + Math.floor(Math.random() * 500000)).toString(),
                timestamp: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
            };
            contracts.push(contract);
        }

        return contracts;
    }

    generateMockAddress() {
        const chars = '0123456789abcdef';
        let address = '0x';
        for (let i = 0; i < 40; i++) {
            address += chars[Math.floor(Math.random() * 16)];
        }
        return address;
    }

    generateMockHash() {
        const chars = '0123456789abcdef';
        let hash = '0x';
        for (let i = 0; i < 64; i++) {
            hash += chars[Math.floor(Math.random() * 16)];
        }
        return hash;
    }

    async analyzeDeploymentScript(scriptPath) {
        console.log(`📝 Mock analyzing deployment script: ${scriptPath}`);
        
        // Simulate finding addresses in deployment scripts
        const mockAddresses = [
            this.generateMockAddress(),
            this.generateMockAddress()
        ];

        for (const address of mockAddresses) {
            await this.analyzeContract(address, 'deployment_script', scriptPath);
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
            network: 'ethereum', // Mock as ethereum mainnet
            verified: true,
            deploymentTx: this.generateMockHash()
        };

        const category = this.categorizeNetwork(contractInfo.network);
        this.deployments[category].push(contractInfo);
        
        this.scanResults.contractsFound++;
        console.log(`✅ Mock verified contract: ${name} at ${address} on ${contractInfo.network}`);
    }
}

// Run mock test
async function runMockTest() {
    console.log('🧪 Running Dream-mind-lucid Scanner Mock Test');
    console.log('=============================================\n');

    const scanner = new MockDreamMindLucidScanner({
        outputPath: './mock-dream-mind-lucid-report.json',
        includeTestnets: false
    });

    try {
        const results = await scanner.scanAllDeployments();
        
        console.log('\n🎯 Mock test completed successfully!');
        console.log(`📊 Mock report saved to: ${scanner.config.outputPath}`);
        
        // Verify the report file was created
        if (fs.existsSync(scanner.config.outputPath)) {
            const report = JSON.parse(fs.readFileSync(scanner.config.outputPath, 'utf8'));
            console.log('\n📋 Mock Report Summary:');
            console.log(`   Contracts Found: ${report.summary.verifiedContracts}`);
            console.log(`   Networks: ${Object.keys(report.networkDetails).join(', ')}`);
            console.log(`   Mainnet Deployments: ${report.deployments.mainnet.length}`);
            
            if (report.deployments.mainnet.length > 0) {
                console.log('\n📋 Sample Mainnet Contracts:');
                report.deployments.mainnet.slice(0, 3).forEach((contract, index) => {
                    console.log(`   ${index + 1}. ${contract.contractType || contract.name} at ${contract.address}`);
                });
            }
        }
        
        return results;
    } catch (error) {
        console.error('❌ Mock test failed:', error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    runMockTest()
        .then(() => {
            console.log('\n✅ Mock test completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Mock test failed:', error);
            process.exit(1);
        });
}

module.exports = { MockDreamMindLucidScanner, runMockTest };