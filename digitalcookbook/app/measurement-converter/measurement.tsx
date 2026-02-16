"use client";

import { useState } from "react";
import { useLang } from "@/app/components/languageprovider";
import { MEASUREMENT_STRINGS } from "./measurementStrings";

// export conversion factor and format function 
export { conversionsToOz, formatMeasurement };

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

// Fractional representations
const fractions = [
  { value: 1 / 8, label: "⅛" },
  { value: 1 / 6, label: "⅙" },
  { value: 1 / 4, label: "¼" },
  { value: 1 / 3, label: "⅓" },
  { value: 1 / 2, label: "½" },
  { value: 2 / 3, label: "⅔" },
  { value: 3 / 4, label: "¾" },
];

// Format measurement into fractions
function formatMeasurement(value: number, unit: Unit) {
  const whole = Math.floor(value);
  const remainder = value - whole;
  // Ounces are shown as decimals
  if (unit === "oz") {
    return remainder === 0 ? value.toFixed(0) : value.toFixed(2);
  }

  let best: { label: string; value: number } | null = null;
  //finds closest fraction to decimal remainder
  for (const f of fractions) {
    if (!best || Math.abs(remainder - f.value) < Math.abs(remainder - best.value)) {
      best = f;
    }
  }

  const fraction = remainder > 0.05 && best?.label ? best.label : "";

  if (remainder >= 0.9) return `${whole + 1}`;
  if (fraction) return whole ? `${whole} ${fraction}` : fraction;
  if (remainder === 0) return `${whole}`;
  return value.toFixed(2);
}

export default function Measurement() {
  //Language setup 
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
            <div
              key={key}
              className={`
                flex justify-between items-center
                px-3 py-2 rounded-xl border-2
                transition-all duration-200 ease-out
                ${
                  isActive
                    ? "bg-orange-200 border-orange-400 shadow-lg scale-105"
                    : "bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-300 hover:shadow-md hover:-translate-y-1 hover:scale-105"
                }
              `}
            >
              <span className="font-medium">
                {t.units[key]}
              </span>
              <span className="font-bold text-orange-500">
                {formatMeasurement(valueInOz / oz, key)}
              </span>
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
