// app/components/navbar.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/app/components/languageprovider"; 

const STRINGS = {
    en: {
        communityResources: "Community Resources",
        aboutCommRes: "About Our Community Resources",
        safety: "Safety",
        putnumHealthDept: "Putnam County Health Department",
        ucAssist: "UCAssist.org",
        elPuente: "El Puente - Hispanic Community Center",
        emergencyNumbers: "Emergency Numbers",
        partners: "Partners",
        aboutPartners: "About Our Partners", 
        kwianis: "Kiwanis",
        enbridge: "Enbridge",
        powerOfPutnam: "Power of Putnam",
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
    },
    es: {
        communityResources: "Recursos Comunitarios",
        aboutCommRes: "Información Sobre Nuestros Recursos Comunitarios",
        safety: "Seguridad",
        putnumHealthDept: "Departamento de Salud del Condado de Putnam",
        ucAssist: "UCAssist.org",
        elPuente: "El Puente - Centro Comunitario Hispano",
        emergencyNumbers: "Números de Emergencia",
        partners: "Socios",
        aboutPartners: "Información Sobre Nuestros Socios Comunitarios", 
        kwianis: "Kiwanis",
        enbridge: "Enbridge",
        powerOfPutnam: "Power of Putnam",
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
    } as const
};

export default function Navbar() {
    const langContext = useLang()
    if (!langContext) return null
    const { lang, setLang } = langContext
    const t = STRINGS[lang];
    return (
        <div className="navbar bg-white text-black shadow-sm relative z-50">

        <div className="navbar-start">
            <Link href="/">
                <div className="p-2 hover:bg-gray-100 rounded-lg relative w-[168px] h-[72px]">
                    <Image 
                    src="/pep_logo.png" 
                    alt="LEADERSHIP PUTNAM Logo" 
                    fill
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
                            href="/safety"
                            className="hover:underline" >
                            {t.safety}
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="https://www.putnamcountytnhealthdept.com/"
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="hover:underline" >
                            {t.putnumHealthDept}
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="https://UCAssist.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            {t.ucAssist}
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="https://www.elpuentecookeville.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            {t.elPuente}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/emergency-numbers"
                            className="hover:underline" >
                            {t.emergencyNumbers}
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
                            href="https://www.kiwanis.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            {t.kwianis}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="https://www.enbridge.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >                                
                            {t.enbridge}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="https://www.powerofputnam.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            {t.powerOfPutnam}
                        </Link>
                    </li>
                </ul>
            </details>
            </li>
            <li>
                <Link
                    href="/recipes?ingredients="
                    className="hover:underline" >
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
                            className="hover:underline" >
                            {t.shelfLife}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/price-finder"
                            className="hover:underline" >
                            {t.priceFinder}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/timer"
                            className="hover:underline" >
                            {t.timer}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/measurement-converter"
                            className="hover:underline" >
                            {t.measurementConverter}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/meal-planner"
                            className="hover:underline" >
                            {t.mealPlanner}
                        </Link>
                    </li>
                    </ul>
                </details>
                </li>
                <li>
                    <Link
                        href="/shopping-list"
                        className="hover:underline">
                            {t.shoppingList}
                    </Link>
            </li>
            </ul>
            </div>
        </div>

        {/*Menu when not small*/}
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-2">
            <li className="relative group">
                <span className="cursor-pointer">{t.communityResources}</span>

                <ul className="absolute left-0 top-full pt-2 w-64 bg-white shadow-lg rounded-lg
                                opacity-0 invisible translate-y-2
                                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                                transition-all duration-200 z-50">

                    <li>
                    <Link href="/comm-resources" className="block px-4 py-2 hover:bg-gray-100">
                        {t.aboutCommRes}
                    </Link>
                    </li>

                    <li>
                    <Link href="/safety" className="block px-4 py-2 hover:bg-gray-100">
                        {t.safety}
                    </Link>
                    </li>

                    <li>
                    <Link
                        href="https://www.putnamcountytnhealthdept.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 hover:bg-gray-100"
                    >
                        {t.putnumHealthDept}
                    </Link>
                    </li>

                    <li>
                    <Link
                        href="https://UCAssist.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 hover:bg-gray-100"
                    >
                        {t.ucAssist}
                    </Link>
                    </li>

                    <li>
                    <Link
                        href="https://www.elpuentecookeville.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 hover:bg-gray-100"
                    >
                        {t.elPuente}
                    </Link>
                    </li>

                    <li>
                    <Link href="/emergency-numbers" className="block px-4 py-2 hover:bg-gray-100">
                        {t.emergencyNumbers}
                    </Link>
                    </li>
                </ul>
            </li>
            <li className="relative group">
                <span className="cursor-pointer">{t.partners}</span>

                <ul className="absolute left-0 top-full pt-2 w-64 bg-white shadow-lg rounded-lg
                                opacity-0 invisible translate-y-2
                                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                                transition-all duration-200 z-50">

                    <li>
                    <Link href="/comm-partners" className="block px-4 py-2 hover:bg-gray-100">
                        {t.aboutPartners}
                    </Link>
                    </li>

                    <li>
                        <Link
                            href="https://www.kiwanis.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 hover:bg-gray-100" >
                            {t.kwianis}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="https://www.enbridge.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 hover:bg-gray-100" >                                
                            {t.enbridge}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="https://www.powerofputnam.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 hover:bg-gray-100" >
                            {t.powerOfPutnam}
                        </Link>
                    </li>
                </ul>
            </li>
            <li>
                <Link
                    href="/recipes?ingredients="
                    className="hover">
                    {t.allRecipes}
                </Link>
            </li>
            <li className="relative group">
            <span className="cursor-pointer">{t.tools}</span>
                <ul className="absolute left-0 top-full pt-2 w-64 bg-white shadow-lg rounded-lg
                                opacity-0 invisible translate-y-2
                                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                                transition-all duration-200 z-50">
                    <li>
                        <Link
                            href="/shelf-life-guidelines"
                            className="block px-4 py-2 hover:bg-gray-100">
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
                            className="block px-4 py-2 hover:bg-gray-100">
                            {t.timer}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/measurement-converter"
                            className="block px-4 py-2 hover:bg-gray-100">
                            {t.measurementConverter}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/meal-planner"
                            className="block px-4 py-2 hover:bg-gray-100">
                            {t.mealPlanner}
                        </Link>
                    </li>
                </ul>
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
            </ul>
        </div>
        <div className="navbar-end">
            <input type="checkbox" aria-label={t.languageToggle} className="toggle" onChange={() => setLang(lang === "en" ? "es" : "en")} />
            <Image 
            src="/LP_logo.png"
            alt="LEADERSHIP PUTNAM LOGO"
            className="w-24 h-auto max-w-full object-contain" 
            height={72}
            width={168}
            />
        </div>
        </div>
    );
}
