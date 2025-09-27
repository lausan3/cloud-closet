"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { SWRConfig } from "swr";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <SWRConfig value={{}}>
        {children}
      </SWRConfig>
    </ClerkProvider>
  );
}
