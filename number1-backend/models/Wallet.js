// ============================================
// models/Wallet.js — محفظة المستخدم
// ============================================
const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({

  // ─── المستخدم ─────────────────────────────
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // محفظة واحدة لكل مستخدم
  },

  // ─── الرصيد ───────────────────────────────
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },

  currency: {
    type: String,
    default: 'USDT'
  },

  // ─── الإجماليات ───────────────────────────
  totalDeposited: { type: Number, default: 0 },
  totalWithdrawn: { type: Number, default: 0 },

  // ─── الحالة ───────────────────────────────
  isActive: {
    type: Boolean,
    default: true
  },

  // ─── ملاحظة الأدمن ────────────────────────
  adminNote: {
    type: String,
    default: null
  }

}, { timestamps: true })

module.exports = mongoose.model('Wallet', walletSchema)