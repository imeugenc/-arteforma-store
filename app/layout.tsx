import type { Metadata } from "next";
import Script from "next/script";
import { Header, Footer } from "@/components/site-shell";
import { CartProvider } from "@/components/cart/cart-provider";
import { siteConfig } from "@/lib/site";
import { buildMetadata, organizationStructuredData } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = buildMetadata({
  title: undefined,
  description: siteConfig.description,
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>
        <Script
          id="arteforma-org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData()),
          }}
        />
        <CartProvider>
          <div className="relative min-h-screen overflow-x-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(215,161,42,0.08),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(215,161,42,0.05),transparent_18%)]" />
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
