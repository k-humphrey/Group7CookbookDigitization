//app/admin-panel/page.tsx
//Page for admin to view, edit, add, and delete recipes once logged in via the admin portal  

import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import { cookies } from "next/headers";
import InfoCard from "../components/infocard";

export default async function AdminPanelPage() {
	const cookieStore = await cookies(); 

	await connectToDB(cookieStore);

	const recipes = await Recipe.find().lean();
	const safeRecipes = JSON.parse(JSON.stringify(recipes));

  return (
    <main className="min-h-screen w-full flex flex-col items-center py-12">
      <h1 className="text-2xl font-bold mb-6 ml-6">
        Admin Panel
      </h1>

      <div className="w-full max-w-6xl mx-auto">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6">
          	{safeRecipes.map((recipe: any) => (
				<InfoCard
				key={recipe._id}
				title={recipe.title.en}
				description=""
				href="#"
				imageSrc={recipe.imageURI}
				action = {
					<button className="btn btn-primary btn-sm">
						Edit
					</button>
				}
				/>
		    ))}
        </div>
      </div>
    </main>
  );
}