const { createNote, getNotes, getNoteById, updateNote, deleteNote } = require('../Controllers/NotesController');
const { verifyToken } = require('../Middlewares/AuthToken');

const router = require('express').Router();

router.post('/create', verifyToken, createNote);
router.get('/all', verifyToken, getNotes);
router.get('/:id', verifyToken, getNoteById);
router.put('/:id', verifyToken, updateNote);
router.delete('/:id', verifyToken, deleteNote);

module.exports = router;
