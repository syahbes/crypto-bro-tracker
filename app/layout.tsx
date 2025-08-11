import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import MainLayout from "@/components/layout/MainLayout";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: "300",
});

export const metadata: Metadata = {
  title: "Crypto Portfolio Tracker | Track Your Investments",
  description:
    "Track and manage your cryptocurrency portfolio with real-time prices, market data, and performance analytics.",
  keywords:
    "cryptocurrency, bitcoin, ethereum, portfolio, tracker, crypto, investment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
