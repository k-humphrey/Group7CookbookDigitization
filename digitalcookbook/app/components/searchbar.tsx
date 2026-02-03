// components/searchbar.tsx
"use client";

import { useState, KeyboardEvent, ChangeEvent } from "react";
import { useLang } from "@/app/components/languageprovider";

interface Props {
  onSearch: (tags: string[]) => void; // parent callback
  initialTags ?: string[]; // initial tags
}

const STRINGS = {
  en: {
    selectedIngredients: "Selected Ingredients:",
    placeholder: "(Your selected ingredients will appear here)",
    search: "Search Recipes",
    placeholder2: "Type an ingredient and press Enter...",
  },
  es: {
    selectedIngredients: "Ingredientes seleccionados:",
    placeholder: "(Tus ingredientes seleccionados aparecerán aquí)",
    search: "Buscar recetas",
    placeholder2: "Escribe un ingrediente y presiona Enter...",
  },
};

export default function Searchbar({ onSearch, initialTags }: Props) {
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const t = STRINGS[lang];
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags || []); // store selected ingredients

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const value = input.trim();
      if (!value) return;

      // avoid duplicates
      if (!tags.includes(value)) {
        setTags((prev) => {
          const update = [...prev, value];
          onSearch(update); // update recipes on page on enter
          return update;
        });
      }

      setInput("");
    }
  };

  // Send tags to parent recipes page
  const handleSearchClick = () => {
    onSearch(tags);
  };

  const removeTag = (tag: string) => {
    setTags((prev) => {
      const update = prev.filter((t) => t !== tag);
      onSearch(update); // update recipes on page after remove
      return update;
    });
  };

  return (
    <section className="w-full flex flex-col items-center">
      
      {/* Selected Ingredients Box */}
      <div className="w-full max-w-3xl mb-2">
        <div className="rounded-3xl bg-[#DEE4D6] px-4 py-3 flex items-center gap-4">

          {/* Tag Area */}
          <div className="flex-1">
            <h2 className="text-xs font-semibold uppercase text-slate-950">{t.selectedIngredients}</h2>
            <div className="mt-2 flex flex-wrap gap-2 text-slate-950">
              {tags.length === 0 ? (
                <span className="text-xs opacity-70">{t.placeholder}</span>
              ) : (
                tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-outline gap-1 px-3 py-2 text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-1 text-[10px]"
                      onClick={() => removeTag(tag)}
                    >
                      ✕
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Search Button */}
          <button className="btn btn-warning btn-sm md:btn-md shrink-0 text-slate-950" onClick={handleSearchClick}>{t.search}</button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-3xl">
        <label className="input input-bordered rounded-full w-full flex items-center gap-3 h-12 px-6 bg-[#DEE4D6]">
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
            type="text"
            className="grow placeholder:text-slate-950 bg-transparent outline-none"
            placeholder={t.placeholder2}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </label>
      </div>
    </section>
  );
}
