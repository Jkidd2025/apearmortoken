# ApeArmor Token

> Ape in with Confidence Armor Up Against Crypto Chaos!

A Solana SPL token implementation for ApeArmor, built using Solana web3.js and Metaplex standards.

## Features

- SPL Token on Solana Mainnet
- 1 billion total supply
- 9 decimals precision
- Metaplex metadata integration
- Secure key management
- Built with Helius RPC

## Prerequisites

- Node.js >= 16.0.0
- npm
- Solana CLI (optional)
- A Helius API key

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Jkidd2025/apearmortoken.git
cd apearmortoken
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

```bash
# Create .env file with your Helius API key and wallet keys
HELIUS_API_KEY=your_helius_api_key
PUBLIC_KEY=your_public_key
PRIVATE_KEY=your_private_key
```

## Usage

### Test Connection

```bash
npm run test-connection
```

### Check Wallet Balance

```bash
npm run check-balance
```

### Generate New Keys

```bash
npm run generate-keys
```

### Create Token

```bash
npm run create
```

### Network Selection

- For mainnet:

```bash
npm run mainnet
```

- For devnet:

```bash
npm run devnet
```

## Token Specifications

- **Name**: ApeArmor Token
- **Symbol**: APE
- **Decimals**: 9
- **Total Supply**: 1,000,000,000
- **Network**: Solana Mainnet
- **RPC Provider**: Helius

## Security

- Private keys are stored securely in .env file
- Environment variables for sensitive data
- Proper error handling and validation
- Transaction confirmation checks
- Balance verification before operations

## Development

The project uses several key dependencies:

- @solana/web3.js
- @solana/spl-token
- @metaplex-foundation/mpl-token-metadata
- dotenv for environment management

## License

MIT License

## Contact

For support or inquiries, please open an issue in the GitHub repository.
