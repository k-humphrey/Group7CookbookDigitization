//app/comm-resources/page.tsx

"use client";

import {useEffect, useState } from "react";
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

	const [resources, setResources] = useState<any[]>([]);
 
	// Get resources
	useEffect(() => {
		fetch("/api/resources")
			.then(res => res.json())
			.then(data => setResources(data));
	}, []);

    return (
		<section aria-label={t.communityResources} className="relative min-h-screen flex flex-col items-center justify-start">

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
					{t.communityResources}
					</h1>
				</div>
			</div>

			{/* Cards Container aka Responsive Grid, works on mobile */}
			<ul className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4 mb-20 items-stretch">
				{resources.map((resource) => (
					<li key={ resource._id } className="flex justify-center">
						<InfoCard
							title={resource.title?.[lang]}
							description= {resource.description?.[lang]}
							href={resource.link}
						/>
					</li>
				))}
			</ul>
		</section>
    );
}