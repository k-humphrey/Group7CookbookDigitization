export const MEASUREMENT_STRINGS = {
  en: {
    title: "Measurement Converter",
    placeholder: "0",
    notesTitle: "Notes",

    units: {
      gallon: "Gallon",
      quart: "Quart",
      pint: "Pint",
      cup: "Cup",
      oz: "Ounce",
      tbsp: "Tablespoon",
      tsp: "Teaspoon",
    },

    notes: [
      { leftStrong: "TBSP", text: " = TABLESPOON = ", rightStrong: "T" },
      { leftStrong: "TSP", text: " = TEASPOON = ", rightStrong: "t" },
      { leftStrong: "1.5 CUPS", text: " = TWO ", rightStrong: "2/3", tail: " CUPS" },
    ],
  },

  es: {
    title: "Convertidor de Medidas",
    placeholder: "0",
    notesTitle: "Notas",

    units: {
      gallon: "Galón",
      quart: "Cuarto",
      pint: "Pinta",
      cup: "Taza",
      oz: "Onza",
      tbsp: "Cucharada",
      tsp: "Cucharadita",
    },

    notes: [
      { leftStrong: "TBSP", text: " = CUCHARADA = ", rightStrong: "T" },
      { leftStrong: "TSP", text: " = CUCHARADITA = ", rightStrong: "t" },
      { leftStrong: "1.5 TAZAS", text: " = DOS ", rightStrong: "2/3", tail: " TAZAS" },
    ],
  },
} as const;
