import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MegaJobNepal - Find Your Dream Job in Nepal",
  description: "Nepal's leading job portal connecting job seekers with top employers. Find jobs, build your career, and hire the best talent in Nepal.",
  keywords: "jobs Nepal, career Nepal, employment Nepal, job portal Nepal, MegaJobNepal",
  authors: [{ name: "MegaJobNepal Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://megajobnepal.com",
    siteName: "MegaJobNepal",
    title: "MegaJobNepal - Find Your Dream Job in Nepal",
    description: "Nepal's leading job portal connecting job seekers with top employers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MegaJobNepal - Find Your Dream Job in Nepal",
    description: "Nepal's leading job portal connecting job seekers with top employers.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}