function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message);
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid identifier format.' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation failed.' });
  }
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;