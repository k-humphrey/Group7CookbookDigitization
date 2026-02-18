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
}