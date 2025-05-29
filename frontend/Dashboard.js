import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const token = localStorage.getItem('token'); // Assuming you're storing token

  const fetchLogs = async () => {
    let url = 'http://localhost:5000/logs';
    if (start && end) {
      url += `?start=${start}&end=${end}`;
    }

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>From: </label>
        <input type="date" onChange={(e) => setStart(e.target.value)} />
        <label> To: </label>
        <input type="date" onChange={(e) => setEnd(e.target.value)} />
        <button onClick={fetchLogs}>Filter</button>
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Action</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.action}</td>
              <td>{new Date(log.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
