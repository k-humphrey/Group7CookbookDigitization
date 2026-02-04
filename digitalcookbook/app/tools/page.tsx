//app/tools/page.tsx

import InfoCard from "../components/infocard";

export default function ToolsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start">
        <div className="text-center mb-5">
            <h1 className="text-2xl md:text-[5rem] font-bold">Kitchen Tools</h1>
        </div>

        {/* Cards Container aka Responsive Grid, should work on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4">
            <InfoCard
                title="Shelf Life Guidelines"
                description="guidelines for food and how long you can keep it"
                href="/shelf-life-guidelines"
            />

            <InfoCard
                title="Price Finder"
                description="Calculate the price of different ingredients and shows you where its cheapest"
                href="/price-finder"
            />

            <InfoCard
                title="Kitchen Timer"
                description="Timer"
                href="/timer"
            />

            <InfoCard
                title="Measurement Converter"
                description="Cups, Ounces, Grams... what is that in a unit of measurement I understand?"
                href="/measurement-converter"
            />
        </div>
    </main>
  );
}