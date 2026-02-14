const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Healthcare', 'Education', 'Salary', 'Other']
  },
  type: {
    type: String,
    required: true,
    enum: ['expense', 'income'],
    default: 'expense'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);