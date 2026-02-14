const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Get all transactions
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = { user: req.user.id };
    
    // Filters
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }
    if (req.query.type && req.query.type !== 'All') {
      query.type = req.query.type;
    }
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.startDate || req.query.endDate) {
      query.date = {};
      if (req.query.startDate) query.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) query.date.$lte = new Date(req.query.endDate);
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Transaction.countDocuments(query);
    
    res.json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get summary
router.get('/summary', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    
    const categoryBreakdown = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    
    const recentTransactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(5);
    
    res.json({
      totalIncome,
      totalExpenses,
      balance,
      categoryBreakdown,
      recentTransactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create transaction
router.post('/', auth, async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      user: req.user.id
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;