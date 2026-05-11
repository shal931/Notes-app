const NotesModel = require("../Models/Notes");

const createNote = async (req, res) => {
    try {
        const { title, description, tags, color } = req.body;
        const userId = req.user._id;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required', success: false });
        }

        const note = new NotesModel({ 
            title, 
            description, 
            userId,
            tags: tags || [],
            color: color || '#34495e'
        });
        await note.save();

        res.status(201).json({
            message: 'Note created successfully',
            success: true,
            note
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message
        });
    }
};

const getNotes = async (req, res) => {
    try {
        const userId = req.user._id;
        const notes = await NotesModel.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Notes fetched successfully',
            success: true,
            notes
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message
        });
    }
};

const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const note = await NotesModel.findById(id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found', success: false });
        }

        if (note.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Unauthorized access', success: false });
        }

        res.status(200).json({
            message: 'Note fetched successfully',
            success: true,
            note
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message
        });
    }
};

const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, tags, color, isFavorite } = req.body;
        const userId = req.user._id;

        const note = await NotesModel.findById(id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found', success: false });
        }

        if (note.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Unauthorized access', success: false });
        }

        if (title) note.title = title;
        if (description) note.description = description;
        if (tags !== undefined) note.tags = tags;
        if (color) note.color = color;
        if (isFavorite !== undefined) note.isFavorite = isFavorite;
        note.updatedAt = new Date();

        await note.save();

        res.status(200).json({
            message: 'Note updated successfully',
            success: true,
            note
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message
        });
    }
};

const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const note = await NotesModel.findById(id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found', success: false });
        }

        if (note.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Unauthorized access', success: false });
        }

        await NotesModel.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Note deleted successfully',
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message
        });
    }
};

module.exports = {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote
};
