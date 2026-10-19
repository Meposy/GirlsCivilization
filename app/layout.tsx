import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Girls Civilization | Уютный Minecraft для девушек",
  description: "Уютный Minecraft-сервер только для девушек. Гильдии, профессии, банк, аукцион, косметика. 0% pay-to-win. Без PvP и токсичности.",
  keywords: ["minecraft", "сервер для девушек", "майнкрафт для девушек", "girls civilization", "уютный сервер", "minecraft сервер", "сервер майнкрафт"],
  authors: [{ name: "Girls Civilization" }],
  openGraph: {
    title: "Girls Civilization | Уютный Minecraft для девушек",
    description: "Уютный Minecraft-сервер только для девушек. Гильдии, профессии, банк, аукцион, косметика. 0% pay-to-win.",
    url: "https://girlsciv.duckdns.org",
    siteName: "Girls Civilization",
    images: [
      {
        url: "/og-image.jpg", // Убедись, что загрузил картинку в папку public
        width: 1200,
        height: 630,
        alt: "Girls Civilization",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Girls Civilization | Уютный Minecraft для девушек",
    description: "Уютный Minecraft-сервер только для девушек. Гильдии, профессии, банк, аукцион, косметика.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
