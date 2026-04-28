"use client";
import Timer from "./timer";
import { useLang } from "@/app/components/languageprovider";
import Image from "next/image";

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
      <section aria-label={t.timer} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Background */}
        <Image
          src="/searchbackground2.0.webp"
          alt=""
          fill
          priority
          className="object-cover scale-120"
        />

        <h1 className="sr-only z-10">{t.timer}</h1>
        <div className="flex flex-col items-center z-10">
          <h1 aria-hidden="true" className="text-7xl md:text-9xl font-black text-orange-500">
            {t.timer}
          </h1>
          <section aria-label={t.timer}>
            <Timer />
          </section>
        </div>

        {/* Background image credit */}
        <div className="absolute bottom-1 right-2 z-20 text-sm text-black px-2 py-1 rounded">
            Background illustration by Magali Agustin-Baltazar, CHS
        </div>
      </section>

  );
}
