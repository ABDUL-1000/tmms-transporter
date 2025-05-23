"use client";

import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

import { Toaster } from "sonner";


const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "TransportHub - Fleet Management",
//   description: "Manage your transport fleet efficiently",
//   generator: "v0.dev",
// };

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <div className="flex-1 pl-0 lg:pl-64">{children}
                        <Toaster position="top-right" />

              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
