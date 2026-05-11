import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../utils/utils';
import styles from './Notes.module.css';

const COLOR_OPTIONS = ['#34495e', '#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6', '#1abc9c'];

export const Notes = () => {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [allTags, setAllTags] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser') || '');
        fetchNotes();
    }, []);

    useEffect(() => {
        applyFiltersAndSort();
    }, [notes, searchTerm, selectedTag, sortBy, showFavoritesOnly]);

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
                // Extract all unique tags
                const tags = new Set();
                result.notes.forEach(note => {
                    note.tags?.forEach(tag => tags.add(tag));
                });
                setAllTags(Array.from(tags));
            } else {
                handleError(result.message || 'Failed to fetch notes');
            }
        } catch (err) {
            handleError(err.message || 'Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...notes];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(note =>
                note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Tag filter
        if (selectedTag) {
            filtered = filtered.filter(note => note.tags?.includes(selectedTag));
        }

        // Favorites filter
        if (showFavoritesOnly) {
            filtered = filtered.filter(note => note.isFavorite);
        }

        // Sorting
        if (sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'oldest') {
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortBy === 'alphabetical') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'favorites') {
            filtered.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
        }

        setFilteredNotes(filtered);
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

    const handleToggleFavorite = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/notes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ isFavorite: !currentStatus })
            });
            const result = await response.json();

            if (result.success) {
                fetchNotes();
            } else {
                handleError(result.message || 'Failed to update note');
            }
        } catch (err) {
            handleError(err.message || 'Failed to update note');
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
            <section className={styles.dashboardHero}>
                <div className={styles.heroCopy}>
                    <p className={styles.heroEyebrow}>Notes workspace</p>
                    <h1>What do you want to do today?</h1>
                    <p className={styles.heroText}>
                        Create a new note, scan through saved notes, or jump straight into favorites and tags.
                    </p>
                </div>

                <div className={styles.profilePanel}>
                    <div className={styles.profileTopRow}>
                        <div>
                            <p className={styles.profileLabel}>Signed in as</p>
                            <h2>{loggedInUser || 'User'}</h2>
                        </div>
                        <span className={styles.profileBadge}>Active</span>
                    </div>
                    <p className={styles.profileHint}>Use the quick actions below to get started.</p>
                    <button className="btn btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </section>

            <section className={styles.quickActions}>
                <button className={styles.actionCard} onClick={() => navigate('/create-note')}>
                    <span className={styles.actionIcon}>+</span>
                    <strong>Create a note</strong>
                    <span>Start a new note from scratch.</span>
                </button>

                <a className={styles.actionCard} href="#notes-grid">
                    <span className={styles.actionIcon}>▤</span>
                    <strong>View notes</strong>
                    <span>Browse all notes in one place.</span>
                </a>

                <button className={styles.actionCard} onClick={() => setShowFavoritesOnly((value) => !value)}>
                    <span className={styles.actionIcon}>★</span>
                    <strong>Favorites</strong>
                    <span>Show only starred notes.</span>
                </button>

                <button className={styles.actionCard} onClick={() => setSearchTerm('')}>
                    <span className={styles.actionIcon}>↺</span>
                    <strong>Reset filters</strong>
                    <span>Clear search and sorting filters.</span>
                </button>
            </section>

            <section className={styles.summaryStrip}>
                <div className={styles.summaryItem}>
                    <span>Total Notes</span>
                    <strong>{notes.length}</strong>
                </div>
                <div className={styles.summaryItem}>
                    <span>Visible Now</span>
                    <strong>{filteredNotes.length}</strong>
                </div>
                <div className={styles.summaryItem}>
                    <span>Tags</span>
                    <strong>{allTags.length}</strong>
                </div>
            </section>

            {/* Search and Filter Section */}
            <div className={styles.filterSection}>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Search notes by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filterControls}>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="favorites">Favorites First</option>
                    </select>

                    {allTags.length > 0 && (
                        <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="">All Tags</option>
                            {allTags.map(tag => (
                                <option key={tag} value={tag}>{tag}</option>
                            ))}
                        </select>
                    )}

                    <button
                        className={`${styles.favoritesBtn} ${showFavoritesOnly ? styles.active : ''}`}
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        title="Show only favorites"
                    >
                        ★ Favorites
                    </button>
                </div>
            </div>

            {loading ? (
                <div className={styles.loading}>Loading your notes...</div>
            ) : filteredNotes.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>{notes.length === 0 ? 'No notes yet. Create your first note to get started!' : 'No notes match your filters.'}</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/create-note')}
                    >
                        Create First Note
                    </button>
                </div>
            ) : (
                <div className={styles.notesGrid} id="notes-grid">
                    {filteredNotes.map((note) => (
                        <div 
                            key={note._id} 
                            className={styles.noteCard}
                            style={{ borderLeftColor: note.color }}
                        >
                            <div className={styles.noteCardHeader}>
                                <div className={styles.noteHeader}>
                                    <h3>{note.title}</h3>
                                    <button
                                        className={styles.favoriteBtn}
                                        onClick={() => handleToggleFavorite(note._id, note.isFavorite)}
                                        title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        {note.isFavorite ? '★' : '☆'}
                                    </button>
                                </div>
                                <span className={styles.noteDate}>{formatDate(note.createdAt)}</span>
                            </div>
                            <p className={styles.noteDescription}>{note.description}</p>
                            
                            {note.tags && note.tags.length > 0 && (
                                <div className={styles.tagsContainer}>
                                    {note.tags.map(tag => (
                                        <span key={tag} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            )}

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
