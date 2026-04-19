// app/components/navbar.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/app/components/languageprovider";
import { useEffect, useMemo, useState } from "react";

const STRINGS = {
    en: {
        communityResources: "Community Resources",
        aboutCommRes: "About Our Community Resources",
        partners: "Community Partners",
        aboutPartners: "About Our Partners",
        tools: "Tools",
        shelfLife: "Shelf Life Guidelines",
        timer: "Timer",
        measurementConverter: "Measurement Converter",
        mealPlanner: "Meal Planner",
        allRecipes: "All Recipes",
        savedRecipe: "Saved Recipes",
        shoppingList: "Shopping List",
        openMenu: "Open Menu",
        languageToggle: "Toggle Language",
        login: "Login",
        findResources: "Map of Local Resources",
    },
    es: {
        communityResources: "Recursos Comunitarios",
        aboutCommRes: "Información Sobre Nuestros Recursos Comunitarios",
        partners: "Socios Comunitarios",
        aboutPartners: "Información Sobre Nuestros Socios",
        tools: "Herramientas",
        shelfLife: "Guías de Vida Útil",
        timer: "Temporizador",
        measurementConverter: "Convertidor de Medidas",
        mealPlanner: "Planificador de Comidas",
        allRecipes: "Todas las Recetas",
        savedRecipe: "Recetas Guardadas",
        shoppingList: "Lista de Compras",
        openMenu: "Abrir Menú",
        languageToggle: "Cambiar Idioma",
        login: "Login",
        findResources: "Mapa de Recursos Locales",
    } as const
};

type LocalizedText = {
    en: string;
    es: string;
};

type ResourceItem = {
    _id: string;
    title?: LocalizedText;
    link: string;
    order?: number;
};

type PartnerItem = {
    _id: string;
    title?: LocalizedText;
    link: string;
    order?: number;
};

type ToolItem = {
    href: string;
    label: string;
};

export default function Navbar() {
    const langContext = useLang();
    if (!langContext) return null;

    const { lang, setLang } = langContext;
    const t = STRINGS[lang];

    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [partners, setPartners] = useState<PartnerItem[]>([]);

    useEffect(() => {
        fetch("/api/resources")
            .then((res) => res.json())
            .then((data) => setResources(data));

        fetch("/api/partners")
            .then((res) => res.json())
            .then((data) => setPartners(data));
    }, []);

    const orderedResources = useMemo( //react hook that caches the result of a calculation between re-renders, which improves performance
        () =>
            [...resources].sort(
                (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)
            ),
        [resources]
    );

    const orderedPartners = useMemo(
        () =>
            [...partners].sort(
                (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)
            ),
        [partners]
    );

    const toolItems: ToolItem[] = [
        { href: "/shelf-life-guidelines", label: t.shelfLife },
        { href: "/timer", label: t.timer },
        { href: "/measurement-converter", label: t.measurementConverter },
        { href: "/meal-planner", label: t.mealPlanner },
        { href: "/saved-recipe", label: t.savedRecipe },
        { href: "/shopping-list", label: t.shoppingList },
    ];

    return (
        <div className="navbar bg-white text-black shadow-sm relative z-50">
            <div className="navbar-start">
                <Link href="/">
                    <div className="p-2 hover:bg-gray-100 rounded-lg relative h-[72px] items-center flex">
                        <Image
                            src="/pep_logo.png"
                            alt="LEADERSHIP PUTNAM Logo"
                            priority
                            height={72}
                            width={168}
                            className="object-contain w-[70px] md:w-[168px]"
                        />
                    </div>
                </Link>

                <div className="dropdown relative">
                    <div
                        aria-label={t.openMenu}
                        aria-haspopup="menu"
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost lg:hidden"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>

                    {/* Menu when small */}
                    <ul
                        tabIndex={-1}
                        className="menu menu-sm dropdown-content bg-white text-black rounded-box z-50 mt-3 w-64 p-2 shadow"
                    >
                        <li>
                            <Link href="/recipes" className="hover">
                                {t.allRecipes}
                            </Link>
                        </li>

                        <li>
                            <details>
                                <summary>{t.communityResources}</summary>
                                <ul className="p-2">
                                    <li>
                                        <Link
                                            href="/comm-resources"
                                            className="block px-4 py-2 hover:bg-gray-100"
                                        >
                                            {t.aboutCommRes}
                                        </Link>
                                    </li>
                                    {orderedResources.map((resource) => (
                                        <li key={resource._id}>
                                            <Link
                                                href={resource.link}
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                {resource.title?.[lang]}
                                            </Link>
                                        </li>
                                    ))}
                                    <li>
                                        <Link
                                            href="/findResources"
                                            className="block px-4 py-2 hover:bg-gray-100"
                                        >
                                            {t.findResources}
                                        </Link>
                                    </li>
                                </ul>
                            </details>
                        </li>

                        <li>
                            <details>
                                <summary>{t.partners}</summary>
                                <ul className="p-2">
                                    <li>
                                        <Link
                                            href="/comm-partners"
                                            className="block px-4 py-2 hover:bg-gray-100"
                                        >
                                            {t.aboutPartners}
                                        </Link>
                                    </li>
                                    {orderedPartners.map((partner) => (
                                        <li key={partner._id}>
                                            <Link
                                                href={partner.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                {partner.title?.[lang]}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </li>

                        <li>
                            <details>
                                <summary>{t.tools}</summary>
                                <ul className="p-2">
                                    {toolItems.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Menu when not small */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2 items-center">
                    <li>
                        <Link
                            href="/recipes"
                            className="block px-4 py-2 rounded-lg hover:bg-gray-100"
                        >
                            {t.allRecipes}
                        </Link>
                    </li>

                    <li className="relative group">
                        <Link
                            href="/comm-resources"
                            className="block px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-100"
                        >
                            {t.communityResources}
                        </Link>

                        <ul
                            className="absolute left-0 top-full pt-2 w-64 bg-white shadow-lg rounded-lg
                            opacity-0 invisible translate-y-2
                            group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                            transition-all duration-200 z-50"
                        >
                            {orderedResources.map((resource) => (
                                <li key={resource._id}>
                                    <Link
                                        href={resource.link}
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        {resource.title?.[lang]}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    href="/findResources"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    {t.findResources}
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className="relative group">
                        <Link
                            href="/comm-partners"
                            className="block px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-100"
                        >
                            {t.partners}
                        </Link>

                        <ul
                            className="absolute left-0 top-full pt-2 w-64 bg-white shadow-lg rounded-lg
                            opacity-0 invisible translate-y-2
                            group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                            transition-all duration-200 z-50"
                        >
                            {orderedPartners.map((partner) => (
                                <li key={partner._id}>
                                    <Link
                                        href={partner.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        {partner.title?.[lang]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li className="relative group">
                        <Link
                            href="/tools"
                            className="block px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-100"
                        >
                            {t.tools}
                        </Link>

                        <ul
                            className="absolute left-0 top-full pt-2 w-64 bg-white shadow-lg rounded-lg
                            opacity-0 invisible translate-y-2
                            group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                            transition-all duration-200 z-50"
                        >
                            {toolItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </div>

            <div className="navbar-end">
                {/* Language Switch */}
                <div className="dropdown dropdown-hover dropdown-end">
                      <button type="button" onClick={(e) => {setLang(lang === "en" ? "es" : "en");(e.currentTarget as HTMLElement).blur()}} className="btn btn-ghost flex items-center gap-2">
                        <Image
                            src={lang === "en" ? "/flags/en.png" : "/flags/es.jpg"}
                            alt="flag"
                            width={20}
                            height={20}
                        />
                        <span className="font-semibold uppercase hidden md:inline">{lang}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <ul className="dropdown-content menu bg-white rounded-box w-26 mt-2 shadow z-50">
                        <li>
                            <button
                                type="button"
                                onClick={(e) => {setLang("en"); (e.currentTarget as HTMLElement).blur()}}
                                className="flex items-center gap-2" >
                                <Image src="/flags/en.png" alt="English" width={20} height={20} />
                                EN
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                onClick={(e) => {setLang("es");(e.currentTarget as HTMLElement).blur()}}
                                className="flex items-center gap-2"
                            >
                                <Image src="/flags/es.jpg" alt="Español" width={20} height={20} />
                                ES
                            </button>
                        </li>
                    </ul>
                </div>
                
                {/* Login Button */}
                <div className="mx-2">
                    <Link
                        href="/recipes"
                        className="btn btn-sm bg-gray-200 text-black hover:bg-gray-300 border-none"
                    >
                        {t.login ?? "Login"}
                    </Link>
                </div>

                {/* Leadershup Putnam Logo */}
                <Image
                    src="/LP_logo.png"
                    alt="LEADERSHIP PUTNAM LOGO"
                    priority
                    className="w-12 md:w-24 h-auto max-w-full object-contain"
                    height={72}
                    width={168}
                />
            </div>
        </div>
    );
}