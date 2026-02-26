//app/admin-panel/page.tsx
//Page for admin to view, edit, add, and delete recipes once logged in via the admin portal  

import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import { cookies } from "next/headers";
import AdminPanelClient from "../components/adminPanelClient";

export default async function AdminPanelPage() {
	const cookieStore = await cookies(); 

	await connectToDB();

	const recipes = await Recipe.find().lean();
	const safeRecipes = JSON.parse(JSON.stringify(recipes));

  return (
     <main className="min-h-screen w-full flex flex-col items-center py-12">
      	<h1 className="text-2xl font-bold mb-6 ml-6">Admin Panel</h1>
			<div className="w-full max-w-6xl mx-auto">
        		<AdminPanelClient recipes={safeRecipes} />
        	</div>
    </main>
  );
}