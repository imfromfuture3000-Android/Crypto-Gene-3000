#!/usr/bin/env node

/**
 * Dream-mind-lucid CLI Scanner
 * Command-line interface for scanning all GENE 9000 contract deployments
 */

const { DreamMindLucidScanner } = require('./contractScanner');
const path = require('path');
const fs = require('fs');

class DreamMindLucidCLI {
    constructor() {
        this.commands = {
            scan: this.scanCommand.bind(this),
            report: this.reportCommand.bind(this),
            help: this.helpCommand.bind(this)
        };
    }

    async run() {
        const args = process.argv.slice(2);
        const command = args[0] || 'scan';
        
        console.log('🤖 Dream-mind-lucid Contract Scanner CLI');
        console.log('=====================================');
        
        if (this.commands[command]) {
            await this.commands[command](args.slice(1));
        } else {
            console.error(`❌ Unknown command: ${command}`);
            this.helpCommand();
            process.exit(1);
        }
    }

    async scanCommand(args) {
        console.log('🔍 Starting comprehensive Dream-mind-lucid deployment scan...\n');
        
        const options = this.parseOptions(args);
        
        try {
            // Load environment variables
            require('dotenv').config();
            
            const scanner = new DreamMindLucidScanner({
                outputPath: options.output || './dream-mind-lucid-deployment-report.json',
                includeTestnets: options.includeTestnets || false,
                networks: options.networks || ['ethereum', 'base', 'skale']
            });
            
            const results = await scanner.scanAllDeployments();
            
            console.log('\n🎯 Scan completed successfully!');
            console.log(`📊 Report saved to: ${scanner.config.outputPath}`);
            
            // Display quick summary
            console.log(`\n📋 Quick Summary:`);
            console.log(`   Total contracts: ${results.contractsFound}`);
            console.log(`   Deployments: ${results.deploymentsFound}`);
            console.log(`   Networks: ${Object.keys(results.networks).length}`);
            
        } catch (error) {
            console.error('❌ Scan failed:', error.message);
            process.exit(1);
        }
    }

    async reportCommand(args) {
        const reportPath = args[0] || './dream-mind-lucid-deployment-report.json';
        
        if (!fs.existsSync(reportPath)) {
            console.error(`❌ Report file not found: ${reportPath}`);
            console.log('💡 Run "dream-scan scan" first to generate a report.');
            process.exit(1);
        }
        
        try {
            const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
            this.displayDetailedReport(report);
        } catch (error) {
            console.error('❌ Error reading report:', error.message);
            process.exit(1);
        }
    }

    displayDetailedReport(report) {
        console.log('\n🔍 DETAILED DREAM-MIND-LUCID DEPLOYMENT REPORT');
        console.log('==============================================');
        console.log(`📅 Generated: ${report.scanTimestamp}`);
        console.log(`🔧 Scanner Version: ${report.version}`);
        
        console.log('\n📊 SUMMARY STATISTICS:');
        console.log(`   Total Contracts Scanned: ${report.summary.totalContractsScanned}`);
        console.log(`   Verified Contracts: ${report.summary.verifiedContracts}`);
        console.log(`   Deployments Found: ${report.summary.deploymentsFound}`);
        console.log(`   Networks Scanned: ${report.summary.networksScanned}`);
        console.log(`   Errors Encountered: ${report.summary.errors}`);
        
        console.log('\n🌐 MAINNET DEPLOYMENTS:');
        if (report.deployments.mainnet.length > 0) {
            report.deployments.mainnet.forEach((deployment, index) => {
                console.log(`\n  📋 Contract ${index + 1}:`);
                console.log(`      Name: ${deployment.name || deployment.contractType || 'Unknown'}`);
                console.log(`      Address: ${deployment.address}`);
                console.log(`      Network: ${deployment.network}`);
                console.log(`      Source: ${deployment.source}`);
                
                if (deployment.transactionHash) {
                    console.log(`      Deployment Tx: ${deployment.transactionHash}`);
                }
                if (deployment.deploymentTx) {
                    console.log(`      Deployment Tx: ${deployment.deploymentTx}`);
                }
                if (deployment.timestamp) {
                    console.log(`      Timestamp: ${deployment.timestamp}`);
                }
                if (deployment.deployer) {
                    console.log(`      Deployer: ${deployment.deployer}`);
                }
                if (deployment.blockNumber) {
                    console.log(`      Block: ${deployment.blockNumber}`);
                }
                if (deployment.gasUsed) {
                    console.log(`      Gas Used: ${deployment.gasUsed}`);
                }
            });
        } else {
            console.log('   ⚠️ No mainnet deployments found');
        }
        
        if (report.deployments.testnet.length > 0) {
            console.log('\n🧪 TESTNET DEPLOYMENTS:');
            report.deployments.testnet.forEach((deployment, index) => {
                console.log(`   ${index + 1}. ${deployment.name || 'Unknown'} at ${deployment.address} (${deployment.network})`);
            });
        }
        
        console.log('\n🌐 NETWORK DETAILS:');
        for (const [network, details] of Object.entries(report.networkDetails)) {
            console.log(`   ${network.toUpperCase()}:`);
            console.log(`      Contracts Found: ${details.contracts.length}`);
            console.log(`      Last Block Scanned: ${details.lastBlock}`);
            
            if (details.contracts.length > 0) {
                console.log(`      Contract Addresses:`);
                details.contracts.forEach((contract, index) => {
                    console.log(`        ${index + 1}. ${contract.address} (${contract.contractType || 'Unknown'})`);
                });
            }
        }
        
        if (report.errors.length > 0) {
            console.log('\n⚠️ ERRORS ENCOUNTERED:');
            report.errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error}`);
            });
        }
        
        console.log('\n📋 CONTRACT TYPES SEARCHED:');
        report.contractTypes.forEach((type, index) => {
            console.log(`   ${index + 1}. ${type}`);
        });
        
        console.log('\n🔧 SCANNER CONFIGURATION:');
        console.log(`   Networks: ${report.metadata.networksConfigured.join(', ')}`);
        console.log(`   Include Testnets: ${report.metadata.scannerConfig.includeTestnets}`);
        console.log(`   Output Path: ${report.metadata.scannerConfig.outputPath}`);
        
        console.log('\n==============================================');
    }

    parseOptions(args) {
        const options = {};
        
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            
            switch (arg) {
                case '--output':
                case '-o':
                    options.output = args[i + 1];
                    i++;
                    break;
                case '--include-testnets':
                case '-t':
                    options.includeTestnets = true;
                    break;
                case '--networks':
                case '-n':
                    options.networks = args[i + 1].split(',');
                    i++;
                    break;
            }
        }
        
        return options;
    }

    helpCommand() {
        console.log('\n🔍 Dream-mind-lucid Contract Scanner CLI');
        console.log('=====================================');
        console.log('\nUsage: dream-scan <command> [options]');
        console.log('\nCommands:');
        console.log('  scan       Scan for all Dream-mind-lucid contract deployments');
        console.log('  report     Display detailed report from previous scan');
        console.log('  help       Show this help message');
        console.log('\nOptions for scan command:');
        console.log('  --output, -o <path>        Output path for report (default: ./dream-mind-lucid-deployment-report.json)');
        console.log('  --include-testnets, -t     Include testnet deployments in scan');
        console.log('  --networks, -n <list>      Comma-separated list of networks to scan (default: ethereum,base,skale)');
        console.log('\nOptions for report command:');
        console.log('  <path>                     Path to report file to display');
        console.log('\nExamples:');
        console.log('  dream-scan scan                                    # Basic scan');
        console.log('  dream-scan scan --include-testnets                 # Include testnets');
        console.log('  dream-scan scan --output ./my-report.json          # Custom output path');
        console.log('  dream-scan scan --networks ethereum,base           # Scan specific networks');
        console.log('  dream-scan report                                  # Show last report');
        console.log('  dream-scan report ./custom-report.json            # Show specific report');
        console.log('\nEnvironment Variables:');
        console.log('  ETHEREUM_RPC_URL          Ethereum mainnet RPC endpoint');
        console.log('  BASE_RPC_URL              Base mainnet RPC endpoint');
        console.log('  SKALE_RPC_URL             SKALE network RPC endpoint');
        console.log('  GENE9000_ACCESS_TOKEN     Access token for GENE 9000 system');
        console.log('\n=====================================');
    }
}

// Run CLI if executed directly
if (require.main === module) {
    const cli = new DreamMindLucidCLI();
    cli.run().catch(console.error);
}

module.exports = { DreamMindLucidCLI };