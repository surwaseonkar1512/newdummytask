const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String },
  source: { 
    type: String, 
    enum: ['product', 'custom', 'contact', 'manual'],
    required: true
  },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'quotation', 'closed'],
    default: 'new'
  },
  
  // Specific properties depending on source
  product: {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    size: String,
    color: String
  },
  
  customDetails: {
    description: String,
    image: { url: String, public_id: String }
  },

  quotation: {
    price: Number,
    description: String,
    sentAt: Date
  },

  notes: [noteSchema],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
