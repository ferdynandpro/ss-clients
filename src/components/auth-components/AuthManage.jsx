import React, { useEffect, useState } from "react";
import api from "../../services/api";
import ConfirmationModal from '../../components/Alert/ConfirmationModal'; // Import modal
import Register from "../Loginx register/Register"; // Import register form
import '../../assets/styles/components/auth-manage.css'

function AuthManage() {
    const [users, setUsers] = useState([]); // Store users
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [confirmDelete, setConfirmDelete] = useState(null); // Confirmation modal state

    // Fetch all users on component mount
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await api.get("/auth/users");
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error fetching users: " + (err.response?.data?.message || err.message));
                setLoading(false);
            }
        };

        fetchAllUsers();
    }, []);

    // Handle user deletion
    const handleDelete = async (userId) => {
        try {
            const response = await api.delete(`/auth/users/${userId}`);

            if (response.status === 200) {
                setUsers(users.filter((user) => user.id !== userId)); // Update user list
                setConfirmDelete(null); // Close modal
            } else {
                setError("Failed to delete user: " + response.statusText);
            }
        } catch (err) {
            setError("Error deleting user: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="container auth-manage">
            {/* Register Form */}
            {/* Title */}
            <p className="titles">User Management</p>
            <Register />

            {/* Loading State */}
            {loading && <p>Loading users...</p>}

            {/* Error State */}
            {error && <p className="error-text">{error}</p>}

            {/* Display Users */}
            {users.length > 0 && (
                <div className="table-container ">
                    <h2>Users List</h2>
                    <table className="data-table ya">
                        <thead>
                            <tr>
                            <th className="hilang">ID</th>
                            <th>Username</th>
                            <th >Role</th>
                            <th className="hilang">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                            <tr key={user.id}>
                                <td className="hilang">{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.role || "No role assigned"}</td> 
                                <td className="hilang">
                                <button
                                    className="action-button delete-button"
                                    onClick={() => setConfirmDelete(user.id)} // Open delete confirmation
                                >
                                    Delete
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                </div>
            )}

            {/* No Users */}
            {!loading && users.length === 0 && <p>No users found.</p>}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmDelete !== null} // Modal is open if confirmDelete is set
                message="Are you sure you want to delete this user?" // Modal message
                onConfirm={() => handleDelete(confirmDelete)} // Handle confirm
                onCancel={() => setConfirmDelete(null)} // Handle cancel
            />
        </div>
    );
}

export default AuthManage;
