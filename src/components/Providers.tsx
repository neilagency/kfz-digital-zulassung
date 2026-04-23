'use client';

import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { sessionStorageProvider } from '@/lib/admin-api';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SWRConfig value={{ provider: sessionStorageProvider }}>
        {children}
      </SWRConfig>
    </SessionProvider>
  );
}
