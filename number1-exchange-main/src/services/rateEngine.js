// src/services/rateEngine.js
// ═══════════════════════════════════════════════════════════════
// محرك الأسعار — المصدر الوحيد لكل منطق الحساب
//
// القاعدة الذهبية:
//   كل زوج (from → to) له سعر واحد محدد بشكل صريح.
//   لا يوجد dynamic keys، لا fallback عشوائي.
//
// الأسعار في DB:
//   usdtBuyRate     — نحن نشتري USDT  (مستخدم يرسل USDT، يستلم EGP/MGO)
//   usdtSellRate    — نحن نبيع USDT   (مستخدم يرسل EGP، يستلم USDT)
//   moneygoRate     — سعر MoneyGo ↔ USDT
//   vodafoneBuyRate — سعر Vodafone Cash (EGP → USDT/MGO)
//   instaPayRate    — سعر InstaPay     (EGP → USDT/MGO)
//   fawryRate       — سعر Fawry        (EGP → USDT/MGO)
//   orangeRate      — سعر Orange Cash  (EGP → USDT/MGO)
// ═══════════════════════════════════════════════════════════════

// ── خريطة الأسعار — صريحة 100% ─────────────────────────────
// البنية: RATE_MAP[fromId][toId] = دالة تأخذ (rates) وترجع رقم
//
// المنطق المالي:
//   EGP → MGO/USDT : المستخدم يرسل جنيه → نقسم على السعر
//                    مثال: 500 EGP ÷ 50 = 10 USDT
//                    divide: true
//
//   USDT → MGO     : المستخدم يرسل USDT → نضرب في سعر البيع
//                    مثال: 10 USDT × 0.98 = 9.8 MGO
//                    divide: false
//
//   MGO → USDT     : المستخدم يرسل MGO → نضرب في moneygoRate
//                    divide: false
//
//   USDT ↔ wallet  : 1:1 دائماً
// ─────────────────────────────────────────────────────────────

const RATE_MAP = {

  // ── Vodafone Cash (EGP) → ────────────────────────────────
  'vodafone': {
    'mgo-recv':  (r) => ({ rate: r.vodafoneBuyRate, divide: true }),
    'usdt-recv': (r) => ({ rate: r.vodafoneBuyRate, divide: true }),
  },

  // ── InstaPay (EGP) → ─────────────────────────────────────
  'instapay': {
    'mgo-recv':  (r) => ({ rate: r.instaPayRate, divide: true }),
    'usdt-recv': (r) => ({ rate: r.instaPayRate, divide: true }),
  },

  // ── Fawry (EGP) → ────────────────────────────────────────
  'fawry': {
    'mgo-recv':  (r) => ({ rate: r.fawryRate, divide: true }),
    'usdt-recv': (r) => ({ rate: r.fawryRate, divide: true }),
  },

  // ── Orange Cash (EGP) → ──────────────────────────────────
  'orange': {
    'mgo-recv':  (r) => ({ rate: r.orangeRate, divide: true }),
    'usdt-recv': (r) => ({ rate: r.orangeRate, divide: true }),
  },

  // ── USDT TRC20 → ─────────────────────────────────────────
  'usdt-trc': {
    // USDT → MoneyGo: نبيع USDT ونعطي دولار MoneyGo
    'mgo-recv':    (r) => ({ rate: r.usdtBuyRate,  divide: false }),
    // USDT → محفظة داخلية: 1:1
    'wallet-recv': ()  => ({ rate: 1,              divide: false }),
  },

  // ── MoneyGo USD → ────────────────────────────────────────
  'mgo-send': {
    // MoneyGo → USDT
    'usdt-recv': (r) => ({ rate: r.moneygoRate, divide: false }),
  },

  // ── محفظة داخلية → ───────────────────────────────────────
  'wallet-usdt': {
    // محفظة → USDT TRC20: 1:1
    'usdt-recv': () => ({ rate: 1, divide: false }),
    // محفظة → MoneyGo
    'mgo-recv':  (r) => ({ rate: r.usdtBuyRate, divide: false }),
  },
}

// ════════════════════════════════════════════════════════════
// getRate — الدالة الوحيدة المسموح استخدامها في كل المشروع
//
// @param fromId  — ID وسيلة الإرسال  (من SEND_METHODS)
// @param toId    — ID وسيلة الاستلام (من RECEIVE_METHODS)
// @param rates   — كائن الأسعار من API  (/api/public/rates)
//
// @returns { rate: number, divide: boolean }
//   rate   — السعر المطبّق
//   divide — true  = receiveAmount = sendAmount ÷ rate  (EGP → USDT)
//            false = receiveAmount = sendAmount × rate  (USDT → MGO)
// ════════════════════════════════════════════════════════════
export function getRate(fromId, toId, rates) {
  const DEFAULT_RATE = { rate: 1, divide: false }

  if (!fromId || !toId || !rates) return DEFAULT_RATE

  const fromMap = RATE_MAP[fromId]
  if (!fromMap) {
    console.warn(`[rateEngine] Unknown fromId: "${fromId}"`)
    return DEFAULT_RATE
  }

  const rateFunc = fromMap[toId]
  if (!rateFunc) {
    console.warn(`[rateEngine] No rate defined for: "${fromId}" → "${toId}"`)
    return DEFAULT_RATE
  }

  const result = rateFunc(rates)

  // تحقق من صحة السعر
  if (!result.rate || result.rate <= 0) {
    console.warn(`[rateEngine] Invalid rate for "${fromId}" → "${toId}":`, result.rate)
    return DEFAULT_RATE
  }

  return result
}

// ════════════════════════════════════════════════════════════
// calcReceiveAmount — حساب المبلغ المستلَم
// ════════════════════════════════════════════════════════════
export function calcReceiveAmount(sendAmount, fromId, toId, rates) {
  const amt = parseFloat(sendAmount) || 0
  if (amt <= 0) return ''

  const { rate, divide } = getRate(fromId, toId, rates)
  const result = divide ? amt / rate : amt * rate
  return result.toFixed(4)
}

// ════════════════════════════════════════════════════════════
// getRateDisplay — نص السعر للعرض في الواجهة
// ════════════════════════════════════════════════════════════
export function getRateDisplay(fromId, toId, rates, fromSymbol, toSymbol) {
  if (!rates) return '...'
  const { rate, divide } = getRate(fromId, toId, rates)

  if (divide) {
    // 1 USDT = 50 EGP (أي المستخدم يدفع 50 جنيه ليحصل على 1 USDT)
    return `1 ${toSymbol || 'USDT'} = ${rate.toFixed(2)} ${fromSymbol || 'EGP'}`
  } else {
    // 1 USDT = 0.98 MGO
    return `1 ${fromSymbol || 'USDT'} = ${rate.toFixed(4)} ${toSymbol || 'MGO'}`
  }
}

// ════════════════════════════════════════════════════════════
// toOrderType — تحويل (fromId, toId) → orderType للـ backend
// ════════════════════════════════════════════════════════════
export function toOrderType(fromId, toId) {
  const MAP = {
    'usdt-trc:wallet-recv':  'USDT_TO_WALLET',
    'usdt-trc:mgo-recv':     'USDT_TO_MONEYGO',
    'wallet-usdt:usdt-recv': 'WALLET_TO_USDT',
    'wallet-usdt:mgo-recv':  'WALLET_TO_MONEYGO',
    'mgo-send:usdt-recv':    'MONEYGO_TO_USDT',
  }

  const key = `${fromId}:${toId}`
  const result = MAP[key]

  if (!result) {
    // EGP methods → MoneyGo/USDT
    const egpSenders = ['vodafone', 'instapay', 'fawry', 'orange']
    if (egpSenders.includes(fromId)) return 'EGP_WALLET_TO_MONEYGO'

    console.warn(`[rateEngine] Unknown orderType for: "${fromId}" → "${toId}"`)
    return 'EGP_WALLET_TO_MONEYGO'
  }

  return result
}

// ════════════════════════════════════════════════════════════
// toPaymentMethod — تحويل fromId → payment.method للـ backend
// ════════════════════════════════════════════════════════════
export function toPaymentMethod(fromId) {
  const MAP = {
    'vodafone':    'VODAFONE_CASH',
    'instapay':    'INSTAPAY',
    'fawry':       'FAWRY',
    'orange':      'ORANGE_CASH',
    'usdt-trc':    'USDT_TRC20',
    'mgo-send':    'MONEYGO',
    'wallet-usdt': 'WALLET',
  }
  return MAP[fromId] || 'VODAFONE_CASH'
}

// ════════════════════════════════════════════════════════════
// getCurrencySent — العملة المرسلة حسب fromId
// ════════════════════════════════════════════════════════════
export function getCurrencySent(fromId) {
  const egpSenders = ['vodafone', 'instapay', 'fawry', 'orange']
  if (egpSenders.includes(fromId)) return 'EGP'
  if (fromId === 'mgo-send')       return 'MGO'
  return 'USDT'
}