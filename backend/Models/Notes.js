const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotesSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    color: {
        type: String,
        default: '#34495e',
        enum: ['#34495e', '#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6', '#1abc9c']
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const NotesModel = mongoose.model('notes', NotesSchema);
module.exports = NotesModel;
