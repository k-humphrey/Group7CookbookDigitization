//app/components/singlerecipeui.tsx
type Recipe = {
  title?: { en?: string; es?: string };
  imageURI?: string;
  tags?: {
    blueRibbon?: boolean;
    vegan?: boolean;
    vegetarian?: boolean;
  };
  ingredients?: Array<{
    ingredient?: {
      name?: { en?: string; es?: string };
    };
    amount?: number;
    unit?: string;
  }>;
  ingredientPlainText?: { en?: string; es?: string };
};

export default function SingleRecipeUI({ recipe }: { recipe: Recipe }) {
  const title = recipe?.title?.en ?? "Recipe";
  
  return (
    <main className="min-h-screen bg-base-100">
      <div className="mx-auto max-w-3xl px-6 pt-6">
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
          <div className="px-6 pt-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-lg font-bold">{title}</h1>

              <div className="flex gap-2">
                {recipe?.tags?.blueRibbon && (
                  <span className="badge badge-info">Blue Ribbon</span>
                )}
                {recipe?.tags?.vegan && (
                  <span className="badge badge-success">Vegan</span>
                )}
                {recipe?.tags?.vegetarian && (
                  <span className="badge badge-success">Vegetarian</span>
                )}
              </div>
            </div>

            <div className="mt-3 border-t border-base-300" />
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
                ) : recipe?.ingredients?.length ? (
                  recipe.ingredients.map((item: any, i: number) => (
                    <li key={i}>
                      {item.amount != null && `${item.amount} `}
                      {item.unit && `${item.unit} `}
                      {item.en ?? item.es ?? "Ingredient"}
                    </li>
                  ))
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
