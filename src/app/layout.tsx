import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { Context } from "./Context";
import StoreProvider from "./StoreProvider";
import Script from "next/script";

const playfairDisplay = Playfair_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Mobile Beauty Services Algarve",
  description:
    "Experience professional beauty treatments in the comfort of your home with Mobile Beauty Services Algarve. Our expert team brings high-quality skincare, haircare, and wellness services directly to you, tailored to meet your individual needs. Serving the Algarve region, we offer convenience, personalized care, and premium beauty solutions wherever you are.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${lato.variable}`}>
      <head>
        {/* <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        /> */}
        {/* <link rel="manifest" href="/site.webmanifest" /> */}

        <Script src="/scripts/lang-config.js" strategy="beforeInteractive" />
        <Script src="/scripts/translation.js" strategy="beforeInteractive" />
        <Script
          src="//translate.google.com/translate_a/element.js?cb=TranslateInit"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-lato max-w-[1920px] mx-auto">
        {/* <MultiLangProvider> */}
        {/* <TranslationButton /> */}
        <StoreProvider>
          <Context>{children}</Context>
        </StoreProvider>
        {/* </MultiLangProvider> */}
      </body>
    </html>
  );
}
