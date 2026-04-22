//app/tools/page.tsx

import InfoCard from "../components/infocard";
import Image from "next/image";

export default function ToolsPage() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-start">
            <Image
                src="/background_maybe2.png"
                alt=""
                fill
                priority
                className="object-cover scale-110"
            />

			<div className="text-center mt-10 mb-20 relative z-10">
				<div className="inline-block bg-white shadow-md rounded-lg p-5">
					<h1 className="text-2xl md:text-[5rem] font-bold text-black">
					Kitchen Tools
					</h1>
				</div>
			</div>

            {/* Cards Container aka Responsive Grid, should work on mobile */}
            <div id="tools-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4">
                <div className="flex justify-center">
                    <InfoCard
                        title="Shelf Life Guidelines"
                        description="Here you can find guidelines for food and how long it stays edible."
                        href="/shelf-life-guidelines"
                    />
                </div>

                <div className="flex justify-center">
                    <InfoCard
                        title="Kitchen Timer"
                        description="Timer"
                        href="/timer"
                    />
                </div>

                <div className="flex justify-center">
                    <InfoCard
                        title="Measurement Converter"
                        description="Cups, Ounces, Grams... what is that in a unit of measurement I understand?"
                        href="/measurement-converter"
                    />
                </div>

                <div className="flex justify-center">
                    <InfoCard
                        title="Meal Planner"
                        description="Choose recipes, adjust servings, and see ingredients and costs automatically."
                        href="/meal-planner"
                    />
                </div>
            </div>
        </section>
    );
}