//app/comm-resources/page.tsx

"use client";

import { useLang } from "@/app/components/languageprovider"; 
import InfoCard from "../components/infocard";
import Image from "next/image";

const STRINGS = {
    en: {
        communityResources: "Community Resources",
		safety: "Safety",
		putnamCoHD: "Putnam County Health Department",
		assist: "Upper Cumberland Assist",
		elPuente:"El Puente",
		emerNums: "Emergency Numbers",
		safetyDesc: "Learn how to keep your and your family safe in day-to-day life and in emergencies.",
		putnamCoHDDesc: "Our Mission: To protect, promote and improve the health and well-being of people in Putnam County.",
		assistDesc: "Finding the resources you need can be difficult. The UCAssist program, operated by the Upper Cumberland Development District, looks to provide the citizens of the Upper Cumberland an efficient and effective way to navigate to the assistance that they are looking for. From small business services to home delivered meals, we strive to make locating these resources easier.",
		elPuenteDesc:"The mission of El Puente is to create a welcoming community and offer resources that connect the Hispanic community of Cookeville. La misión de El Puente es crear una comunidad acogedora y ofrecer recursos que conecten a la comunidad hispana de Cookeville.",
		emerNumsDesc: "Here you can find some local and non-local emergency numbers for any situation.",
    },
    es: {
        communityResources: "Recursos Comunitarios",
		safety: "Seguridad",
		putnamCoHD: "Departamento de Salud del Condado de Putnam",
		assist: "Asistencia de Upper Cumberland",
		elPuente:"El Puente",
		emerNums: "Números de emergencia",
		safetyDesc: "Aprenda a mantener su seguridad y la de su familia en la vida diaria y en caso de emergencia",
		putnamCoHDDesc: "Nuestra misión: Proteger, promover y mejorar la salud y el bienestar de las personas en el condado de Putnam",
		assistDesc: "Encontrar los recursos que necesita puede ser difícil. El programa UCAssist, operado por el Distrito de Desarrollo de Upper Cumberland, busca brindar a los ciudadanos de Upper Cumberland una manera eficiente y eficaz de acceder a la asistencia que buscan. Desde servicios para pequeñas empresas hasta comidas a domicilio, nos esforzamos por facilitar la búsqueda de estos recursos",
		elPuenteDesc:"La misión de El Puente es crear una comunidad acogedora y ofrecer recursos que conecten a la comunidad hispana de Cookeville. La misión de El Puente es crear una comunidad acogedora y ofrecer recursos que conecten a la comunidad hispana de Cookeville.",
		emerNumsDesc: "Aquí puedes encontrar algunos números de emergencia locales y no locales para cualquier situación.",
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
				src="/searchbackground.jpg"
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
						title={t.safety}
						description= {t.safetyDesc}
						href="/safety"
					/>
				</li>

				<li className="flex justify-center">
					<InfoCard
						title={t.putnamCoHD}
						description= {t.putnamCoHDDesc}
						href="https://www.putnamcountytnhealthdept.com/"
					/>
				</li>

				<li className="flex justify-center">
					<InfoCard
						title={t.assist}
						description= {t.assistDesc}
						href="https://UCAssist.org"
					/>
				</li>

				<li className="flex justify-center">
					<InfoCard
						title={t.elPuente}
						description= {t.elPuenteDesc}
						href="https://www.elpuentecookeville.org"
					/>
				</li>

				<li className="flex justify-center">
					<InfoCard
						title={t.emerNums}
						description={t.emerNumsDesc}
						href="/emergency-numbers"
					/>
				</li>

			</ul>
		</section>
    );
}