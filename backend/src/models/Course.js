const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true,
    },
    courseName: {
        type: String,
        required: true,
    },
    description: String,
    credits: Number,
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    semester: String,
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
});

module.exports = mongoose.model('Course', courseSchema);
