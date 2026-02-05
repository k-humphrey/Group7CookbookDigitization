//app/comm-partners/page.tsx

"use client";

import { useLang } from "@/app/components/languageprovider"; 
import InfoCard from "../components/infocard";

const STRINGS = {
    en: {
        communityPartners: "Community Partners",
    },
    es: {
        communityPartners: "Socios Comunitarios",
    },
};

export default function CommPartnersPage() {

    const langContext = useLang();
    const lang = langContext?.lang ?? 'en';
    const t = STRINGS[lang];
    
    return (
        <main className="min-h-screen flex flex-col items-center justify-start">
            <div className="text-center mb-5">
                <h1 className="text-2xl md:text-[5rem] font-bold">{t.communityPartners}</h1>
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