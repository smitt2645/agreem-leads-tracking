const express = require('express');
const router = express.Router();
const leadRoutes = require('./leadRoutes');

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/leads', leadRoutes);

module.exports = router;
