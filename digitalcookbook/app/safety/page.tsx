//app/safety/page.tsx 

import InfoCard from "../components/infocard";

export default function SafetyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start">
        <div className="text-center mb-5">
            <h1 className="text-2xl md:text-[5rem] font-bold">Safety</h1>
        </div>

        {/* Cards Container aka Responsive Grid, should work on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4">
            <InfoCard
                title="Car Seat Recommendations"
                description="Learn how to choose the correct car seat for your child's age, height, and weight."
                href="https://www.nhtsa.gov/equipment/car-seats-and-booster-seats"
            />

            <InfoCard
                title="Extreme Weather Awareness"
                description="Important steps to take during heat waves, blizzards, tornadoes, and flooding."
                href="https://www.ready.gov/weather"
            />

            <InfoCard
                title="First Aid for Choking"
                description="Recognize choking signs and learn how to perform abdominal thrusts safely."
                href="https://www.redcross.org/..."
            />

            <InfoCard
                title="How to Perform CPR"
                description="Learn adult, child, and infant CPR guidelines."
                href="https://www.heart.org/..."
            />
        </div>
    </main>
  );
}
