"use client";

import { useState } from "react";

// keep track of selected fitlers
interface Props {
  onChange: (filters: { appliances: string[]; tags: {healthTags: string[], allergenTags: string[]} }) => void; // callback to parent
}

export default function Filters({ onChange }: Props) {
  const [selected, setSelected] = useState({ appliances: [] as string[], tags: {healthTags: [] as string[], allergenTags: [] as string[]}});

  const toggle = (category: "appliances" | "healthTags" | "allergenTags", newTag: string) => {
    let newSelected;

    if(category == "appliances") {  // toggle appliances
      if (selected.appliances.includes(newTag))
        newSelected = {...selected, appliances: selected.appliances.filter((item) => item !== newTag)};
      else
        newSelected = {...selected, appliances: selected.appliances.concat(newTag)};

    } else {  // toggle tags
      if (selected.tags[category].includes(newTag))
        newSelected = {...selected, tags: {...selected.tags, [category]: selected.tags[category].filter((item) => item !== newTag)}};
      else
        newSelected = {...selected, tags: {...selected.tags, [category]: selected.tags[category].concat(newTag)}};

    }

    setSelected(newSelected); // update UI
    onChange(newSelected); // update recipes
  };

  const [isOpen, setIsOpen] = useState(true);
  
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
          Filters
        </div>
        <div className="collapse-content text-sm ml-2">
          <div className="h-200">
            {/* Filter 1: Kitchen Appliances */}
            <div>
              <h3 className="font-semibold text-xs uppercase mb-2">Kitchen Appliances</h3>
              <div className="flex flex-col gap-1">
                {["Oven", "Stockpot and Skillet", "Slow Cooker", "Microwave", "Stockpot/Dutch Oven", "Skillet/Frying Pan", "Saucepan with Lid"].map(appliance => (
                <label key={appliance} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  checked={selected.appliances.includes(appliance)}
                  onChange={() => toggle("appliances", appliance)}
                />
                <span>{appliance}</span>
                </label>
                ))}
              </div>
            </div>

            {/* Filter 2: Blue Ribbon */}
            <div>
              <h3 className="font-semibold text-xs uppercase my-2">Health</h3>
              <div className="flex flex-col gap-1">
                {["blueRibbon", "vegan", "vegetarian"].map(tag => (
                <label key={tag} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  checked={selected.tags.healthTags.includes(tag)}
                  onChange={() => toggle("healthTags", tag)}
                />
                <span>{tag}</span>
                </label>
                ))}
              </div>
            </div>

            {/* Filter 3: Allergies */}
            <div>
              <h3 className="font-semibold text-xs uppercase my-2">Allergies</h3>
              <div className="flex flex-col gap-1">
                {["dairy", "egg", "fish", "peanuts", "soy", "treeNuts", "wheat"].map(tag => (
                <label key={tag} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  checked={selected.tags.allergenTags.includes(tag)}
                  onChange={() => toggle("allergenTags", tag)}
                />
                <span>{tag}</span>
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