import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "SIDEO — Sistema de Diagnóstico Ergonómico Ocupacional",
  description:
    "Plataforma de gestión y diagnóstico ergonómico ocupacional para empresas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
