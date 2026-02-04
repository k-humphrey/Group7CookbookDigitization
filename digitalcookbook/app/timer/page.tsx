"use client";
import Timer from "./timer";
import { useLang } from "@/app/components/languageprovider";

const STRINGS = {
  en: {
    timer: "Timer"
  },
  es: {
    timer: "Temporizador"
  }
};

export default function TimerPage() {
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const t = STRINGS[lang];
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/searchbackground.jpg')",
        backgroundSize: "120%",
      }}
    >
    <div className="-mt-40 flex flex-col items-center">
      <h1 className="text-[6rem] md:text-[8rem] font-black text-orange-500 mb-6">
        {t.timer}
      </h1>

      <Timer />
    </div>
    </main>
  );
}
