// app/timer/timer.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/app/components/languageprovider";

const STRINGS = {
  en: {
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    remaining: "Time Remaining",
    sound: "Sound Alert"
  },
  es: {
    hours: "horas",
    minutes: "minutos",
    seconds: "segundos",
    start: "Iniciar",
    pause: "Pausa",
    reset: "Reiniciar",
    remaining: "Tiempo Restante",
    sound: "Alerta de sonido"
  }
};

const focusClasses = "focus-visible:ring-3 focus-visible:ring-neutral focus-visible:ring-offset-2";

export default function Timer() {
  // Input state
  const [inputHours, setInputHours] = useState<number>(0);
  const [inputMinutes, setInputMinutes] = useState<number>(0);
  const [inputSeconds, setInputSeconds] = useState<number>(0);

  // Timer state 
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  //sound toggle state
  const [soundEnabled, setSoundEnabled] = useState(true);
  //audio ref
  const alarmRef = useRef<HTMLAudioElement | null > (null);

  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const t = STRINGS[lang];
  
  //load saved preference
  useEffect(() => {
    const saved = localStorage.getItem("soundEnabled");
    if (saved !== null) setSoundEnabled(saved === "true");
  }, []);

  // save preference
  useEffect(() => {
    localStorage.setItem("soundEnabled", String(soundEnabled));
  }, [soundEnabled]);

  // Tick every second
  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);
  // detect when timmer hits zero
  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);

      if (soundEnabled) {
        alarmRef.current?.play().catch(() => {
          console.log("Audio blocked: user interaction required");
        });
        // vibration (mobile)
        navigator.vibrate?.(500);
      }
    }
  }, [secondsLeft, isRunning, soundEnabled]);

  // prime audio for autoplay
  const primeAudio = () => {
    if (!alarmRef.current){
      alarmRef.current = new Audio("/sound/alarm.mp3");
      alarmRef.current.preload = "auto";
      alarmRef.current.play().then(() => alarmRef.current?.pause());
      alarmRef.current.currentTime = 0;
    }
  }

  // Timer control handlers 
  const handleStart = () => {
    // stop current alarm before starting new alarm
    if (alarmRef.current){
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
    if(secondsLeft == 0) {
      const totalSeconds = inputHours * 3600 + inputMinutes * 60 + inputSeconds;
      setSecondsLeft(totalSeconds);
    }
    if (soundEnabled)
      // prime audio on start 
      primeAudio();
      setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(0);
    //stop sound if playing
    if (alarmRef.current){
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
  };
    // Sound toggle handler
  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const newValue = !prev;
      if (newValue){
        primeAudio(); // prime audio on first enable
      }
      else {
        if (alarmRef.current){
          alarmRef.current.pause();
          alarmRef.current.currentTime = 0;
        }
      }
      return newValue;
    });
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

  //Styling
  return (
    <div className="flex flex-col items-center mt-5 gap-6">
      {/* Timer display */}
      <div className="card w-full max-w-3xl bg-base-100 shadow-xl p-4 sm:p-6">
        <div className="stat text-center">
          <div className="stat-title text-xl md:text-2xl -mt-9">{t.remaining}</div>
          <div className="stat-value text-7xl md:text-9xl font-bold text-gray-600">{formatTime(secondsLeft)}</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-4 mb-5">
        {/* Inputs with labels */}
        <div className="flex gap-4 text-center">
          {/* Hours */}
          <div>
            <input
              id="hours"
              type="number"
              inputMode="numeric"
              max={24}
              value={inputHours === 0 ? "" : inputHours}
              placeholder="0"
              onChange={(e) =>
                handleInputChange(e.target.value, 24, setInputHours)
              }
              className={focusClasses + " w-16 p-1 border rounded text-center placeholder-gray-400"}
            />
            <div>
              <label htmlFor="hours" className="text-sm text-gray-500">{t.hours}</label>
            </div>
          </div>

          {/* Minutes */}
          <div>
            <input
              id="minutes"
              type="number"
              inputMode="numeric"
              max={60}
              value={inputMinutes === 0 ? "" : inputMinutes}
              placeholder="0"
              onChange={(e) =>
                handleInputChange(e.target.value, 60, setInputMinutes)
              }
              className={focusClasses + " w-16 p-1 border rounded text-center placeholder-gray-400"}
            />
            <div>
              <label htmlFor="minutes" className="text-sm text-gray-500">{t.minutes}</label>
            </div>
          </div>

          {/* Seconds */}
          <div>
            <input
              id="seconds"
              type="number"
              inputMode="numeric"
              max={60}
              value={inputSeconds === 0 ? "" : inputSeconds}
              placeholder="0"
              onChange={(e) =>
                handleInputChange(e.target.value, 60, setInputSeconds)
              }
              className={focusClasses + " w-16 p-1 border rounded text-center placeholder-gray-400"}
            />
            <div>
              <label htmlFor="seconds" className="text-sm text-gray-500">{t.seconds}</label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className={focusClasses + " px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"}
            >
              {t.start}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className={focusClasses + " px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"}
            >
              {t.pause}
            </button>
          )}

          <button
            onClick={handleReset}
            className={focusClasses + " px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"}
          >
            {t.reset}
          </button>
        </div>
        
        {/*Sound toggle */}
        <div className = "flex items-center gap-2 mt-2">
          <input id="soundToggle" 
          type= "checkbox" 
          checked={soundEnabled}
          onChange={handleToggleSound}
          className="toggle toggle-primary" />
          <label htmlFor="soundToggle" className = "text-sm text-gray-60">{t.sound}</label>
        </div>
      </div>
    </div>
  );
}