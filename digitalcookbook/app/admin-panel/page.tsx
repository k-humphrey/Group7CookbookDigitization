//app/admin-panel/page.tsx

import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import InfoCard from "../components/infocard";

export default async function AdminPanelPage() {
    await connectToDB();

    const recipes = await Recipe.find().lean();
    const safeRecipes = JSON.parse(JSON.stringify(recipes));

    return (
      	<div>
      	<h1 className="text-2xl font-bold mb-2 ml-6">Admin Panel</h1>
      	<div className="grid grid-cols-3 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
			{safeRecipes.map((recipe: any) => (
                <div key={recipe._id} className="card bg-base-100 shadow-md">
                <figure className="h-48 overflow-hidden">
					<img
					src={recipe.imageURI}
					alt={recipe.title.en}
					className="w-full h-full object-cover"
					/>
				</figure>

				<div className="flex justify-center">
					<InfoCard
					title={recipe.title.en}
					description=""
					href=""
					/>
					<button className="btn btn-primary btn-sm">Edit</button>
				
				</div>
				</div>
            ))
		}
      	</div>
      	</div>
    );
=======
//Page for admin to view, edit, add, and delete recipes once logged in via the admin portal  

import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import { cookies } from "next/headers";
import AdminPanelClient from "../components/adminPanelClient";
import { isAdminAuthenticated } from "@/lib/checkAdminAuth";
import AdminLoginPage from "../admin-login/page";

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
     <main className="min-h-screen w-full flex flex-col items-center py-12">
      	<h1 className="text-2xl font-bold mb-6 ml-6">Admin Panel</h1>
			<div className="w-full max-w-6xl mx-auto">
        		<AdminPanelClient recipes={safeRecipes} />
        	</div>
    </main>
  );
>>>>>>> 01fabd6114f7b26c70e471ce6b649f744cc1813a
}
