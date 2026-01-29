"use client";

import { useState } from "react";

type Unit =
  | "gallon"
  | "quart"
  | "pint"
  | "cup"
  | "oz"
  | "tbsp"
  | "tsp";

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
  const [value, setValue] = useState(1);
  const [unit, setUnit] = useState<Unit>("cup");

  const valueInOz = value * conversionsToOz[unit];

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
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-1/2 p-2 border rounded text-center"
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
      <div className="grid grid-cols-2 gap-2 text-sm mb-6">
        {Object.entries(conversionsToOz).map(([key, oz]) => (
          <div key={key} className="flex justify-between border-b pb-1">
            <span className="capitalize">{key}</span>
            <span>{(valueInOz / oz).toFixed(2)}</span>
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
