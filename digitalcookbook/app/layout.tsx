import "./globals.css";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import { LanguageProvider } from "@/app/components/languageprovider";

export const metadata = {
  title: "My App",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
        <Navbar/>
        {children}
        <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}