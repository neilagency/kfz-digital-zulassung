'use client';

import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { sessionStorageProvider } from '@/lib/admin-api';
import { useState, useEffect } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Initialize the SWR cache provider only after mount so SSR and the initial
  // client render both use an empty in-memory Map.  This prevents React
  // hydration mismatches (errors #422/#425) caused by sessionStorage being
  // populated on the client but empty on the server.
  const [swrProvider, setSwrProvider] = useState<(() => Map<any, any>) | undefined>(undefined);

  useEffect(() => {
    setSwrProvider(() => sessionStorageProvider);
  }, []);

  return (
    <SessionProvider>
      <SWRConfig value={swrProvider ? { provider: swrProvider } : {}}>
        {children}
      </SWRConfig>
    </SessionProvider>
  );
}
