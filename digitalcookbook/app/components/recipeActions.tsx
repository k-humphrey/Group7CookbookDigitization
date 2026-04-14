"use client";

import { useState, useEffect } from "react";
import { useLang } from "./languageprovider";
import PrintButton from "./printbutton";

interface Props {
  recipe: any;
  servings: number;
}

export default function RecipeActions({ recipe, servings }: Props) {
  const [toastMessage, setToastMessage] = useState("");
  // Shopping list state
  const [isAdded, setIsAdded] = useState(false);
  // Saved state
  const [isSaved, setIsSaved] = useState(false);

  const langContext = useLang();
  const lang = langContext?.lang ?? "en";

  // Show toast message for 2 seconds 
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2000);
  };

  // Sync state from localStorage on load
  useEffect(() => {
    // Shopping list sync
    const shopping = localStorage.getItem("shoppingList");
    const shoppingList = shopping ? JSON.parse(shopping) : [];
    
    //check if current recipe is in shopping list
    const inShopping = shoppingList.some((item: any) => item.recipe._id === recipe._id);
    setIsAdded(inShopping);

    // Saved list sync (bookmarks)
    const saved = localStorage.getItem("savedRecipe");
    const savedList = saved ? JSON.parse(saved) : [];
    //check if current recipe is already saved
    const inSaved = savedList.some((item: any) => item._id === recipe._id);
    setIsSaved(inSaved);
  }, [recipe._id]);

  // Adds or reemove recipe from shopping list
  const handleToggleShopping = () => {
    const saved = localStorage.getItem("shoppingList");
    const list = saved ? JSON.parse(saved) : [];
    // find recipe index in shopping list
    const index = list.findIndex((item: any) => item.recipe._id === recipe._id );

    //remove recipe from shopping list
    if (index !== -1) {
      list.splice(index, 1);
      setIsAdded(false);

      showToast(
        `${recipe.title?.[lang]} ${
          lang === "es" ? "eliminada de compras" : "removed from shopping"
        }`
      );
    } else { // add recipe to shopping list
      list.push({recipe, servings: servings || 4,});
      setIsAdded(true);
      showToast(
        `${recipe.title?.[lang]} ${
          lang === "es" ? "agregada a compras": "added to shopping"
        }`
      );
    }
    //update the list
    localStorage.setItem("shoppingList", JSON.stringify(list));
  };

  // Add or remove recipe from saved
  const handleToggleSave = () => {
    const saved = localStorage.getItem("savedRecipe");
    const list = saved ? JSON.parse(saved) : [];

    const index = list.findIndex((item: any) => item._id === recipe._id);

    // remove from list
    if (index !== -1) { 
      list.splice(index, 1);
      setIsSaved(false);

      showToast(
        `${recipe.title?.[lang]} ${
          lang === "es" ? "eliminada de guardados" : "removed from saved"
        }`
      );
    } else { // add to save list
      list.push({_id: recipe._id, title: recipe.title?.[lang], imageURI: recipe.imageURI,});
      setIsSaved(true);
      showToast(
        `${recipe.title?.[lang]} ${
          lang === "es" ? "guardada" : "saved"
        }`
      );
    }
    //update save list
    localStorage.setItem("savedRecipe", JSON.stringify(list));
  };

  return (
    <div className="flex gap-2 print:hidden">

      {/* Bookmark SAVE toggle */}
      <div className="relative group">
        <button
          type="button"
          onClick={handleToggleSave}
          aria-label={lang === "es" ? "Guardar receta" : "Save recipe"}
          className="p-2 rounded-lg h-10 flex items-center justify-center hover:bg-base-200 active:scale-95 transition cursor-pointer"
        >
          {isSaved ? (
            // Solid bookmark
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-black"
            >
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            // Outline for bookmark
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          )}
        </button>

        {/* Tooltip to appear when hover */}
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none">
          {isSaved
            ? lang === "es"
              ? "Quitar de guardados"
              : "Remove from saved"
            : lang === "es"
            ? "Guardar receta"
            : "Save recipe"}
        </span>
      </div>

      {/* Sopping toggle */}
      <div className="relative group">
        <button
          type="button"
          onClick={handleToggleShopping}
          aria-label="Toggle shopping"
          className="p-2 rounded-lg h-10 flex items-center justify-center hover:bg-base-200 active:scale-95 transition cursor-pointer"
        >
          {isAdded ? (
            // Solid cart icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-black"
            >
              <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
            </svg>
          ) : (
            // Outline cart icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          )}
        </button>

        {/* Tooltip */}
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none">
          {isAdded
            ? lang === "es"
              ? "Quitar de compras"
              : "Remove from shopping"
            : lang === "es"
            ? "Agregar a compras"
            : "Add to shopping"}
        </span>
      </div>

      {/* Print Button */}
      <PrintButton variant="icon" className="h-10" />

      {/* Toast message */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-400 text-black px-4 py-2 rounded shadow-md">
          {toastMessage}
        </div>
      )}
    </div>
  );
}