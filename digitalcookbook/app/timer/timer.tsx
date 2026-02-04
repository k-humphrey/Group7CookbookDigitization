// app/timer/timer.tsx
"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/app/components/languageprovider";

const STRINGS = {
  en: {
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    remaining: "Time Remaining"
  },
  es: {
    hours: "horas",
    minutes: "minutos",
    seconds: "segundos",
    start: "Iniciar",
    pause: "Pausa",
    reset: "Reiniciar",
    remaining: "Tiempo Restante"
  }
};

export default function Timer() {
  // Input state
  const [inputHours, setInputHours] = useState<number>(0);
  const [inputMinutes, setInputMinutes] = useState<number>(0);
  const [inputSeconds, setInputSeconds] = useState<number>(0);

  // Timer state 
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const t = STRINGS[lang];
  

  // Tick every second
  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  // Timer control handlers 
  const handleStart = () => {
    if(secondsLeft == 0) {
      const totalSeconds = inputHours * 3600 + inputMinutes * 60 + inputSeconds;
      setSecondsLeft(totalSeconds);
    }
    
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(0);
  };

  // Format seconds into Hours:Minutes:Seconds
  const formatTime = (sec: number) => {
    const hours = Math.floor(sec / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
    const seconds = (sec % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  //Input handlers
  const handleInputChange = (
    value: string,
    max: number,
    setter: (val: number) => void
  ) => {
    value = value.replace(/\D/g, ""); //Only digits
    //Limit to 2 digits
    if (value.length > 2) return;
    //Allow empty input (visual zero)
    if (value === "") {
      setter(0);
      return;
    }
    const num = Math.min(max, Math.max(0, Number(value)));
    setter(num);
  };

  //KeyDown handler to block letters but allow backspace/delete/arrows/tab
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  //Styling
  return (
    <div className="flex flex-col items-center mt-10 gap-6">
      {/* Timer display */}
      <div className="card w-[44rem] bg-base-100 shadow-xl p-6 -mt-20">
        <div className="stat text-center">
          <div className="stat-title text-xl md:text-2xl -mt-9">{t.remaining}</div>
          <div className="stat-value text-8xl md:text-9xl font-bold text-gray-600">{formatTime(secondsLeft)}</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-6">
        {/* Inputs with labels */}
        <div className="flex gap-4 text-center">
          {/* Hours */}
          <div>
            <input
              type="number"
              max={24}
              value={inputHours === 0 ? "" : inputHours}
              placeholder="0"
              onChange={(e) =>
                handleInputChange(e.target.value, 24, setInputHours)
              }
              onKeyDown={handleKeyDown}
              className="w-16 p-1 border rounded text-center placeholder-gray-400"
            />
            <div className="text-sm text-gray-500">{t.hours}</div>
          </div>

          {/* Minutes */}
          <div>
            <input
              type="number"
              max={60}
              value={inputMinutes === 0 ? "" : inputMinutes}
              placeholder="0"
              onChange={(e) =>
                handleInputChange(e.target.value, 60, setInputMinutes)
              }
              onKeyDown={handleKeyDown}
              className="w-16 p-1 border rounded text-center placeholder-gray-400"
            />
            <div className="text-sm text-gray-500">{t.minutes}</div>
          </div>

          {/* Seconds */}
          <div>
            <input
              type="number"
              max={60}
              value={inputSeconds === 0 ? "" : inputSeconds}
              placeholder="0"
              onChange={(e) =>
                handleInputChange(e.target.value, 60, setInputSeconds)
              }
              onKeyDown={handleKeyDown}
              className="w-16 p-1 border rounded text-center placeholder-gray-400"
            />
            <div className="text-sm text-gray-500">{t.seconds}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t.start}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              {t.pause}
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            {t.reset}
          </button>
        </div>
      </div>
    </div>
  );
}


