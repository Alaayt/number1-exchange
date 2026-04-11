// models/Rate.js
const mongoose = require('mongoose');

const pairSchema = new mongoose.Schema({
  from:     { type: String, required: true },
  to:       { type: String, required: true },
  buyRate:  { type: Number, required: true, min: 0 },
  sellRate: { type: Number, required: true, min: 0 },
  label:    { type: String, default: '' },
  enabled:  { type: Boolean, default: true },
}, { _id: false });

const rateSchema = new mongoose.Schema({
  pairs:     { type: [pairSchema], default: [] },
  updatedBy: { type: String, default: 'system' },

  // ── حدود ثابتة (حد أدنى فقط) ───────────────
  minEgp:  { type: Number, default: 100   },
  minUsdt: { type: Number, default: 10    },
  minMgo:  { type: Number, default: 10    },

  // backward compat
  minOrderUsdt: { type: Number, default: 10 },

  // ── الحد الأقصى المبدئي (يضبطه الأدمن) ─────
  maxEgp:  { type: Number, default: 300000 },
  maxUsdt: { type: Number, default: 10000  },
  maxMgo:  { type: Number, default: 10000  },
  maxOrderUsdt: { type: Number, default: 10000 },

  // ── الرصيد المتاح (يتغير مع كل طلب مكتمل) ──
  // EGP: يزيد عند استلام EGP، ينقص عند إرسال EGP
  availableEgp:  { type: Number, default: null }, // null = لم يُضبط بعد

  // USDT: يزيد عند استلام USDT، ينقص عند إرسال USDT
  availableUsdt: { type: Number, default: null },

  // MGO: يزيد عند استلام MGO، ينقص عند إرسال MGO
  availableMgo:  { type: Number, default: null },

}, { timestamps: true });

// ── عند أول إنشاء، availableXxx = maxXxx ──────
rateSchema.pre('save', function(next) {
  if (this.isNew) {
    if (this.availableEgp  === null) this.availableEgp  = this.maxEgp
    if (this.availableUsdt === null) this.availableUsdt = this.maxUsdt
    if (this.availableMgo  === null) this.availableMgo  = this.maxMgo
  }
  next()
})

const DEFAULT_PAIRS = [
  { from: 'EGP_VODAFONE', to: 'USDT',     buyRate: 50,    sellRate: 49,    label: 'فودافون كاش ↔ USDT'     },
  { from: 'EGP_INSTAPAY', to: 'USDT',     buyRate: 50.1,  sellRate: 49.1,  label: 'إنستا باي ↔ USDT'      },
  { from: 'EGP_FAWRY',    to: 'USDT',     buyRate: 49.8,  sellRate: 48.8,  label: 'فاوري ↔ USDT'           },
  { from: 'EGP_ORANGE',   to: 'USDT',     buyRate: 49.9,  sellRate: 48.9,  label: 'أورنج كاش ↔ USDT'      },
  { from: 'USDT',         to: 'MGO',      buyRate: 0.995, sellRate: 1.005, label: 'USDT ↔ MoneyGo'         },
  { from: 'EGP_VODAFONE', to: 'MGO',      buyRate: 49.75, sellRate: 48.75, label: 'فودافون كاش ↔ MoneyGo' },
  { from: 'EGP_INSTAPAY', to: 'MGO',      buyRate: 49.75, sellRate: 48.75, label: 'إنستا باي ↔ MoneyGo'   },
  { from: 'EGP_FAWRY',    to: 'MGO',      buyRate: 49.75, sellRate: 48.75, label: 'فاوري ↔ MoneyGo'        },
  { from: 'EGP_ORANGE',   to: 'MGO',      buyRate: 49.75, sellRate: 48.75, label: 'أورنج كاش ↔ MoneyGo'   },
  { from: 'USDT',         to: 'INTERNAL', buyRate: 1,     sellRate: 1,     label: 'USDT ↔ محفظة داخلية'        },
  { from: 'INTERNAL',     to: 'USDT',     buyRate: 1,     sellRate: 1,     label: 'محفظة داخلية ↔ USDT'        },
  { from: 'INTERNAL',     to: 'MGO',      buyRate: 0.995, sellRate: 1.005, label: 'محفظة داخلية → MoneyGo'     },
  { from: 'MGO',          to: 'INTERNAL', buyRate: 0.995, sellRate: 1.005, label: 'MoneyGo → محفظة داخلية'     },
];

rateSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      pairs: DEFAULT_PAIRS,
      availableEgp:  300000,
      availableUsdt: 10000,
      availableMgo:  10000,
    })
  }
  if (doc.pairs.length === 0) { doc.pairs = DEFAULT_PAIRS; await doc.save(); }

  // ── Migration: أضف أي أزواج افتراضية مفقودة ──────────────
  const existingKeys = new Set(doc.pairs.map(p => `${p.from}|${p.to}`))
  const missingPairs = DEFAULT_PAIRS.filter(p => !existingKeys.has(`${p.from}|${p.to}`))
  if (missingPairs.length > 0) {
    await this.findOneAndUpdate({}, { $push: { pairs: { $each: missingPairs } } })
    doc = await this.findOne()
    console.log(`[Rate] Added missing default pairs: ${missingPairs.map(p => `${p.from}→${p.to}`).join(', ')}`)
  }

  // إذا availableXxx لا يزال null، اضبطه من maxXxx
  let needsSave = false
  if (doc.availableEgp  === null || doc.availableEgp  === undefined) { doc.availableEgp  = doc.maxEgp;  needsSave = true }
  if (doc.availableUsdt === null || doc.availableUsdt === undefined) { doc.availableUsdt = doc.maxUsdt; needsSave = true }
  if (doc.availableMgo  === null || doc.availableMgo  === undefined) { doc.availableMgo  = doc.maxMgo;  needsSave = true }
  if (needsSave) await doc.save()
  return doc;
};

// ── تحديث السيولة بعد طلب مكتمل ──────────────
// currencySent: 'EGP' | 'USDT' | 'MGO'
// currencyRecv: 'USDT' | 'MGO' | 'EGP'
// amountSent: المبلغ الذي أرسله العميل
// amountRecv: المبلغ الذي استلمه العميل
rateSchema.statics.applyLiquidity = async function (currencySent, currencyRecv, amountSent, amountRecv) {
  const inc = {}

  // العملة التي أرسلها العميل → نستقبلها نحن → رصيدنا يزيد
  if (currencySent === 'EGP')  inc.availableEgp  = +Math.abs(amountSent)
  if (currencySent === 'USDT') inc.availableUsdt = +Math.abs(amountSent)
  if (currencySent === 'MGO')  inc.availableMgo  = +Math.abs(amountSent)

  // العملة التي استلمها العميل → نرسلها نحن → رصيدنا ينقص
  if (currencyRecv === 'EGP')  inc.availableEgp  = (inc.availableEgp  || 0) - Math.abs(amountRecv)
  if (currencyRecv === 'USDT') inc.availableUsdt = (inc.availableUsdt || 0) - Math.abs(amountRecv)
  if (currencyRecv === 'MGO')  inc.availableMgo  = (inc.availableMgo  || 0) - Math.abs(amountRecv)

  await this.findOneAndUpdate({}, { $inc: inc })
}

rateSchema.statics.convert = async function (from, to, amount, type = 'buy') {
  const doc  = await this.getSingleton();
  const pair = doc.pairs.find(p => p.from === from && p.to === to && p.enabled);
  if (!pair) throw new Error(`No rate found for ${from} → ${to}`);
  const rate   = type === 'buy' ? pair.buyRate : pair.sellRate;
  const isEgp  = from.startsWith('EGP_');
  const result = isEgp ? amount / rate : amount * rate;
  return { rate, result: parseFloat(result.toFixed(6)), pair };
};

module.exports = mongoose.model('Rate', rateSchema);