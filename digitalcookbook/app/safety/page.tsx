//app/safety/page.tsx
"use client";
import InfoCard from "../components/infocard";
import { useLang } from "@/app/components/languageprovider";

const STRINGS = {
  en: {
    title: "Safety",

    carSeatTitle: "Car Seat Recommendations",
    carSeatDesc:
      "Learn how to choose the correct car seat for your child's age, height, and weight.",

    extremeWeatherTitle: "Extreme Weather Awareness",
    extremeWeatherDesc:
      "Important steps to take during heat waves, blizzards, tornadoes, and flooding.",

    chokingTitle: "First Aid for Choking",
    chokingDesc:
      "Recognize choking signs and learn how to perform abdominal thrusts safely.",

    cprTitle: "How to Perform CPR",
    cprDesc:
      "Learn adult, child, and infant CPR guidelines.",
  },
  es: {
    title: "Seguridad",

    carSeatTitle: "Recomendaciones para Asientos de Auto",
    carSeatDesc:
      "Aprenda a elegir el asiento correcto según la edad, estatura y peso de su hijo.",

    extremeWeatherTitle: "Conciencia sobre Clima Extremo",
    extremeWeatherDesc:
      "Pasos importantes durante olas de calor, tormentas de nieve, tornados e inundaciones.",

    chokingTitle: "Primeros Auxilios por Asfixia",
    chokingDesc:
      "Reconozca las señales de asfixia y aprenda a realizar empujes abdominales de forma segura.",

    cprTitle: "Cómo Realizar RCP",
    cprDesc:
      "Aprenda las pautas de RCP para adultos, niños y bebés.",
  },
};

export default function SafetyPage() {
  const langContext = useLang();
  const lang = langContext?.lang ?? "en";
  const t = STRINGS[lang];

  return (
    <main className="min-h-screen flex flex-col items-center justify-start">
      <div className="text-center mb-5">
        <h1 className="text-3xl md:text-[5rem] font-bold">{t.title}</h1>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4">
        <InfoCard
          title={t.carSeatTitle}
          description={t.carSeatDesc}
          href="https://www.nhtsa.gov/equipment/car-seats-and-booster-seats"
        />

        <InfoCard
          title={t.extremeWeatherTitle}
          description={t.extremeWeatherDesc}
          href="https://www.ready.gov/weather"
        />

        <InfoCard
          title={t.chokingTitle}
          description={t.chokingDesc}
          href="https://www.redcross.org/..."
        />

        <InfoCard
          title={t.cprTitle}
          description={t.cprDesc}
          href="https://www.heart.org/..."
        />
      </div>
    </main>
  );
}
