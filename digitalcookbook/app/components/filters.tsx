"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/app/components/languageprovider";

type IDGroup = { name: string; id: number };
type TagIDGroup = { healthTags: IDGroup[]; allergenTags: IDGroup[] };

// Props for parent callback
interface Props {
  onChange: (filters: {
    appliances: string[];
    tags: { healthTags: string[]; allergenTags: string[] };
    maxCost: number;
  }) => void;
}

const STRINGS = {
  en: {
    filters: "Filters",
    appliances: "Kitchen Appliances",
    health: "Health",
    allergies: "Allergies",
    cost: "Cost",
    collapse: "Collapse filters",
    expand: "Expand filters",
    maxCostLabel: "Max cost",
  },
  es: {
    filters: "Filtros",
    appliances: "Electrodomésticos",
    health: "Salud",
    allergies: "Alergias",
    cost: "Costo",
    collapse: "Colapsar filtros",
    expand: "Expandir filtros",
    maxCostLabel: "Costo máximo",
  },
} as const;

export default function Filters({ onChange }: Props) {
  // Language settings
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const t = STRINGS[lang];

  // State for filter options (id, number) and filter toggles
  const [filterOptions, setFilterOptions] = useState<{appliances: IDGroup[]; tags: TagIDGroup;}>({ appliances: [], tags: { healthTags: [], allergenTags: [] } });
  const [isOpen, setIsOpen] = useState(true);
  
  // States for maxCost slider
  const [maxCost, setMaxCost] = useState(10);
  const [sliderMax, setSliderMax] = useState(0);
  
  // State for selected filters (id for toggle between languages)
  const [selected, setSelected] = useState(() => {
    const sessionFilterIds: {appliances?: number[]; tags?: {healthTags: number[]; allergenTags: number[] }} = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("recipeFilterIds") || "{}") : {};
    return {appliances: sessionFilterIds.appliances || [], tags: sessionFilterIds.tags || { healthTags: [], allergenTags: []}};
  });

  // Gets all filter options
  useEffect(() => {
    fetch(`/api/filters?lang=${lang}`)
    .then(response => response.json())
    .then(filterInfo => { // set filter options for UI
      // Set filter options for appliances and tags
      setFilterOptions({
        appliances: filterInfo.appliances || [],
        tags : { healthTags: filterInfo.tags || [], allergenTags: filterInfo.allergens || []}
      });
      
    }).catch(error => console.warn(`Failed to fetch Filters API: ${error}`)); // catch fetch errors

  }, [lang]);

  // Save selected filter IDs and maxCost to sessionStorage whenever selected or maxCost changes
  useEffect(() => {
    sessionStorage.setItem("recipeFilterIds", JSON.stringify(selected));
  }, [selected]);

  //Gets max cost for slider
  useEffect(() => {
  fetch("/api/recipes/maxCost")
    .then(response => response.json())
    .then(data => {
      data.maxCost = Math.ceil(data.maxCost); // round to nearest full number
      setSliderMax(data.maxCost);

      const sessionMaxCost = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("recipeMaxCost") || "null") : null;
      setMaxCost(sessionMaxCost ?? data.maxCost); //start slider at max cost or max cost from session storage

    }).catch(error => console.warn(`Failed to fetch maxCost API: ${error}`)); // catch fetch errors

  }, []);


  // Toggle filter selection
  const toggle = (category: "appliances" | "healthTags" | "allergenTags", tagID: number) => {
    let newSelected;

    if(category == "appliances") {  // toggle appliances
      if (selected.appliances.includes(tagID))
        newSelected = {...selected, appliances: selected.appliances.filter((item) => item !== tagID)};
      else
        newSelected = {...selected, appliances: selected.appliances.concat(tagID)};

    } else {  // toggle tags
      if (selected.tags[category].includes(tagID))
        newSelected = {...selected, tags: {...selected.tags, [category]: selected.tags[category].filter((item) => item !== tagID)}};
      else
        newSelected = {...selected, tags: {...selected.tags, [category]: selected.tags[category].concat(tagID)}};

    }

    // update UI
    setSelected(newSelected); 

    // update recipes, send parent only names
    onChange({
      appliances: newSelected.appliances.map(id => filterOptions.appliances.find(appliance => appliance.id == id)?.name ?? ""),
      tags: {
        healthTags: newSelected.tags.healthTags.map(id => filterOptions.tags.healthTags.find(tag => tag.id == id)?.name ?? ""),
        allergenTags: newSelected.tags.allergenTags.map(id => filterOptions.tags.allergenTags.find(tag => tag.id == id)?.name ?? "")
      },
      maxCost
    }); 
  };
  
  return (
    <aside
    className={[
      "bg-gray-200 border border-base-300 rounded-xl",
      "transition-all duration-300",
      isOpen ? "w-40 sm:w-55" : "w-10", // open vs collapsed width
      "h-full shrink-0 relative",
    ].join(" ")}
  >
    {/* Filters */}
    <div className={isOpen ? "flex flex-row items-center justify-between p-4 font-semibold" : "opacity-0"}>
      <h2>{t.filters}</h2>
    </div>
    {/* Arrow sliver */}
    <button type="button" onClick={() => setIsOpen(!isOpen)}
      className={[
        "absolute top-3 right-2",
        "btn btn-ghost btn-xs",
        "p-0 w-6 h-6 min-h-0",
      ].join(" ")}
      aria-label={isOpen ? t.collapse : t.expand}
      aria-expanded={isOpen}
    >
      <span className={isOpen ? "inline-block" : "inline-block rotate-180"}>
        ❮
      </span>
    </button>
    {/* Content */}
    <div aria-hidden={!isOpen} className={isOpen ? "p-4 -mt-2 text-sm ml-1" : "p-4 text-sm ml-1 opacity-0 pointer-events-none"}>
          <div className="flex flex-col gap-2">
            {/* Filter 1: Kitchen Appliances */}
            <div>
              <h3 className="font-semibold text-xs uppercase mb-2">{t.appliances}</h3>
              <div className="flex flex-col gap-1">
                {filterOptions.appliances.map(appliance => (
                <label key={appliance.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`appliance-${appliance.id}`}
                  className="checkbox checkbox-xs"
                  checked={selected.appliances.includes(appliance.id)}
                  onChange={() => toggle("appliances", appliance.id)}
                />
                <span>{appliance.name}</span>
                </label>
                ))}
              </div>
            </div>

            {/* Filter 2: Blue Ribbon */}
            <div>
              <h3 className="font-semibold text-xs uppercase my-2">{t.health}</h3>
              <div className="flex flex-col gap-1">
                {filterOptions.tags.healthTags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`healthTag-${tag.id}`}
                  className="checkbox checkbox-xs"
                  checked={selected.tags.healthTags.includes(tag.id)}
                  onChange={() => toggle("healthTags", tag.id)}
                />
                <span>{tag.name}</span>
                </label>
                ))}
              </div>
            </div>

            {/* Filter 3: Allergies */}
            <div>
              <h3 className="font-semibold text-xs uppercase my-2">{t.allergies}</h3>
              <div className="flex flex-col gap-1">
                {filterOptions.tags.allergenTags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`allergenTag-${tag.id}`}
                  className="checkbox checkbox-xs"
                  checked={selected.tags.allergenTags.includes(tag.id)}
                  onChange={() => toggle("allergenTags", tag.id)}
                />
                <span>{tag.name}</span>
                </label>
                ))}
              </div>
            </div>

            {/* Filter 4: Cost */}
            <div>
              <h3 className="font-semibold text-xs uppercase my-2">{t.cost}</h3>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-2">
                  <input 
                    type="range"
                    id="maxCost"
                    aria-label={t.maxCostLabel}
                    min={0} max={sliderMax}
                    value={maxCost}
                    className="range range-xs"
                    onChange={(e) => {
                      setMaxCost(+e.target.value);
                      sessionStorage.setItem("recipeMaxCost", JSON.stringify(+e.target.value));
                  }}
                  onPointerUp={() => {
                     onChange({
                      maxCost,
                      appliances: selected.appliances.map(id =>
                        filterOptions.appliances.find(a => a.id === id)?.name ?? ""
                      ),
                      tags: {
                        healthTags: selected.tags.healthTags.map(id =>
                          filterOptions.tags.healthTags.find(t => t.id === id)?.name ?? ""
                        ),
                        allergenTags: selected.tags.allergenTags.map(id =>
                          filterOptions.tags.allergenTags.find(t => t.id === id)?.name ?? ""
                        ),
                      }
                    });
                  }}
                  />
                  <p>Max: ${maxCost ?? sliderMax}</p>
                </label>
              </div>
            </div>
          </div>
        </div>
      </aside>
  );
}