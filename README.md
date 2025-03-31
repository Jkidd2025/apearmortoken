# ApeArmor Token

This repository contains the code for creating and managing the ApeArmor Token on the Solana blockchain.

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Add your logo image to the `assets` directory (recommended size: 512x512 pixels)

3. Update the metadata.json file with your token's specific information:

   - Update the image URL after uploading your logo
   - Add your external URL if applicable
   - Update the creator address with your wallet address

4. Run the token creation script:

```bash
npm start
```

## Token Specifications

- Name: ApeArmor Token
- Symbol: APE
- Decimals: 9
- Total Supply: 1,000,000,000
- Network: Solana Mainnet
- RPC Provider: Helius

## Important Notes

- Make sure you have enough SOL in your wallet for transaction fees
- The script will generate a new wallet keypair for the token creation
- Save the mint address and token account address that are displayed after running the script
- The token metadata will be created using Metaplex

## Security

- Never share your private keys
- Keep your wallet secure
- Verify all transactions before confirming
