"use client";

import { useState } from "react";
import { useLang } from "@/app/components/languageprovider";
import { decimalToFraction } from "@/lib/fractionConverter";
import { MEASUREMENT_STRINGS } from "./measurementStrings"; // adjust path if needed

export { conversionsToOz };

// Unit type
type Unit =
  | "gallon"
  | "quart"
  | "pint"
  | "cup"
  | "oz"
  | "tbsp"
  | "tsp";

// Conversion factors to ounces. Stores ounces in each unit
const conversionsToOz: Record<Unit, number> = {
  gallon: 128,
  quart: 32,
  pint: 16,
  cup: 8,
  oz: 1,
  tbsp: 0.5,
  tsp: 1 / 6,
};

export default function MeasurementConverter() {
  const langContext = useLang();
  const lang = langContext?.lang ?? "en";
  const t = MEASUREMENT_STRINGS[lang];

  //Stores value and select unit
  const [value, setValue] = useState<number>(1);
  const [unit, setUnit] = useState<Unit>("cup");
  //convert to ounces
  const valueInOz = value * conversionsToOz[unit];

  return (
    <div className="bg-white border-4 border-blue-900 rounded-[32px] shadow-2xl p-6 w-[360px]">
      {/* Title */}
      <h2 className="text-2xl font-extrabold text-center mb-5 text-red-500">
        {t.title}
      </h2>

      {/* Input */}
      <div className="flex gap-4 mb-6">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          value={value || ""}
          placeholder={t.placeholder}
          onChange={(e) => setValue(Number(e.target.value))}
          className="
            w-1/2 p-3 text-lg text-center
            border-4 border-orange-200 rounded-2xl
            focus:outline-none focus:border-orange-400
            focus:ring-2 focus:ring-orange-200
          "
        />
        {/*Unit Dropdown */}
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as Unit)}
          className="
            w-1/2 p-3
            border-4 border-orange-200 rounded-2xl
            focus:outline-none focus:border-orange-400
          "
        >
          {(Object.keys(conversionsToOz) as Unit[]).map((u) => (
            <option key={u} value={u}>
              {t.units[u]}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
        {/*Loops through all units and convert */}
        {(Object.entries(conversionsToOz) as [Unit, number][]).map(([key, oz]) => {
          {/*Highlight the selected unit */}
          const isActive = key === unit;

          return (
            <div key={key} className="flex justify-between border-b pb-1">
              <span className="capitalize">{t.units[key]}</span>
              <span>{decimalToFraction(valueInOz / oz, key)}</span>
            </div>
          );
        })}
      </div>

      {/* Cooking notes */}
      <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 text-sm text-gray-700">
        <p className="font-bold mb-2 text-orange-500">
          {t.notesTitle}
        </p>
        <ul className="space-y-1">
          {t.notes.map((n, i) => (
            <li key={i}>
              <strong>{n.leftStrong}</strong>
              {n.text}
              <strong>{n.rightStrong}</strong>
              {"tail" in n ? n.tail : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
