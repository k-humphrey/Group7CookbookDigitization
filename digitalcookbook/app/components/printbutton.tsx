"use client";

import { useLang } from "@/app/components/languageprovider";

export default function PrintButton() {
  // lang settings
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';

  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 print:hidden">
      {lang === "es" ? "Imprimir" : "Print"}
    </button>
  );
}
