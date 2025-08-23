# Crypto-Gene-3000 Dockerfile
FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Rust for Solana development
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Set working directory
WORKDIR /app

# Copy package files
COPY skale/package*.json ./skale/
COPY solana/Cargo.toml ./solana/
COPY .env.example ./

# Install Node.js dependencies
RUN cd skale && npm ci --only=production

# Copy application code
COPY . .

# Create .env from example if it doesn't exist
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Expose port for potential future web interface
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "const { OneiroGene9000System } = require('./gene9000.js'); const sys = new OneiroGene9000System(); console.log('Health check OK');" || exit 1

# Default command
CMD ["node", "gene9000.js"]