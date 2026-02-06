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
  }) => void;
}

const STRINGS = {
  en: {
    filters: "Filters",
    appliances: "Kitchen Appliances",
    health: "Health",
    allergies: "Allergies",
  },
  es: {
    filters: "Filtros",
    appliances: "Electrodomésticos",
    health: "Salud",
    allergies: "Alergias",
  },
} as const;

export default function Filters({ onChange }: Props) {
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const t = STRINGS[lang];

  // State for filter options (id, number) and selected filters (id for toggle between languages)
  const [filterOptions, setFilterOptions] = useState<{appliances: IDGroup[]; tags: TagIDGroup;}>({ appliances: [], tags: { healthTags: [], allergenTags: [] } });
  const [selected, setSelected] = useState({appliances: [] as number[], tags: { healthTags: [] as number[], allergenTags: [] as number[]}})
  const [isOpen, setIsOpen] = useState(true);

  // Gets all filter options
  useEffect(() => {
    const fetchFilters = async () => {
      const filterInfo = await fetch(`/api/filters?lang=${lang}`).then(r => r.json());

      setFilterOptions({
        appliances: filterInfo.appliances,
        tags : { healthTags: filterInfo.tags, allergenTags: filterInfo.allergens}
      });
    }

    fetchFilters();
  }, [lang]);

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
      }
    }); 
  };
  
  return (
    <section>
      {/* Filters */}
      <div
        className={`mt-6 collapse collapse-arrow bg-gray-200 border-base-300 border mx-3 ${
          isOpen ? "collapse-open" : "collapse-close"
        }`}
      >
        
        <div
        className="collapse-title font-semibold after:start-5 after:end-auto pe-4 ps-12 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        >
          {t.filters}
        </div>

        <div className="collapse-content text-sm ml-2">
          <div className="h-200">
            {/* Filter 1: Kitchen Appliances */}
            <div>
              <h3 className="font-semibold text-xs uppercase mb-2">{t.appliances}</h3>
              <div className="flex flex-col gap-1">
                {filterOptions.appliances.map(appliance => (
                <label key={appliance.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
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
                  className="checkbox checkbox-xs"
                  checked={selected.tags.allergenTags.includes(tag.id)}
                  onChange={() => toggle("allergenTags", tag.id)}
                />
                <span>{tag.name}</span>
                </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}