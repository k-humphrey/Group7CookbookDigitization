import "./globals.css";
import Footer from "./components/footer";

export const metadata = {
  title: "My App",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer/>
      </body>
    </html>
  );
}