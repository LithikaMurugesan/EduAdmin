const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  dateOfBirth: Date,
  address: String,
  enrollmentDate: Date,
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
  },
  status: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  academicStatus: {
    type: String,
    enum: ["Active", "Graduated", "Dropped"],
    default: "Active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

module.exports = mongoose.model("Student", studentSchema);
