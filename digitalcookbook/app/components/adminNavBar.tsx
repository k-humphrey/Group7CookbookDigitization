//app/components/adminNavBar.tsx

"use client";

import Link from "next/link";

export default function AdminNavBar(){
    return (
        <header className="">
            <nav>
                <summary>Edit/Add Website Data</summary>
                <Link
                    href="/admin/editResources"
                    className="hover:underline" >
                    Edit/Add Community Resources
                </Link>

                <Link 
                    href="/admin/editPartners"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="hover:underline" >
                    Edit/Add Community Partners
                </Link>

                <Link 
                    href="/admin/editAdvertisements"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline" >
                    Edit/Add Advertisements
                </Link>

                <Link 
                    href="/admin/editRecipes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline" >
                    Edit/Add Recipes
                </Link>

                <Link
                    href="/admin/logout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline" >
                    Logout
                </Link>

            </nav>
        </header>
    )
}