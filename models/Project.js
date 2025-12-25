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

//   slug: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     index: true,
//   },

  category: {
    type: String,
    required: true,
    enum: ["Residential", "Commercial", "Office", "Restaurant", "Hotel"],
    index: true,
  },

//   projectType: {
//     type: String,
//     enum: ["renovation", "new-design", "remodeling"],
//     required: true,
//   },

  status: {
    type: String,
    enum: ["completed", "ongoing", "upcoming"],
    default: "completed",
    index: true,
  },

  location: {
    type: String,
    required: true,
    index: true,
  },

  areaSize: {
    type: String, // 1200 sqft
  },

  budgetRange: {
    type: String, // ৳5L – ৳10L
    index: true,
  },

  completionTime: {
    type: String, // 45 days / 3 months
  },

  image: {
    type: String,
    required: true,
  },

//   galleryImages: {
//     type: [String],
//     validate: [arr => arr.length > 0, "At least one gallery image required"]
//   },

  beforeAfterImages: {
    type: [String],
  },

  videoURL: String,
  floorPlanImage: String,

  designStyle: {
    type: String,
    index: true,
  },

  colorPalette: [String],
  materialsUsed: [String],
  furnitureType: [String],
  lightingType: String,
  ceilingType: String,

  shortDescription: {
    type: String,
    required: true,
    // minlength: 50,
  },

  detailedOverview: String,
  clientRequirement: String,
  designChallenges: String,
  ourSolution: String,
  resultSummary: String,

  projectManager: String,
  designTeam: [String],
  workProcess: [String],

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

  metaTitle: String,
  metaDescription: String,
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

ProjectSchema.index({ category: 1, status: 1 });
ProjectSchema.index({ featured: -1, createdAt: -1 });
ProjectSchema.index({ budgetRange: 1, clientRating: -1 });

const Project = mongoose.model("Project", ProjectSchema)

export default Project