require('dotenv').config();
const { 
    Connection, 
    Keypair, 
    PublicKey,
    clusterApiUrl,
    LAMPORTS_PER_SOL
} = require('@solana/web3.js');
const {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    TOKEN_PROGRAM_ID,
    createSetAuthorityInstruction,
    AuthorityType
} = require('@solana/spl-token');
const { Metaplex } = require('@metaplex-foundation/js');

// Helius RPC URL
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;

// Minimum SOL required for operations (in lamports)
const MIN_SOL_REQUIRED = 0.1 * LAMPORTS_PER_SOL;

// Create keypair from environment variables
const payer = Keypair.fromSecretKey(
    Buffer.from(process.env.PRIVATE_KEY, 'hex')
);

async function checkBalance(connection, publicKey) {
    const balance = await connection.getBalance(publicKey);
    if (balance < MIN_SOL_REQUIRED) {
        throw new Error(`Insufficient SOL balance. Required: ${MIN_SOL_REQUIRED / LAMPORTS_PER_SOL} SOL`);
    }
    return balance;
}

async function waitForConfirmation(connection, signature) {
    const latestBlockHash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature
    });
}

async function createToken() {
    try {
        // Connect to Solana mainnet using Helius RPC
        const connection = new Connection(HELIUS_RPC_URL, 'confirmed');
        
        // Check if we have enough SOL
        await checkBalance(connection, payer.publicKey);
        
        // Create new token mint
        console.log('Creating token mint...');
        const mint = await createMint(
            connection,
            payer,
            payer.publicKey,
            payer.publicKey,
            9 // 9 decimals
        );

        console.log(`Token created! Mint address: ${mint.toBase58()}`);

        // Get the token account of the wallet address, and if it does not exist, create it
        console.log('Creating token account...');
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            mint,
            payer.publicKey
        );

        console.log(`Token Account: ${tokenAccount.address.toBase58()}`);

        // Mint 1 billion tokens to the token account
        console.log('Minting tokens...');
        const mintAmount = 1_000_000_000 * Math.pow(10, 9); // 1 billion with 9 decimals
        const mintSignature = await mintTo(
            connection,
            payer,
            mint,
            tokenAccount.address,
            payer,
            mintAmount
        );

        // Wait for confirmation
        await waitForConfirmation(connection, mintSignature);
        console.log(`Minted ${mintAmount} tokens to ${tokenAccount.address.toBase58()}`);

        // Initialize Metaplex
        const metaplex = new Metaplex(connection);
        
        // Create metadata
        const metadata = {
            name: "ApeArmor Token",
            symbol: "APE",
            description: "Ape in with Confidence Armor Up Against Crypto Chaos!",
            image: "https://raw.githubusercontent.com/Jkidd2025/apearmortoken/main/assets/ApeArmor_side_logo.png",
            attributes: [
                {
                    trait_type: "Category",
                    value: "Token"
                }
            ]
        };

        // Create metadata on-chain
        console.log('Creating on-chain metadata...');
        const { nft } = await metaplex.nfts().create({
            uri: metadata,
            name: metadata.name,
            symbol: metadata.symbol,
            sellerFeeBasisPoints: 0,
        });

        console.log("Token creation completed successfully!");
        console.log("Please save these addresses:");
        console.log(`Mint: ${mint.toBase58()}`);
        console.log(`Token Account: ${tokenAccount.address.toBase58()}`);
        console.log(`Metadata: ${nft.address.toBase58()}`);
        console.log("\nIMPORTANT: Save your wallet's private key securely!");
        console.log(`Private Key: ${Buffer.from(payer.secretKey).toString('hex')}`);

    } catch (error) {
        console.error("Error creating token:", error);
        if (error.message.includes('Insufficient SOL balance')) {
            console.error("Please fund your wallet with at least 0.1 SOL before creating the token.");
        }
        process.exit(1);
    }
}

// Add retry logic for the main function
async function createTokenWithRetry(maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await createToken();
            break;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            console.log(`Attempt ${i + 1} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        }
    }
}

createTokenWithRetry(); 