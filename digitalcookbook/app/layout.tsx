import "./globals.css";
import Footer from "./components/footer";
<<<<<<< HEAD
=======
import Navbar from "./components/navbar";
>>>>>>> 1e3cd92cbfaacf4d3262abe5c7fdbda295b1c0fc

export const metadata = {
  title: "My App",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}