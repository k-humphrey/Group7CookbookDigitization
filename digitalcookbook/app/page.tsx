// Hompe page

"use client";

import { useRouter } from "next/navigation";
import Searchbar from "./components/searchbar";

export default function Home() {
  const router = useRouter();

  // routes to the recipes page
  const handleSearch = (tags: string[]) => {
    if(tags)
      router.push(`/recipes?ingredients=${tags.join(",")}`);
    else
      router.push('/recipes');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start">

      {/* Background picture */}
      <div 
        className="w-full bg-cover bg-center bg-no-repeat py-30 flex flex-col items-center"  
        style={{
          backgroundSize: "110%", 
          backgroundImage: "url('/searchbackground.jpg')"
          }}
      >

        {/* Logo + Subtitle */}
        <div className="text-center mb-5">
          <h1 className="text-6xl md:text-[5rem] font-black text-slate-950 leading-none">
            Thrifty Bites
          </h1>

          <p className="mt-5 pt-5 text-base max-w-3xl md:text-2xl text-slate-950">
            Search by ingredients you have or find the perfect recipe
          </p>
        </div>

        {/* Searchbar */}
        <Searchbar onSearch={handleSearch} />
      </div>  
    </main>
  );
}