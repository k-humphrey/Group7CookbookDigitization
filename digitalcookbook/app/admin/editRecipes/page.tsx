//app/admin/editRecipes/page.tsx
//Page for admin to view, edit, add, and delete recipes once logged in via the admin portal

import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import { cookies } from "next/headers";
import AdminPanelClient from "../../components/adminPanelClient";
import { isAdminAuthenticated } from "@/lib/checkAdminAuth";
import AdminLoginPage from "../../admin-login/page";
import AdminNavBar from "../../components/adminNavBar";

export default async function AdminPanelPage() {
    //get cookies
    const cookieStore = await cookies(); 

    //check authentication
    if (!isAdminAuthenticated(cookieStore)) {
            //return login page back
            return <AdminLoginPage />
    }

    //if authenticated connect to db
    await connectToDB();
    //get all recipes
    const recipes = await Recipe.find().lean();
    const safeRecipes = JSON.parse(JSON.stringify(recipes));
    //return the recipe view
  return (
    <main>
        <AdminNavBar/>
        <div className="w-full max-w-6xl mx-auto">
            <AdminPanelClient recipes={safeRecipes} />
        </div>
    </main>
  );
}