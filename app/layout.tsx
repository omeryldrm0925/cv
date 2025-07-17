import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ömer Yıldırım - İnteraktif CV",
  description: "Ömer Yıldırım için hazırlanmış modern, animasyonlu ve interaktif bir özgeçmiş uygulaması.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body>{children}</body>
    </html>
  );
}
