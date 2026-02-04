"use client";

import { useState } from "react";
import { useLang } from "@/app/components/languageprovider";
import { MEASUREMENT_STRINGS } from "./measurementStrings"; // adjust path if needed

export { conversionsToOz, formatMeasurement };

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

// Fractional representations for formatting
const fractions = [
  { value: 1 / 8, label: "⅛" },
  { value: 1 / 6, label: "⅙" },
  { value: 1 / 4, label: "¼" },
  { value: 1 / 3, label: "⅓" },
  { value: 1 / 2, label: "½" },
  { value: 2 / 3, label: "⅔" },
  { value: 3 / 4, label: "¾" },
];

// Format measurement into fractional representation
function formatMeasurement(value: number, unit: string) {
  const wholeNumber = Math.floor(value);
  const remainder = value - wholeNumber;

  if (unit === "oz") return remainder === 0 ? value.toFixed(0) : value.toFixed(2);

  let best: { label: string; value: number } | null = null;
  for (const frac of fractions) {
    if (!best || Math.abs(remainder - frac.value) < Math.abs(remainder - best.value)) {
      best = frac;
    }
  }

  const fractionLabel = remainder > 0.05 && best?.label ? best.label : "";

  if (remainder >= 0.9) return `${wholeNumber + 1}`;
  if (fractionLabel) return wholeNumber ? `${wholeNumber} ${fractionLabel}` : fractionLabel;
  if (remainder === 0) return `${wholeNumber}`;
  return value.toFixed(2);
}

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
              <span>{formatMeasurement(valueInOz / oz, key)}</span>
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
