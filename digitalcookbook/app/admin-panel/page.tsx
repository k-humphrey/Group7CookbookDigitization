//app/admin-panel/page.tsx
//Page for admin to view, edit, add, and delete recipes once logged in via the admin portal  

import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import FeaturedRecipes from "@/models/FeaturedRecipes";
import { cookies } from "next/headers";
import AdminPanelClient from "../components/adminPanelClient";
import FeaturedRecipeSelector from "../components/featuredRecipeSelector";
import { isAdminAuthenticated } from "@/lib/checkAdminAuth";
import AdminLoginPage from "../admin-login/page";
import SponsorsSelector from "../components/sponsorsSelector";

export default async function AdminPanelPage() {
	//get cookies
	const cookieStore = await cookies(); 

	//check authentication
	if (!(await isAdminAuthenticated(cookieStore))) {
			//return login page back
			return <AdminLoginPage />
	}

	//if authenticated connect to db
	await connectToDB();

	//get all recipes
	const recipes = await Recipe.find().lean();
	const safeRecipes = JSON.parse(JSON.stringify(recipes));

	// get featured ids
	const featuredIds = JSON.parse(JSON.stringify((await FeaturedRecipes.findOne<{ recipeIds: string[] }>({}).lean())?.recipeIds || []));

	//return the recipe view
  	return (
		<section className="min-h-screen w-full flex flex-col items-center py-12">
			<h1 className="text-2xl font-bold mb-6 ml-6">Admin Panel</h1>
				<div className="w-full max-w-6xl mx-auto">
					<AdminPanelClient recipes={safeRecipes} />
					<FeaturedRecipeSelector recipes={safeRecipes} featuredIds={featuredIds} />
					<SponsorsSelector />
				</div>
		</section>
  	);
}
