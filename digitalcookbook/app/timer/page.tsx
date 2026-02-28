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
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/searchbackground2.0.png')",
        backgroundSize: "120%",
      }}
    >
    <div className="flex flex-col items-center">
      <h1 className="text-7xl md:text-9xl font-black text-orange-500">
        {t.timer}
      </h1>

      <Timer />
    </div>
    </main>
  );
}
