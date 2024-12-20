// src/app/layout.tsx
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ToastProvider from "@/provider/toast-provider";
import { auth } from "@clerk/nextjs/server";

const inter = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });

export const metadata: Metadata = {
  title: "Grocery",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn("bg-background antialiased", inter.variable)}>
          <ToastProvider />
          <img
            src="/1.jpg"
            className="absolute -z-10 -top-56 right-0 w-full md:w-[50%]"
          />
          <Header userId={userId} />
          {children}
          {userId && <Footer />}
        </body>
      </html>
    </ClerkProvider>
  );
}
