import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RankPulse — Social Media SEO Intelligence",
    template: "%s | RankPulse",
  },
  description:
    "Algorithm-native SEO scoring for Instagram, LinkedIn & X. Built on verified 2026 ranking signals — watch time, DM sends, Depth Score, TweepCred. Not opinions. The real algorithm.",
  keywords: [
    "social media SEO",
    "Instagram SEO",
    "LinkedIn SEO",
    "Twitter SEO",
    "content optimization",
    "SEO scoring",
    "RankPulse",
  ],
  openGraph: {
    title: "RankPulse — Social Media SEO Intelligence",
    description:
      "Algorithm-native SEO scoring for Instagram, LinkedIn & X. Built on verified 2026 ranking signals.",
    type: "website",
    locale: "en_US",
    siteName: "RankPulse",
  },
  twitter: {
    card: "summary_large_image",
    title: "RankPulse — Social Media SEO Intelligence",
    description:
      "Algorithm-native SEO scoring for Instagram, LinkedIn & X.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
