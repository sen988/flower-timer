import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function App() {
  const [inputMinutes, setInputMinutes] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    axios.get('https://localhost:5293/api/TimerPreset')
      .then(response => {
        setPresets(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching presets:', error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) setInputMinutes(val);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    const seconds = parseInt(inputMinutes, 10) * 60;
    if (seconds > 0) {
      setTimeLeft(seconds);

      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const createPreset = async () => {
    if (!inputMinutes || parseInt(inputMinutes) <= 0) {
      setMessage("Please enter a valid number of minutes.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5293/api/TimerPreset", {
        inputMinutes: parseInt(inputMinutes),
      });
      setMessage("Preset added!");
      setMinutes("");
    } catch (error) {
      setMessage("Failed to add preset");
    }
  };

  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(0);
    setInputMinutes("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Simple Timer</h1>
      <input
        type="text"
        placeholder="Enter minutes"
        value={inputMinutes}
        onChange={handleChange}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={startTimer}>Start</button>
        <button onClick={createPreset}>Create</button>
        <button onClick={pauseTimer} style={{ marginLeft: "5px" }}>
          Pause
        </button>
        <button onClick={resetTimer} style={{ marginLeft: "5px" }}>
          Reset
        </button>
      </div>
      <div style={{ marginTop: "20px", fontSize: "24px" }}>
        Time Remaining: {formatTime(timeLeft)}
      </div>
    </div>
  );
}
