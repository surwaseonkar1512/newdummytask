const Lead = require('../models/Lead');
const sendEmail = require('../utils/sendEmail');

const createLead = async (req, res) => {
  try {
    const leadParams = { ...req.body };
    
    // Prevent exactly identical lead in short time (basic logic)
    const recentLead = await Lead.findOne({ email: req.body.email, source: req.body.source }).sort({ createdAt: -1 });
    if (recentLead && Date.now() - recentLead.createdAt < 60000) { 
      return res.status(400).json({ message: 'Duplicate lead detected' });
    }

    const lead = new Lead(leadParams);
    const createdLead = await lead.save();

    // Optionally notify admin
    try {
      if (process.env.EMAIL_USER) {
        await sendEmail({
          to: process.env.EMAIL_USER,
          subject: `New Lead: ${lead.source}`,
          text: `You have received a new inquiry from ${lead.name} (${lead.email}).`
        });
      }
    } catch (err) {
      console.log('Admin notification email failed', err.message);
    }

    res.status(201).json(createdLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeads = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { isDeleted: false };
    if (status) query.status = status;

    const leads = await Lead.find(query).populate('product.productId', 'name').populate('assignedTo', 'name').sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('product.productId').populate('notes.createdBy', 'name').populate('assignedTo', 'name');
    if (lead && !lead.isDeleted) {
      res.json(lead);
    } else {
      res.status(404).json({ message: 'Lead not found or deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (lead && !lead.isDeleted) {
      Object.assign(lead, req.body);
      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (lead && !lead.isDeleted) {
      lead.status = status;
      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addQuotation = async (req, res) => {
  try {
    const { price, description } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (lead && !lead.isDeleted) {
      lead.quotation = { price, description, sentAt: new Date() };
      lead.status = 'quotation'; // Automatically bump state
      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addNoteToLead = async (req, res) => {
  try {
    const { text } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (lead && !lead.isDeleted) {
      const note = { text, createdBy: req.user._id };
      lead.notes.push(note);
      await lead.save();
      res.status(201).json(lead.notes);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (lead) {
      lead.isDeleted = true;
      await lead.save();
      res.json({ message: 'Lead softly deleted' });
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeadAnalytics = async (req, res) => {
  try {
    // Current month start
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Prev month start and end
    const startOfPrevMonth = new Date(startOfMonth);
    startOfPrevMonth.setMonth(startOfPrevMonth.getMonth() - 1);
    const endOfPrevMonth = new Date(startOfMonth);
    endOfPrevMonth.setMilliseconds(-1);

    // Aggregations
    const totalLeads = await Lead.countDocuments({ isDeleted: false, createdAt: { $gte: startOfMonth } });
    const prevTotalLeads = await Lead.countDocuments({ isDeleted: false, createdAt: { $gte: startOfPrevMonth, $lte: endOfPrevMonth } });
    
    const quotationsSent = await Lead.countDocuments({ isDeleted: false, 'quotation.sentAt': { $exists: true } });
    const closedWon = await Lead.countDocuments({ isDeleted: false, status: 'closed' }); 
    const totalEver = await Lead.countDocuments({ isDeleted: false });

    // Sources breakdown
    const sourceBreakdown = await Lead.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    // Status breakdown
    const statusBreakdown = await Lead.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      metrics: {
        totalLeads,
        prevTotalLeads,
        quotationsSent,
        closedWon,
        totalEver,
        conversionRate: totalEver > 0 ? ((closedWon / totalEver) * 100).toFixed(1) : 0
      },
      charts: {
        sources: sourceBreakdown,
        status: statusBreakdown
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createLead, 
  getLeads, 
  getLeadById, 
  updateLead, 
  updateLeadStatus,
  addQuotation,
  addNoteToLead, 
  deleteLead,
  getLeadAnalytics
};
