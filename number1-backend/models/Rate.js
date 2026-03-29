// models/Rate.js
// ═══════════════════════════════════════════════
// نموذج الأسعار — يُخزّن كل أسعار الصرف
// يكون دائماً سجل واحد فقط في قاعدة البيانات
// ═══════════════════════════════════════════════
const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema(
  {
    // USDT ↔ EGP
    usdtBuyRate:  { type: Number, default: 50.00 }, // نحن نشتري USDT بهذا السعر
    usdtSellRate: { type: Number, default: 49.50 }, // نحن نبيع USDT بهذا السعر

    // USDT ↔ MoneyGo USD
    moneygoRate: { type: Number, default: 1.00 },

    // محافظ إلكترونية
    vodafoneBuyRate: { type: Number, default: 50.00 },
    instaPayRate:    { type: Number, default: 50.10 },
    fawryRate:       { type: Number, default: 49.80 },
    orangeRate:      { type: Number, default: 49.90 },

    // حدود المعاملات
    minOrderUsdt: { type: Number, default: 10  },
    maxOrderUsdt: { type: Number, default: 5000 },

    // آخر من عدّل
    updatedBy: { type: String, default: 'system' },
  },
  { timestamps: true }
);

// ── دالة مساعدة: جلب السجل الوحيد أو إنشاؤه ──
rateSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

module.exports = mongoose.model('Rate', rateSchema);