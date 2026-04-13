// app/safety/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/app/components/languageprovider";
import InfoCard from "../components/infocard";
import Image from "next/image";

const STRINGS = {
    en: {
        safety: "Safety",
    },
    es: {
        safety: "Seguridad",
    },
};

type SafetyItem = {
    _id: string;
    title: {
        en: string;
        es: string;
    };
    description: {
        en: string;
        es: string;
    };
    link: string;
    order: number;
}; 

export default function SafetyPage() {
    const langContext = useLang();
    const lang = langContext?.lang ?? "en";
    const t = STRINGS[lang];

    const [safetyItems, setSafetyItems] = useState<SafetyItem[]>([]);

    // Get safety items from DB
    useEffect(() => {
        fetch("/api/safety")
            .then((res) => res.json())
            .then((data) => {
				console.log("DATA", data);
				setSafetyItems(data);
			});
    }, []);

    return (
        <section
            aria-label={t.safety}
            className="relative min-h-screen flex flex-col items-center justify-start"
        >
            {/* Background picture */}
            <Image
                src="/comm_resources.png"
                alt=""
                fill
                priority
                className="object-cover scale-110"
            />

            <div className="text-center mt-10 mb-20 relative z-10">
                <div className="inline-block bg-white shadow-md rounded-lg p-5">
                    <h1 className="text-2xl md:text-[5rem] font-bold text-black">
                        {t.safety}
                    </h1>
                </div>
            </div>

            {/* Cards Container aka Responsive Grid, works on mobile */}
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4 mb-20 items-stretch">
                {safetyItems.map((item) => (
                    <li key={item._id} className="flex justify-center">
                        <InfoCard
                            title={item.title?.[lang]}
                            description={item.description?.[lang]}
                            href={item.link}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}