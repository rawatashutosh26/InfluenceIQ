const mongoose = require('mongoose');

const competitorSchema = new mongoose.Schema({
  name: String,
  differentiation: String,
});

const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    report: {
      problem: String,
      customer: String,
      market: String,
      competitors: [competitorSchema],
      tech_stack: [String],
      risk_level: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
      },
      profitability_score: {
        type: Number,
        min: 0,
        max: 100,
      },
      justification: String,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Idea', ideaSchema);