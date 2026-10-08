const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead
} = require('../controllers/leadController');
const {
  getNotesByLeadId,
  createNote
} = require('../controllers/noteController');
const {
  validateCreateLead,
  validateUpdateLead,
  validateCreateNote
} = require('../middlewares/validate');

router.get('/', getLeads);
router.post('/', validateCreateLead, createLead);
router.get('/:id', getLeadById);
router.patch('/:id', validateUpdateLead, updateLead);
router.delete('/:id', deleteLead);

router.get('/:id/notes', getNotesByLeadId);
router.post('/:id/notes', validateCreateNote, createNote);

module.exports = router;
