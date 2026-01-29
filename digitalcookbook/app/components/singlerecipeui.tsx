//app/components/singlerecipeui.tsx
"use client";

type Recipe = {
  title?: { en?: string; es?: string };
  ingredientPlainText?: { en?: string; es?: string };
  imageURI?: string;
  tags?: {
    blueRibbon?: boolean;
    vegan?: boolean;
    vegetarian?: boolean;
  };
  totalCost?: number;
};

export default function SingleRecipeUI({ recipe }: { recipe: Recipe }) {
  const title = recipe?.title?.en ?? "Recipe";
  return (
    <main className="min-h-screen bg-base-100">
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <div className="border border-base-300 bg-base-100">
          
          {/* Image */}
          <div className="h-48 w-full overflow-hidden bg-base-200">
            {recipe?.imageURI ? (
              <img
                src={recipe.imageURI}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-base-content/60">
                No image
              </div>
            )}
          </div>

          {/* Title + Tags */}
          <div className="p-4 sm:p-6">
            {/* Row 1: Title + Tags */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h1 className="text-lg font-bold leading-tight wrap-break-word">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                {recipe?.tags && Object.entries(recipe.tags).filter(([_, value]) => value == true).map(([tag]) => (
                  <div key={tag} className={`badge ${tag == "blueRibbon" ? "badge-info" : "badge-success"}`}>
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Time, Servings, and Cost */}
            <div className="md:flex md:flex-row items-start mt-24 md:gap-10 sm:grid">
              <div className="font-semibold">
                Prep Time:
              </div>
              <div className="font-semibold">
                Cook Time:
              </div>
              <div className="font-semibold">
                Servings:
              </div>
              <span className="font-semibold">
                Total Cost: $
                {recipe?.totalCost != null ? recipe.totalCost.toFixed(2) : "0.00"}
              </span>
            </div>
            {/* Divider */}
            <div className="mt-4 border-t border-base-900" />
          </div>

          {/* Ingredients */}
          <div className="px-6 py-6 flex justify-left">
            <section className="rounded-lg bg-[#dfe8d8] p-4">
              <h2 className="text-center text-sm font-bold tracking-wide">
                INGREDIENTS
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                {recipe?.ingredientPlainText?.en ? (
                  recipe.ingredientPlainText.en
                    .split("\n")
                    .map((line, i) => <li key={i}>{line.trim()}</li>)
                ) : (
                  <li className="text-base-content/60">No ingredients listed.</li>
                )}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
