"use client";

import { useLang } from "@/app/components/languageprovider";

interface Props {
  targetId?: string;
  label?: string;
  className?: string; // extra styling for alignment
}

export default function PrintButton({ targetId, label, className }: Props) {
  const langContext = useLang();
  const lang = langContext?.lang ?? "en";

  const handlePrint = () => {
    if (targetId) {
      const content = document.getElementById(targetId);
      if (!content) return;

      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${lang === "es" ? "Imprimir" : "Print"}</title>
          <style>
            body { font-family: sans-serif; padding: 1rem; }

            ul { list-style: none; padding-left: 0; }
            li { margin-bottom: 0.25rem; }

            /* Hide buttons in print window */
            button { display: none !important; }

          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      window.print();
    }
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className={`mt-0 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800
                 print:hidden focus:outline-none focus-visible:ring-3 focus-visible:ring-offset-2
                 focus-visible:ring-primary ${className || ""}`}
    >
      {label ?? (lang === "es" ? "Imprimir" : "Print")}
    </button>
  );
}