"use client";

import { useState } from "react";
import { useLang } from "@/app/components/languageprovider";
import { decimalToFraction } from "@/lib/fractionConverter";
import { MEASUREMENT_STRINGS } from "./measurementStrings"; // adjust path if needed

export { conversionsToOz };

// Define measurement units
type Unit =
  | "gallon"
  | "quart"
  | "pint"
  | "cup"
  | "oz"
  | "tbsp"
  | "tsp";

// Conversion factors to ounces
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

  const [value, setValue] = useState(1);
  const [unit, setUnit] = useState<Unit>("cup");

  const valueInOz = value * conversionsToOz[unit];

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4 text-orange-500">
        {t.title}
      </h2>

      {/* Input */}
      <div className="flex gap-4 mb-6">
        <input
          type="number"
          min={0}
          value={value || ""}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-1/2 p-2 border rounded text-center"
          placeholder={t.placeholder}
        />

        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as Unit)}
          className="w-1/2 p-2 border rounded"
        >
          {(Object.keys(conversionsToOz) as Unit[]).map((u) => (
            <option key={u} value={u}>
              {t.units[u]}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-2 text-m mb-6">
        {Object.entries(conversionsToOz).map(([key, oz]) => {
          const unitKey = key as Unit;
          return (
            <div key={key} className="flex justify-between border-b pb-1">
              <span className="capitalize">{t.units[unitKey]}</span>
              <span>{decimalToFraction(valueInOz / oz, key)}</span>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-semibold mb-2 text-orange-500">{t.notesTitle}</p>
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
