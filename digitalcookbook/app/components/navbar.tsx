// app/components/navbar.tsx
//import React from "react";
import Link from "next/link";

export default function Navbar() {
    return (
        <div className="navbar bg-white text-black shadow-sm">


            <Link href="/">
            <div className="inline-block p-2 hover:bg-gray-100 rounded">
                <img 
                src="pep_logo.png" 
                alt="LEADERSHIP PUTNAM Logo" 
                className="w-80 h-auto max-w-full"
                />
            </div>
            </Link>


            
        <div className="navbar-start">
            <div className="dropdown">
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
                className="menu menu-sm dropdown-content bg-white text-black rounded-box z-1 mt-3 w-52 p-2 shadow" >
                <li>
                <details>
                    <summary>Community Resources</summary>
                    <ul className="p-2">
                    <li>
                        <Link
                            href="/safety"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            Safety
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="https://www.putnamcountytnhealthdept.com/"
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="hover:underline" >
                            Putnam County Health Department
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="https://UCAssist.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            UCAssist.org
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="https://www.elpuentecookeville.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            El Puente - Hispanic Community Center
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/emergency-numbers"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            Emergency Numbers
                        </Link>
                    </li>
                </ul>
            </details>
            </li>
            <li>
            <details>
                <summary>Partners</summary>
                <ul className="p-2">
                    <li>
                        <Link
                            href="https://www.kiwanis.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            Kiwanis
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="https://www.enbridge.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >                                
                            Enbridge
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="https://www.powerofputnam.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            Power of Putnam
                        </Link>
                    </li>
                </ul>
            </details>
            </li>
            <li>
                <Link
                    href="/all-recipes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline" >
                    All Recipes
                </Link>
            </li>
            <li>
            <details>
                <summary>Tools</summary>
                <ul className="p-2">
                    <li>
                        <Link
                            href="/shelf-life-guidelines"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            Shelf Life Guidelines
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/price-finder"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            Price Finder
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/timer"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            Timer
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
                <summary>Community Resources</summary>
                <ul className="p-2">
                    <li>
                        <Link
                            href="/safety"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            Safety
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="https://www.putnamcountytnhealthdept.com/"
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="hover:underline" >
                            Putnam County Health Department
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="https://UCAssist.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            UCAssist.org
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="https://www.elpuentecookeville.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            El Puente - Hispanic Community Center
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/emergency-numbers"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            Emergency Numbers
                        </Link>
                    </li>
                </ul>
            </details>
            </li>
            <li>
            <details>
                <summary>Partners</summary>
                <ul className="p-2">
                    <li>
                        <Link
                            href="https://www.kiwanis.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            Kiwanis
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="https://www.enbridge.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >                                
                            Enbridge
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="https://www.powerofputnam.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            Power of Putnam
                        </Link>
                    </li>
                </ul>
            </details>
            </li>
            <li>
                <Link
                    href="/all-recipes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline" >
                    All Recipes
                </Link>
            </li>
            <li>
            <details>
                <summary>Tools</summary>
                <ul className="p-2">
                    <li>
                        <Link
                            href="/shelf-life-guidelines"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            Shelf Life Guidelines
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/price-finder"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            Price Finder
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/timer"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline" >
                            Timer
                        </Link>
                    </li>
                </ul>
            </details>
            </li>
            </ul>
        </div>
        <div className="navbar-end"></div>
        </div>
    );
}
