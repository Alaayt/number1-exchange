// routes/public.js
// ═══════════════════════════════════════════════
// Routes عامة — بدون authentication
// للمستخدمين العاديين (ExchangeForm, etc.)
// ═══════════════════════════════════════════════
const express = require('express');
const router  = express.Router();
const Rate    = require('../models/Rate');

// ─── GET /api/public/rates ────────────────────
// جلب الأسعار الحالية للمستخدمين
router.get('/rates', async (req, res) => {
  try {
    const rates = await Rate.getSingleton();

    // نرجع فقط ما يحتاجه المستخدم
    res.json({
      success: true,
      usdtBuyRate:     rates.usdtBuyRate,
      usdtSellRate:    rates.usdtSellRate,
      moneygoRate:     rates.moneygoRate,
      vodafoneBuyRate: rates.vodafoneBuyRate,
      instaPayRate:    rates.instaPayRate,
      fawryRate:       rates.fawryRate,
      orangeRate:      rates.orangeRate,
      minOrderUsdt:    rates.minOrderUsdt,
      maxOrderUsdt:    rates.maxOrderUsdt,
      updatedAt:       rates.updatedAt,
    });
  } catch (error) {
    console.error('Public rates error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;