//app/comm-partners/page.tsx

"use client";

import { useLang } from "@/app/components/languageprovider"; 
import InfoCard from "../components/infocard";
import Image from "next/image";

const STRINGS = {
    en: {
        communityPartners: "Community Partners",
        partnerList: "List of our Community Partners",
        kiwanis: "From Kiwanis.org: Kids need adults who care. That's why people join Kiwanis clubs. They're local groups of like-minded volunteers who make a difference. Friends. Neighbors. Anyone who loves serving together to change children's lives. In fact, Kiwanians are part of a global network of clubs and members who partner with each other and with organizations whose missions align with ours. All around the world — and in communities like yours — Kiwanis International is serving the kids who need us most.",
        enbridge: "At Enbridge, our goal is to be the first-choice energy delivery company in North America and beyond—for customers, communities, investors, regulators and policymakers, and employees. As a diversified energy company, we are uniquely positioned to help accelerate the global energy transition, and we're doing it in ways that are ethical, sustainable and socially responsible. We're advancing new low-carbon energy technologies—including hydrogen, renewable natural gas, and carbon capture and storage. We're committed to reducing the carbon footprint of the energy we deliver, and to achieving net-zero emissions from our operations by 2050.",
        powerOfPutnam: "Who We Are: Power of Putnam is a coalition that brings together community members concerned about the issue of substance misuse to work together in the development of strategies and in finding ways of implementing those strategies into the community. Our Mission: Our mission is to partner with the diverse elements of Putnam County in a united substance misuse prevention effort designed to empower individuals, strengthen families, and build character and resiliency resulting in drug-free children and youth.",
    },
    es: {
        communityPartners: "Socios Comunitarios",
        partnerList: "Lista de Socios Comunitarios",
        kiwanis: "De Kiwanis.org: Los niños necesitan adultos que se preocupen por ellos. Por eso, la gente se une a los clubes Kiwanis.Son grupos locales de voluntarios con ideas afines que marcan la diferencia. Amigos. Vecinos. Cualquiera que disfrute trabajando juntos para cambiar la vida de los niños. De hecho, los kiwanis forman parte de una red global de clubes y miembros que colaboran entre sí y con organizaciones cuyas misiones coinciden con la nuestra. En todo el mundo, y en comunidades como la suya, Kiwanis International está sirviendo a los niños que más nos necesitan.",
        enbridge: "En Enbridge, nuestro objetivo es ser la empresa de suministro de energía preferida en Norteamérica y el resto del mundo, tanto para clientes, comunidades, inversores, reguladores y legisladores, como para empleados. Como empresa energética diversificada, nos encontramos en una posición privilegiada para ayudar a acelerar la transición energética global, y lo hacemos de forma ética, sostenible y socialmente responsable. Impulsamos nuevas tecnologías energéticas bajas en carbono, como el hidrógeno, el gas natural renovable y la captura y almacenamiento de carbono. Nos comprometemos a reducir la huella de carbono de la energía que suministramos y a alcanzar cero emisiones netas en nuestras operaciones para 2050.",
        powerOfPutnam: "Quiénes somos: Power of Putnam es una coalición que reúne a miembros de la comunidad preocupados por el problema del abuso de sustancias para colaborar en el desarrollo de estrategias y la búsqueda de maneras de implementarlas en la comunidad. Nuestra misión: Nuestra misión es colaborar con los diversos sectores del condado de Putnam en una iniciativa conjunta de prevención del abuso de sustancias diseñada para empoderar a las personas, fortalecer a las familias y desarrollar el carácter y la resiliencia, lo que resulta en niños y jóvenes libres de drogas.",
    },
};

export default function CommPartnersPage() {

    const langContext = useLang();
    const lang = langContext?.lang ?? 'en';
    const t = STRINGS[lang];
    
    return (
        <section aria-label={t.communityPartners} className="relative min-h-screen flex flex-col items-center justify-start bg-cover bg-center bg-no-repeat">
            {/* Background picture */}
            <Image
                src="/cutting-board.png"
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
                <li className="flex justify-center">
                    <InfoCard
                        title="Kiwanis"
                        description={t.kiwanis}
                        href="https://www.kiwanis.org/"
                    />
                </li>
                
                <li className="flex justify-center">
                    <InfoCard
                        title="Enbridge"
                        description={t.enbridge}
                        href="https://www.enbridge.com/"
                    />
                </li>

                <li className="flex justify-center">
                    <InfoCard
                        title="Power of Putnam"
                        description={t.powerOfPutnam}
                        href="https://www.powerofputnam.org/"
                    />
                </li>
            </ul>
        </section>
    );
}