import MeasurementConverter from "./measurement";

export default function MeasurementPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-no-repeat bg-[center_75%]"
      style={{
        backgroundImage: "url('/resources.png')",
        backgroundSize: "100%",
      }}
    >
    <div className="-mt-40 flex flex-col items-center">
      
      <MeasurementConverter />
    </div>
    </main>
  );
}


