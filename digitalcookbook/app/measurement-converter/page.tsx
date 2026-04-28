"use client";

import MeasurementConverter from "./measurement";
import { MEASUREMENT_STRINGS } from "./measurementStrings";
import { useLang } from "@/app/components/languageprovider";
import Image from "next/image";

export default function MeasurementPage() {
  const langContext = useLang();
  const lang = langContext?.lang ?? "en";
  const t = MEASUREMENT_STRINGS[lang];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background picture */}
      <Image
        src="/measurementbg.png"
        alt=""
        fill
        priority
        className="object-cover"
      />

      <h1 className="sr-only z-10">{t.title}</h1>

      {/* Color overlay */}
      <div className="absolute backdrop-blur-[2px] z-10" />

      <div className="relative z-10 -mt-40">
        <MeasurementConverter />
      </div>

      {/* Background image credit */}
        <div className="absolute bottom-1 right-2 z-20 text-sm text-black px-2 py-1 rounded">
            Background illustration by Hailey Van Kooten, CHS
        </div>
    </section>

  );
}
