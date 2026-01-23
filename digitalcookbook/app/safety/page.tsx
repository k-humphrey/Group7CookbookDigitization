//app/safety/page.tsx 

import InfoCard from "../components/infocard";

export default function SafetyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start">
        <div className="text-center mb-5">
            <h1 className="text-3xl md:text-[5rem] font-bold">Safety</h1>
        </div>

        {/* Cards Container */}
        <div className="flex flex-col gap-6 w-full items-center">
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
