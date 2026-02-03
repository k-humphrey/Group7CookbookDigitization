import Timer from "./timer";

export default function TimerPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/searchbackground.jpg')",
        backgroundSize: "120%",
      }}
    >
    <div className="-mt-60 flex flex-col items-center">
      <h1 className="text-[6rem] md:text-[6rem] font-black text-orange-500 mb-15 -mt-15">
        Timer
      </h1>

      <Timer />
    </div>
    </main>
  );
}
