"use client";

import { useLang } from "@/app/components/languageprovider";

interface Props {
  targetId?: string;
  label?: string;
  className?: string;
  variant?: "text" | "icon";
}

export default function PrintButton({ targetId, label, className, variant = "text",}: Props) {
  const langContext = useLang();
  const lang = langContext?.lang ?? "en";

  const handlePrint = () => {
    if (targetId) {
      const content = document.getElementById(targetId);
      if (!content) 
        return;

      const printWindow = window.open("", "_blank");
      if (!printWindow) 
        return;

      printWindow.document.write(`
        <html>
          <head>
            <title>${lang === "es" ? "Imprimir" : "Print"}</title>
            <style>
              body { font-family: sans-serif; padding: 1rem; }

              ul { list-style: none; padding-left: 0; }
              li { margin-bottom: 0.25rem; }

              button { display: none !important; }

              /* Hide screen only content in print window */
              .screen-list-only { display: none !important; }
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

  // ICON
  if (variant === "icon") {
    return (
      <div className="relative group">
        <button
          type="button"
          onClick={handlePrint}
          aria-label={lang === "es" ? "Imprimir receta" : "Print recipe"}
          className={`p-2 rounded-lg h-10 flex items-center justify-center hover:bg-base-200 active:scale-95 transition cursor-pointer ${
            className || ""
          }`}
        >
          {/* Outline print icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
            />
          </svg>
        </button>

        {/* Tooltip */}
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
          whitespace-nowrap rounded bg-black text-white text-xs px-2 py-1 
          opacity-0 group-hover:opacity-100 transition pointer-events-none">
          {lang === "es" ? "Imprimir receta" : "Print recipe"}
        </span>
      </div>
    );
  }

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