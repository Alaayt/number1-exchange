// src/data/currencies.js — كل بيانات المشروع

export const TICKER_DATA = [
  { symbol:'BTC/USD',  price:'67,420',  change:'+2.4%', up:true  },
  { symbol:'ETH/USD',  price:'3,840',   change:'-0.8%', up:false },
  { symbol:'USDT/MGO', price:'1.00598', change:'+0.1%', up:true  },
  { symbol:'BNB/USD',  price:'580',     change:'+1.2%', up:true  },
  { symbol:'TON/USD',  price:'6.84',    change:'+3.5%', up:true  },
  { symbol:'LTC/USD',  price:'84.20',   change:'-1.1%', up:false },
  { symbol:'XRP/USD',  price:'0.584',   change:'+4.2%', up:true  },
  { symbol:'SOL/USD',  price:'186',     change:'+2.1%', up:true  },
]

export const RATES_DATA = [
  { name:'Bitcoin',  symbol:'BTC',  price:67420.5, change:2.4,  up:true  },
  { name:'Ethereum', symbol:'ETH',  price:3840.2,  change:0.8,  up:false },
  { name:'USDT',     symbol:'USDT', price:1.0,     change:0.01, up:true  },
  { name:'MoneyGo',  symbol:'MGO',  price:0.994,   change:0.1,  up:true  },
  { name:'BNB',      symbol:'BNB',  price:580.4,   change:1.2,  up:true  },
  { name:'Toncoin',  symbol:'TON',  price:6.84,    change:3.5,  up:true  },
  { name:'Litecoin', symbol:'LTC',  price:84.2,    change:1.1,  up:false },
  { name:'XRP',      symbol:'XRP',  price:0.584,   change:4.2,  up:true  },
  { name:'Solana',   symbol:'SOL',  price:186.4,   change:2.1,  up:true  },
  { name:'Cardano',  symbol:'ADA',  price:0.612,   change:0.8,  up:true  },
]

export const PAIRS = [
  { from:'USDT',     fromNet:'TRC20', to:'MoneyGo', toNet:'MGO',   fromColor:'#26a17b', toColor:'#e91e63', fromSym:'₮', toSym:'M' },
  { from:'Bitcoin',  fromNet:'BTC',   to:'MoneyGo', toNet:'MGO',   fromColor:'#f7931a', toColor:'#e91e63', fromSym:'₿', toSym:'M' },
  { from:'Ethereum', fromNet:'ETH',   to:'MoneyGo', toNet:'MGO',   fromColor:'#627eea', toColor:'#e91e63', fromSym:'Ξ', toSym:'M' },
  { from:'BNB',      fromNet:'BEP20', to:'USDT',    toNet:'TRC20', fromColor:'#f0b90b', toColor:'#26a17b', fromSym:'B', toSym:'₮' },
  { from:'Toncoin',  fromNet:'TON',   to:'USDT',    toNet:'TRC20', fromColor:'#0098ea', toColor:'#26a17b', fromSym:'T', toSym:'₮' },
  { from:'Solana',   fromNet:'SOL',   to:'USDT',    toNet:'TRC20', fromColor:'#9945ff', toColor:'#26a17b', fromSym:'S', toSym:'₮' },
]

export const SEND_METHODS = [
  { id:'vodafone',  name:'فودافون كاش',  nameEn:'Vodafone Cash',  symbol:'V', color:'#e40000', type:'egp',    flag:'🇪🇬' },
  { id:'instapay',  name:'إنستا باي',    nameEn:'Instapay',       symbol:'I', color:'#1a56db', type:'egp',    flag:'🇪🇬' },
  { id:'etisalat',  name:'اتصالات كاش',  nameEn:'Etisalat Cash',  symbol:'E', color:'#009a44', type:'egp',    flag:'🇪🇬' },
  { id:'usdt-trc',  name:'USDT',         nameEn:'USDT',           symbol:'₮', color:'#26a17b', type:'crypto', flag:'🔷' },
  { id:'mgo-send',  name:'MoneyGo USD',  nameEn:'MoneyGo USD',    symbol:'M', color:'#e91e63', type:'crypto', flag:'💳' },
]

export const RECEIVE_METHODS = [
  { id:'mgo-recv',  name:'MoneyGo USD', nameEn:'MoneyGo USD', symbol:'M', color:'#e91e63', type:'crypto' },
  { id:'usdt-recv', name:'USDT TRC20',  nameEn:'USDT TRC20',  symbol:'₮', color:'#26a17b', type:'crypto' },
]

export const TRANSFER_INFO = {
  vodafone:   { labelAr:'رقم فودافون كاش',        labelEn:'Vodafone Cash Number',     value:'01012345678',                          noteAr:'حوّل باسم: NUMBER 1 EXCHANGE', noteEn:'Transfer to: NUMBER 1 EXCHANGE' },
  instapay:   { labelAr:'رقم إنستا باي',           labelEn:'Instapay Number',          value:'01098765432',                          noteAr:'من تطبيق البنك — إنستا باي',   noteEn:'Via banking app — Instapay' },
  etisalat:   { labelAr:'رقم اتصالات كاش',         labelEn:'Etisalat Cash Number',     value:'01112345678',                          noteAr:'حوّل باسم: NUMBER 1 EXCHANGE', noteEn:'Transfer to: NUMBER 1 EXCHANGE' },
  'usdt-trc': { labelAr:'عنوان محفظة USDT TRC20',  labelEn:'USDT TRC20 Wallet Address',value:'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', noteAr:'تأكد من شبكة TRC20 فقط',      noteEn:'TRC20 network only' },
  'mgo-send': { labelAr:'معرف محفظة MoneyGo',      labelEn:'MoneyGo Wallet ID',        value:'MGO-N1-EXCHANGE-2024',                 noteAr:'أرسل على هذا المعرف بالضبط',  noteEn:'Send to this exact ID' },
}

export const EXCHANGE_RATES = {
  'vodafone_mgo-recv':   0.0265,
  'vodafone_usdt-recv':  0.0265,
  'instapay_mgo-recv':   0.0265,
  'instapay_usdt-recv':  0.0265,
  'etisalat_mgo-recv':   0.0263,
  'etisalat_usdt-recv':  0.0263,
  'usdt-trc_mgo-recv':   1.00598,
  'usdt-trc_usdt-recv':  1.0,
  'mgo-send_usdt-recv':  0.9945,
  'mgo-send_mgo-recv':   1.0,
}

export const REVIEWS = [
  { name:'زكريا عمر',  nameEn:'Zakaria Omar',  color:'linear-gradient(135deg,#00d2ff,#7c5cfc)', date:'03/14', textAr:'أفضل خدمة تبادل! سريع وموثوق جداً',      textEn:'Best exchange service! Very fast and reliable' },
  { name:'محتار عدن',  nameEn:'Mokhtar Aden',  color:'linear-gradient(135deg,#c8a84b,#f59e0b)', date:'03/13', textAr:'خدمة ممتازة وسريعة، أنصح بها',           textEn:'Excellent and fast service, highly recommended' },
  { name:'أحمد سالم',  nameEn:'Ahmed Salem',   color:'linear-gradient(135deg,#00e5a0,#00b3d9)', date:'03/12', textAr:'تجربة رائعة أنصح بها بشدة',              textEn:'Wonderful experience, strongly recommend it' },
]

export const FEATURES = [
  { icon:'⚡', titleAr:'معاملات فورية',      titleEn:'Instant Transactions',   descAr:'تتم عمليات التبادل خلال ثوانٍ مع تأكيد فوري وإشعارات لحظية',                             descEn:'Exchange operations complete in seconds with instant confirmation and real-time notifications' },
  { icon:'🔐', titleAr:'أمان عالي المستوى',  titleEn:'High-Level Security',    descAr:'تشفير AES-256 وحماية متعددة الطبقات لضمان سلامة أموالك وبياناتك',                       descEn:'AES-256 encryption and multi-layer protection to ensure the safety of your funds and data' },
  { icon:'💬', titleAr:'دعم 24/7',            titleEn:'24/7 Support',           descAr:'فريق متخصص متاح على مدار الساعة عبر الدردشة والبريد والتيليجرام',                       descEn:'Specialized team available around the clock via chat, email and Telegram' },
  { icon:'💰', titleAr:'أفضل الأسعار',        titleEn:'Best Rates',             descAr:'رسوم تنافسية تبدأ من 0.1% فقط مع أفضل أسعار الصرف في السوق',                          descEn:'Competitive fees starting from just 0.1% with the best exchange rates in the market' },
  { icon:'🌍', titleAr:'تغطية عالمية',        titleEn:'Global Coverage',        descAr:'خدماتنا متاحة في أكثر من 50 دولة مع دعم كامل للعملات الرقمية',                         descEn:'Our services are available in more than 50 countries with full support for digital currencies' },
  { icon:'📊', titleAr:'أزواج متنوعة',        titleEn:'Diverse Pairs',          descAr:'أكثر من 50 زوج تبادل متاح بين العملات الرقمية والمحافظ الإلكترونية',                   descEn:'More than 50 trading pairs available between digital currencies and electronic wallets' },
]

export const NEWS = [
  { icon:'📈', tagAr:'السوق',    tagEn:'MARKET',    titleAr:'Bitcoin يتجاوز 67,000 دولار مع تزايد الطلب المؤسسي',           titleEn:'Bitcoin Surpasses $67,000 as Institutional Demand Rises',     date:'18 Mar 2026', bodyAr:'شهدت أسواق العملات الرقمية ارتفاعاً ملحوظاً في طلبات المستثمرين المؤسسيين على Bitcoin، مما دفع سعره إلى تجاوز حاجز 67,000 دولار للمرة الأولى منذ أشهر. ويعزو المحللون هذا الارتفاع إلى تدفق الأموال من صناديق الاستثمار الكبرى.', bodyEn:'Digital currency markets saw a notable rise in institutional investor demand for Bitcoin, pushing its price above $67,000 for the first time in months. Analysts attribute this rise to capital inflows from major investment funds.' },
  { icon:'🔐', tagAr:'الأمان',   tagEn:'SECURITY',  titleAr:'Number 1 تحصل على شهادة أمان ISO 27001 الدولية',               titleEn:'Number 1 Obtains ISO 27001 International Security Certificate', date:'16 Mar 2026', bodyAr:'حصلت منصة Number 1 على شهادة أمان ISO 27001 الدولية المعترف بها عالمياً في مجال أمن المعلومات. هذه الشهادة تؤكد التزام المنصة بأعلى معايير حماية البيانات وأمان المعاملات المالية.', bodyEn:'Number 1 platform obtained the internationally recognized ISO 27001 security certificate in information security. This certificate confirms the platform\'s commitment to the highest standards of data protection and financial transaction security.' },
  { icon:'🚀', tagAr:'تحديث',    tagEn:'UPDATE',    titleAr:'إطلاق نسخة جديدة من المنصة مع واجهة محسّنة',                   titleEn:'New Platform Version Launched with Improved Interface',         date:'14 Mar 2026', bodyAr:'أطلقت Number 1 نسختها الجديدة من المنصة التي تتضمن واجهة مستخدم محسّنة تماماً، وأداءً أسرع بنسبة 40%، ودعماً محسّناً للهاتف المحمول.', bodyEn:'Number 1 launched its new platform version featuring a completely improved user interface, 40% faster performance, and enhanced mobile support.' },
  { icon:'💱', tagAr:'تبادل',    tagEn:'EXCHANGE',  titleAr:'إضافة 5 أزواج تبادل جديدة تشمل Solana و Polygon',              titleEn:'5 New Trading Pairs Added Including Solana and Polygon',        date:'12 Mar 2026', bodyAr:'أعلنت المنصة عن إضافة 5 أزواج تبادل جديدة تشمل Solana وPolygon وAvalanche. هذه الإضافات تعكس التزام Number 1 بمواكبة أحدث التطورات.', bodyEn:'The platform announced the addition of 5 new trading pairs including Solana, Polygon and Avalanche. These additions reflect Number 1\'s commitment to keeping up with the latest developments.' },
  { icon:'🌍', tagAr:'توسع',     tagEn:'EXPANSION', titleAr:'توسع خدمات Number 1 لتشمل دول الخليج العربي',                  titleEn:'Number 1 Services Expand to Include Gulf Countries',           date:'10 Mar 2026', bodyAr:'وسّعت Number 1 نطاق خدماتها الجغرافي ليشمل دول الخليج العربي بشكل رسمي، مع إطلاق نسخة مُعرَّبة بالكامل وخدمة دعم عملاء مخصصة للمنطقة.', bodyEn:'Number 1 officially expanded its geographic reach to include Gulf countries, with a fully Arabized version and dedicated customer support for the region.' },
  { icon:'📊', tagAr:'تقرير',    tagEn:'REPORT',    titleAr:'تقرير: حجم معاملات المنصة يتجاوز 50 مليون دولار',              titleEn:'Report: Platform Transaction Volume Exceeds $50 Million',      date:'8 Mar 2026',  bodyAr:'كشف التقرير الربعي لمنصة Number 1 أن حجم معاملاتها تجاوز 50 مليون دولار خلال الربع الأول من 2026، بزيادة 120% مقارنةً بالفترة ذاتها من العام الماضي.', bodyEn:'Number 1\'s quarterly report revealed that its transaction volume exceeded $50 million in Q1 2026, a 120% increase compared to the same period last year.' },
]

export const FAQS = [
  { qAr:'كيف أبدأ عملية التبادل؟',          qEn:'How do I start an exchange?',          aAr:'اختر العملة من القائمة المنسدلة، أدخل المبلغ المراد تبادله، ثم أدخل بيانات المحفظة والبريد الإلكتروني، وافق على الشروط ثم اضغط إرسال.', aEn:'Choose the currency from the dropdown, enter the amount you want to exchange, then enter your wallet details and email, agree to terms and click Submit.' },
  { qAr:'ما هو الحد الأدنى للتبادل؟',        qEn:'What is the minimum exchange amount?', aAr:'الحد الأدنى هو 10 وحدة من العملة المرسلة لمعظم الأزواج.', aEn:'The minimum is 10 units of the sending currency for most pairs.' },
  { qAr:'كم يستغرق التحويل؟',               qEn:'How long does the transfer take?',     aAr:'معظم العمليات تتم خلال 1-5 دقائق. في أوقات ازدحام الشبكة قد تصل إلى 15 دقيقة.', aEn:'Most operations complete within 1-5 minutes. During network congestion it may take up to 15 minutes.' },
  { qAr:'هل بياناتي وأموالي آمنة؟',          qEn:'Are my data and funds safe?',          aAr:'نعم! نستخدم تشفير AES-256 وحماية متعددة الطبقات مع شهادة ISO 27001.', aEn:'Yes! We use AES-256 encryption and multi-layer protection with ISO 27001 certification.' },
  { qAr:'ما هي الرسوم على كل عملية؟',        qEn:'What are the fees per transaction?',   aAr:'رسومنا تبدأ من 0.1% فقط على كل عملية تبادل، وهي من أقل الرسوم في السوق.', aEn:'Our fees start from just 0.1% per exchange operation, among the lowest in the market.' },
  { qAr:'كيف أتواصل مع فريق الدعم؟',        qEn:'How do I contact support?',            aAr:'يمكنك التواصل معنا عبر المساعد الذكي أو تيليجرام @Number1Exchange أو واتساب. الدعم متاح 24/7.', aEn:'You can contact us via the AI assistant, Telegram @Number1Exchange, or WhatsApp. Support is available 24/7.' },
]
