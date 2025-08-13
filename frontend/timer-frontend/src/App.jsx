import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function App() {
  const [inputMinutes, setInputMinutes] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showPresets, setShowPresets] = useState(false);
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
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

  //show presets
  const handleShowPresets = async () => {
    if (!showPresets) {
      try {
        const response = await axios.get("http://localhost:5293/api/TimerPreset");
        setPresets(response.data);
      } catch (error) {
        setMessage("No presets available!");
      }
    }
    setShowPresets(!showPresets);
  };

  const createPreset = async () => {
    if (!inputMinutes || parseInt(inputMinutes) <= 0) {
      setMessage("Please enter a valid number of minutes.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5293/api/TimerPreset", {
        minutes: parseInt(inputMinutes),
      });
      setMessage("Preset added!");
      setMinutes("");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage("Preset with this duration already exists.");
      } else {
        setMessage("Failed to add preset");
      }    
    }
  };

  const deletePreset = async (inputMinutes) => {
    const minutes = parseInt(inputMinutes);
    
    if (isNaN(minutes) || minutes <= 0) {
      setMessage("Please enter a valid number of minutes to delete.");
      return;
    }

    axios.delete(`http://localhost:5293/api/TimerPreset/${inputMinutes}`)
      .then(() => {
        console.log('Preset deleted!');
    })
    .catch(err => {
      console.error('Error deleting preset:', err);
    });
  };


  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(0);
    setInputMinutes("");
    setMessage("");
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

        <button onClick={handleShowPresets}>
          {showPresets ? "Hide Presets" : "Show Presets"}
        </button>
        {showPresets && (
          <ul>
            {presets.map((preset) => (
              <li
                key={preset.id}
                style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                onClick={() => setInputMinutes(preset.minutes.toString())}
              >
                {preset.minutes} minutes
              </li>
            ))}
          </ul>
        )}

        <button onClick={createPreset}>Create</button>
        <button onClick={() => deletePreset(inputMinutes)}>Delete Preset</button>
        <button onClick={pauseTimer} style={{ marginLeft: "5px" }}>
          Pause
        </button>
        <button onClick={resetTimer} style={{ marginLeft: "5px" }}>
          Reset
        </button>
      </div>
      {message && <div style={{ color: "green", marginTop: "10px" }}>{message}
      </div>}
      <div style={{ marginTop: "20px", fontSize: "24px" }}>
        Time Remaining: {formatTime(timeLeft)}
      </div>
    </div>
  );
}
