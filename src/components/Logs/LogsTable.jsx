import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // Adjust the path to where your `api` instance is located
import '../../assets/styles/components/logs-table.css'; // Import the CSS file

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
            setError("Failed to fetch logs.");
        } finally {
            setLoading(false);
        }
    };

    // Filter logs by operation type
    const filterLogs = (operation) => {
        if (operation === "ALL") {
            setFilteredLogs(logs);
        } else {
            setFilteredLogs(logs.filter(log => log.operation.toLowerCase() === operation.toLowerCase()));
        }
    };

    // Fetch logs when component mounts
    useEffect(() => {
        fetchLogs();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="logs-table-container">
            <h1>Audit Logs (Last 50)</h1>

            {/* Filter Buttons */}
            <div className="filter-buttons">
                <button onClick={() => filterLogs("ALL")}>All</button>
                <button onClick={() => filterLogs("INSERT")}>Create</button>
                <button onClick={() => filterLogs("UPDATE")}>Update</button>
                <button onClick={() => filterLogs("DELETE")}>Delete</button>
            </div>

            <table className="logs-table">
                <thead>
                    <tr>
                        <th className="tn">Table Name</th>
                        <th className="aksi">Action</th>
                        <th>Changes</th>
                        <th className="tgl">Performed At</th>
                    </tr>
                </thead>
                <tbody>
    {filteredLogs.map((log) => (
        <tr key={log.id} className={`log-row ${log.operation.toLowerCase()}`}>
            <td>{log.table_name}</td>
            <td>{log.operation}</td>
            <td>
                <pre>{`\n${log.changes.before}\n${log.changes.after}`}</pre>
            </td>
            <td>{new Date(log.performed_at).toLocaleString()}</td>
        </tr>
    ))}
</tbody>

            </table>
        </div>
    );
};

export default LogsTable;
