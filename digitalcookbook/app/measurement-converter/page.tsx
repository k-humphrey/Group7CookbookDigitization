"use client";

import MeasurementConverter from "./measurement";
import { MEASUREMENT_STRINGS } from "./measurementStrings";
import { useLang } from "@/app/components/languageprovider";

export default function MeasurementPage() {
  const langContext = useLang();
  const lang = langContext?.lang ?? "en";
  const t = MEASUREMENT_STRINGS[lang];

  return (
    <main
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/measurementbg.png')",
      }}
    >
      <h1 className="sr-only">{t.title}</h1>

      {/* Color overlay */}
      <div className="absolute backdrop-blur-[2px]" />

      <div className="relative z-10 -mt-40">
        <MeasurementConverter />
      </div>
    </main>
  );
}
