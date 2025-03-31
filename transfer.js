const { 
    Connection, 
    PublicKey,
    Transaction,
    SystemProgram,
    Keypair
} = require('@solana/web3.js');
const {
    getOrCreateAssociatedTokenAccount,
    createTransferInstruction,
    TOKEN_PROGRAM_ID
} = require('@solana/spl-token');
require('dotenv').config();

// Helius RPC URL
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;

class TokenTransfer {
    constructor() {
        this.connection = new Connection(HELIUS_RPC_URL, 'confirmed');
    }

    /**
     * Transfer tokens from one account to another
     * @param {string} fromWalletPrivateKey - Private key of the sender's wallet
     * @param {string} toWalletAddress - Public key of the recipient's wallet
     * @param {string} mintAddress - Token mint address
     * @param {number} amount - Amount to transfer (in token units)
     */
    async transferTokens(fromWalletPrivateKey, toWalletAddress, mintAddress, amount) {
        try {
            // Convert private key to Keypair
            const fromWallet = Keypair.fromSecretKey(
                Buffer.from(JSON.parse(fromWalletPrivateKey))
            );

            // Convert addresses to PublicKey
            const toWalletPubkey = new PublicKey(toWalletAddress);
            const mintPubkey = new PublicKey(mintAddress);

            // Get the token accounts
            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                this.connection,
                fromWallet,
                mintPubkey,
                fromWallet.publicKey
            );

            const toTokenAccount = await getOrCreateAssociatedTokenAccount(
                this.connection,
                fromWallet,
                mintPubkey,
                toWalletPubkey
            );

            // Create transfer instruction
            const transferInstruction = createTransferInstruction(
                fromTokenAccount.address,
                toTokenAccount.address,
                fromWallet.publicKey,
                amount
            );

            // Create and send transaction
            const transaction = new Transaction().add(transferInstruction);
            const signature = await this.connection.sendTransaction(
                transaction,
                [fromWallet],
                { skipPreflight: false }
            );

            console.log('Transfer successful!');
            console.log('Transaction signature:', signature);
            return signature;

        } catch (error) {
            console.error('Error transferring tokens:', error);
            throw error;
        }
    }

    /**
     * Get token balance for a wallet
     * @param {string} walletAddress - Public key of the wallet
     * @param {string} mintAddress - Token mint address
     */
    async getTokenBalance(walletAddress, mintAddress) {
        try {
            const walletPubkey = new PublicKey(walletAddress);
            const mintPubkey = new PublicKey(mintAddress);

            const tokenAccount = await getOrCreateAssociatedTokenAccount(
                this.connection,
                Keypair.generate(), // dummy keypair for read-only operations
                mintPubkey,
                walletPubkey
            );

            const balance = await this.connection.getTokenAccountBalance(
                tokenAccount.address
            );

            return balance.value.uiAmount;
        } catch (error) {
            console.error('Error getting token balance:', error);
            throw error;
        }
    }

    /**
     * Get transaction history for a token account
     * @param {string} tokenAccountAddress - Public key of the token account
     */
    async getTransactionHistory(tokenAccountAddress) {
        try {
            const pubkey = new PublicKey(tokenAccountAddress);
            const signatures = await this.connection.getSignaturesForAddress(
                pubkey,
                { limit: 10 }
            );

            const transactions = await Promise.all(
                signatures.map(async (sig) => {
                    const tx = await this.connection.getTransaction(sig.signature);
                    return {
                        signature: sig.signature,
                        timestamp: sig.blockTime,
                        transaction: tx
                    };
                })
            );

            return transactions;
        } catch (error) {
            console.error('Error getting transaction history:', error);
            throw error;
        }
    }
}

module.exports = TokenTransfer; 