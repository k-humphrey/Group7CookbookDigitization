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
                    title="Kiwanis"
                    description="From Kiwanis.org: Kids need adults who care. That’s why people join Kiwanis clubs. 
                    They’re local groups of like-minded volunteers who make a difference. Friends. 
                    Neighbors. Anyone who loves serving together to change children’s lives. In fact, 
                    Kiwanians are part of a global network of clubs and members who partner with each 
                    other and with organizations whose missions align with ours. All around the world — 
                    and in communities like yours — Kiwanis International is serving the kids who need 
                    us most."
                    href="https://www.kiwanis.org/"
                />

                <InfoCard
                    title="Enbridge Power"
                    description="At Enbridge, our goal is to be the first-choice energy delivery company 
                    in North America and beyond—for customers, communities, investors, regulators and policymakers, 
                    and employees. As a diversified energy company, we are uniquely positioned to help accelerate 
                    the global energy transition, and we're doing it in ways that are ethical, sustainable and 
                    socially responsible. We're advancing new low-carbon energy technologies—including hydrogen, 
                    renewable natural gas, and carbon capture and storage. We're committed to reducing the carbon 
                    footprint of the energy we deliver, and to achieving net-zero emissions from our operations by 2050.1, 2"
                    href="https://www.enbridge.com/"
                />

                <InfoCard
                    title="Power of Putnam"
                    description="Who We Are: Power of Putnam is a coalition that brings together community members concerned about the issue of substance misuse to work together in the development of strategies and in finding ways of implementing those strategies into the community.
                    Our Mission: Our mission is to partner with the diverse elements of Putnam County in a united substance misuse prevention effort designed to empower individuals, strengthen families, and build character and resiliency resulting in drug-free children and youth."
                    href="https://www.powerofputnam.org/"
                />

            </div>
        </main>
    );
}