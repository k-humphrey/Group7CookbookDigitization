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
      aria-label={t.timer}
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/searchbackground2.0.png')",
        backgroundSize: "120%",
      }}
    >
    <h1 className="sr-only">{t.timer}</h1>
    <div className="flex flex-col items-center">
      <h1 aria-hidden="true" className="text-7xl md:text-9xl font-black text-orange-500">
        {t.timer}
      </h1>
      <section aria-label={t.timer}>
        <Timer />
      </section>
    </div>
    </main>
  );
}
