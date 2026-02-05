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
        <main className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat">
            {/* Background picture */}
            <div
                className="w-full h-[300px] bg-cover bg-center"
                style={{ backgroundImage: "url('/community-background.png')" }}
            />

            <div className="text-center mb-5">
                <h1 className="text-2xl md:text-[5rem] font-bold">Commuity Resources</h1>
            </div>

            {/* Cards Container aka Responsive Grid, works on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4">
                <InfoCard
                    title="Safety"
                    description="Learn how to keep your and your family safe in day-to-day life and in emergencies."
                    href="/safety"
                />

                <InfoCard
                    title="Putnam Co Health Dept"
                    description="Our Mission: To protect, promote and improve the health and well-being of people in Putnam County."
                    href="https://www.putnamcountytnhealthdept.com/"
                />

                <InfoCard
                    title="Upper Cumberland Assist"
                    description="Finding the resources you need can be difficult.  
                    The UCAssist program, operated by the Upper Cumberland Development District, 
                    looks to provide the citizens of the Upper Cumberland an efficient and effective 
                    way to navigate to the assistance that they are looking for.  From small business 
                    services to home delivered meals, we strive to make locating these resources easier."
                    href="https://UCAssist.org"
                />

                <InfoCard
                    title="El Puente Cookeville"
                    description="The mission of El Puente is to create a welcoming community and 
                    offer resources that connect the Hispanic community of Cookeville. La misión 
                    de El Puente es crear una comunidad acogedora y ofrecer recursos que conecten 
                    a la comunidad hispana de Cookeville."
                    href="https://www.elpuentecookeville.org"
                />

                <InfoCard
                    title="Emergency Numbers"
                    description="Here you can find some local and non-local emergency numbers for any situation."
                    href="/emergency-numbers"
                />

            </div>
        </main>
    );
}