import "./globals.css";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import { LanguageProvider } from "@/app/components/languageprovider";

export const metadata = {
  title: "Thrifty Bites",
  description: "Discover budget-friendly recipes, plan meals, and track ingredients with ease.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Navbar/>
          <main>
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}