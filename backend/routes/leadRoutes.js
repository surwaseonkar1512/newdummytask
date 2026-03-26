const express = require('express');
const router = express.Router();
const { 
  createLead, 
  getLeads, 
  getLeadById, 
  updateLead, 
  updateLeadStatus,
  addQuotation,
  addNoteToLead, 
  deleteLead,
  getLeadAnalytics
} = require('../controllers/leadController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/analytics/dashboard', protect, admin, getLeadAnalytics);

router.route('/')
  .post(createLead)
  .get(protect, admin, getLeads);

router.route('/:id')
  .get(protect, admin, getLeadById)
  .put(protect, admin, updateLead)
  .delete(protect, admin, deleteLead);

router.patch('/:id/status', protect, admin, updateLeadStatus);
router.put('/:id/quotation', protect, admin, addQuotation);

router.route('/:id/notes')
  .post(protect, admin, addNoteToLead);

module.exports = router;
