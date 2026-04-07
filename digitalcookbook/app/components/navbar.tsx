// app/components/navbar.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/app/components/languageprovider"; 
import { useEffect, useState } from "react";

const STRINGS = {
    en: {
        communityResources: "Community Resources",
        aboutCommRes: "About Our Community Resources",
        partners: "Partners",
        aboutPartners: "About Our Partners", 
        tools: "Tools",
        shelfLife: "Shelf Life Guidelines",
        priceFinder: "Price Finder",
        timer: "Timer",
        measurementConverter: "Measurement Converter",
        mealPlanner: "Meal Planner",
        allRecipes: "All Recipes",
        savedRecipe: "Saved Recipe",
        shoppingList: "Shopping List",
        openMenu: "Open Menu",
        languageToggle: "Toggle Language",
        findResources: "Find Resources",
    },
    es: {
        communityResources: "Recursos Comunitarios",
        aboutCommRes: "Información Sobre Nuestros Recursos Comunitarios",
        partners: "Socios",
        aboutPartners: "Información Sobre Nuestros Socios Comunitarios",
        tools: "Herramientas",
        shelfLife: "Guías de Vida Útil",
        priceFinder: "Buscador de Precios",
        timer: "Temporizador",
        measurementConverter: "Convertidor de Medidas",
        mealPlanner: "Planificador de comidas",
        allRecipes: "Todas las Recetas",
        savedRecipe: "Receta guardada",
        shoppingList: "Lista de Compras",
        openMenu: "Abrir Menú",
        languageToggle: "Cambiar Idioma",
        findResources: "Encontrar recursos",
    } as const
};

export default function Navbar() {
    const langContext = useLang()
    if (!langContext) return null
    const { lang, setLang } = langContext
    const t = STRINGS[lang];

    const [resources, setResources] = useState<any[]>([]);
    const [partners, setPartners] = useState<any[]>([]);
     
    // Get resources
    useEffect(() => {
        fetch("/api/resources")
            .then(res => res.json())
            .then(data => setResources(data));

        fetch("/api/partners")
            .then(res => res.json())
            .then(data => setPartners(data));
    }, []);

    return (
        <div className="navbar bg-white text-black shadow-sm relative z-50">

        <div className="navbar-start">
            <Link href="/">
                <div className="p-2 hover:bg-gray-100 rounded-lg relative w-[168px] h-[72px]">
                    <Image 
                    src="/pep_logo.png" 
                    alt="LEADERSHIP PUTNAM Logo" 
                    priority
                    height={72}
                    width={168}
                    className="object-contain"
                    />
                </div>
            </Link>

            <div className="dropdown relative">
            <div aria-label={t.openMenu} aria-haspopup="menu" tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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

            {/*Drop down menu for when screen small*/}
            <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-white text-black rounded-box z-50 mt-3 w-52 p-2 shadow" >
                <li>
                <details>
                    <summary>{t.communityResources}</summary>
                    <ul className="p-2">
                    <li>
                        <Link 
                            href="/comm-resources" 
                            className="block px-4 py-2 hover:bg-gray-100">
                            {t.aboutCommRes}
                        </Link>
                    </li>
                    {resources.map((resource) => (
                        <li key={resource._id}>
                            <Link
                                href={resource.link}
                                className="block px-4 py-2 hover:bg-gray-100" >
                                {resource.title?.[lang]}
                            </Link>
                        </li>
                    ))}
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
                            className="block px-4 py-2 hover:bg-gray-100">
                            {t.aboutPartners}
                        </Link>
                    </li>
                    {partners.map((partner) => (
                        <li key={partner._id}>
                            <Link
                                href={partner.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 hover:bg-gray-100" >
                                {partner.title?.[lang]}
                            </Link>
                        </li>
                    ))}
                </ul>
            </details>
            </li>
            <li>
                <Link
                    href="/recipes"
                    className="hover" >
                    {t.allRecipes}
                </Link>
            </li>
            <li>
            <details>
                <summary>{t.tools}</summary>
                <ul className="p-2">
                    <li>
                        <Link
                            href="/shelf-life-guidelines"
                            className="block px-4 py-2 hover:bg-gray-100" >
                            {t.shelfLife}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/price-finder"
                            className="block px-4 py-2 hover:bg-gray-100" >
                            {t.priceFinder}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/timer"
                            className="block px-4 py-2 hover:bg-gray-100" >
                            {t.timer}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/measurement-converter"
                            className="block px-4 py-2 hover:bg-gray-100" >
                            {t.measurementConverter}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/meal-planner"
                            className="block px-4 py-2 hover:bg-gray-100" >
                            {t.mealPlanner}
                        </Link>
                    </li>
                    </ul>
                </details>
                </li>
                <li>
                    <Link
                        href="/saved-recipe"
                        className="hover">
                            {t.savedRecipe}
                    </Link>

                </li>
                <li>
                    <Link
                        href="/shopping-list"
                        className="hover">
                            {t.shoppingList}
                    </Link>
            </li>
            <li>
                <Link
                    href="/findResources"
                    className="hover">
                        {t.findResources}
                </Link>

            </li>
            </ul>
            </div>
        </div>

        {/* Menu when not small */}
        <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 items-center">
            <li className="relative group">
            <Link
                href="/comm-resources"
                className="block px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-100" >
                {t.communityResources}
            </Link>

            <ul
                className="absolute left-0 top-full pt-2 w-64 bg-white shadow-lg rounded-lg
                        opacity-0 invisible translate-y-2
                        group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                        transition-all duration-200 z-50" >
                {resources.map((resource) => (
                <li key={resource._id}>
                    <Link
                    href={resource.link}
                    className="block px-4 py-2 hover:bg-gray-100" >
                    {resource.title?.[lang]}
                    </Link>
                </li>
                ))}
            </ul>
            </li>

            <li className="relative group">
            <Link
                href="/comm-partners"
                className="block px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-100" >
                {t.partners}
            </Link>

            <ul
                className="absolute left-0 top-full pt-2 w-64 bg-white shadow-lg rounded-lg
                        opacity-0 invisible translate-y-2
                        group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                        transition-all duration-200 z-50" >
                {partners.map((partner) => (
                <li key={partner._id}>
                    <Link
                    href={partner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 hover:bg-gray-100" >
                    {partner.title?.[lang]}
                    </Link>
                </li>
                ))}
            </ul>
            </li>

            <li>
            <Link
                href="/recipes"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100" >
                {t.allRecipes}
            </Link>
            </li>

            <li className="relative group">
            <Link
                href="/tools"
                className="block px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-100" >
                {t.tools}
            </Link>
            <ul
                className="absolute left-0 top-full pt-2 w-64 bg-white shadow-lg rounded-lg
                        opacity-0 invisible translate-y-2
                        group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                        transition-all duration-200 z-50" >
                <li>
                <Link
                    href="/shelf-life-guidelines"
                    className="block px-4 py-2 hover:bg-gray-100" >
                    {t.shelfLife}
                </Link>
                </li>
                <li>
                <Link
                    href="/price-finder"
                    className="block px-4 py-2 hover:bg-gray-100" >
                    {t.priceFinder}
                </Link>
                </li>
                <li>
                <Link
                    href="/timer"
                    className="block px-4 py-2 hover:bg-gray-100" >
                    {t.timer}
                </Link>
                </li>
                <li>
                <Link
                    href="/measurement-converter"
                    className="block px-4 py-2 hover:bg-gray-100" >
                    {t.measurementConverter}
                </Link>
                </li>
                <li>
                <Link
                    href="/meal-planner"
                    className="block px-4 py-2 hover:bg-gray-100" >
                    {t.mealPlanner}
                </Link>
                </li>
            </ul>
            </li>

            <li>
            <Link
                href="/saved-recipe"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100" >
                {t.savedRecipe}
            </Link>
            </li>

            <li>
            <Link
                href="/shopping-list"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100" >
                {t.shoppingList}
            </Link>
            </li>

            <li>
            <Link
                href="/findResources"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100" >
                {t.findResources}
            </Link>
            </li>
        </ul>
        </div>

        <div className="navbar-end">
            <input 
                type="checkbox"
                id="languageToggle"
                aria-label={t.languageToggle}
                className="toggle"
                onChange={() => setLang(lang === "en" ? "es" : "en")}
            />
            <Image 
                src="/LP_logo.png"
                alt="LEADERSHIP PUTNAM LOGO"
                priority
                className="w-24 h-auto max-w-full object-contain" 
                height={72}
                width={168}
            />
        </div>
        </div>
    );
}