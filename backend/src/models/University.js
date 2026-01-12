const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  state: String,
  country: { type: String, default: "India" },
  address: String,
  postalCode: String,
  phone: String,
  email: String,
  website: String,
  establishedYear: { type: Number, default: new Date().getFullYear() },
  university_type: {
    type: String,
    enum: ["Public", "Private", "Deemed", "Autonomous"],
    default: "Public",
  },
  accreditation_status: {
    type: String,
    enum: ["Accredited", "Pending", "Not Accredited"],
    default: "Pending",
  },
  description: String,
  facilities: { type: [String], default: [] },
  programs_offered: { type: [String], default: [] },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

// Async-safe pre-save hook to auto-generate code
universitySchema.pre("save", function () {
  if (!this.code) {
    const timestamp = Date.now().toString().slice(-5);
    const random = Math.floor(100 + Math.random() * 900);
    this.code = `UNI${timestamp}${random}`;
  }
});

module.exports = mongoose.model("University", universitySchema);
