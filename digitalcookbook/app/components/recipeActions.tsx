"use client";

import { useState } from "react";
import { useLang } from "./languageprovider";
import PrintButton from "./printbutton";

interface Props {
  recipe: any;
  servings: number;
}

export default function RecipeActions({ recipe, servings }: Props) {
  const [toastMessage, setToastMessage] = useState("");
  const langContext = useLang();
  const lang = langContext?.lang ?? "en";

  // Toast helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2000);
  };

  return (
    <div className="flex gap-2 print:hidden">
      {/* Save Recipe */}
      <button
        className="btn btn-sm btn-primary h-10"
        onClick={() => {
          const saved = localStorage.getItem("savedRecipe");
          const list = saved ? JSON.parse(saved) : [];

          if (!list.find((item: any) => item._id === recipe._id)) {
            list.push({
              _id: recipe._id,
              title: recipe.title?.[lang],
              imageURI: recipe.imageURI,
            });

            localStorage.setItem("savedRecipe", JSON.stringify(list));

            showToast(
              `${recipe.title?.[lang]} ${
                lang === "es" ? "guardada" : "added to Saved Recipes"
              }`
            );
          }
        }}
      >
        {lang === "es" ? "Guardar" : "Save"}
      </button>

      {/* Add to Shopping */}
      <button
        className="btn btn-sm btn-secondary h-10"
        onClick={() => {
          const saved = localStorage.getItem("shoppingList");
          const list = saved ? JSON.parse(saved) : [];

          if (!list.find((item: any) => item.recipe._id === recipe._id)) {
            list.push({
              recipe: recipe,
              servings: servings || 4,
            });

            localStorage.setItem("shoppingList", JSON.stringify(list));

            showToast(
              `${recipe.title?.[lang]} ${
                lang === "es"
                  ? "agregada a compras"
                  : "added to Shopping List"
              }`
            );
          }
        }}
      >
        {lang === "es" ? "Agregar a compras" : "Add to Shopping"}
      </button>

      {/* Print Recipe */}
      <PrintButton
        className="h-10"
        label={lang === "es" ? "Imprimir Receta" : "Print Recipe"}
      />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-400 text-black px-4 py-2 rounded shadow-md">
          {toastMessage}
        </div>
      )}
    </div>
  );
}