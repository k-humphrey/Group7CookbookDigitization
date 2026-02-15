import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";

export default async function AdminPanelPage() {
  await connectToDB();

  const recipes = await Recipe.find().lean();
  const safeRecipes = JSON.parse(JSON.stringify(recipes));

  return (
    <div>
    <h1 className="text-2xl font-bold mb-2 ml-6">Admin Panel</h1>
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6">

          {safeRecipes.map((recipe) => (
                <div key={recipe._id} className="card bg-base-100 shadow-md">
                <figure className="h-48 overflow-hidden">
                    <img
                    src={recipe.imageURI}
                    alt={recipe.title.en}
                    className="w-full h-full object-cover"
                    />
                </figure>

                <div className="card-body">
                    <h2 className="card-title">{recipe.title.en}</h2>


                    <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">Edit</button>
                    </div>
                </div>
                </div>
            ))}

    </div>
    </div>
  );
}