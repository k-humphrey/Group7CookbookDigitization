//app/comm-resources/page.tsx

"use client";

import { useLang } from "@/app/components/languageprovider"; 
import InfoCard from "../components/infocard";
import Image from "next/image";

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
		<section aria-label={t.communityResources} className="relative min-h-screen flex flex-col items-center justify-start">

			{/* Background picture */}
			<Image
				src="/community-background.png"
				alt=""
				fill
				priority
				className="object-cover scale-110"
			/>
			
			<div className="text-center mt-10 mb-20 relative z-10">
				<div className="inline-block bg-white shadow-md rounded-lg p-5">
					<h1 className="text-2xl md:text-[5rem] font-bold text-black">
					{t.communityResources}
					</h1>
				</div>
			</div>

			{/* Cards Container aka Responsive Grid, works on mobile */}
			<ul className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4 mb-20 items-stretch">
				<li className="flex justify-center">
					<InfoCard
						title="Safety"
						description="Learn how to keep your and your family safe in day-to-day life and in emergencies."
						href="/safety"
					/>
				</li>

				<li className="flex justify-center">
					<InfoCard
						title="Putnam Co Health Dept"
						description="Our Mission: To protect, promote and improve the health and well-being of people in Putnam County."
						href="https://www.putnamcountytnhealthdept.com/"
					/>
				</li>

				<li className="flex justify-center">
					<InfoCard
						title="Upper Cumberland Assist"
						description="Finding the resources you need can be difficult. The UCAssist program, operated by the Upper Cumberland Development District, looks to provide the citizens of the Upper Cumberland an efficient and effective way to navigate to the assistance that they are looking for. From small business services to home delivered meals, we strive to make locating these resources easier."
						href="https://UCAssist.org"
					/>
				</li>

				<li className="flex justify-center">
					<InfoCard
						title="El Puente Cookeville"
						description="The mission of El Puente is to create a welcoming community and offer resources that connect the Hispanic community of Cookeville. La misión de El Puente es crear una comunidad acogedora y ofrecer recursos que conecten a la comunidad hispana de Cookeville."
						href="https://www.elpuentecookeville.org"
					/>
				</li>

				<li className="flex justify-center">
					<InfoCard
						title="Emergency Numbers"
						description="Here you can find some local and non-local emergency numbers for any situation."
						href="/emergency-numbers"
					/>
				</li>

			</ul>
		</section>
    );
}