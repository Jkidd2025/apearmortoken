require('dotenv').config();
const { 
    Connection, 
    Keypair, 
    PublicKey,
    clusterApiUrl
} = require('@solana/web3.js');
const {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    TOKEN_PROGRAM_ID
} = require('@solana/spl-token');
const { Metaplex } = require('@metaplex-foundation/js');

// Helius RPC URL
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=ddfb0573-3e2f-4f26-9331-ee493de86063`;

async function createToken() {
    try {
        // Connect to Solana mainnet using Helius RPC
        const connection = new Connection(HELIUS_RPC_URL, 'confirmed');
        
        // Generate a new wallet keypair
        const payer = Keypair.generate();
        
        // Create new token mint
        const mint = await createMint(
            connection,
            payer,
            payer.publicKey,
            payer.publicKey,
            9 // 9 decimals
        );

        console.log(`Token created! Mint address: ${mint.toBase58()}`);

        // Get the token account of the wallet address, and if it does not exist, create it
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mint,
            payer.publicKey
        );

        console.log(`Token Account: ${tokenAccount.address.toBase58()}`);

        // Mint 1 billion tokens to the token account
        const mintAmount = 1_000_000_000 * Math.pow(10, 9); // 1 billion with 9 decimals
        await mintTo(
            connection,
            payer,
            mint,
            tokenAccount.address,
            payer,
            mintAmount
        );

        console.log(`Minted ${mintAmount} tokens to ${tokenAccount.address.toBase58()}`);

        // Initialize Metaplex
        const metaplex = new Metaplex(connection);
        
        // Create metadata
        const metadata = {
            name: "ApeArmor Token",
            symbol: "APE",
            description: "ApeArmor Token on Solana",
            image: "https://arweave.net/your-image-url", // Replace with your actual image URL
            attributes: [
                {
                    trait_type: "Category",
                    value: "Token"
                }
            ]
        };

        console.log("Token creation completed successfully!");
        console.log("Please save these addresses:");
        console.log(`Mint: ${mint.toBase58()}`);
        console.log(`Token Account: ${tokenAccount.address.toBase58()}`);

    } catch (error) {
        console.error("Error creating token:", error);
    }
}

createToken(); 