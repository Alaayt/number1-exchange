// ============================================
// routes/wallet.js — API المحفظة
// ============================================
const express  = require('express')
const router   = express.Router()
const Wallet      = require('../models/Wallet')
const Transaction = require('../models/Transaction')
const { protect } = require('../middleware/auth')

// كل routes المحفظة تحتاج تسجيل دخول
router.use(protect)

// ─── GET /api/wallet ──────────────────────────
// جلب رصيد المستخدم + آخر المعاملات
router.get('/', async (req, res) => {
  try {
    // جلب أو إنشاء المحفظة تلقائياً
    let wallet = await Wallet.findOne({ user: req.user._id })
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id })
    }

    // آخر 10 معاملات
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)

    res.json({
      success: true,
      wallet: {
        _id:            wallet._id,
        balance:        wallet.balance,
        currency:       wallet.currency,
        totalDeposited: wallet.totalDeposited,
        totalWithdrawn: wallet.totalWithdrawn,
        isActive:       wallet.isActive,
        createdAt:      wallet.createdAt
      },
      transactions
    })

  } catch (error) {
    console.error('Get wallet error:', error)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── GET /api/wallet/transactions ─────────────
// كل المعاملات مع pagination
router.get('/transactions', async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 20
    const skip  = (page - 1) * limit

    const [transactions, total] = await Promise.all([
      Transaction.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments({ user: req.user._id })
    ])

    res.json({
      success: true,
      transactions,
      pagination: {
        page, limit, total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── POST /api/wallet/withdraw ────────────────
// طلب سحب من المستخدم
router.post('/withdraw', async (req, res) => {
  try {
    const { amount, note } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount.' })
    }

    const wallet = await Wallet.findOne({ user: req.user._id })
    if (!wallet || !wallet.isActive) {
      return res.status(400).json({ success: false, message: 'Wallet not found or inactive.' })
    }

    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: `رصيد غير كافٍ. رصيدك الحالي: ${wallet.balance} USDT`
      })
    }

    const balanceBefore = wallet.balance

    // خصم الرصيد
    wallet.balance        -= amount
    wallet.totalWithdrawn += amount
    await wallet.save()

    // تسجيل المعاملة
    const transaction = await Transaction.create({
      user:          req.user._id,
      wallet:        wallet._id,
      type:          'withdraw',
      amount,
      balanceBefore,
      balanceAfter:  wallet.balance,
      status:        'completed',
      performedBy:   'user',
      note:          note || null
    })

    res.json({
      success: true,
      message: 'تم طلب السحب بنجاح.',
      balance: wallet.balance,
      transaction
    })

  } catch (error) {
    console.error('Withdraw error:', error)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
})

module.exports = router