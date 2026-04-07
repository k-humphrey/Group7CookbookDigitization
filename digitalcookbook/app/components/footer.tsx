//app/components/footer.tsx 
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/app/components/languageprovider'

const STRINGS = {
    en: {
        quickLinks: "Quick Links",
        resources: "Resources",
        contact: "Contact",
        social: "Social",
        allRecipes: "All Recipes",
        tools: "Tools",
        homepage: "Home Page",
        communityPartners: "Community Partners",
        communityResources: "Community Resources",
        email: "Email",
        copyright: "Copyright © ",
        allRightsReserved: " - All rights reserved",
        adminPortal: "Admin Portal",
    },
    es: {
        quickLinks: "Enlaces Rápidos",
        resources: "Recursos",
        contact: "Contacto",
        social: "Social",
        allRecipes: "Todas las Recetas",
        tools: "Herramientas",
        homepage: "Inicio",
        communityPartners: "Socios Comunitarios",
        communityResources: "Recursos Comunitarios",
        email: "Correo Electrónico",
        copyright: "Derechos de Autor © ",
        allRightsReserved: " - Todos los derechos reservados",
        adminPortal: "Admin Portal",
    },
};

// className for focus
const focusClasses =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2   focus-visible:ring-neutral focus-visible:rounded-md hover:shadow-lx";

export default function Footer(){
    const langContext = useLang();
    const lang = langContext?.lang ?? 'en';
    const t = STRINGS[lang];
    return (

        <>
        <footer className="relative z-10 footer sm:footer-horizontal bg-base-200 text-base-content p-5 justify-center gap-10 sm:gap-40 flex-wrap grid grid-cols-2 md:grid-cols-none mx-auto justify-items-start">

        {/* Quick Links */}
        <nav>
            <h2 className="footer-title">{t.quickLinks}</h2>

                <Link
                    href="/"
                    className={focusClasses + " link link-hover"}>
                    {t.homepage}
                </Link>
            
                <Link
                    href="/recipes"
                    className={focusClasses + " link link-hover"}>
                    {t.allRecipes}
                </Link>

                <Link
                    href="/tools"
                    className={focusClasses + " link link-hover"}>
                    {t.tools}
                </Link>

                <Link
                    href="/admin-login"
                    className={focusClasses + " link link-hover"}>
                    {t.adminPortal}
                </Link>
        </nav>

        {/* Resources */}
        <nav>
            <h2 className="footer-title">{t.resources}</h2>
                <Link
                    href="/comm-partners"
                    className={focusClasses + " link link-hover"}>
                    {t.communityPartners}
                </Link>

                <Link
                    href="/comm-resources"
                    className={focusClasses + " link link-hover"}>
                    {t.communityResources}
                </Link>
        </nav>

        {/* Contact */}
        <nav>
            <h2 className="footer-title">{t.contact}</h2>
            <a href="mailto:Katelyn.steakley@pcsstn.com" className={focusClasses + " link link-hover"}>{t.email}</a>
        </nav>

        {/* Social */}
        <nav>
            <h2 className="footer-title">{t.social}</h2>
            <div className="flex gap-2 sm:gap-4 mt-2">

            {/* Facebook */}
            <a
                href="https://www.facebook.com/pepfound/"
                target="_blank"
                rel="noopener noreferrer"
                className={focusClasses}
                aria-label="Facebook"
            >
                <svg xmlns="https://www.facebook.com/pepfound/" width="24" height="24" className="fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667
                        c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808
                        c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
            </a>
            </div>
        </nav>

        </footer>

        {/*Logos*/}
        <footer className="footer relative z-10 sm:footer-horizontal bg-base-300 p-4 flex items-center justify-center gap-15 md:gap-20 pr-5">
            <Image 
                src="/pep_logo.png" 
                alt="PUTNAM EDUCATION PARTNERSHIP FOUNDATION Logo" 
                className="h-auto pt-px max-w-full" 
                height={72}
                width={168}
                priority
            />

            <Image 
                src="/LP_logo.png" 
                alt="LEADERSHIP PUTNAM Logo" 
                className="w-24 max-w-full -mt-1" 
                height={72}
                width={168}
                priority
            />

        </footer>

        <footer className="footer sm:footer-horizontal bg-black text-white p-4 flex items-center justify-between">
            <aside className="text-center mx-auto">
                <p>{t.copyright}{new Date().getFullYear()}{t.allRightsReserved}</p>
            </aside>
        </footer>
        </>
    );
}
