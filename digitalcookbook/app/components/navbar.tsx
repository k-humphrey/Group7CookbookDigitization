// app/components/navbar.tsx
//import React from "react";
"use client";
import Link from "next/link";
import { useLang } from "@/app/components/languageprovider"; 

const STRINGS = {
    en: {
        communityResources: "Community Resources",
        safety: "Safety",
        putnumHealthDept: "Putnam County Health Department",
        ucAssist: "UCAssist.org",
        elPuente: "El Puente - Hispanic Community Center",
        emergencyNumbers: "Emergency Numbers",
        partners: "Partners",
        kwianis: "Kiwanis",
        enbridge: "Enbridge",
        powerOfPutnam: "Power of Putnam",
        tools: "Tools",
        shelfLife: "Shelf Life Guidelines",
        priceFinder: "Price Finder",
        timer: "Timer",
        measurementConverter: "Measurement Converter",
        allRecipes: "All Recipes",
    },
    es: {
        communityResources: "Recursos Comunitarios",
        safety: "Seguridad",
        putnumHealthDept: "Departamento de Salud del Condado de Putnam",
        ucAssist: "UCAssist.org",
        elPuente: "El Puente - Centro Comunitario Hispano",
        emergencyNumbers: "Números de Emergencia",
        partners: "Socios",
        kwianis: "Kiwanis",
        enbridge: "Enbridge",
        powerOfPutnam: "Power of Putnam",
        tools: "Herramientas",
        shelfLife: "Guías de Vida Útil",
        priceFinder: "Buscador de Precios",
        timer: "Temporizador",
        measurementConverter: "Convertidor de Medidas",
        allRecipes: "Todas las Recetas",
    },
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
                <div className="p-2 hover:bg-gray-100 rounded">
                    <img 
                    src="pep_logo.png" 
                    alt="LEADERSHIP PUTNAM Logo" 
                    className="h-18 w-42"
                    />
                </div>
            </Link>

            <div className="dropdown relative">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
                            target="_blank"
                            rel="noopener noreferrer"
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
                            target="_blank"
                            rel="noopener noreferrer"
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
                    href="/recipes"
                    rel="noopener noreferrer"
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
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            {t.shelfLife}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/price-finder"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            {t.priceFinder}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/timer"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            {t.timer}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/measurement-converter"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            {t.measurementConverter}
                        </Link>
                    </li>
                    </ul>
                </details>
                </li>
            </ul>
            </div>
        </div>

        {/*Menu when not small*/}
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
            <li>
            <details>
                <summary>{t.communityResources}</summary>
                <ul className="p-2">
                    <li>
                        <Link
                            href="/safety"
                            target="_blank"
                            rel="noopener noreferrer"
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
                            target="_blank"
                            rel="noopener noreferrer"
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
                    href="/recipes"
                    rel="noopener noreferrer"
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
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            {t.shelfLife}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/price-finder"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            {t.priceFinder}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/timer"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            {t.timer}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/measurement-converter"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            {t.measurementConverter}
                        </Link>
                    </li>
                </ul>
            </details>
            </li>
            </ul>
        </div>
        <div className="navbar-end">
            <input type="checkbox" defaultChecked className="toggle" onChange={() => setLang(lang === "en" ? "es" : "en")} />
            <img src="logo.png"
            alt="LEADERSHIP PUTNAM LOGO"
            className="w-24 h-auto max-w-full -mt 4" />
        </div>
        </div>
    );
}
