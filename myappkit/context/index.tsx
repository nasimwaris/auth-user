'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { wagmiAdapter, projectId } from '../config';
import { mainnet, arbitrum } from '@reown/appkit/networks';
import React, { ReactNode } from 'react';
import { WagmiProvider, cookieToInitialState } from 'wagmi';

const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'appkit-example',
  description: 'AppKit Example',
  url: 'https://appkitexampleapp.com', 
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// Create AppKit instance
const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum],
  defaultNetwork: mainnet,
  metadata,
  features: { analytics: true },
});

export function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export { appKit };
