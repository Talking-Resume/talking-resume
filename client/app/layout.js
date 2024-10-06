import { Inter as FontSans } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Steps from "@/components/ui/steps";
import Main from "@/components/Main";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "TALKINGResume",
  description:
    "A platform designed to automate interviews based on your Resume",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <div className="main-container ">
          <div className="main-content bg-cyan-800">
            <Header />
            <Hero />

            {/* <Steps /> */}
          </div>
        </div>
      </body>
    </html>
  );
}
