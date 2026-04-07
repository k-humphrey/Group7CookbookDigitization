"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLang } from "@/app/components/languageprovider";

// string lang conversions
const STRINGS = {
  en: {
    title: "Our Partners",
  },
  es: {
    title: "Nuestros Socios",
  },
} as const;

// Component to show sponsors on the home page
export default function Sponsors() {
    const [sponsors, setSponsors] = useState<any[]>([]);

    // lang settings
    const langContext = useLang();
    const lang = langContext?.lang || "en";

    // get sponsor data from database
    useEffect(() => {
        fetch("/api/advertisments")
        .then(response => response.json())
        .then(data => {
            // set sponsors
            setSponsors(data.ads || []);

        }).catch(error => console.warn(`Failed to fetch advertisments API: ${error}`)); // catch fetch errors

    }, []);

    if (sponsors.length > 0) {
        return (
            <section className="w-full flex justify-center">
                <div className="w-3/4 text-center px-4 py-2 min-w-50">
                    {/* Title */}
                    <h2 className="font-bold mb-1">{STRINGS?.[lang].title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
                        {sponsors && sponsors.map(sponsor => (
                            // if link included, include Hyperlink, else dont
                            sponsor.link ? (
                                <a
                                    key={sponsor._id}
                                    href={sponsor.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center"
                                >
                                    <div className="min-h-50">
                                        {/* Name */}
                                        <div className="text-center underline mb-2">{sponsor.name.startsWith("!") ? <div className="invisible">{sponsor.name}</div> : sponsor.name}</div>

                                        {/* Logo */}
                                        {sponsor?.imageURI && /^https?:\/\//.test(sponsor.imageURI) && (
                                            <div className="relative w-full h-40 mb-5">
                                                <Image
                                                    src={sponsor.imageURI}
                                                    alt={sponsor.name}
                                                    fill
                                                    loading="lazy"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                    className="w-full object-contain"
                                                />
                                            </div>
                                        )}
                                    </div>

                                </a>
                            ) : (
                                <div key={sponsor._id} className="min-h-50">
                                    {/* Name */}
                                    <div className="text-center underline mb-2">{sponsor.name.startsWith("!") ? <div className="invisible">{sponsor.name}</div> : sponsor.name}</div>

                                    {/* Logo */}
                                    {sponsor?.imageURI && /^https?:\/\//.test(sponsor.imageURI) && (
                                        <div className="relative w-full h-40 mb-5">
                                            <Image
                                                src={sponsor.imageURI}
                                                alt={sponsor.name}
                                                fill
                                                loading="lazy"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                className="w-full object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </section>
        );
    }
}