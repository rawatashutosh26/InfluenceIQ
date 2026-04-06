const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {
  createIdea,
  getIdeas,
  getIdeaById,
  deleteIdea,
  reanalyzeIdea,
} = require('../controllers/ideasController');

router.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database is unavailable. Check MongoDB Atlas credentials and IP whitelist.',
    });
  }
  next();
});

router.post('/', createIdea);
router.get('/', getIdeas);
router.get('/:id', getIdeaById);
router.post('/:id/reanalyze', reanalyzeIdea);
router.delete('/:id', deleteIdea);

module.exports = router;