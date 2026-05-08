import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../utils/utils';
import styles from './Notes.module.css';

export const Notes = () => {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser') || '');
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/notes/all', {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });
            const result = await response.json();

            if (result.success) {
                setNotes(result.notes);
            } else {
                handleError(result.message || 'Failed to fetch notes');
            }
        } catch (err) {
            handleError(err.message || 'Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNote = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/notes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token
                }
            });
            const result = await response.json();

            if (result.success) {
                handleSuccess('Note deleted successfully');
                fetchNotes();
            } else {
                handleError(result.message || 'Failed to delete note');
            }
        } catch (err) {
            handleError(err.message || 'Failed to delete note');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.notesContainer}>
            <div className={styles.notesHeader}>
                <div>
                    <h1>My Notes</h1>
                    <p className={styles.welcomeText}>Welcome, {loggedInUser}</p>
                </div>
                <div className={styles.headerButtons}>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/create-note')}
                    >
                        + Create Note
                    </button>
                    <button 
                        className="btn btn-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>Loading your notes...</div>
            ) : notes.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No notes yet. Create your first note to get started!</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/create-note')}
                    >
                        Create First Note
                    </button>
                </div>
            ) : (
                <div className={styles.notesGrid}>
                    {notes.map((note) => (
                        <div key={note._id} className={styles.noteCard}>
                            <div className={styles.noteHeader}>
                                <h3>{note.title}</h3>
                                <span className={styles.noteDate}>{formatDate(note.createdAt)}</span>
                            </div>
                            <p className={styles.noteDescription}>{note.description}</p>
                            <div className={styles.noteActions}>
                                <button
                                    className="btn btn-edit"
                                    onClick={() => navigate(`/edit-note/${note._id}`)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-delete"
                                    onClick={() => handleDeleteNote(note._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ToastContainer />
        </div>
    );
};
