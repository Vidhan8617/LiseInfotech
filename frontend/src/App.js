import React, { useEffect, useState } from "react";
import "./App.css";
import logo from "./logo.png";

function App() {
  const [time, setTime] = useState(new Date());
  const [signedIn, setSignedIn] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const notifyServer = async (action) => {
    try {
      const res = await fetch(`http://localhost:5000/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      alert(data.message);

      if (action === "login") {
        setSignedIn(true);
        fetchLogs();
      }
      if (action === "logout") {
        setSignedIn(false);
      }
    } catch (err) {
      alert("Failed to notify server: " + err.message);
    }
  };
  useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  if (token) {
    localStorage.setItem("token", token);
    setSignedIn(true);
    fetchLogs();
  }
}, []);


  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/logs");
      const data = await res.json();
      setLogs(data.logs);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  useEffect(() => {
    if (signedIn) fetchLogs();
  }, [signedIn]);

  return (
    <div className="container">
      <div className="header">
        <div className="clock">{time.toLocaleTimeString()}</div>
        <div className="logo-area">
          <img src={logo} alt="Logo" className="logo-icon" />
        </div>
        <div className="signin-section">
          {!signedIn ? (
            <button onClick={() => notifyServer("login")}>Login</button>
          ) : (
            <span className="status-indicator">
              <span className="green-dot" /> Signed In
            </span>
          )}
        </div>
      </div>

      <div className="button-grid">
        <button disabled={!signedIn} onClick={() => notifyServer("break")}>
          Break
        </button>
        <button disabled={!signedIn} onClick={() => notifyServer("resume")}>
          Resume
        </button>
        <button disabled={!signedIn} onClick={() => notifyServer("lunch")}>
          Lunch
        </button>
        <button disabled={!signedIn} onClick={() => notifyServer("back-online")}>
          Back Online
        </button>
        <button disabled={!signedIn} onClick={() => notifyServer("logout")}>
          LogOut
        </button>
      </div>

      <div className="dashboard">
        <h2>Action Logs</h2>
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.action}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
