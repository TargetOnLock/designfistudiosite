# Solana Pay Setup Guide

## Environment Variables

Add the following to your `.env.local` file:

```
SOLANA_MERCHANT_WALLET=DA7GPnpyxVkL7Lfc3vnRw1bz9XGbSAiTs7Z2GEGanvWj
```


## Payment Flow

1. User fills out article form (title, content, image)
2. User clicks "Pay 100 SOL with Solana Pay"
3. System generates a unique payment reference
4. Solana Pay URL is created and opened (triggers wallet if installed)
5. User completes payment in their Solana wallet
6. System polls for payment confirmation
7. Once confirmed, user can add links and publish

## Payment Verification

The current implementation includes a placeholder for payment verification. You'll need to:

1. Set up a Solana RPC connection
2. Monitor transactions to your merchant wallet
3. Verify transaction signatures match the reference
4. Confirm the payment amount matches (100 SOL)

## Testing

For testing, you can use Solana devnet. Update the network in your wallet and use devnet SOL.

## Production

For production:
- Use mainnet
- Implement proper transaction verification
- Add rate limiting
- Add database to track payments and prevent duplicate charges
- Store published articles in a database or IPFS/Arweave

