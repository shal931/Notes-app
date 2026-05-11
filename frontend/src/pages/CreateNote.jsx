import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../utils/utils';
import styles from './CreateNote.module.css';

const COLOR_OPTIONS = [
    { value: '#34495e', label: 'Dark Gray' },
    { value: '#e74c3c', label: 'Red' },
    { value: '#f39c12', label: 'Orange' },
    { value: '#27ae60', label: 'Green' },
    { value: '#3498db', label: 'Blue' },
    { value: '#9b59b6', label: 'Purple' },
    { value: '#1abc9c', label: 'Teal' }
];

export const CreateNote = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [color, setColor] = useState('#34495e');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            const response = await fetch('http://localhost:8080/notes/create', {
                method: 'POST',
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
                handleSuccess('Note created successfully');
                setTimeout(() => {
                    navigate('/notes');
                }, 1000);
            } else {
                handleError(result.message || 'Failed to create note');
            }
        } catch (err) {
            handleError(err.message || 'Failed to create note');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.formBox}>
                <h1>Create New Note</h1>
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
                            {loading ? 'Creating...' : 'Create Note'}
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
