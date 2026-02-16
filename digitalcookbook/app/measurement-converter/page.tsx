import MeasurementConverter from "./measurement";

export default function MeasurementPage() {
  return (
    <main
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/measurementbg.png')",
        backgroundSize: "100%",
      }}
    >
      {/* Color overlay */}
      <div className="absolute  backdrop-blur-[2px]" />

      <div className="relative z-10 -mt-40">
        <MeasurementConverter />
      </div>
    </main>
  );
}
