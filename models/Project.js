import mongoose from "mongoose";
/**
 * 

: 
"asas"
 */
const ProjectSchema = new mongoose.Schema({

  projectTitle: {
    type: String,
    required: [true, "Project title is required"],
    trim: true,
    minlength: 3,
    index: true,
  },

  category: {
    type: String,
    required: true,
    lowercase : true,
    index: true,
  },

  location: {
    type: String,
    required: true,
    index: true,
  },

  areaSize: {
    type: String,
  },

  budgetRange: {
    type: String, 
    index: true,
  },

  completionTime: {
    type: String, 
  },

  image: {
    type: String,
    required: true,
  },

  galleryImages: {
    type: [String],
    // validate: [arr => arr.length > 0, "At least one gallery image required"]
  },

  shortDescription: {
    type: String,
    required: true,
    // minlength: 50,
  },

  clientReview: String,

  clientRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
    index: true,
  },

  testimonialImage: String,

  featured: {
    type: Boolean,
    default: false,
    index: true,
  },

  visibility: {
    type: String,
    enum: ["public", "draft", "private"],
    default: "public",
    index: true,
  },

  tags: [String],

  isActive: {
    type: Boolean,
    default: true,
    index: true,
  }

}, { timestamps: true });

ProjectSchema.index({
  projectTitle: "text",
  shortDescription: "text",
  location: "text",
  category: "text",
  tags: "text",
});

// 📂 Filter projects by category + visibility (public / draft / private)
ProjectSchema.index({ category: 1, visibility: 1 });

// ⭐ Sort by rating inside budget filter
ProjectSchema.index({ budgetRange: 1, clientRating: -1 });

const Project = mongoose.model("Project", ProjectSchema)

export default Project