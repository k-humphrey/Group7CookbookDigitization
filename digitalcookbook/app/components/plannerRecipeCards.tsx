import { Recipe, SelectedRecipe } from "@/app/meal-planner/page";
import { useLang } from "@/app/components/languageprovider";
import Image from "next/image";
import { PLANNER_STRINGS } from "@/app/meal-planner/plannerStrings";

// Props needed to render planner recipe cards
interface Props {
    recipe: Recipe;
    selected: SelectedRecipe | undefined;
    toggleRecipe: (recipe: Recipe) => void;
    updateServings: (recipeID: string, servings: number) => void;
}

export default function PlannerRecipeCards({ recipe, selected, toggleRecipe, updateServings}: Props) {
    // Lang settings
    const langContext = useLang();
    const lang = langContext?.lang ?? "en";
    const t = PLANNER_STRINGS[lang];

    return (
        <div key={recipe._id} className="card bg-base-100 shadow-xl">

            {/* Image */}
            <figure className="h-40 overflow-hidden relative">
                {recipe.imageURI ? (
                    <Image
                        src={recipe.imageURI.trimEnd()}
                        alt={recipe.title?.[lang]}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        No image
                    </div>
                )}
            </figure>

            <div className="card-body">

                {/* Title */}
                <h2 className="card-title text-lg">
                    {recipe.title?.[lang]}
                </h2>

                {/* Cost */}
                <p className="font-semibold">
                    {t.cost}: ${recipe.totalCost?.toFixed(2)}
                </p>

                {/* Add / Remove Button */}
                <button className={`btn ${selected ? "btn-error" : "btn-success"}`} onClick={() => toggleRecipe(recipe)}>
                    {selected ? t.remove : t.addToPlan}
                </button>

                {/* Serving input */}
                {selected && (
                    <div className="flex items-center gap-1 mt-2">
                        <span>{t.servings}:</span>
                        <input
                            type="number"
                            min={1}
                            value={selected.servings}
                            onChange={(e) => updateServings(recipe._id, Number(e.target.value))}
                            className="input input-bordered w-20"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}