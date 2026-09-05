import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClassroomHub",
  description: "Portal de gestión para ClassroomHub",
  icons: { icon: "/character.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme')
                if (t === 'dark') {
                  document.documentElement.classList.add('dark')
                } else if (t === 'mid') {
                  document.documentElement.classList.add('dark', 'mid')
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
