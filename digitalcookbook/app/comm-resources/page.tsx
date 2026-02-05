//app/comm-resources/page.tsx

"use client";

import { useLang } from "@/app/components/languageprovider"; 
import InfoCard from "../components/infocard";

const STRINGS = {
    en: {
        communityResources: "Community Resources",
    },
    es: {
        communityResources: "Recursos Comunitarios",
    },
};

export default function CommResourcesPage() {

    const langContext = useLang();
    const lang = langContext?.lang ?? 'en';
    const t = STRINGS[lang];

    return (
        <main className="min-h-screen flex flex-col items-center justify-start">
            <div className="text-center mb-5">
                <h1 className="text-2xl md:text-[5rem] font-bold">Commuity Resources</h1>
            </div>

            {/* Cards Container aka Responsive Grid, works on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4">
                <InfoCard
                    title=""
                    description=""
                    href=""
                />

                <InfoCard
                    title=""
                    description=""
                    href=""
                />

                <InfoCard
                    title=""
                    description=""
                    href=""
                />

                <InfoCard
                    title=""
                    description=""
                    href=""
                />

            </div>
        </main>
    );
}