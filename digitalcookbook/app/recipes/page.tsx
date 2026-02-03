// app/recipes/page.tsx
  import { Suspense } from "react";
  import RecipeSearchPage from "./RecipeSearchPage";

  export const dynamic = "force-dynamic";

  export default function RecipesPage() {
    return (
      <Suspense fallback={<div>Loading recipes...</div>}>
        <RecipeSearchPage />
      </Suspense>
  );
}
