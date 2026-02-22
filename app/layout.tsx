import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
        {/* <Analytics /> */}
      </body>
    </html>
  );
}