//app/comm-resources/page.tsx

import InfoCard from "../components/infocard";

export default function CommResourcesPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start">
        <div className="text-center mb-5">
            <h1 className="text-2xl md:text-[5rem] font-bold">Commuity Resources</h1>
        </div>

        {/* Cards Container aka Responsive Grid, works on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4">
            <InfoCard
                title=""
                description=""
                href=""
            />

            <InfoCard
                title=""
                description=""
                href=""
            />

            <InfoCard
                title=""
                description=""
                href=""
            />

            <InfoCard
                title=""
                description=""
                href=""
            />

        </div>
    </main>
  );
}