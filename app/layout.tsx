import "./globals.css";
import Providers from "./providers";
import React from "react";

export const metadata = {
  title: "Diagnosis App",
  description: "Vehicle diagnostics and blog platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 