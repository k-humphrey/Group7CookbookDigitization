//app/admin-panel/page.tsx
//Page for admin to view, edit, add, and delete recipes once logged in via the admin portal  

import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import FeaturedRecipes from "@/models/FeaturedRecipes";
import { cookies } from "next/headers";
import { isAdminAuthenticated } from "@/lib/checkAdminAuth";
import AdminLoginPage from "../admin-login/page";
import PartnerSelector from "../components/PartnerSelector";
import Link from "next/link";

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
				<div className="flex justify-center mx-2">
					<Link href="/admin-panel" className="block px-4 py-2 hover:bg-gray-100">Edit Recipes</Link>
					<Link href="/admin-panel-featured" className="block px-4 py-2 hover:bg-gray-100">Edit Featured Recipes</Link>
					<Link href="/admin-panel-sponsors" className="block px-4 py-2 hover:bg-gray-100">Edit Sponsors</Link>
					<Link href="/admin-panel-resources" className="block px-4 py-2 hover:bg-gray-100">Edit Resources</Link>
					<Link href="/admin-panel-partners" className="block px-4 py-2 hover:bg-gray-100">Edit Partners</Link>
				</div>
				<div className="w-full max-w-6xl mx-auto">
					<PartnerSelector />
				</div>
		
		</section>
  	);
}
