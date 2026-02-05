import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";

const kanit = Kanit({
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PM2.5 Air Quality Monitor | ThaiPBS",
  description: "ระบบตรวจวัดคุณภาพอากาศ PM2.5 แบบเรียลไทม์ พร้อมการแสดงผลแบบอินเตอร์แอคทีฟสำหรับประเทศไทย",
  keywords: ["PM2.5", "คุณภาพอากาศ", "ประเทศไทย", "AQI", "มลพิษ", "ThaiPBS"],
  authors: [{ name: "ThaiPBS" }],
  openGraph: {
    title: "PM2.5 Air Quality Monitor",
    description: "ระบบตรวจวัดคุณภาพอากาศ PM2.5 แบบเรียลไทม์",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={kanit.variable}>
      <body className={`${kanit.className} antialiased`}>
        <Providers>
          <div className="min-h-screen w-full">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
