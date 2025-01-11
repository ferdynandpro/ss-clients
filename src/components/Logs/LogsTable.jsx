import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // Adjust the path to where your `api` instance is located
// import '../../assets/styles/components/manage-customer.css'; // Import global styles
// import '../../assets/styles/components/customers-table.css'; // Import global styles
import '../../assets/styles/components/logs-table.css'
const LogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch logs from backend
  const fetchLogs = async () => {
    try {
      const response = await api.get('/logs'); // Use the custom `api` instance
      const latestLogs = response.data.slice(0, 50);
      setLogs(latestLogs);
      setFilteredLogs(latestLogs); // Set initial logs to all logs
    } catch (err) {
      setError('Failed to fetch logs.');
    } finally {
      setLoading(false);
    }
  };

  // Filter logs by operation type
  const filterLogs = (operation) => {
    if (operation === 'ALL') {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter((log) => log.operation.toLowerCase() === operation.toLowerCase()));
    }
  };

  // Fetch logs when component mounts
  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container manage-container">
      <p className='titles'>Audit Logs (Last 50)</p>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button onClick={() => filterLogs('ALL')}>All</button>
        <button onClick={() => filterLogs('INSERT')}>Create</button>
        <button onClick={() => filterLogs('UPDATE')}>Update</button>
        <button onClick={() => filterLogs('DELETE')}>Delete</button>
      </div>

      <div className="table-container">
        <table className="data-table responsive-table">
          <thead>
            <tr>
              <th className="">Table Name</th>
              <th>Action</th>
              <th>Changes</th>
              <th className="last-updated">Performed At</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className={`log-row ${log.operation.toLowerCase()}`}>
                <td className="id">{log.table_name}</td>
                <td>{log.operation}</td>
                <td>
                  <pre>{`\n${log.changes.before}\n${log.changes.after}`}</pre>
                </td>
                <td className="last-updated">{new Date(log.performed_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsTable;
