import Link from 'next/link';

// app/components/navbar.tsx
//import React from "react";

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
                className="menu menu-sm dropdown-content bg-white text-black rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
                <li>
                <details>
                    <summary>Community Resources</summary>
                    <ul className="p-2">
                        <li><a>Safety</a></li>
                        <li><a>Emergency Preparedness</a></li>
                        <li><a>Putnam County Health Department</a></li>
                        <li><a>UCAssist.org</a></li>
                        <li><a>Hispanic Community Center</a></li>
                        <li><a>Emergecy Numbers</a></li>
                    </ul>
                </details>
                </li>
                <li>
                <details>
                    <summary>Partners</summary>
                    <ul className="p-2">
                        <li><a>Kiwanis</a></li>
                        <li><a>Enbridge</a></li>
                        <li><a>Power of Putnam</a></li>
                        <li><a>Etc</a></li>
                    </ul>
                </details>
                </li>
                <li><a>All Recipes</a></li>
                <li>
                <details>
                    <summary>Tools</summary>
                    <ul className="p-2">
                        <li><a>Shelf Life Guidelines</a></li>
                        <li><a>Price Finder</a></li>
                        <li><a>Timer</a></li>
                        <li><a>Etc</a></li>
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
                <summary className = "!font-bold">Community Resources</summary>
                    <ul className="p-2">
                    <li><a>Safety</a></li>
                    <li><a>Emergency Preparedness</a></li>
                    <li><a>Putnam County Health Department</a></li>
                    <li><a>UCAssist.org</a></li>
                    <li><a>Hispanic Community Center</a></li>
                    <li><a>Emergecy Numbers</a></li>
                    </ul>
                </details>
            </li>
            <li>
                <details>
                <summary className = "!font-bold">Partners</summary>
                    <ul className="p-2">
                    <li><a>Kiwanis</a></li>
                    <li><a>Enbridge</a></li>
                    <li><a>Power of Putnam</a></li>
                    <li><a>Etc</a></li>
                    </ul>
                </details>
            </li>
            <li className = "!font-bold"><a>All Recipes</a></li>
            <li>
                <details>
                <summary className = "!font-bold">Tools</summary>
                    <ul className="p-2">
                    <li><a>Shelf Life Guidelines</a></li>
                    <li><a>Price Finder</a></li>
                    <li><a>Timer</a></li>
                    <li><a>Etc</a></li>
                    </ul>
                </details>
            </li>
            </ul>
        </div>
        <div className="navbar-end"></div>
        </div>
    );
}
