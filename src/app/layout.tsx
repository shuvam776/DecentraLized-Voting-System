import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MetaMaskAuthContextProvider } from "@/context/metamaskAuth";
import { PartyAuthContextProvider } from "@/context/partyAuth";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoteChain",
  description: "Dapp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://kit.fontawesome.com/5f1aab7443.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MetaMaskAuthContextProvider>
          <PartyAuthContextProvider>
            {children}
            
          </PartyAuthContextProvider>
        </MetaMaskAuthContextProvider>
      </body>
    </html>
  );
}

