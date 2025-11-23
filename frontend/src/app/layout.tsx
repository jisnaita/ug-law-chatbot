import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from '@/theme/ThemeRegistry';
import { ChatProvider } from '@/context/ChatContext';

export const metadata: Metadata = {
  title: 'Uganda Laws Assistant',
  description: 'AI-powered legal assistant for Uganda business laws',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <ChatProvider>
            {children}
          </ChatProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
