import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/providers";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Assignment 1 - Tabs Generator",
  description: "NextJS Application for generating HTML5 tabs",
};


const STUDENT_NUMBER = "22503977";
const STUDENT_NAME = "jiawenqi song";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <ClientLayout studentName={STUDENT_NAME} studentNumber={STUDENT_NUMBER}>
              {children}
            </ClientLayout>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}