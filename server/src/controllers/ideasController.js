const Idea = require('../models/Idea');
const { generateReport, generateFallbackReport } = require('../services/aiService');
const mongoose = require('mongoose');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// POST /ideas — Create idea + trigger AI analysis
async function createIdea(req, res, next) {
  try {
    const { title, description } = req.body;
    const cleanTitle = typeof title === 'string' ? title.trim() : '';
    const cleanDescription = typeof description === 'string' ? description.trim() : '';

    if (!cleanTitle || !cleanDescription) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }
    if (cleanTitle.length < 4 || cleanDescription.length < 20) {
      return res.status(400).json({ error: 'Title must be >= 4 chars and description >= 20 chars.' });
    }

    // Save idea first with pending status
    const idea = new Idea({ title: cleanTitle, description: cleanDescription, status: 'pending' });
    await idea.save();

    // Generate AI report
    try {
      const report = await generateReport(cleanTitle, cleanDescription);
      idea.report = report;
      idea.status = 'completed';
    } catch (aiError) {
      console.error('AI generation failed:', aiError.message);
      idea.report = generateFallbackReport(cleanTitle, cleanDescription, aiError.message);
      idea.status = 'completed';
    }

    await idea.save();
    res.status(201).json(idea);
  } catch (err) {
    next(err);
  }
}

// GET /ideas — List all ideas
async function getIdeas(req, res, next) {
  try {
    const ideas = await Idea.find()
      .select('title description status report.profitability_score report.risk_level createdAt')
      .sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    next(err);
  }
}

// GET /ideas/:id — Get single idea with full report
async function getIdeaById(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid idea id.' });
    }
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: 'Idea not found.' });
    res.json(idea);
  } catch (err) {
    next(err);
  }
}

// DELETE /ideas/:id — Delete an idea
async function deleteIdea(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid idea id.' });
    }
    const idea = await Idea.findByIdAndDelete(req.params.id);
    if (!idea) return res.status(404).json({ error: 'Idea not found.' });
    res.json({ message: 'Idea deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

// POST /ideas/:id/reanalyze — Regenerate report for an existing idea
async function reanalyzeIdea(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid idea id.' });
    }

    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: 'Idea not found.' });

    idea.status = 'pending';
    await idea.save();

    try {
      const report = await generateReport(idea.title, idea.description);
      idea.report = report;
      idea.status = 'completed';
    } catch (aiError) {
      console.error('AI reanalysis failed:', aiError.message);
      idea.report = generateFallbackReport(idea.title, idea.description, aiError.message);
      idea.status = 'completed';
    }

    await idea.save();
    res.json(idea);
  } catch (err) {
    next(err);
  }
}

module.exports = { createIdea, getIdeas, getIdeaById, deleteIdea, reanalyzeIdea };