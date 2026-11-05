import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { token, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetch(
                    'http://localhost:3000/api/students',
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const data = await response.json();

                if (response.status === 401) {
                    logout();
                    navigate('/login', { replace: true });
                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        data.error || 'Failed to fetch students.'
                    );
                }

                setStudents(data);

            } catch (err) {
                setError(err.message || 'Something went wrong.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchStudents();
        }
    }, [token, logout, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="students-container">
            <header className="students-header">
                <div>
                    <h1>Student Directory</h1>
                    <p>Manage and view registered students.</p>
                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </header>

            <main className="students-content">
                <div className="students-title">
                    <h2>Students List</h2>
                    <span>
                        {students.length} Students
                    </span>
                </div>

                {loading && (
                    <p className="loading-message">
                        Loading students...
                    </p>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!loading && !error && students.length === 0 && (
                    <p className="empty-message">
                        No students found.
                    </p>
                )}

                {!loading && !error && students.length > 0 && (
                    <div className="table-container">
                        <table className="students-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email Address</th>
                                </tr>
                            </thead>

                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student._id}>
                                        <td>{index + 1}</td>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Students;
