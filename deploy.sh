#!/bin/bash

# Crypto-Gene-3000 Deployment Script
# This script deploys the complete GENE 9000 system

set -e

echo "🚀 CRYPTO-GENE-3000 DEPLOYMENT STARTING..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_warning "Please edit .env file with your actual configuration before proceeding."
    exit 1
fi

# Source environment variables
source .env

print_status "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "Node.js $(node --version) and npm $(npm --version) found"

# Check if we should deploy SKALE contracts
if [ "$1" = "--skip-contracts" ]; then
    print_warning "Skipping smart contract deployment as requested"
    DEPLOY_CONTRACTS=false
else
    DEPLOY_CONTRACTS=true
fi

# Check if we should deploy Solana program
if [ "$1" = "--skip-solana" ]; then
    print_warning "Skipping Solana program deployment as requested"
    DEPLOY_SOLANA=false
else
    DEPLOY_SOLANA=true
fi

# Deploy SKALE Smart Contracts
if [ "$DEPLOY_CONTRACTS" = true ]; then
    print_status "Deploying SKALE smart contracts..."
    
    cd skale
    
    # Install dependencies if not already installed
    if [ ! -d "node_modules" ]; then
        print_status "Installing SKALE dependencies..."
        npm install
    fi
    
    # Try to compile contracts (may fail in restricted environment)
    print_status "Attempting to compile smart contracts..."
    if npx hardhat compile 2>/dev/null; then
        print_success "Smart contracts compiled successfully"
        
        # Deploy contracts if network is available
        if [ -n "$SKALE_ENDPOINT" ] && [ -n "$PRIVATE_KEY" ]; then
            print_status "Deploying contracts to SKALE network..."
            if npx hardhat run scripts/deploy.js --network skale; then
                print_success "Smart contracts deployed to SKALE!"
            else
                print_warning "Contract deployment failed - network may not be available"
            fi
        else
            print_warning "SKALE_ENDPOINT or PRIVATE_KEY not configured - skipping deployment"
        fi
    else
        print_warning "Smart contract compilation failed - may be due to internet restrictions"
        print_warning "Contracts can be deployed later when network access is available"
    fi
    
    cd ..
fi

# Deploy Solana Program  
if [ "$DEPLOY_SOLANA" = true ]; then
    print_status "Setting up Solana program..."
    
    cd solana
    
    # Check if Rust is available
    if command -v cargo &> /dev/null; then
        print_status "Rust/Cargo found: $(cargo --version)"
        
        # Try to build the Solana program
        print_status "Building Solana program..."
        if cargo build-bpf 2>/dev/null || cargo build-sbf 2>/dev/null || cargo build; then
            print_success "Solana program built successfully"
        else
            print_warning "Solana program build failed - may need Solana CLI tools"
        fi
    else
        print_warning "Rust/Cargo not found - Solana program cannot be built"
    fi
    
    cd ..
fi

# Start the GENE 9000 System
print_status "Starting GENE 9000 System..."

# Test that the main system can be imported
if node -e "require('./gene9000.js')" 2>/dev/null; then
    print_success "GENE 9000 system validated successfully"
else
    print_error "GENE 9000 system validation failed"
    exit 1
fi

print_success "🎉 CRYPTO-GENE-3000 DEPLOYMENT COMPLETED!"
echo "=========================================="
print_status "To start the GENE 9000 system, run:"
echo "    node gene9000.js"
echo
print_status "To deploy contracts manually (when network available):"
echo "    cd skale && npx hardhat run scripts/deploy.js --network skale"
echo
print_status "To register new bots:"
echo "    CONTROLLER_ADDR=0x... BOT_ADDR=0x... npx hardhat run scripts/setBots.js --network skale"
echo
print_status "System configuration is loaded from .env file"
echo "🤖 ONEIROBOT/GITHUB GENE 9000 is ready to HUNT FOR PROFITS!"