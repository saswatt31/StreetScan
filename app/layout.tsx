import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";
import type { Metadata } from "next";

// This part changes the Tab Name and the Logo
export const metadata: Metadata = {
  title: "StreetScan",
  description: "AI-powered infrastructure monitoring system for Cuttack",
  icons: {
    icon: "/logo.png", // This looks for logo.png in your 'public' folder
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Your existing theme script stays here */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark');
                }
              } catch {}
            `,
          }}
        />
      </head>
      <body className={` font-sans antialiased`}>
        <div className="noise-overlay" aria-hidden="true" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}