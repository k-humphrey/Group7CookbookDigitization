//app/components/adminNavBar.tsx

"use client";

import Link from "next/link";

export default function AdminNavBar(){
    return (
        <header className="">
            <nav>
                <summary>Edit/Add Website Data</summary>
                <Link
                    href="/app/admin/EditResources"
                    className="hover:underline" >
                    Edit/Add Community Resources
                </Link>
                <Link 
                    href="/app/admin/EditPartners"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="hover:underline" >
                    Edit/Add Community Partners
                </Link>
                <Link 
                    href="/app/admin/EditAdvertisements"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline" >
                    Edit/Add Advertisements
                </Link>
                <Link 
                    href="/app/admin/EditRecipes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline" >
                    Edit/Add Recipes
                </Link>
                <Link
                    href="/app/admin/Logout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline" >
                    Logout
                </Link>
            </nav>
        </header>
    )
}