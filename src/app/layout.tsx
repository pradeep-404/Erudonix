import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const serifFont = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Erudogix | Premium Academic Support, SLMs & App Studio",
  description: "Erudogix offers premium 1:1 academic tutoring, custom secure small language model fine-tuning, and expert app studio solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  }>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${serifFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          } catch (_) {}
        ` }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-accent-warm-light selection:text-accent-warm">
        {children}
      </body>
    </html>
  );
}

