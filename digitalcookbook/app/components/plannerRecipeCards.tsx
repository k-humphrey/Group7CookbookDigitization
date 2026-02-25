import { Recipe, SelectedRecipe } from "@/app/meal-planner/page";
import { useLang } from "@/app/components/languageprovider";
import { PLANNER_STRINGS } from "@/app/meal-planner/plannerStrings";

// Props needed to render planner recipe cards
interface Props {
    recipe: Recipe;
    selected: SelectedRecipe | undefined;
    toggleRecipe: (recipe: Recipe) => void;
    updateServings: (recipeID: string, servings: number) => void;
}

const focusClasses = "focus:outline-none focus-visible:ring-3 focus-visible:ring-offset-2   focus-visible:ring-neutral focus-visible:rounded-md hover:shadow-lx"

export default function PlannerRecipeCards({ recipe, selected, toggleRecipe, updateServings}: Props) {
    // Lang settings
    const langContext = useLang();
    const lang = langContext?.lang ?? "en";
    const t = PLANNER_STRINGS[lang];

    return (
        <div key={recipe._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow flex flex-col">

            {/* Image */}
            <figure className="h-40 overflow-hidden">
                {recipe.imageURI ? (
                    <img
                        src={recipe.imageURI}
                        alt={recipe.title?.[lang]}
                        className="w-full h-full object-cover"
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
                <button className={`btn ${selected ? "btn-error" : "btn-success"} ${focusClasses}`} onClick={() => toggleRecipe(recipe)}>
                    {selected ? t.remove : t.addToPlan}
                </button>

                {/* Serving input */}
                {selected && (
                    <div className="flex items-center gap-1 mt-2">
                        <span>{t.servings}:</span>
                        <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            value={selected.servings}
                            onChange={(e) => updateServings(recipe._id, Number(e.target.value))}
                            className="input input-bordered w-full md:w-20"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}