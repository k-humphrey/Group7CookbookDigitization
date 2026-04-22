// components/searchbar.tsx
"use client";

import { useState, KeyboardEvent, ChangeEvent } from "react";
import { useLang } from "@/app/components/languageprovider";
import { useEffect } from "react";

interface Props {
  onSearch: (tags: string[]) => void; // parent callback
  initialTags ?: string[]; // initial tags
  suggestionsSource: string[]; // list of all possible ingredients for autocomplete
}

const STRINGS = {
  en: {
    selectedIngredients: "Selected Ingredients:",
    placeholder: "(Your selected ingredients will appear here)",
    search: "Search Recipes",
    placeholder2: "Type an ingredient and press Enter...",
    removetag: "Remove",
    blueRibbon: "Blue ribbon recipes are nutritionally balanced across all food groups",
  },
  es: {
    selectedIngredients: "Ingredientes seleccionados:",
    placeholder: "(Tus ingredientes seleccionados aparecerán aquí)",
    search: "Buscar recetas",
    placeholder2: "Escribe un ingrediente y presiona Enter...",
    removetag: "Eliminar",
    blueRibbon: "Las recetas de la cinta azul están equilibradas nutricionalmente en todos los grupos de alimentos",
  },
};

export default function Searchbar({ onSearch, initialTags, suggestionsSource = [] }: Props) {
  // Language context
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const t = STRINGS[lang];

  // State for dropdown
  const [open, setOpen] = useState(false);

  // State for input and selected tags
  const [input, setInput] = useState("");
  //const [tags, setTags] = useState<string[]>(initialTags || []); // store selected ingredients
  const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
    if (initialTags && initialTags.length > 0) {
      setTags(initialTags);
    }
}, [initialTags]);
  // Filter suggestions based on input and exclude already selected tags
  const filteredSuggestions = suggestionsSource
    .filter((s) => typeof s === "string")
    .map((s) => s.replace(/\(.*?\)/g, "").replace(/\s*[-–—]\s*.*/, "").trim())
    .filter((s) => s.toLowerCase().includes(input.toLowerCase()))
    .filter((s) => !tags.includes(s))
    .slice(0, 6);

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setOpen(value.length > 0);
  };

  // Handle Enter key to add tag
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const value = input.trim();
      if (!value || tags.includes(value)) return;

      // Add new tag and send to parent
      const update = [...tags, value];
      setTags(update);

      setInput("");
      setOpen(false);
    }
  };

  // Send tags to parent recipes page
  const handleSearchClick = () => {
    onSearch(tags);
  };

  const removeTag = (tag: string) => {
    // Remove tag and send to parent
    const update = tags.filter((t) => t !== tag);
    setTags(update);
    onSearch(update); // update recipes on page after remove
  };

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="w-full flex flex-col items-center">
      
      <div
        className={`w-full max-w-3xl overflow-hidden transition-all duration-300 ease-in-out
        ${tags.length > 0 ? "opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="rounded-t-3xl bg-gray-200 px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            
          {/* Tag Area */}
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase text-slate-950">{t.selectedIngredients}</p>
            <ul aria-live="polite" aria-atomic="true" className="pt-2 flex flex-wrap gap-2 text-slate-950 max-h-24 overflow-y-auto">
              {tags.map((tag, index) => {
                  const colorClasses = [
                    "badge-info",
                    "badge-warning",
                    "badge-error",
                  ];

                  const color = colorClasses[index % 3];

                  return (
                    <li key={tag} className={`badge font-semibold gap-1 px-3 py-2 text-xs ${color}`}>
                      {tag}
                      <button
                        type="button"
                        aria-label={`${t.removetag} ${tag}`}
                        className="ml-1 text-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral focus-visible:ring-offset-1 rounded"
                        onClick={() => removeTag(tag)}
                      >
                        ✕
                      </button>
                    </li>
                  );
                })
              }
            </ul>
          </div>

          {/* Search Button */}
          <button 
            className="btn btn-warning btn-sm md:btn-md shrink-0 text-slate-950 focus:outline-none focus-visible:ring-3 focus-visible:ring-neutral focus-visible:ring-offset-2" 
            type="button" 
            onClick={handleSearchClick}>{t.search}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-3xl relative">
        <p id="ingredient-help" className="sr-only">{t.placeholder2}</p>
        <label 
          htmlFor="ingredient-search" 
          className={`input input-bordered transition-all duration-100 ${
          tags.length > 0 ? "rounded-b-3xl rounded-t-none" : "rounded-full"}
          w-full flex items-center gap-3 h-12 px-6 bg-gray-200 focus-within:ring-1 focus-within:ring-neutral`}>
          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 opacity-70"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" />
          </svg>

          {/* Input */}
          <input
            id="ingredient-search"
            type="text"
            aria-label={t.search}
            className="grow placeholder:text-slate-950 bg-transparent outline-none"
            placeholder={t.placeholder2}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-describedby="ingredient-help"
          />
        </label>

        {open && filteredSuggestions.length > 0 && (
          <ul className="absolute w-full bg-white border rounded-xl mt-1 shadow-lg z-50 max-h-40 overflow-y-auto">
            {filteredSuggestions.map((s) => (
              <li
                key={s}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onMouseDown={() => {
                  const update = [...tags, s];
                  setTags(update);
                  setInput("");
                  setOpen(false);
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-900 backdrop-blur-xs px-3 rounded-full">
       {t.blueRibbon}
      </p>
    </form>
  );
}