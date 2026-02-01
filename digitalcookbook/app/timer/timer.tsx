// app/timer/timer.tsx
"use client";

import { useState, useEffect } from "react";

export default function Timer() {
  const [inputHours, setInputHours] = useState<number>(0);
  const [inputMinutes, setInputMinutes] = useState<number>(0);
  const [inputSeconds, setInputSeconds] = useState<number>(0);

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Tick every second
  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const handleStart = () => {
    const totalSeconds =
      inputHours * 3600 +
      inputMinutes * 60 +
      inputSeconds;

    setSecondsLeft(totalSeconds);
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(0);
  };

  const formatTime = (sec: number) => {
    const hours = Math.floor(sec / 3600)
      .toString()
      .padStart(2, "0");

    const minutes = Math.floor((sec % 3600) / 60)
      .toString()
      .padStart(2, "0");

    const seconds = (sec % 60)
      .toString()
      .padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  // Generic input change handler
  const handleInputChange = (
    value: string,
    max: number,
    setter: (val: number) => void
  ) => {
    // Only digits
    value = value.replace(/\D/g, "");

    // Limit to 2 digits
    if (value.length > 2) return;

    // Allow empty input (visual zero)
    if (value === "") {
      setter(0);
      return;
    }

    const num = Math.min(max, Math.max(0, Number(value)));
    setter(num);
  };

  // Generic onKeyDown handler to block letters but allow arrows/backspace/tab
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
        e.key
      )
    )
      return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  return (
    <>
      <div className="text-[6rem] md:text-[8rem] lg:text-[10rem] font-bold tracking-wider text-center">
        {formatTime(secondsLeft)}
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
            <div className="text-sm text-gray-500">hours</div>
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
            <div className="text-sm text-gray-500">minutes</div>
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
            <div className="text-sm text-gray-500">seconds</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Pause
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
