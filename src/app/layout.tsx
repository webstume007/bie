import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BIE Portal - Board of Islamic Education",
  description: "Modern, secure educational management portal for BIE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <LanguageProvider>
          <LanguageSwitcher />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
