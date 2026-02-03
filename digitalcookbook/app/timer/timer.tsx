// app/timer/timer.tsx
"use client";

import { useState, useEffect } from "react";

export default function Timer() {
  // Input state
  const [inputHours, setInputHours] = useState<number>(0);
  const [inputMinutes, setInputMinutes] = useState<number>(0);
  const [inputSeconds, setInputSeconds] = useState<number>(0);

  // Timer state 
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Countdown tick every second
  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  // Timer control handlers 
  const handleStart = () => {
    const totalSeconds = inputHours * 3600 + inputMinutes * 60 + inputSeconds;
    setSecondsLeft(totalSeconds);
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
          <div className="stat-title text-xl md:text-2xl -mt-9">Time Remaining</div>
          <div className="stat-value text-8xl md:text-9xl font-bold text-gray-600">{formatTime(secondsLeft)}</div>
        </div>
      </div>

      {/* Inputs */}
      <div className="flex gap-4">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <input
            type="number"
            max={24}
            value={inputHours === 0 ? "" : inputHours}
            placeholder="0"
            onChange={(e) => handleInputChange(e.target.value, 24, setInputHours)}
            onKeyDown={handleKeyDown}
            className="input input-bordered w-20 text-center"
          />
          <span className="text-sm text-gray-500 mt-1">hours</span>
        </div>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <input
            type="number"
            max={60}
            value={inputMinutes === 0 ? "" : inputMinutes}
            placeholder="0"
            onChange={(e) => handleInputChange(e.target.value, 60, setInputMinutes)}
            onKeyDown={handleKeyDown}
            className="input input-bordered w-20 text-center"
          />
          <span className="text-sm text-gray-500 mt-1">minutes</span>
        </div>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <input
            type="number"
            max={60}
            value={inputSeconds === 0 ? "" : inputSeconds}
            placeholder="0"
            onChange={(e) => handleInputChange(e.target.value, 60, setInputSeconds)}
            onKeyDown={handleKeyDown}
            className="input input-bordered w-20 text-center"
          />
          <span className="text-sm text-gray-500 mt-1">seconds</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        {!isRunning ? (
          <button onClick={handleStart} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Start</button>
        ) : (
          <button onClick={handlePause} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Pause</button>
        )}
        <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Reset</button>
      </div>
    </div>
  );
}


