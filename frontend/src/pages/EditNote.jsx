import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../utils/utils';
import styles from './EditNote.module.css';

export const EditNote = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchNote();
    }, [id]);

    const fetchNote = async () => {
        try {
            setFetching(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/notes/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });

            const result = await response.json();

            if (result.success) {
                setTitle(result.note.title);
                setDescription(result.note.description);
            } else {
                handleError(result.message || 'Failed to fetch note');
                setTimeout(() => navigate('/notes'), 1500);
            }
        } catch (err) {
            handleError(err.message || 'Failed to fetch note');
            setTimeout(() => navigate('/notes'), 1500);
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            handleError('Title and description cannot be empty');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/notes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ title, description })
            });

            const result = await response.json();

            if (result.success) {
                handleSuccess('Note updated successfully');
                setTimeout(() => {
                    navigate('/notes');
                }, 1000);
            } else {
                handleError(result.message || 'Failed to update note');
            }
        } catch (err) {
            handleError(err.message || 'Failed to update note');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className={styles.loading}>Loading note...</div>;
    }

    return (
        <div className={styles.formContainer}>
            <div className={styles.formBox}>
                <h1>Edit Note</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Enter note title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="Enter note description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows="10"
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => navigate('/notes')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};
