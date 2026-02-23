"use client";

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="mt-4 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 print:hidden">
      Print
    </button>
  );
}
