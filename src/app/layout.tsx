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
      <head>
        <title>Invite me</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <StoreProvider store={store}>{children}</StoreProvider>
      </body>
    </html>
  );
}
