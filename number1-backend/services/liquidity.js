// services/liquidity.js
// Single source of truth for liquidity updates after completed orders.
//
// Responsibilities:
//   1. Map orderType → { currencySent, currencyRecv }
//   2. Call Rate.applyLiquidity with correct values
//
// Rules:
//   - currencySent  = what the CUSTOMER sent us   → our balance INCREASES
//   - currencyRecv  = what we send the CUSTOMER    → our balance DECREASES
//   - Called ONLY when an order transitions to "completed" (enforced by callers)

const Rate = require('../models/Rate')

// ── Lookup table: orderType → currencies ─────────────────────────────────────
// Add new order types here; no other file needs to change.
const ORDER_TYPE_CURRENCIES = {
  EGP_TO_USDT:            { currencySent: 'EGP',  currencyRecv: 'USDT' },
  EGP_TO_MONEYGO:         { currencySent: 'EGP',  currencyRecv: 'MGO'  },
  USDT_TO_MONEYGO:        { currencySent: 'USDT', currencyRecv: 'MGO'  },
  USDT_TO_WALLET:         { currencySent: 'USDT', currencyRecv: 'USDT' },
  WALLET_TO_USDT:         { currencySent: 'USDT', currencyRecv: 'USDT' },
  WALLET_TO_MONEYGO:      { currencySent: 'USDT', currencyRecv: 'MGO'  },
  MONEYGO_TO_USDT:        { currencySent: 'MGO',  currencyRecv: 'USDT' },
  MONEYGO_TO_WALLET:      { currencySent: 'MGO',  currencyRecv: 'USDT' },
  EGP_WALLET_TO_MONEYGO:  { currencySent: 'EGP',  currencyRecv: 'MGO'  },
}

// ── Derive currencies for an order ──────────────────────────────────────────
function getCurrenciesForOrder(order) {
  const ot = order.orderType || ''
  const mapped = ORDER_TYPE_CURRENCIES[ot]
  if (mapped) return mapped

  // Unknown type — fall back to what the order says; log a warning so it's visible
  const currencySent = order.payment?.currencySent || 'USDT'
  console.warn(`[Liquidity] Unknown orderType "${ot}" for order ${order.orderNumber}. Falling back to currencySent=${currencySent}, currencyRecv=USDT. Add this type to ORDER_TYPE_CURRENCIES.`)
  return { currencySent, currencyRecv: 'USDT' }
}

// ── Apply liquidity update for a completed order ─────────────────────────────
// Returns true on success, false on failure (never throws — callers should not
// block the order confirmation if liquidity tracking fails).
async function applyLiquidity(order) {
  try {
    const { currencySent, currencyRecv } = getCurrenciesForOrder(order)
    const amountSent = parseFloat(order.payment?.amountSent) || 0
    const amountRecv = parseFloat(order.exchangeRate?.finalAmountUSD ?? order.moneygo?.amountUSD) || 0

    if (amountSent <= 0 && amountRecv <= 0) {
      console.warn(`[Liquidity] Order ${order.orderNumber} has zero amounts — skipping update.`)
      return false
    }

    await Rate.applyLiquidity(currencySent, currencyRecv, amountSent, amountRecv)
    console.log(`[Liquidity] Order ${order.orderNumber}: +${amountSent} ${currencySent} | -${amountRecv} ${currencyRecv}`)
    return true
  } catch (err) {
    console.error(`[Liquidity] Failed for order ${order.orderNumber}:`, err.message)
    return false
  }
}

module.exports = { applyLiquidity, getCurrenciesForOrder, ORDER_TYPE_CURRENCIES }
