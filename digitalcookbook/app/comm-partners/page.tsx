//app/comm-partners/page.tsx

"use client";

import { useLang } from "@/app/components/languageprovider"; 
import InfoCard from "../components/infocard";
import Image from "next/image";
import { useEffect, useState } from "react";

const STRINGS = {
    en: {
        communityPartners: "Community Partners",
        partnerList: "List of our Community Partners"
    },
    es: {
        communityPartners: "Socios Comunitarios",
        partnerList: "Lista de Socios Comunitarios"
    },
};

export default function CommPartnersPage() {

    const langContext = useLang();
    const lang = langContext?.lang ?? 'en';
    const t = STRINGS[lang];

    const [partners, setPartners] = useState<any[]>([]);
     
    // Get resources
    useEffect(() => {
        fetch("/api/partners")
            .then(res => res.json())
            .then(data => setPartners(data));
    }, []);
    
    return (
        <section aria-label={t.communityPartners} className="relative min-h-screen flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat">
            {/* Background picture */}
            <Image
                src="/background_maybe3.png"
                alt=""
                fill
                priority
                className="object-cover scale-110"
            />

            <div className="text-center mt-10 mb-20 relative z-10">
                <div className="inline-block bg-white shadow-md rounded p-5 rounded-lg">
                    <h1 className="text-2xl md:text-[5rem] font-bold text-black">
                    {t.communityPartners}
                    </h1>
                </div>
            </div>

            {/* Cards Container aka Responsive Grid, works on mobile */}
            <ul aria-label={t.partnerList} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4 mb-20 relative z-10">
                {partners.map((partner) => (
                    <li key={partner._id} className="flex justify-center">
                        <InfoCard
                            title={partner.title?.[lang]}
                            description={partner.description?.[lang]}
                            href={partner.link}
                            imageSrc={partner?.imageURI ?? ""}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}