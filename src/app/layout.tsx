"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { ReactNode } from "react";
import { StoreProvider } from "@/stores/context";
import { store } from "@/stores";
import Head from "next/head";
import "react-phone-input-2/lib/bootstrap.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>Invite me</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body>
        <StoreProvider store={store}>{children}</StoreProvider>
      </body>
    </html>
  );
}
