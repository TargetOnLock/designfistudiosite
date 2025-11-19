"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo, ReactNode } from "react";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

export function WalletContextProvider({ children }: { children: ReactNode }) {
  // Use mainnet for production, or devnet for testing
  const network = WalletAdapterNetwork.Mainnet;
  
  // Use a custom RPC endpoint if provided, otherwise use a more reliable public endpoint
  const endpoint = useMemo(() => {
    // Check for custom RPC endpoint in environment variable
    if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    }
    
    // Use a more reliable public RPC endpoint
    // Ankr's public endpoint is generally more reliable than the default Solana one
    // If issues persist, get a free RPC from: https://www.helius.dev/ or https://www.quicknode.com/
    return "https://rpc.ankr.com/solana";
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

