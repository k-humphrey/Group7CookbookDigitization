"use client";

import { useState } from "react";

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
  { value: 1/8, label: "⅛" },
  { value: 1/6, label: "⅙" },
  { value: 1/4, label: "¼" },
  { value: 1/3, label: "⅓" },
  { value: 1/2, label: "½" },
  { value: 2/3, label: "⅔" },
  { value: 3/4, label: "¾" },
];

// Format measurement into fractional representation
function formatMeasurement(value: number, unit: string) {
  const fractionSet = fractions;
  const wholeNumber = Math.floor(value);

  // Formating for ounces, makes it 0 decimal places if whole number, else 2 decimal places
  if (unit == "oz") 
    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);

  // Find closest fraction representation to decimal part
  let best: { label: string; value: number } | null = null;
  for (const frac of fractionSet) {
    if (!best || Math.abs((value - wholeNumber) - frac.value) < Math.abs((value - wholeNumber) - best.value)) { // closer fraction found, save it in best
      best = frac;
    }
  }

  // Assign fraction label if decimal part is significant
  let fractionLabel = value % 1 > 0.025 && best?.label ? best.label : "";

  // Construct final string
  if (fractionLabel) // whole number with fraction or just fraction
    return wholeNumber ? `${wholeNumber} ${fractionLabel}` : fractionLabel;
  else if (value - wholeNumber < 0.2) // whole number only, without fraction if fraction is negligible
    return `${wholeNumber}`;
  
  return value.toFixed(2); // fallback to decimal representation

}

export default function MeasurementConverter() {
  // State for input value and unit
  const [value, setValue] = useState(1);
  const [unit, setUnit] = useState<Unit>("cup");

  // Convert input value to ounces
  const valueInOz = value * conversionsToOz[unit];

  // Render conversion results
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4 text-orange-500">
        Measurement Converter
      </h2>

      {/* Input */}
      <div className="flex gap-4 mb-6">
        <input
          type="number"
          min={0}
          value={value || ""}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-1/2 p-2 border rounded text-center"
          placeholder="0"
        />

        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as Unit)}
          className="w-1/2 p-2 border rounded"
        >
          <option value="gallon">Gallon</option>
          <option value="quart">Quart</option>
          <option value="pint">Pint</option>
          <option value="cup">Cup</option>
          <option value="oz">Ounce</option>
          <option value="tbsp">Tablespoon</option>
          <option value="tsp">Teaspoon</option>
        </select>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-2 text-m mb-6">
        {Object.entries(conversionsToOz).map(([key, oz]) => (
          <div key={key} className="flex justify-between border-b pb-1">
            <span className="capitalize">{key}</span>
            <span>{(formatMeasurement(valueInOz / oz, key))}</span>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-semibold mb-2 text-orange-500">Notes</p>
        <ul className="space-y-1">
          <li><strong>TBSP</strong> = TABLESPOON = <strong>T</strong></li>
          <li><strong>TSP</strong> = TEASPOON = <strong>t</strong></li>
          <li><strong>1.5 CUPS</strong> = TWO <strong>2/3</strong> CUPS</li>
        </ul>
      </div>
    </div>
  );
}
