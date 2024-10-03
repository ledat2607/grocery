import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import { auth } from "@clerk/nextjs/server";
import Footer from "@/components/footer";

const inter = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });

export const metadata: Metadata = {
  title: "Grocery",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn("bg-background antialiased", inter.variable)}>
          <img
            src="/hero.svg"
            className="absolute -z-10 top-0 right-0 w-full md:w-[60%]"
          />
          {userId && <Header userId={userId} />}
          {children}
          {userId && <Footer />}
        </body>
      </html>
    </ClerkProvider>
  );
}
