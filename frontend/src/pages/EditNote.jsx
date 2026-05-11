import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../utils/utils';
import styles from './EditNote.module.css';

const COLOR_OPTIONS = [
    { value: '#34495e', label: 'Dark Gray' },
    { value: '#e74c3c', label: 'Red' },
    { value: '#f39c12', label: 'Orange' },
    { value: '#27ae60', label: 'Green' },
    { value: '#3498db', label: 'Blue' },
    { value: '#9b59b6', label: 'Purple' },
    { value: '#1abc9c', label: 'Teal' }
];

export const EditNote = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [color, setColor] = useState('#34495e');
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
                setTags(result.note.tags || []);
                setColor(result.note.color || '#34495e');
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

    const handleAddTag = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            e.preventDefault();
            if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
                setTagInput('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
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
                body: JSON.stringify({ 
                    title, 
                    description,
                    tags,
                    color
                })
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

                    <div className={styles.formGroup}>
                        <label htmlFor="tags">Tags</label>
                        <div className={styles.tagInputContainer}>
                            <input
                                type="text"
                                id="tags"
                                placeholder="Enter tag and press Enter"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={handleAddTag}
                            />
                            <button 
                                type="button" 
                                className={styles.addTagBtn}
                                onClick={handleAddTag}
                            >
                                + Add
                            </button>
                        </div>
                        {tags.length > 0 && (
                            <div className={styles.tagsDisplay}>
                                {tags.map(tag => (
                                    <span key={tag} className={styles.tag}>
                                        {tag}
                                        <button
                                            type="button"
                                            className={styles.removeTagBtn}
                                            onClick={() => handleRemoveTag(tag)}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="color">Note Color</label>
                        <div className={styles.colorPicker}>
                            {COLOR_OPTIONS.map(option => (
                                <label key={option.value} className={styles.colorOption}>
                                    <input
                                        type="radio"
                                        name="color"
                                        value={option.value}
                                        checked={color === option.value}
                                        onChange={(e) => setColor(e.target.value)}
                                    />
                                    <span 
                                        className={styles.colorSwatch}
                                        style={{ backgroundColor: option.value }}
                                        title={option.label}
                                    />
                                </label>
                            ))}
                        </div>
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
