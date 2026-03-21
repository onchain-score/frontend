import type { Metadata } from "next";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onchain Score | 온체인 스코어",
  description:
    "이더리움 지갑을 분석하고 온체인 신용 점수를 확인하세요. Analyze your Ethereum wallet and get a comprehensive on-chain reputation score.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
