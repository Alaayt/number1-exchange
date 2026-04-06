// src/data/currencies.js
// ═══════════════════════════════════════════════════════════════
// المصدر الوحيد للعملات — IDs ثابتة لا تتغير أبداً
// ═══════════════════════════════════════════════════════════════

export const SEND_METHODS = [
  {
    id:     'vodafone',
    name:   'Vodafone Cash',
    symbol: 'EGP',
    type:   'egp',
    color:  '#e50000',
    img:    '/icons/vodafone.png',
  },
  {
    id:     'instapay',
    name:   'InstaPay',
    symbol: 'EGP',
    type:   'egp',
    color:  '#6a0dad',
    img:    '/icons/instapay.png',
  },
  {
    id:     'fawry',
    name:   'Fawry',
    symbol: 'EGP',
    type:   'egp',
    color:  '#f97316',
    img:    '/icons/fawry.png',
  },
  {
    id:     'orange',
    name:   'Orange Cash',
    symbol: 'EGP',
    type:   'egp',
    color:  '#ff7700',
    img:    '/icons/orange.png',
  },
  {
    id:     'usdt-trc',
    name:   'USDT TRC20',
    symbol: 'USDT',
    type:   'crypto',
    color:  '#26a17b',
    img:    '/icons/usdt.png',
  },
  {
    id:     'mgo-send',
    name:   'MoneyGo USD',
    symbol: 'MGO',
    type:   'moneygo',
    color:  '#00c17c',
    img:    '/icons/moneygo.png',
  },
  {
    id:     'wallet-usdt',
    name:   'محفظة داخلية',
    symbol: 'USDT',
    type:   'wallet',
    color:  '#378ADD',
    img:    '/icons/wallet.png',
  },
]

export const RECEIVE_METHODS = [
  {
    id:          'mgo-recv',
    name:        'MoneyGo USD',
    symbol:      'MGO',
    type:        'moneygo',
    color:       '#00c17c',
    img:         '/icons/moneygo.png',
    placeholder: 'U-XXXXXXXX',
  },
  {
    id:          'usdt-recv',
    name:        'USDT TRC20',
    symbol:      'USDT',
    type:        'crypto',
    color:       '#26a17b',
    img:         '/icons/usdt.png',
    placeholder: 'T...',
  },
  {
    id:          'wallet-recv',
    name:        'محفظة داخلية',
    symbol:      'USDT',
    type:        'wallet',
    color:       '#378ADD',
    img:         '/icons/wallet.png',
    placeholder: '',
  },
]