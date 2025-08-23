#!/bin/bash

# GENE 9000 System Manager
# Provides easy management commands for the Crypto-Gene-3000 system

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

show_help() {
    echo "GENE 9000 System Manager"
    echo "========================"
    echo
    echo "Usage: $0 <command> [options]"
    echo
    echo "Commands:"
    echo "  start           Start the GENE 9000 system"
    echo "  stop            Stop the GENE 9000 system"
    echo "  restart         Restart the GENE 9000 system"
    echo "  status          Check system status"
    echo "  logs            Show system logs"
    echo "  deploy          Deploy the complete system"
    echo "  deploy-skale    Deploy only SKALE contracts"
    echo "  deploy-solana   Deploy only Solana program"
    echo "  register-bot    Register a new bot (requires CONTROLLER_ADDR and BOT_ADDR env vars)"
    echo "  docker-start    Start with Docker"
    echo "  docker-stop     Stop Docker containers"
    echo "  docker-logs     Show Docker logs"
    echo "  health          Check system health"
    echo "  help            Show this help message"
    echo
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 deploy"
    echo "  $0 docker-start"
    echo "  CONTROLLER_ADDR=0x123... BOT_ADDR=0x456... $0 register-bot"
}

check_dependencies() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
}

start_system() {
    print_status "Starting GENE 9000 system..."
    
    if [ -f gene9000.pid ]; then
        print_warning "System may already be running (PID file exists)"
        if kill -0 "$(cat gene9000.pid)" 2>/dev/null; then
            print_error "System is already running with PID $(cat gene9000.pid)"
            exit 1
        else
            print_warning "Removing stale PID file"
            rm gene9000.pid
        fi
    fi
    
    # Start in background and save PID
    node gene9000.js &
    echo $! > gene9000.pid
    
    sleep 2
    if kill -0 "$(cat gene9000.pid)" 2>/dev/null; then
        print_success "GENE 9000 system started with PID $(cat gene9000.pid)"
        print_status "Use '$0 logs' to view output or '$0 stop' to stop"
    else
        print_error "Failed to start GENE 9000 system"
        rm -f gene9000.pid
        exit 1
    fi
}

stop_system() {
    print_status "Stopping GENE 9000 system..."
    
    if [ ! -f gene9000.pid ]; then
        print_warning "No PID file found - system may not be running"
        # Try to kill any running gene9000 processes
        pkill -f "node gene9000.js" 2>/dev/null || true
        return
    fi
    
    PID=$(cat gene9000.pid)
    if kill -0 "$PID" 2>/dev/null; then
        kill -TERM "$PID"
        sleep 2
        
        if kill -0 "$PID" 2>/dev/null; then
            print_warning "Process didn't stop gracefully, forcing..."
            kill -KILL "$PID"
        fi
        
        print_success "GENE 9000 system stopped"
    else
        print_warning "Process was not running"
    fi
    
    rm -f gene9000.pid
}

show_status() {
    if [ -f gene9000.pid ]; then
        PID=$(cat gene9000.pid)
        if kill -0 "$PID" 2>/dev/null; then
            print_success "GENE 9000 system is running (PID: $PID)"
            
            # Show basic process info
            ps -p "$PID" -o pid,ppid,cmd,etime,pcpu,pmem 2>/dev/null || true
        else
            print_warning "PID file exists but process is not running"
            rm -f gene9000.pid
        fi
    else
        print_status "GENE 9000 system is not running"
    fi
}

show_logs() {
    if [ -f gene9000.pid ]; then
        PID=$(cat gene9000.pid)
        print_status "Showing logs for GENE 9000 system (PID: $PID)"
        print_status "Press Ctrl+C to exit log view"
        echo
        # Follow the process output (this is a simplified approach)
        tail -f /dev/null  # Placeholder - in real deployment, you'd set up proper logging
    else
        print_warning "System is not running"
    fi
}

health_check() {
    print_status "Performing health check..."
    
    # Basic Node.js syntax check
    if node -e "require('./gene9000.js')" 2>/dev/null; then
        print_success "✅ GENE 9000 system code is valid"
    else
        print_error "❌ GENE 9000 system code has issues"
        return 1
    fi
    
    # Check dependencies
    if [ -d "skale/node_modules" ]; then
        print_success "✅ SKALE dependencies installed"
    else
        print_warning "⚠️ SKALE dependencies not installed"
    fi
    
    # Check environment file
    if [ -f ".env" ]; then
        print_success "✅ Environment configuration found"
    else
        print_warning "⚠️ .env file not found"
    fi
    
    print_success "Health check completed"
}

case "$1" in
    start)
        check_dependencies
        start_system
        ;;
    stop)
        stop_system
        ;;
    restart)
        stop_system
        sleep 1
        start_system
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    deploy)
        ./deploy.sh
        ;;
    deploy-skale)
        ./deploy.sh --skip-solana
        ;;
    deploy-solana)
        ./deploy.sh --skip-contracts
        ;;
    register-bot)
        if [ -z "$CONTROLLER_ADDR" ] || [ -z "$BOT_ADDR" ]; then
            print_error "CONTROLLER_ADDR and BOT_ADDR environment variables must be set"
            exit 1
        fi
        cd skale
        npx hardhat run scripts/setBots.js --network skale
        ;;
    docker-start)
        print_status "Starting with Docker..."
        docker-compose up -d
        print_success "Docker containers started"
        ;;
    docker-stop)
        print_status "Stopping Docker containers..."
        docker-compose down
        print_success "Docker containers stopped"
        ;;
    docker-logs)
        docker-compose logs -f crypto-gene-3000
        ;;
    health)
        health_check
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo
        show_help
        exit 1
        ;;
esac