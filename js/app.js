  let cont = null;

// --- Config ---
const BOT_USERNAME = 'RIFT_R7bot';
const CONTACT_EMAIL = 'riftr7@gmail.com';
const INSTAGRAM = 'rift_r7';
const LOCATION_QUERY = 'Najaf, Iraq';
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQhJGjRF4ouUsXhJFXANVJbpZTHSkHMAJ548s0zOVaRmTG2NE7_QRnkhh2-j5c-HkC_s_MR918qHG7x/pub?output=xlsx';
// --- Error overlay (avoids silent blank screens) ---
(function(){ window.__riftErrorOverlayInstalled = true; window.__RIFT_OVERLAY_DISABLED = true; function show(){ /* overlay disabled */ } })();
// uid helper for older browsers
function uid(){ try{ if(window.crypto && window.crypto.randomUUID){ return window.uid(); } }catch(e){} return 'id-' + Math.random().toString(36).slice(2); }

// basic HTML escape
function escapeHtml(s){
  return (s||'').toString().replace(/[&<>"']/g, function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]) || c;
  });
}


// --- viewport (mobile) ---
try {
  const mq = window.matchMedia('(max-width: 640px)');
  function applyMobile(){ document.body && document.body.classList.toggle('mobile', mq.matches); }
  mq.addEventListener ? mq.addEventListener('change', applyMobile) : mq.addListener && mq.addListener(applyMobile);
  applyMobile();
} catch(_e){}

// --- i18n ---
const i18n = {
  en: {
    brand: 'RIFT',
    home: 'Home',
    services: 'Services',
    store: 'Digital Goods',
    about: 'About',
    contact: 'Contact',
    cart: 'Cart',
    welcome: 'Welcome to Rift',
    heroLine: 'Professional. Trusted. Secure.',
    exploreServices: 'Explore Services',
    whatWeDo: 'What we do',
    goToStore: 'Go to Store',
    addViaStore: 'Add',
    addToCart: 'Add to Cart',
    view: 'View',
    quantity: 'Quantity',
    price: 'Price',
    subtotal: 'Subtotal',
    total: 'Total',
    continueShopping: 'Continue Shopping',
    checkout: 'Checkout',
    contactDetails: 'Contact Details',
    iraqPhone: 'Iraqi phone number',
    city: 'City',
    backToCart: 'Back to Cart',
    continue: 'Continue',
    copyInvoice: 'Copy Invoice Text',
    openTelegram: 'Open Telegram',
    print: 'Print',
    invoiceTitle: 'Copy & Send via Telegram',
    contactHead: 'Reach Us',
    trusted: 'Trusted • Transparent • Clear Pricing',
    emptyCart: 'Your cart is empty.',
    storeGoods: 'Digital Goods',
    storeServices: 'Services',
    addDetails: 'Add details → Checkout',
    onRequest: 'On request',
    remove: 'Remove',
    back: 'Back',
    selectOption: 'Select an option',
    notes: 'Notes',
    phoneCityNote: 'Your phone and city will be added to the invoice. You can then copy and send it to the Telegram bot.',
    orderType: 'Order type',
    orderTypeAccount: 'Account',
    orderTypeService: 'Service',
    serviceTarget: 'Service username / link',
    serviceTargetPlaceholder: 'e.g., @username or profile link',
    serviceTargetNote: 'Only required for services in your cart.',
    sendToBotNote: 'Copy this invoice, open Telegram, and send it to',
    invoiceGrandTotal: 'Grand Total',
    mapLink: LOCATION_QUERY,
  },
  ar: {
    brand: 'ريفت',
    home: 'الرئيسية',
    services: 'الخدمات',
    store: 'السلع الرقمية',
    about: 'من نحن',
    contact: 'تواصل',
    cart: 'السلة',
    welcome: 'مرحباً بك في ريفت',
    heroLine: 'احترافي. موثوق. آمن.',
    exploreServices: 'استكشف الخدمات',
    whatWeDo: 'ماذا نقدم',
    goToStore: 'اذهب للمتجر',
    addViaStore: 'أضف',
    addToCart: 'أضف إلى السلة',
    view: 'عرض',
    quantity: 'الكمية',
    price: 'السعر',
    subtotal: 'الإجمالي الفرعي',
    total: 'الإجمالي',
    continueShopping: 'متابعة التسوق',
    checkout: 'إتمام الشراء',
    contactDetails: 'بيانات التواصل',
    iraqPhone: 'رقم الهاتف العراقي',
    city: 'المدينة',
    backToCart: 'رجوع إلى السلة',
    continue: 'متابعة',
    copyInvoice: 'نسخ الفاتورة',
    openTelegram: 'فتح تيليجرام',
    print: 'طباعة',
    invoiceTitle: 'انسخ وأرسل عبر تيليجرام',
    contactHead: 'تواصل معنا',
    trusted: 'ثقة • وضوح • تسعير شفاف',
    emptyCart: 'سلتك فارغة.',
    storeGoods: 'السلع الرقمية',
    storeServices: 'الخدمات',
    addDetails: 'أضف التفاصيل → إتمام الشراء',
    onRequest: 'عند الطلب',
    remove: 'حذف',
    back: 'رجوع',
    selectOption: 'اختر خياراً',
    notes: 'ملاحظات',
    phoneCityNote: 'سيتم إضافة هاتفك و مدينتك إلى الفاتورة، ثم انسخها وأرسلها إلى بوت تيليجرام.',
    orderType: 'نوع الطلب',
    orderTypeAccount: 'حساب',
    orderTypeService: 'خدمة',
    serviceTarget: 'يوزر / رابط الخدمة',
    serviceTargetPlaceholder: 'مثال: @username أو رابط الحساب',
    serviceTargetNote: 'يظهر هذا الحقل فقط إذا كانت هناك خدمة في السلة.',
    sendToBotNote: 'انسخ هذه الفاتورة، افتح تيليجرام، ثم أرسلها إلى',
    invoiceGrandTotal: 'الإجمالي النهائي',
    mapLink: LOCATION_QUERY,

  }
};

const t = (k)=> i18n[state.lang][k] || k;

// --- State ---
const state = {
  route: 'home',
  lang: localStorage.getItem('siteLanguage') || 'en',
  cart: JSON.parse(localStorage.getItem('cart')||'[]'),
  invoiceDetails: null,
  sheetProducts: [],
  loadedSheet: false,
  loadingSheet: false,
  loadingStore: false,

  products: [
        { id:'chatgpt-personal', cat:'digital', title_en:'ChatGPT Personal Accounts', title_ar:'حسابات فردية (شهر واحد)', image:'assets/chatgpt\-personal\.png', options:[{key:'plan', choices:['1 Month']}] },
    { id:'chatgpt-shared', cat:'digital', title_en:'ChatGPT Shared Accounts', title_ar:'حسابات مشتركة', image:'assets/chatgpt\-shared\.png', options:[{key:'plan', choices:['1 Month','1 Year']}] },
    { id:'canva', cat:'digital', title_en:'Canva Pro', title_ar:'كانفا برو', image:'assets/canva.png', options:[{key:'term', choices:['1 Year','3 Years','Forever']}] },
    { id:'duolingo', cat:'digital', title_en:'Duolingo Plus', title_ar:'دولينغو بلس', image:'assets/duolingo.png', options:[{key:'term', choices:['1 Year','Forever']}] },
    { id:'adobecc', cat:'digital', title_en:'Adobe Creative Cloud', title_ar:'أدوبي كريتيف كلاود', image:'assets/adobecc.png', desc_en:'12 months • 2 devices • 100GB cloud storage', desc_ar:'12 شهر • جهازان • 100GB تخزين سحابي', options:[{key:'term', choices:['1 Year']}] },
    { id:'primevideo', cat:'digital', title_en:'Amazon Prime Video', title_ar:'أمازون برايم فيديو', image:'assets/primevideo\.png', options:[{key:'term', choices:['1 Month','1 Year']}] },
    { id:'netflix', cat:'digital', title_en:'Netflix', title_ar:'نتفليكس', image:'assets/netflix\.png', options:[{key:'term', choices:['1 Month','3 Months','6 Months','1 Year']}] },
    { id:'shahid', cat:'digital', title_en:'Shahid VIP', title_ar:'شاهد VIP', image:'assets/shahid.png', options:[{key:'term', choices:['1 Month','1 Year']}] },
    { id:'disneyplus', cat:'digital', title_en:'Disney+', title_ar:'ديزني+', image:'assets/disneyplus.png', options:[{key:'term', choices:['1 Month','1 Year']}] },
    { id:'capcut', cat:'digital', title_en:'CapCut Pro', title_ar:'كاب كت برو', image:'assets/capcut\.jpeg', options:[{key:'term', choices:['1 Month','1 Year']}] },
{ id:'itunes', cat:'digital', title_en:'iTunes Gift Cards', title_ar:'بطاقات iTunes', image:'assets/itunes\.png', options:[{key:'amount', choices:[2,3,4,5,10,15,20,25,30,40,50,60,100,500]}] },
    { id:'freefire', cat:'digital', title_en:'Free Fire Diamonds', title_ar:'ماسات Free Fire', image:'assets/freefire\.jpeg', options:[{key:'diamonds', choices:[100,210,350,1080,2200]}] },
    { id:'pubg', cat:'digital', title_en:'PUBG Mobile UC', title_ar:'شدات ببجي موبايل', image:'assets/pubg\.jpg', options:[{key:'uc', choices:[60,325,660,1800,3850,8100,16200,24300,32400,40500]}] },
    { id:'xbox', cat:'digital', title_en:'Xbox (Membership / Gift Cards)', title_ar:'اكس بوكس (اشتراك/بطاقات)', image:'assets/xbox\.png', options:[{key:'type', choices:['Membership 1 Month','Membership 3 Months','Membership 12 Months','$10','$15','$20']}] },
    { id:'minecraft', cat:'digital', title_en:'Minecraft Minecoins', title_ar:'Minecoins ماينكرافت', image:'assets/minecraft\.jpg', options:[{key:'minecoins', choices:[3500]}] },
    { id:'discord', cat:'digital', title_en:'Discord Nitro', title_ar:'ديسكورد نيترو', image:'assets/discord\.png', options:[{key:'plan', choices:['Nitro Classic Monthly (INT)','Nitro Monthly (INT)']}] },

    
        { id:'office', cat:'digital', title_en:'Microsoft Office', title_ar:'مايكروسوفت أوفيس', image:'assets/office\.png', options:[{key:'version', choices:['2016','2019']}] },
    { id:'perplexity', cat:'digital', title_en:'Perplexity Pro', title_ar:'بيربلكسيتي برو', image:'assets/perplexity\.png', options:[{key:'term', choices:['1 Year']}] },

    // Services
  { id:'svc-pc', cat:'service', title_en:'PC Optimization (Service)', title_ar:'تحسين الكمبيوتر', image:'assets/pc.jpg', options:[{key:'notes', textarea:true}] },
  { id:'svc-mobile', cat:'service', title_en:'Mobile Services', title_ar:'خدمات الموبايل', image:'assets/mobile.jpg', options:[{key:'notes', textarea:true}] },
  { id:'svc-cloud', cat:'service', title_en:'Cloud Accounts', title_ar:'حسابات سحابية', image:'assets/cloud.jpg', options:[{key:'notes', textarea:true}] },
  { id:'svc-webprog', cat:'service', title_en:'Website Programming', title_ar:'برمجة مواقع', image:'assets/website-programming.png', options:[{key:'notes', textarea:true}] },
  { id:'svc-appprog', cat:'service', title_en:'App Programming', title_ar:'برمجة تطبيقات', image:'assets/app-development.avif', options:[{key:'notes', textarea:true}] },
  { id:'svc-apps', cat:'service', title_en:'Apps', title_ar:'التطبيقات', image:'assets/apps.avif', options:[{key:'notes', textarea:true}] },
  { id:'svc-programs', cat:'service', title_en:'Programs', title_ar:'البرامج', image:'assets/programms.jpg', options:[{key:'notes', textarea:true}] },
  { id:'almanasa', cat:'digital', title_en:'Almanasa', title_ar:'المناسة', image:'assets/Almanasa.png', options:[{key:'term', choices:['1 Month']}] },
  { id:'valorant', cat:'digital', title_en:'Valorant', title_ar:'فالورانت', image:'assets/valorant-logo-x0jet8s98hbbfi62.jpg', options:[{key:'amount', choices:['10$','20$']}] },

  ],
  
services: [
    {key:'pc-opt', title_en:'PC Optimization', title_ar:'تحسين الكمبيوتر', image:'assets/pc.jpg',
      desc_en:'Deep clean, boot speedup, driver updates, stability fixes.',
      desc_ar:'تنظيف عميق، تسريع الإقلاع، تحديث التعريفات، إصلاح الاستقرار.'},
    {key:'mobile', title_en:'Mobile Services', title_ar:'خدمات الموبايل', image:'assets/mobile.jpg',
      desc_en:'Repairs, optimization, backups, transfer, security.',
      desc_ar:'صيانة، تحسين، نسخ احتياطي، نقل، أمان.'},
    {key:'webprog', title_en:'Website Programming', title_ar:'برمجة مواقع', image:'assets/website-programming.png',
      desc_en:'Custom websites, landing pages, stores.',
      desc_ar:'مواقع مخصصة، صفحات هبوط، متاجر.'},
    {key:'appprog', title_en:'App Programming', title_ar:'برمجة تطبيقات', image:'assets/app-development.avif',
      desc_en:'Mobile/desktop app development on request.',
      desc_ar:'تطوير تطبيقات موبايل أو سطح المكتب عند الطلب.'},
    {key:'cloud', title_en:'Cloud Accounts', image:'assets/cloud.jpg', title_ar:'حسابات سحابية',
      desc_en:'Setup, recovery, storage, security.',
      desc_ar:'إعداد، استرجاع، تخزين، أمان.'},
    {key:'programs', title_en:'Programs', title_ar:'البرامج', image:'assets/programms.jpg',
      desc_en:'Custom scripts, automation, small web tools.',
      desc_ar:'سكربتات مخصصة، أتمتة، أدوات ويب صغيرة.'}
  ]

};

// --- Prices (IQD) ---
const fmtIQD = (n)=> new Intl.NumberFormat('en-US').format(n) + ' IQD';
const pricesIQD = {
  capcut:{'1 Month':12000,'1 Year':50000},
  disneyplus:{'1 Month':12000,'1 Year':55000},
  shahid:{'1 Month':8000,'1 Year':35000},
  almanasa:{'1 Month':8000},
  netflix:{'1 Month':6000,'3 Months':12000,'6 Months':22000,'1 Year':35000},primevideo:{'1 Month':11000,'1 Year':65000},
  adobecc:{'1 Year':155000},
  duolingo:{'1 Year':20000,'Forever':40000},
  canva:{'1 Year':6000,'3 Years':11000,'Forever':21000},
  chatgptShared:{'1 Month':12000,'1 Year':50000},
  chatgptPersonal:{'1 Month':16000},
  office:{'2016':2000,'2019':6000},
  perplexity:{'1 Year':30000},
  chatgptPerMonth: 12000,
  itunes: {2:3500, 3:4750, 4:5750, 5:7250, 10:13250, 15:21500, 20:27500, 25:35500, 30:42750, 40:53750, 50:69500, 60:82500, 100:138250, 500:685250},
  freefire: {100:1750, 210:3250, 350:7500, 1080:15000, 2200:28750},
  pubg: {60:1500, 325:6750, 660:12600, 1800:33000, 3850:62500, 8100:129500, 16200:244500, 24300:367500, 32400:490500, 40500:613500},
  xbox: {'Membership 1 Month':13000,'Membership 3 Months':34000,'Membership 12 Months':100000,'$10':13000,'$15':20000,'$20':26000},
  minecraft: {3500:27000},
  discord: {'Nitro Classic Monthly (INT)':8000, 'Nitro Monthly (INT)':14000},
  valorant: {'10$':15000,'20$':29000}
};

// --- Sheet Prices (IQD) ---
// pricesSheet[productId][accTypeKey][quantity] = price
const pricesSheet = {};

// Normalize values coming from the sheet
function normAccType(v){
  const s = (v||'').toString().trim().toLowerCase();
  if(!s || s==='none' || s==='na' || s==='n/a') return 'none';
  if(s==='shared' || s==='مشترك' || s==='حساب مشترك') return 'shared';
  if(s==='private' || s==='خاص' || s==='personal' || s==='حساب خاص') return 'private';
  return s; // fallback
}

function normBool(v){
  const s = (v||'').toString().trim().toLowerCase();
  if(!s) return false;
  return (s === 'true' || s === '1' || s === 'yes' || s === 'y');
}

function normOptionLabel(v){
  return (v||'').toString().trim();
}
function normKind(v, fallbackSection){
  const s = (v||'').toString().trim().toLowerCase();
  // Accept common variants coming from sheets (SERVICE, Services, الخدمات, etc.)
  if(s==='service' || s==='خدمة' || s==='services' || s.includes('serv') || s.includes('خدم')) return 'service';
  if(s==='account' || s==='حساب' || s==='accounts' || s.includes('acc') || s.includes('حسا')) return 'account';
  const sec = (fallbackSection||'').toString().trim().toLowerCase();
  if(sec==='service' || sec==='services' || sec.includes('serv') || sec.includes('خدم')) return 'service';
  if(sec==='account' || sec==='accounts' || sec.includes('acc') || sec.includes('حسا')) return 'account';
  return 'account';
}

function cartItemIsService(it){
  if(!it) return false;
  if(it.kind === 'service' || it.cat === 'service') return true;
  const s = (it.section || '').toString().trim().toLowerCase();
  return (s === 'service' || s === 'services' || s.includes('serv') || s.includes('خدم'));
}


function productTitle(p){
  return state.lang==='ar' ? p.title_ar : p.title_en;
}
function serviceTitle(s){
  return state.lang==='ar' ? s.title_ar : s.title_en;
}
function serviceDesc(s){
  return state.lang==='ar' ? s.desc_ar : s.desc_en;
}

function fmtSelectionPair(k,v){
  if(k==='accType'){
    if(state.lang==='ar') return 'نوع الحساب: ' + (v==='private'?'خاص':(v==='shared'?'مشترك':v));
    return 'Account: ' + (v==='private'?'Private':(v==='shared'?'Shared':v));
  }
  if(k==='quantity'){
    if(state.lang==='ar') return 'المدة: ' + localizeDurationLabel(v);
    return 'Duration: ' + localizeDurationLabel(v);
  }
  if(k==='option'){
    if(state.lang==='ar') return 'الخيار: ' + v;
    return 'Option: ' + v;
  }
  // fallback
  return k + ': ' + v;
}


function priceFor(productId, selections){
  if (pricesSheet[productId]) {
    const acc = normAccType(selections && selections.accType);
    const opt = normOptionLabel(selections && selections.option) || '__default__';
    const qty = (selections && selections.quantity) || '';
    return (pricesSheet[productId][acc] && pricesSheet[productId][acc][opt] && pricesSheet[productId][acc][opt][qty]) || 0;
  }
  if (productId.startsWith('sheet-')) {
    // For sheet products, price is in selections
    return selections.price || 0;
  }
  switch(productId){
    case 'capcut': return pricesIQD.capcut[selections.term]||0;
    case 'disneyplus': return pricesIQD.disneyplus[selections.term]||0;
    case 'shahid': return pricesIQD.shahid[selections.term]||0;
    case 'almanasa': return pricesIQD.almanasa[selections.term]||0;
    case 'netflix': return pricesIQD.netflix[selections.term]||0;case 'primevideo': return pricesIQD.primevideo[selections.term]||0;
    case 'adobecc': return pricesIQD.adobecc[selections.term]||0;
    case 'duolingo': return pricesIQD.duolingo[selections.term]||0;
    case 'canva': return pricesIQD.canva[selections.term]||0;
    case 'itunes': return pricesIQD.itunes[Number(selections.amount)]||0;
    case 'chatgpt-shared': return pricesIQD.chatgptShared[selections.plan]||0;
    case 'chatgpt-personal': return pricesIQD.chatgptPersonal[selections.plan]||0;
    case 'office': return pricesIQD.office[selections.version]||0;
    case 'perplexity': return pricesIQD.perplexity[selections.term]||0;
    case 'chatgpt': {
      // type-aware (Personal or Shared) using original price tables
      var type = (selections && selections.type)||'Shared';
      var plan = (selections && selections.plan)||'1 Month';
      if(type==='Personal'){ return pricesIQD.chatgptPersonal[plan]||0; }
      return pricesIQD.chatgptShared[plan]||0;
    }
    case 'freefire': return pricesIQD.freefire[Number(selections.diamonds)]||0;
    case 'pubg': return pricesIQD.pubg[Number(selections.uc)]||0;
    case 'xbox': return pricesIQD.xbox[selections.type]||0;
    case 'minecraft': return pricesIQD.minecraft[Number(selections.minecoins)]||0;
    case 'discord': return pricesIQD.discord[selections.plan]||0;
    case 'valorant': return pricesIQD.valorant[selections.amount]||0;
    default: return 0;
  }
}

function minPrice(productId){
  if (pricesSheet[productId]) {
    const all = [];
    Object.values(pricesSheet[productId]).forEach(byAcc=>{
      Object.values(byAcc||{}).forEach(byOpt=>{
        Object.values(byOpt||{}).forEach(v=> all.push(Number(v)||0));
      });
    });
    return all.length ? Math.min(...all) : 0;
  }
  if (productId.startsWith('sheet-')) {
    // For sheet products, find min price from sheet items
    const sheet = state.sheetProducts.find(s => 'sheet-' + s.name.replace(/\s+/g, '-').toLowerCase() === productId);
    if (sheet) {
      return Math.min(...sheet.items.map(item => item.price));
    }
    return 0;
  }
  switch(productId){
    case 'capcut': return Math.min(...Object.values(pricesIQD.capcut));
    case 'disneyplus': return Math.min(...Object.values(pricesIQD.disneyplus));
    case 'shahid': return Math.min(...Object.values(pricesIQD.shahid));
    case 'almanasa': return Math.min(...Object.values(pricesIQD.almanasa));
    case 'netflix': return Math.min(...Object.values(pricesIQD.netflix));case 'primevideo': return Math.min(...Object.values(pricesIQD.primevideo));
    case 'adobecc': return Math.min(...Object.values(pricesIQD.adobecc));
    case 'duolingo': return Math.min(...Object.values(pricesIQD.duolingo));
    case 'canva': return Math.min(...Object.values(pricesIQD.canva));
    case 'itunes': return Math.min(...Object.values(pricesIQD.itunes));
    case 'chatgpt-personal': return Math.min(...Object.values(pricesIQD.chatgptPersonal));
    case 'chatgpt-shared': return Math.min(...Object.values(pricesIQD.chatgptShared));
    case 'chatgpt': return 12000;
    case 'freefire': return Math.min(...Object.values(pricesIQD.freefire));
    case 'pubg': return Math.min(...Object.values(pricesIQD.pubg));
    case 'xbox': return Math.min(...Object.values(pricesIQD.xbox));
    case 'minecraft': return Math.min(...Object.values(pricesIQD.minecraft));
    case 'discord': return Math.min(...Object.values(pricesIQD.discord));
    case 'valorant': return Math.min(...Object.values(pricesIQD.valorant));
    default: return 0;
  }
}


function adjustCatalog(){
  // If we already replaced catalog from sheet rows, keep it.
  if(state.loadedSheet && state.products && state.products.length && state.products[0].isSheetProduct){ 
    return; 
  }

  // Fallback: use built-in catalog (original behavior)
    // Remove services from products
    state.products = state.products.filter(p=> p.cat !== 'service');

    // Remove duplicate ChatGPT items if we are going to show merged one in list
    state.products = state.products.filter(p=> !['chatgpt-personal','chatgpt-shared'].includes(p.id));

    // Ensure merged ChatGPT appears as a product card
    const hasChatGPT = state.products.some(p=> p.id==='chatgpt');
    if(!hasChatGPT){
      state.products.push({
        id:'chatgpt',
        cat:'digital',
        title_en:'ChatGPT',
        title_ar:'شات جي بي تي',
        image:'assets/chatgpt.png',
        desc_en:'Personal & Shared accounts in one place',
        desc_ar:'حسابات شخصية ومشتركة في مكان واحد',
        options:[{key:'months', choices:[1,3,6,12]}]
      });
    }

    // Reorder digital products by priority
    const order = ['pubg','freefire','itunes','chatgpt','almanasa','duolingo','adobecc','primevideo','netflix','minecraft','valorant'];
    const priority = Object.fromEntries(order.map((id,i)=>[id,i]));
    state.products.sort((a,b)=>{
      if(a.cat!==b.cat){
        return a.cat==='digital' ? -1 : b.cat==='digital' ? 1 : 0;
      }
      // within digital, apply priority
      if(a.cat==='digital'){
        const pa = (priority[a.id]!==undefined)? priority[a.id] : 999;
        const pb = (priority[b.id]!==undefined)? priority[b.id] : 999;
        if(pa!==pb) return pa-pb;
      }
      return 0;
    });
}

// Localization helpers for option labels (Arabic durations & digits)
function toArabicDigits(str){
  // Force Latin (English) digits regardless of locale
  try {
    var str = String(arguments[0]);
    var map = {
      '٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9',
      '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9'
    };
    return str.replace(/[٠-٩۰-۹]/g, function(d){ return map[d] || d; });
  } catch(e) {
    return String(arguments[0]);
  }
};
function localizeDurationLabel(label){
  if(state.lang!=='ar') return label;
  // Normalize
  let s = String(label).trim();
  // Specific known labels
  s = s.replace(/^1\s*Month$/i, 'شهر واحد')
       .replace(/^3\s*Months$/i, '٣ شهور')
       .replace(/^6\s*Months$/i, '٦ شهور')
       .replace(/^1\s*Year$/i, 'سنة واحدة')
       .replace(/^Forever$/i, 'مدى الحياة')
       .replace(/^Membership\s*1\s*Month$/i, 'اشتراك شهر واحد')
       .replace(/^Membership\s*3\s*Months$/i, 'اشتراك ٣ شهور')
       .replace(/^Membership\s*12\s*Months$/i, 'اشتراك ١٢ شهر');
  // Generic fallbacks like "12 Months", "2 Years"
  s = s.replace(/^(\d+)\s*Months?$/i, (_,n)=> toArabicDigits(n)+' شهور')
       .replace(/^(\d+)\s*Years?$/i, (_,n)=> toArabicDigits(n)+' سنة');
  // Keep numeric denominations like "100" for diamonds/UC etc.
  return s.replace(/\d+/g, toArabicDigits);
}
// --- Helpers ---
function saveCart(){ localStorage.setItem('cart', JSON.stringify(state.cart)); }
function setLang(l){ state.lang=l; localStorage.setItem('siteLanguage', l); document.documentElement.setAttribute('lang', l); document.documentElement.dir = (l==='ar'?'rtl':'ltr'); render(); }
function navigate(route){ state.route = route; window.location.hash = route; render(); }
window.addEventListener('hashchange', ()=>{ const r = location.hash.replace('#',''); if(r){ if('scrollRestoration' in history){ history.scrollRestoration = 'manual'; } window.scrollTo(0,0); state.route = r; render(); } });





// --- Added-to-cart animation: centered jelly bubble (subtle aesthetic) ---
function triggerAddToCartAnimation(){
  try{
    var textBubble = document.createElement('div');
    textBubble.textContent = (state.lang==='ar' ? 'تمت الإضافة' : 'Added');
    textBubble.setAttribute('style', [
      'position:fixed',
      'left:50%',
      'top:50%',
      'transform:translate(-50%,-50%)',
      'z-index:999999',
      'background: linear-gradient(135deg, var(--brand), #34d399)',
      'color:#081017',
      'font-weight:800',
      'font-size:16px',
      'letter-spacing:.2px',
      'padding:12px 20px',
      'border-radius:999px',
      'border:1px solid rgba(255,255,255,.08)',
      'box-shadow: 0 10px 30px rgba(0,0,0,.25)',
      'backdrop-filter: blur(6px)',
      'pointer-events:none',
      'will-change: transform, opacity'
    ].join(';'));
    document.body.appendChild(textBubble);
    var textAnim = textBubble.animate([
      { opacity:0, transform:'translate(-50%,-50%) translateY(20px)' },
      { opacity:1, transform:'translate(-50%,-50%) translateY(0)' },
      { opacity:1, transform:'translate(-50%,-50%) translateY(0)' },
      { opacity:0, transform:'translate(-50%,-50%) translateY(-10px)' }
    ], { duration: 1500, easing: 'ease-out' });
    textAnim.onfinish = function(){ textBubble.remove(); };

    // Animate cart badge
    var badge = document.getElementById('cart-count');
    if(badge){
      badge.classList.add('bounce');
      setTimeout(function(){ badge.classList.remove('bounce'); }, 600);
    }
  }catch(e){}
}
function addToCart(id, selections, qty){
  qty = Number(qty)||1;
  const p = state.products.find(x=>x.id===id);
  if(!p) return;
  const unitPrice = priceFor(id, selections);
  state.cart.push({ id: uid(), productId:id, title: productTitle(p), selections, unitPrice, qty: qty, image:p.image, cat:p.cat, kind: p.kind || (p.cat==='service'?'service':'account'), section: p.section || '' });
  saveCart();
triggerAddToCartAnimation();
  // Checkout validation
  const phoneEl = document.getElementById('phone');
  const cityEl = document.getElementById('city');
  const orderTypeEl = document.getElementById('order-type');
  const serviceFields = document.getElementById('service-fields');
  const serviceTargetEl = document.getElementById('service-target');
  const cartHasService = state.cart.some(cartItemIsService);

  function syncServiceFields(){
    if(!orderTypeEl || !serviceFields) return;
    const isServiceOrder = cartHasService || orderTypeEl.value === 'service';
    serviceFields.style.display = isServiceOrder ? '' : 'none';
  }

  function enableIfValid(){
    if(!cont) return;
    const phone = normalizeIraqPhone(phoneEl && phoneEl.value);
    const city = (cityEl && cityEl.value||'').trim();
    const isServiceOrder = cartHasService || (orderTypeEl && orderTypeEl.value === 'service');
    const target = (serviceTargetEl && serviceTargetEl.value||'').trim();
    const isValid = (!!phone && !!city && state.cart.length>0 && (!isServiceOrder || !!target));
    if(isValid){ cont.removeAttribute('disabled'); } else { cont.setAttribute('disabled',''); }
  }

  if(orderTypeEl){
    orderTypeEl.addEventListener('change', ()=>{ syncServiceFields(); enableIfValid(); });
    syncServiceFields();
  }

  if(cont){
    phoneEl && phoneEl.addEventListener('input', enableIfValid);
    cityEl && cityEl.addEventListener('input', enableIfValid);
    serviceTargetEl && serviceTargetEl.addEventListener('input', enableIfValid);
    enableIfValid();
  }


  // Header single toggle for language (header back arrow removed)
  (function(){
    var lt = document.getElementById('lang-toggle');
    if(lt){ lt.addEventListener('click', function(){ setLang(state.lang==='ar' ? 'en' : 'ar'); }); }
  })();



  renderCartIndicator();
}
function removeFromCart(id){
  state.cart = state.cart.filter(i=>i.id!==id);
  saveCart();
  // Remove row
  const row = document.querySelector(`tr[data-item="${id}"]`);
  if(row) row.remove();
  // Update total
  const totalEl = document.querySelector('.tag');
  if(totalEl) totalEl.textContent = 'Total: ' + fmtIQD(cartTotal());
  // Update checkout button
  const checkoutBtn = document.getElementById('checkout');
  if(checkoutBtn) checkoutBtn.disabled = state.cart.length === 0;
  renderCartIndicator();
}
function changeQty(id, delta){
  const it = state.cart.find(i=>i.id===id);
  if(!it) return;
  it.qty = Math.max(1, it.qty + delta);
  saveCart();
  // Update DOM
  const row = document.querySelector(`tr[data-item="${id}"]`);
  if(row){
    const qtySpan = row.querySelector('.qty-value');
    if(qtySpan) qtySpan.textContent = it.qty;
    // const subTd = row.querySelectorAll('td')[3]; // subtotal is 4th td
    // if(subTd) subTd.textContent = it.unitPrice? fmtIQD(it.unitPrice*it.qty): '—';
  }
  // Update total
  const totalEl = document.querySelector('.tag');
  if(totalEl) totalEl.textContent = 'Total: ' + fmtIQD(cartTotal());
  renderCartIndicator();
}
function cartTotal(){ return state.cart.reduce((s,i)=>s+(i.unitPrice*i.qty),0); }
function totalItems(){ return state.cart.reduce((s,i)=>s+i.qty,0); }
function renderCartIndicator(){ const el = document.querySelector('#cart-count'); if(!el) return; const c = totalItems(); el.textContent = c? String(c):''; el.classList.remove('bounce'); }

// Iraq phone normalization/validation
function normalizeIraqPhone(input){
  let s = (input||'').replace(/[\s\-]/g,'');
  if(s.startsWith('+964')){
  }else if(s.startsWith('07')){
    s = '+964' + s.slice(1);
  }else if(s.startsWith('964')){
    s = '+' + s;
  }
  const ok = /^\+9647\d{9}$/.test(s);
  return ok ? s : null;
}


// --- Cart item modal helpers ---
function openItemModal(it){
  const m = document.getElementById('item-modal'); if(!m) return;
  m.classList.add('open');
  const sel = Object.entries(it.selections||{}).map(([k,v])=>`${k}: ${v}`).join(', ');
  var imt=document.getElementById('im-title'); if(imt) imt.textContent = it.title || '';
  var imq=document.getElementById('im-qty'); if(imq) imq.textContent = 'x'+(it.qty||1);
  var imu=document.getElementById('im-unit'); if(imu) imu.textContent = it.unitPrice? fmtIQD(it.unitPrice) : (state.lang==='ar'?'عند الطلب':'On request');
  var ims=document.getElementById('im-sub'); if(ims) ims.textContent = it.unitPrice? fmtIQD(it.unitPrice*(it.qty||1)) : '—';
  var imsel=document.getElementById('im-sel'); if(imsel) imsel.textContent = sel || '';
  document.querySelectorAll('[data-close-modal]').forEach(b=> b.addEventListener('click', ()=> m.classList.remove('open')));
}




function parseWorkbook(workbook) {
  const products = [];
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const product = {
      name: sheetName,
      items: []
    };

jsonData.forEach((row, index) => {
  if (index === 0) return; // Skip header
  // Expected layout (0-based index shown):
  // A[0] unused/ID (optional)
  // B[1] Product Name (EN)
  // C[2] Product Name (AR)
  // D[3] Quantity
  // E[4] Price
  // F[5] Image URL
  // G[6] Description
  // H[7] Account Type (private/shared/blank)
  // I[8] Section (ACCOUNT/SERVICE)
  // J[9] Description Button (TRUE/FALSE)
  // K[10] Options label (free text)
  if (row.length >= 7) {
    const section = (row[8] || '').toString().trim();
    const item = {
      englishName: row[1] || '',
      arabicName: row[2] || '',
      quantity: row[3] || '',
      price: parseFloat(row[4]) || 0,
      imageUrl: row[5] || '',
      description: row[6] || '',
      accType: (row[7] || '').toString().trim(),
      section: section,
      productKind: section,
      descButton: normBool(row[9]),
      optionLabel: normOptionLabel(row[10]),
      productId: (row[0] || '').toString().trim()
    };
    product.items.push(item);
  }
});
    if (product.items.length > 0) {
      products.push(product);
    }
  });

  return products;
}

async function loadSheetProducts() {
  if (state.loadedSheet || state.loadingSheet) return;
  state.loadingSheet = true;
  const loadingDiv = document.getElementById('sheet-loading');
  if (loadingDiv) loadingDiv.classList.remove('hidden');

  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) throw new Error('Failed to fetch sheet');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Parse all sheets, then flatten rows into a single list of option rows
    const parsedSheets = parseWorkbook(workbook);
    const rows = [];
    parsedSheets.forEach(s => (s.items || []).forEach(it => rows.push(it)));

    // Build products grouped by product name (preferred) to avoid duplicates when IDs differ per row
    const byId = {};
    function slugify(s){
      return (s||'').toString().trim().toLowerCase()
        .replace(/\s+/g,'-')
        .replace(/[^a-z0-9\u0600-\u06FF\-]/g,'')
        .replace(/\-+/g,'-')
        .replace(/^\-+|\-+$/g,'') || 'item';
    }

    rows.forEach((r, idx) => {
      const nameKey = (r.englishName || r.arabicName || '').toString().trim();
      const idKey = (r.productId || '').toString().trim();
      // Prefer grouping by name, fall back to ID if name missing
      const groupKey = nameKey ? nameKey : idKey;
      if (!groupKey) return;

      const sectionKey = (r.section || '').toString().trim();
      const compoundKey = (sectionKey ? sectionKey + '|' : '') + groupKey.toLowerCase();
      const pid = 'sheetprod-' + slugify(compoundKey);

      if (!byId[pid]) {
        byId[pid] = {
          id: pid,
          isSheetProduct: true,
          orderIndex: idx,
          cat: normKind(r.productKind, r.section) === 'service' ? 'service' : 'digital',
          kind: normKind(r.productKind, r.section), // account | service
          title_en: (r.englishName || r.arabicName || ('Product ' + groupKey)),
          title_ar: (r.arabicName || r.englishName || ('منتج ' + groupKey)),
          image: r.imageUrl || 'assets/apps.png',
          desc_en: r.description || '',
          desc_ar: r.description || '',
          section: sectionKey,
          sourceProductId: idKey,
          sheetVariants: []
        };
      }

      byId[pid].sheetVariants.push({
        accType: normAccType(r.accType),
        quantity: (r.quantity || '').toString().trim(),
        price: Number(r.price) || 0,
        description: r.description || '',
        descButton: !!r.descButton,
        optionLabel: normOptionLabel(r.optionLabel)
      });

      // Build pricesSheet map for fast lookup
      // pricesSheet[pid][accType][optionLabel][quantity] = price
      pricesSheet[pid] = pricesSheet[pid] || {};
      const a = normAccType(r.accType);
      const o = normOptionLabel(r.optionLabel) || '__default__';
      const q = (r.quantity || '').toString().trim();
      pricesSheet[pid][a] = pricesSheet[pid][a] || {};
      pricesSheet[pid][a][o] = pricesSheet[pid][a][o] || {};
      pricesSheet[pid][a][o][q] = Number(r.price) || 0;
    });

    // Replace catalog with sheet-driven products, but keep services list intact
    const sheetProducts = Object.values(byId);
    // Keep the same order as the Google Sheet (first appearance wins)
    sheetProducts.sort((a,b)=> (a.orderIndex||0) - (b.orderIndex||0));

    state.products = sheetProducts;
    state.loadedSheet = true;
  } catch (error) {
    console.error('Error loading sheet products:', error);
    state.loadedSheet = true; // allow fallback UI
  } finally {
    state.loadingSheet = false;
    if (loadingDiv) loadingDiv.classList.add('hidden');
  }
}




// --- UI TEMPLATES ---

function header(){
  const l = state.lang;
  return `
  <header class="header" style="background: rgba(11,14,19,.7); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,.06);">
    <div class="header-inner container">
      <a class="brand" href="#home" aria-label="Home">
        <img class="brand-logo" src="assets/riftlogo.png" alt="RIFT logo">
        <div style="color: #8a2be2;">${t('brand')}</div>
      </a>
      <div class="right">
        <a class="btn ghost badge-btn" href="#cart" id="cart-btn" aria-label="${t('cart')}" style="color: #8a2be2;">🛒<span id="cart-count" class="badge"></span></a>
        <div class="hamburger" id="hamburger" aria-label="Open menu" style="color: #8a2be2;"><span></span></div>
        <button class="btn ghost" id="lang-toggle" type="button" style="color: #8a2be2;">EN / العربية</button>
      </div>

    </div>
  </header>
  <!-- Drawer is appended here so it's always present -->
  <div class="drawer" id="drawer">
    <div class="drawer-bg" id="drawer-bg"></div>
    
<div class="drawer-panel">
      <h3>${t('brand')}</h3>
      <a class="nav-link" href="#home">${t('home')} <span>›</span></a>
      <a class="nav-link" href="#services">${t('services')} <span>›</span></a>
      <a class="nav-link" href="#store">${t('store')} <span>›</span></a>
      <a class="nav-link" href="#about">${t('about')} <span>›</span></a>
      <a class="nav-link" href="#contact">${t('contact')} <span>›</span></a>
      <div class="lang-menu">
        <div class="chip" id="lang-en">🇬🇧 English</div>
        <div class="chip" id="lang-ar">🇮🇶 العربية</div>
      </div>
    </div>
  </div>

  `;
}

function footer(){
  return `
  <footer class="footer">
    <div class="container cols footer cols">
      <div>
        <div class="brand"><img class="brand-logo" src="assets/rift-logo.jpg" alt="RIFT logo"><div>${t('brand')}</div></div>
        <p class="small">${t('trusted')}</p>
      </div>
      <div>
        <div class="kicker">Quick Links</div>
        <div class="grid">
          <a href="#home">${t('home')}</a>
          <a href="#services">${t('services')}</a>
          <a href="#store">${t('store')}</a>
          <a href="#contact">${t('contact')}</a>
        </div>
      </div>
      <div>
        <div class="kicker">${t('contact')}</div>
        <div class="grid">
          <a class="small" href="https://t.me/${BOT_USERNAME}" target="_blank" rel="noopener">Telegram Bot: @${BOT_USERNAME}</a>
          <a class="small" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
          <a class="small" href="https://instagram.com/${INSTAGRAM}" target="_blank" rel="noopener">Instagram: @${INSTAGRAM}</a>
          <a class="small" href="https://maps.google.com/?q=${encodeURIComponent(LOCATION_QUERY)}" target="_blank" rel="noopener">${i18n[state.lang].mapLink}</a>
        </div>
      </div>
    </div>
  </footer>`;
}

function viewHome(){
  return `
  <section class="hero container" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <div class="hero-card">
      <div class="kicker">${t('welcome')}</div>
      <h1 class="hero-line">${i18n[state.lang].heroLine.split(/(\. )/).map((part, i) => `<span style="animation-delay: ${i*0.3}s">${part}</span>`).join('')}</h1>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <button id="goToStore" class="btn primary explore" style="box-shadow: 0 0 30px rgba(255,255,255,0.3);">${t('goToStore')}</button>
    </div>
  </section>
  ${viewServices(true)}
  <div id="custom-service-modal" class="modal">
    <div class="overlay" data-close-modal></div>
    <div class="panel">
      <h3>${state.lang === 'ar' ? 'طلب خدمة مخصصة' : 'Custom Service Request'}</h3>
      <label class="small">${t('notes')}</label>
      <textarea id="custom-service-notes" rows="6" placeholder="${state.lang === 'ar' ? 'اكتب تفاصيل الخدمة التي تحتاجها...' : 'Describe the service you need...'}"></textarea>
      <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:16px">
        <button class="btn" data-close-modal>${state.lang === 'ar' ? 'إغلاق' : 'Close'}</button>
        <button class="btn accent" id="add-custom-service">${t('addToCart')}</button>
      </div>
    </div>
  </div>

  `;
}

function viewServices(inHome=false){
  // Merge static services (old catalog) with sheet-driven service products.
  const sheetServiceCards = state.products
    .filter(p => p && p.cat === 'service')
    .map(productCard)
    .join('');

  const staticCards = state.services.map(s=>`
    <div class="card">
      <a class="view-link" href="#store">
        <div class="img"><img src="${s.image || 'assets/apps.png'}" alt="${serviceTitle(s)}"></div>
      </a>
      <div class="body">
        <div class="kicker">${s.key.replace('-',' ')}</div>
        <strong>${serviceTitle(s)}</strong>
        <p class="small">${serviceDesc(s)}</p>
        <button class="btn ghost" data-add-details="${s.key}" style="color: white;">${t('addViaStore')}</button>
      </div>
    </div>
  `).join('');

  const cards = staticCards + sheetServiceCards;
  return `
  <section class="container">
    <div class="section-title">
      <div>
        <div class="kicker">${t('exploreServices')}</div>
        <h2>${inHome ? t('whatWeDo') : t('services')}</h2>
      </div>
      <a class="btn" href="#store" style="display:none;">${t('goToStore')}</a>
    </div>
    <div class="grid cards mobile-two-col uniform-cards">${cards}</div>
  </section>`;
}

// --- Store cards now open a product detail page
const FIT_IDS = ['office','xbox','chatgpt-personal','chatgpt-shared'];
function productCard(p){
  const mp = minPrice(p.id);
  const title = productTitle(p);
  const isSheetProduct = !!p.isSheetProduct;
  // Sheet-driven products use the same product view route.
  const href = `#product/${p.id}`;
  return `
  <div class="card" data-open="${p.id}">
    <div class="img ${FIT_IDS.includes(p.id)?'fit':''}"><img src="${p.image || 'assets/apps.png'}" alt="${title}"></div>
    <div class="body">
      <strong>${title}</strong>
        ${p.desc_en && state.lang==='en' ? `<p class="small">${p.desc_en}</p>` : ''}
        ${p.desc_ar && state.lang==='ar' ? `<p class="small">${p.desc_ar}</p>` : ''}
        <!--desc-injected-->
      ${mp ? `<div class="small">${t('price')}: ${fmtIQD(mp)} +</div>` : ''}
      <a class="btn accent block" href="${href}">${t('view')}</a>
    </div>
  </div>`;
}

function sheetProductCard(sheet){
  const id = 'sheet-' + sheet.name.replace(/\s+/g, '-').toLowerCase();
  const title = sheet.name;
  const image = sheet.items[0]?.imageUrl || 'assets/apps.png';
  const desc = `${sheet.items.length} items`;
  return `
  <div class="card" data-open="${id}">
    <div class="img"><img src="${image}" alt="${title}"></div>
    <div class="body">
      <strong>${title}</strong>
      <p class="small">${desc}</p>
      <a class="btn accent block" href="#sheet-product/${id}">${t('view')}</a>
    </div>
  </div>`;
}

function viewStore(){
  const goods = state.products
    .filter(p=>p.cat==='digital' || p.cat==='service')
    .map(productCard)
    .join('');
  return `
  <section class="container">
    <div class="back-row">
      <a class="btn ghost" href="#home">‹ Back to Home</a>
    </div>
    <div class="section-title">
      <div>
        <div class="kicker">${t('store')}</div>
        <h2>${t('storeGoods')}</h2>
      </div>
      <div class="tag">Images • ${t('price')} • ${t('view')}</div>
    </div>
    <div class="grid cards mobile-two-col uniform-cards">${goods}</div>
  </section>`;
}

function viewProduct(id){
  const p = state.products.find(x=>x.id===id);
  if(!p) { navigate('store'); return ''; }
  const title = productTitle(p);
  const isService = p.cat==='service';

  // Sheet-driven product (from Google Sheet) — uses account type toggle + duration list like your screenshots
  if(p.isSheetProduct){
    const variants = (p.sheetVariants||[]).filter(v=>v.quantity);
    const accSet = Array.from(new Set(variants.map(v=>v.accType||'none')));
    const hasPrivate = accSet.includes('private');
    const hasShared  = accSet.includes('shared');
    const showAccToggle = hasPrivate && hasShared;

    const optSetRaw = variants.map(v=> (v.optionLabel && v.optionLabel.trim()) ? v.optionLabel.trim() : '__default__');
    const optSet = Array.from(new Set(optSetRaw));
    const showOptToggle = optSet.length > 1;

    const defaultAcc = hasPrivate ? 'private' : (hasShared ? 'shared' : (accSet[0]||'none'));
    const defaultOpt = optSet[0] || '__default__';

    function accLabel(acc){
      if(state.lang==='ar'){
        if(acc==='private') return 'حساب خاص';
        if(acc==='shared') return 'حساب مشترك';
        return '—';
      }
      if(acc==='private') return 'Private';
      if(acc==='shared') return 'Shared';
      return '—';
    }

    // Build duration cards; JS will filter dynamically by accType + optionLabel
    // If Column J (Description Button) is TRUE for that row, clicking that option will expand a small panel
    // that shows the description from Column G.
    const durationCards = variants.map(v=>{
      const durLabel = localizeDurationLabel(v.quantity);
      const desc = escapeHtml(v.description || p.desc_ar || p.desc_en || '');
      const opt = (v.optionLabel && v.optionLabel.trim()) ? v.optionLabel.trim() : '__default__';
      const hasDesc = !!v.descButton;
      return `
        <div class="rift-opt-card ${hasDesc ? 'is-service' : ''}" data-acc="${v.accType}" data-opt="${escapeHtml(opt)}" data-qty="${escapeHtml(v.quantity)}" data-price="${v.price}" data-has-desc="${hasDesc ? '1' : '0'}">
          <div class="rift-opt-main">
            <div class="rift-opt-left">IQD ${new Intl.NumberFormat('en-US').format(v.price)}</div>
            <div class="rift-opt-right">${durLabel}</div>
          </div>
          ${hasDesc ? `<div class="rift-opt-desc" style="display:none;">${desc}</div>` : ``}
        </div>
      `;
    }).join('');

    return `
      <section class="container">
        <div class="back-row">
          <a class="btn accent" href="#store">‹ ${t('back')}</a>
        </div>

        <div class="card">
          <div class="body">
            <div class="rift-modal-head">
              <strong style="font-size:20px">${title}</strong>
            </div>

            ${showAccToggle ? `
              <div class="rift-seg" id="acc-seg" data-default="${defaultAcc}">
                <button class="rift-seg-btn" data-acc="private">${accLabel('private')}</button>
                <button class="rift-seg-btn" data-acc="shared">${accLabel('shared')}</button>
              </div>
            ` : ``}

            ${showOptToggle ? `
              <div class="rift-seg" id="opt-seg" data-default-opt="${escapeHtml(defaultOpt)}">
                ${optSet.map(o=> `<button class="rift-seg-btn" data-opt="${escapeHtml(o)}">${escapeHtml(o==='__default__' ? (state.lang==='ar' ? 'اعتيادي' : 'Normal') : o)}</button>`).join('')}
              </div>
            ` : ``}

            <div class="rift-opt-list" id="sheet-opt-list">
              ${durationCards}
            </div>

            <div id="sheet-qty-wrap" class="rift-qty-wrap" style="display:none;">
              <div class="rift-qty-row">
                <button type="button" class="btn ghost rift-qty-btn" id="sheet-qty-minus">-</button>
                <span class="rift-qty-val" id="sheet-qty-val">1</span>
                <button type="button" class="btn ghost rift-qty-btn" id="sheet-qty-plus">+</button>
                <div style="flex:1"></div>
                <div class="rift-total" id="sheet-total">IQD 0</div>
              </div>
            </div>

            <button class="btn accent block" id="add-sheet-selected" disabled>${state.lang==='ar'?'إضافة للسلة':t('addToCart')}</button>
          </div>
        </div>
      </section>
    `;
  }




  // Merged ChatGPT special view
  if(id==='chatgpt'){
    // Side-by-side sections with price buttons; single Add button
    const pricePersonal1M = fmtIQD(priceFor('chatgpt', { type:'Personal', plan:'1 Month' }));
    const priceShared1M   = fmtIQD(priceFor('chatgpt', { type:'Shared',  plan:'1 Month' }));
    const priceShared1Y   = fmtIQD(priceFor('chatgpt', { type:'Shared',  plan:'1 Year'  }));

    return `
      <section class="container">
        <div class="back-row">
          <a class="btn ghost" href="#store">‹ ${t('back')}</a>
        </div>
        <div class="card">
          <div class="img ${FIT_IDS.includes('chatgpt')?'fit':''}"><img src="assets/chatgpt.png" alt="ChatGPT"></div>
          <div class="body">
            <strong>${state.lang==='ar'?'شات جي بي تي':'ChatGPT'}</strong>

            <div style="display:flex;gap:24px;align-items:flex-start;margin-top:10px">
              <div style="flex:1;min-width:0">
                <div class="kicker">${state.lang==='ar'?'حساب شخصي':'Personal Accounts'}</div>
                <div id="choices-chatgpt-personal" class="choice-grid" style="margin-top:8px">
                  <div class="choice" data-choice="personal-1m">${localizeDurationLabel("1 Month")} — ${pricePersonal1M}</div>
                </div>
              </div>
              <div style="width:1px;height:auto;background:rgba(255,255,255,.1)"></div>
              <div style="flex:1;min-width:0">
                <div class="kicker">${state.lang==='ar'?'حساب مشترك':'Shared Accounts'}</div>
                <div id="choices-chatgpt-shared" class="choice-grid" style="margin-top:8px">
                  <div class="choice" data-choice="shared-1m">${localizeDurationLabel("1 Month")} — ${priceShared1M}</div>
                  <div class="choice" data-choice="shared-1y">${localizeDurationLabel("1 Year")} — ${priceShared1Y}</div>
                </div>
              </div>
            </div>

            <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:14px">
              <button class="btn accent" id="add-chatgpt" disabled>${t('addToCart')}</button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

// Build choice buttons for goods; textarea for services
  let content = '';
  if(isService){
    content = `
      <label class="small">${state.lang==='ar' ? 'ملاحظات' : 'Notes'}</label>
      <textarea class="opt" data-key="notes" rows="4" placeholder="${state.lang==='ar' ? 'اكتب مشكلتك وسأساعدك' : 'Type your problem and I will help you'}"></textarea>
      <button class="btn accent block" id="add-selected">${t('addToCart')}</button>
    `;
  }else{
    let choiceKey = p.options[0].key;
    let choices = p.options[0].choices;
    let choiceButtons = choices.map(c=>{
      // compute price for this selection
      const selections = { [choiceKey]: c };
      const price = priceFor(p.id, selections);
      return `<div class="choice" data-choice="${c}"><span>${(choiceKey==="amount" || p.id==="itunes") ? ("$" + String(c)) : localizeDurationLabel(c)}</span><span>${fmtIQD(price)}</span></div>`;
    }).join('');
    content = `
      <div class="choice-grid" id="choices">${choiceButtons}</div>
      <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:10px">
        <button class="btn accent" id="add-selected" disabled>${t('addToCart')}</button>
      </div>
    `;
  }

  return `
  <section class="container">
    <div class="back-row">
      <a class="btn accent" href="#store">‹ ${t('back')}</a>
    </div>
    <div class="card">
      <div class="img ${FIT_IDS.includes(p.id)?'fit':''}"><img src="${p.image || 'assets/apps.png'}" alt="${title}"></div>
      <div class="body">
        <strong>${title}</strong>
        ${p.desc_en && state.lang==='en' ? `<p class=\"small\">${p.desc_en}</p>` : ''}
        ${p.desc_ar && state.lang==='ar' ? `<p class=\"small\">${p.desc_ar}</p>` : ''}
        <!--desc-injected-->
        ${content}
      </div>
    </div>
  </section>
  `;
}

function viewSheetProduct(id){
  const p = state.products.find(x=>x.id===id);
  if(!p) { navigate('store'); return ''; }
  const sheet = state.sheetProducts.find(s => 'sheet-' + s.name.replace(/\s+/g, '-').toLowerCase() === id);
  if(!sheet) { navigate('store'); return ''; }
  const title = productTitle(p);

const itemCards = sheet.items.map(item => `
  <div class="card">
    <div class="img"><img src="${item.imageUrl || 'assets/apps.png'}" alt="${state.lang === 'ar' ? item.arabicName : item.englishName}"></div>
    <div class="body">
      <strong>${state.lang === 'ar' ? item.arabicName : item.englishName}</strong>
      <p class="small">${item.description}</p>
      <div class="small">${t('quantity')}: ${item.quantity}</div>
      <div class="small">${t('price')}: ${fmtIQD(item.price)}</div>
      <button class="btn accent" data-add-sheet-item="${item.productId || item.englishName}" data-price="${item.price}" data-quantity="${item.quantity}" data-description="${item.description}">${t('addToCart')}</button>
    </div>
  </div>
`).join('');

  if (sheet.items.length === 1) {
    return `
  <section class="container">
    <div class="back-row">
      <a class="btn accent" href="#store">‹ ${t('back')}</a>
    </div>
    <div class="section-title">
      <div>
        <div class="kicker">${t('store')}</div>
        <h2>${title}</h2>
      </div>
    </div>
    <div style="display: flex; justify-content: center;">
      ${itemCards}
    </div>
  </section>
  `;
  } else {
    return `
  <section class="container">
    <div class="back-row">
      <a class="btn accent" href="#store">‹ ${t('back')}</a>
    </div>
    <div class="section-title">
      <div>
        <div class="kicker">${t('store')}</div>
        <h2>${title}</h2>
      </div>
    </div>
    <div class="grid cards mobile-two-col uniform-cards">${itemCards}</div>
  </section>
  `;
  }
}


function viewCart(){
  const rows = state.cart.map(i=>`
    <tr data-item="${i.id}" class="cart-row">
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <img src="${i.image || 'assets/apps.png'}" alt="" style="width:56px;height:36px;object-fit:cover;border-radius:8px">
          <div>
            <strong>${i.title}</strong>
            <div class="small">${Object.entries(i.selections).map(([k,v])=>`${k}: ${v}`).join(', ')}</div>
          </div>
        </div>
      </td>
      <td>${i.unitPrice? fmtIQD(i.unitPrice): `<span class="small">${t('onRequest')}</span>`}</td>
      <td>
        <button class="btn accent" data-qty="${i.id}|-1" aria-label="Decrease quantity">-</button>
        <span class="qty-value">${i.qty}</span>
        <button class="btn accent" data-qty="${i.id}|1" aria-label="Increase quantity">+</button>
      </td>
      
      <td>
        <button class="bin-btn" title="${t('remove')}" data-remove="${i.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
            <path d="M10 11v6M14 11v6"/>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');
  return `
  <section class="container">
    <button class="btn ghost" id="cart-top-back" type="button" style="color:#8a2be2; margin: 12px 0 6px;">${state.lang==='ar' ? 'رجوع' : 'Back'}</button>
    <div class="section-title">
      <div>
        <div class="kicker">${t('cart')}</div>
        <h2>${t('checkout')}</h2>
      </div>
      <div class="tag">${t('total')}: ${fmtIQD(cartTotal())}</div>
    </div>
    <div class="card">
      <div class="body">
        <table class="table">
          <thead><tr><th>Item</th><th>${t('price')}</th><th>${t('quantity')}</th><th></th></tr></thead>
          <tbody>${rows || `<tr><td colspan="4" class="small">${t('emptyCart')}</td></tr>`}</tbody>
        </table>
        <div style="display:flex;gap:12px;justify-content:flex-end;flex-wrap:wrap">
          <a class="btn ghost" href="${state.lang==='ar' ? 'orders-ar.html' : 'orders.html'}">${state.lang==='ar' ? 'الطلبات السابقة' : 'Old Orders'}</a>
          <a class="btn ghost" href="#store">${t('continueShopping')}</a>
          <button class="btn accent" id="checkout" ${state.cart.length? '' : 'disabled'}>${t('checkout')}</button>
        </div>
      </div>
    </div>
    <div id="item-modal" class="modal">
      <div class="overlay" data-close-modal></div>
      <div class="panel">
        <h3 id="im-title"></h3>
        <div class="row"><span class="small">${t('quantity')}</span><span id="im-qty"></span></div>
        <div class="row"><span class="small">${t('price')}</span><span id="im-unit"></span></div>
        <div class="row small" id="im-sel"></div>
        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px">
          <button class="btn" data-close-modal>Close</button>
        </div>
      </div>
    </div>
  </section>`;
}

function viewCheckout(){
  const hasService = state.cart.some(cartItemIsService);
  const orderType = hasService ? 'service' : 'account';
  return `
  <section class="container">
    <div class="section-title">
      <div>
        <div class="kicker">${t('checkout')}</div>
        <h2>${t('contactDetails')}</h2>
      </div>
      <div class="tag">${t('total')}: ${fmtIQD(cartTotal())}</div>
    </div>

    <div class="card">
      <div class="body">
        <label class="small">${t('orderType')}</label>
        <select id="order-type" ${hasService ? 'disabled' : ''}>
          <option value="account" ${orderType==='account'?'selected':''}>${t('orderTypeAccount')}</option>
          <option value="service" ${orderType==='service'?'selected':''}>${t('orderTypeService')}</option>
        </select>

        <div id="service-fields" style="${hasService ? '' : 'display:none'}; margin-top:10px">
          <label class="small">${t('serviceTarget')}</label>
          <input type="text" id="service-target" placeholder="${t('serviceTargetPlaceholder')}" />
          <p class="small">${t('serviceTargetNote')}</p>
        </div>

        <label class="small" style="margin-top:10px">${t('iraqPhone')}</label>
        <input type="tel" id="phone" placeholder="+9647XXXXXXXXX or 07XXXXXXXXX">

        <label class="small">${t('city')}</label>
        <input type="text" id="city" placeholder="e.g., Najaf">

        <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:8px">
          <a class="btn ghost" href="#cart">${t('backToCart')}</a>
          <button class="btn accent" id="continue-invoice" disabled>${t('continue')}</button>
        </div>
        <p class="small">${t('phoneCityNote')}</p>
      </div>
    </div>
  </section>`;
}


function invoiceText(){
  const id = Math.random().toString(36).slice(2,10).toUpperCase();
  const now = new Date();
  const date = now.toLocaleString('en-US');
  const phone = (state.invoiceDetails && state.invoiceDetails.phone) || '';
  const city = (state.invoiceDetails && state.invoiceDetails.city) || '';
  const lines = [];
  if(state.lang==='ar'){
    lines.push(`ريفت — فاتورة #${id}`);
    lines.push(`التاريخ/الوقت: ${date}`);
    lines.push(`الهاتف: ${phone}`);
    lines.push(`المدينة: ${city}`);
    const orderType = (state.invoiceDetails && state.invoiceDetails.orderType) || 'account';
    const serviceTarget = (state.invoiceDetails && state.invoiceDetails.serviceTarget) || '';
    lines.push(`نوع الطلب: ${orderType==='service'?'خدمة':'حساب'}`);
    if(orderType==='service'){ lines.push(`يوزر/رابط الخدمة: ${serviceTarget}`); }

  }else{
    lines.push(`Rift — Invoice #${id}`);
    lines.push(`Date/Time: ${date}`);
    lines.push(`Phone: ${phone}`);
    lines.push(`City: ${city}`);
    const orderType = (state.invoiceDetails && state.invoiceDetails.orderType) || 'account';
    const serviceTarget = (state.invoiceDetails && state.invoiceDetails.serviceTarget) || '';
    lines.push(`Order type: ${orderType==='service'?'Service':'Account'}`);
    if(orderType==='service'){ lines.push(`Service username/link: ${serviceTarget}`); }

  }
  lines.push(`--------------------------------`);
  state.cart.forEach(i=>{
    const sel = Object.entries(i.selections).map(([k,v])=>`${k}: ${v}`).join(', ');
    const lineBase = `${i.title}${sel? ' ('+sel+')':''}  x${i.qty}  ${i.unitPrice? fmtIQD(i.unitPrice*i.qty): (state.lang==='ar'?'عند الطلب':'On request')}`;
    lines.push(lineBase);
  });
  lines.push(`--------------------------------`);
  lines.push(`${t('invoiceGrandTotal')}: ${fmtIQD(cartTotal())}`);
  lines.push(`${t('sendToBotNote')} @${BOT_USERNAME}.`);
  const text = lines.join('\n');
  return text;
}

function viewInvoice(){
  if(!state.invoiceDetails){ navigate('cart'); return ''; }
  const text = invoiceText();
  const encoded = encodeURIComponent(text);
  const tgLink = `https://t.me/${BOT_USERNAME}?text=${encoded}`;
  return `
  <section class="container">
    <div class="section-title">
      <div>
        <div class="kicker">${t('invoiceTitle')}</div>
        <h2>${t('brand')}</h2>
      </div>
      <div class="tag">${t('total')}: ${fmtIQD(cartTotal())}</div>
    </div>
    <div class="card">
      <div class="body">
        <textarea id="invoice-text" rows="10" readonly>${text}</textarea>
        <div style="display:flex;gap:12px;justify-content:flex-end">
          <button class="btn accent" id="copy-invoice">${t('copyInvoice')}</button>
          <a class="btn accent" id="open-telegram" href="${tgLink}" target="_blank" rel="noopener">${t('openTelegram')}</a>
        </div>
        <p class="small">${t('sendToBotNote')} <strong>@${BOT_USERNAME}</strong>.</p>
      </div>
    </div>
  </section>`;
}



function viewAbout(){ return `<section class="container"><h2>${t('about')} ${t('brand')}</h2><p class="small">Digital goods and services with clear pricing and a clean experience.</p></section>`; }



function viewContact(){
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(LOCATION_QUERY)}&output=embed`;
  return `
  <section class="container">
    <div class="section-title">
      <div>
        <div class="kicker">${t('contact')}</div>
        <h2>${t('contactHead')}</h2>
      </div>
    </div>
    <div class="grid" style="grid-template-columns:1fr;gap:16px">
      <a class="btn accent" href="https://t.me/${BOT_USERNAME}" target="_blank" rel="noopener">Telegram Bot (@${BOT_USERNAME})</a>
      <a class="btn ghost" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
      <a class="btn ghost" href="https://instagram.com/${INSTAGRAM}" target="_blank" rel="noopener">Instagram @${INSTAGRAM}</a>
      <a class="btn ghost" href="https://maps.google.com/?q=${encodeURIComponent(LOCATION_QUERY)}" target="_blank" rel="noopener">${i18n[state.lang].mapLink}</a>
      <iframe class="iframe-map" src="${mapSrc}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </section>`;
}

// --- Render ---
function render(){
  let cont = null;
  const app = document.getElementById('app');
  let main = '';
  const [route, param] = state.route.split('/');
  switch(route){
    case 'home': main = viewHome(); break;
    case 'services': main = viewServices(false); break;
    case 'store': main = viewStore(); break;
    case 'product': main = viewProduct(param); break;
    case 'sheet-product': main = viewSheetProduct(param); break;
    case 'cart': main = viewCart(); break;
    case 'checkout': main = viewCheckout(); break;
    case 'invoice': main = viewInvoice(); break;
    case 'about': main = viewAbout(); break;
    case 'contact': main = viewContact(); break;
    default: main = viewHome();
  }
  app.innerHTML = header() + main + footer();

  // Bind checkout button
  cont = document.getElementById('continue-invoice');

  // Bind after render
  cont = document.getElementById('continue-invoice');

  // Set direction
  document.documentElement.dir = (state.lang==='ar'?'rtl':'ltr');

  // Drawer handlers
  const drawer = document.getElementById('drawer');
  const burger = document.getElementById('hamburger');
  const bg = document.getElementById('drawer-bg');
  function open(){ if(drawer) drawer.classList.add('open'); }
  function close(){ if(drawer) drawer.classList.remove('open'); }
  burger && burger.addEventListener('click', open);
  bg && bg.addEventListener('click', close);
  // Close drawer when navigating
  document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click', close));

  // Language switch
  const en = document.getElementById('lang-en');
  const ar = document.getElementById('lang-ar');
  en && en.addEventListener('click', ()=> setLang('en'));
  ar && ar.addEventListener('click', ()=> setLang('ar'));
  const enm = document.getElementById('lang-en-menu');
  const arm = document.getElementById('lang-ar-menu');
  enm && enm.addEventListener('click', ()=> setLang('en'));
  arm && arm.addEventListener('click', ()=> setLang('ar'));

  // Product card open
  document.querySelectorAll('[data-open]').forEach(card=>{
    card.addEventListener('click', (e)=>{
      const id = card.getAttribute('data-open');
      const isSheetProduct = id.startsWith('sheet-');
      const route = isSheetProduct ? 'sheet-product' : 'product';
      navigate(route + '/' + id);
    });
  });

  // Go to store button with spinner
  const goToStoreBtn = document.querySelector('a[href="#store"]');
  if (goToStoreBtn) {
    goToStoreBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (state.loadingStore) return;
      state.loadingStore = true;
      const originalText = goToStoreBtn.innerHTML;
      goToStoreBtn.innerHTML = '<span class="loader"></span>';
      goToStoreBtn.style.pointerEvents = 'none';
      try {
        await loadSheetProducts();
        navigate('store');
      } finally {
        goToStoreBtn.innerHTML = originalText;
        goToStoreBtn.style.pointerEvents = '';
        state.loadingStore = false;
      }
    });
  }

  // Glowing Go to Store button
  const glowingGoToStoreBtn = document.getElementById('goToStore');
  if (glowingGoToStoreBtn) {
    glowingGoToStoreBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (state.loadingStore) return;
      state.loadingStore = true;
      const originalText = glowingGoToStoreBtn.innerHTML;
      glowingGoToStoreBtn.innerHTML = '<span class="loader"></span>';
      glowingGoToStoreBtn.style.pointerEvents = 'none';
      try {
        await loadSheetProducts();
        navigate('store');
      } finally {
        glowingGoToStoreBtn.innerHTML = originalText;
        glowingGoToStoreBtn.style.pointerEvents = '';
        state.loadingStore = false;
      }
    });
  }



  // Product detail choices
/* ChatGPT price-choice bindings (single Add) */
(function(){
  if(state.route !== 'product/chatgpt') return;
  var personal = document.getElementById('choices-chatgpt-personal');
  var shared   = document.getElementById('choices-chatgpt-shared');
  var addBtn   = document.getElementById('add-chatgpt');
  var picked   = null;

  function clearAll(){
    [personal, shared].forEach(function(w){
      if(!w) return;
      w.querySelectorAll('.choice').forEach(function(x){ x.classList.remove('active'); });
    });
  }
  function bindWrap(wrap){
    if(!wrap) return;
    wrap.querySelectorAll('.choice').forEach(function(btn){
      btn.addEventListener('click', function(){
        clearAll();
        btn.classList.add('active');
        picked = btn.getAttribute('data-choice'); // personal-1m | shared-1m | shared-1y
        if(addBtn) addBtn.removeAttribute('disabled');
      });
    });
  }
  bindWrap(personal);
  bindWrap(shared);

  if(addBtn){
    addBtn.addEventListener('click', function(){
      if(!picked) return;
      var sel;
      if(picked === 'personal-1m'){ sel = { type:'Personal', plan:'1 Month' }; }
      else if(picked === 'shared-1m'){ sel = { type:'Shared', plan:'1 Month' }; }
      else if(picked === 'shared-1y'){ sel = { type:'Shared', plan:'1 Year' }; }
      else { return; }
      addToCart('chatgpt', sel);
    });
  }
})();


  /* Sheet product (Google Sheet) bindings: account type toggle + duration selection */
  (function(){
    if(!state.route.startsWith('product/')) return;
    const productId = state.route.split('/')[1];
    const prod = state.products.find(x=>x.id===productId);
    if(!prod || !prod.isSheetProduct) return;

    const accSeg = document.getElementById('acc-seg');
    const accBtns = accSeg ? Array.from(accSeg.querySelectorAll('.rift-seg-btn')) : [];
    const optSeg = document.getElementById('opt-seg');
    const optBtns = optSeg ? Array.from(optSeg.querySelectorAll('.rift-seg-btn')) : [];
    const optList = document.getElementById('sheet-opt-list');
    const optCards = optList ? Array.from(optList.querySelectorAll('.rift-opt-card')) : [];
    const addBtn = document.getElementById('add-sheet-selected');

    const qtyWrap = document.getElementById('sheet-qty-wrap');
    const qtyValEl = document.getElementById('sheet-qty-val');
    const qtyMinus = document.getElementById('sheet-qty-minus');
    const qtyPlus  = document.getElementById('sheet-qty-plus');
    const totalEl  = document.getElementById('sheet-total');

    // Defaults must still be set even when toggles are not shown.
    const variants = (prod.sheetVariants||[]).filter(v=>v.quantity);
    const accSet = Array.from(new Set(variants.map(v=>v.accType||'none')));
    const hasPrivate = accSet.includes('private');
    const hasShared  = accSet.includes('shared');
    let currentAcc = (accSeg && accSeg.getAttribute('data-default')) || (hasPrivate ? 'private' : (hasShared ? 'shared' : (accSet[0]||'none')));

    const optSetRaw = variants.map(v=> (v.optionLabel && v.optionLabel.trim()) ? v.optionLabel.trim() : '__default__');
    const optSet = Array.from(new Set(optSetRaw));
    let currentOpt = (optSeg && optSeg.getAttribute('data-default-opt')) || (optSet[0] || '__default__');
    let pickedQty = null;
    let pickedUnit = 0;
    let pickedCount = 1;

    function hideAllDescs(){
      optCards.forEach(c=>{
        const d = c.querySelector('.rift-opt-desc');
        if(d) d.style.display = 'none';
      });
    }

    function updatePickedTotal(){
      if(qtyValEl) qtyValEl.textContent = String(pickedCount);
      if(!totalEl) return;
      const total = Math.max(0, (Number(pickedUnit)||0) * (Number(pickedCount)||1));
      totalEl.textContent = 'IQD ' + new Intl.NumberFormat('en-US').format(total);
    }
    function showQty(){
      if(qtyWrap) qtyWrap.style.display = '';
      updatePickedTotal();
    }
    function hideQty(){
      if(qtyWrap) qtyWrap.style.display = 'none';
      pickedUnit = 0;
      pickedCount = 1;
      updatePickedTotal();
    }

    function applyFilter(){
      // Toggle buttons state
      accBtns.forEach(b=>{
        if(b.getAttribute('data-acc')===currentAcc) b.classList.add('active');
        else b.classList.remove('active');
      });
      optBtns.forEach(b=>{
        if(b.getAttribute('data-opt')===currentOpt) b.classList.add('active');
        else b.classList.remove('active');
      });

      // Show only matching accType + optionLabel (when toggles exist)
      optCards.forEach(c=>{
        const a = c.getAttribute('data-acc') || 'none';
        const o = c.getAttribute('data-opt') || '__default__';
        const showAcc = (!accSeg) ? true : (a===currentAcc);
        const showOpt = (!optSeg) ? true : (o===currentOpt);
        const show = showAcc && showOpt;
        c.style.display = show ? '' : 'none';
        if(!show) c.classList.remove('active');
        if(!show){
          const d = c.querySelector('.rift-opt-desc');
          if(d) d.style.display = 'none';
        }
      });

      // If current selection hidden, clear
      if(pickedQty){
        const still = optCards.some(c=>c.classList.contains('active') && c.style.display!=='none');
        if(!still){
          pickedQty = null;
          hideQty();
          addBtn && addBtn.setAttribute('disabled','');
        }
      }
    }

    function selectCard(card){
      optCards.forEach(c=>c.classList.remove('active'));
      hideAllDescs();
      card.classList.add('active');
      const hasDesc = (card.getAttribute('data-has-desc')||'0') === '1';
      if(hasDesc){
        const d = card.querySelector('.rift-opt-desc');
        if(d && d.textContent.trim()!=='') d.style.display = 'block';
      }
      pickedQty = card.getAttribute('data-qty');
      pickedUnit = Number(card.getAttribute('data-price')) || 0;
      pickedCount = 1;
      showQty();
      addBtn && addBtn.removeAttribute('disabled');
    }

    accBtns.forEach(b=>{
      b.addEventListener('click', ()=>{
        currentAcc = b.getAttribute('data-acc') || 'none';
        pickedQty = null;
        hideAllDescs();
        hideQty();
        addBtn && addBtn.setAttribute('disabled','');
        optCards.forEach(c=>c.classList.remove('active'));
        applyFilter();
      });
    });
    optBtns.forEach(b=>{
      b.addEventListener('click', ()=>{
        currentOpt = b.getAttribute('data-opt') || '__default__';
        pickedQty = null;
        hideAllDescs();
        hideQty();
        addBtn && addBtn.setAttribute('disabled','');
        optCards.forEach(c=>c.classList.remove('active'));
        applyFilter();
      });
    });

    optCards.forEach(card=>{
      card.addEventListener('click', ()=>{
        if(card.style.display==='none') return;
        if(card.classList.contains('active')){
          card.classList.remove('active');
          hideAllDescs();
          pickedQty = null;
          hideQty();
          addBtn && addBtn.setAttribute('disabled','');
        }else{
          selectCard(card);
        }
      });
    });

    applyFilter();

    // Quantity stepper (shows after picking an option)
    if(qtyMinus){
      qtyMinus.addEventListener('click', ()=>{
        if(!pickedQty) return;
        pickedCount = Math.max(1, (pickedCount||1) - 1);
        updatePickedTotal();
      });
    }
    if(qtyPlus){
      qtyPlus.addEventListener('click', ()=>{
        if(!pickedQty) return;
        pickedCount = Math.max(1, (pickedCount||1) + 1);
        updatePickedTotal();
      });
    }

    if(addBtn){
      addBtn.addEventListener('click', ()=>{
        if(!pickedQty) return;
        const sel = { accType: currentAcc, quantity: pickedQty };
        if(currentOpt && currentOpt !== '__default__') sel.option = currentOpt;
        addToCart(productId, sel, pickedCount);
      });
    }
  })();



  const choices = document.getElementById('choices');
  let selectedChoice = null;
  if(choices){
    choices.querySelectorAll('.choice').forEach(ch=>{
      ch.addEventListener('click', ()=>{
        if(ch.classList.contains('active')){
          ch.classList.remove('active');
          selectedChoice = null;
          const btn = document.getElementById('add-selected');
          if(btn){ btn.setAttribute('disabled',''); }
        } else {
          choices.querySelectorAll('.choice').forEach(x=>x.classList.remove('active'));
          ch.classList.add('active');
          selectedChoice = ch.getAttribute('data-choice');
          const btn = document.getElementById('add-selected');
          if(btn){ btn.removeAttribute('disabled'); }
        }
      });
    });
  }

  const addSelected = document.getElementById('add-selected');
  if(addSelected){ addSelected.setAttribute('disabled',''); }
  if(addSelected){
    addSelected.addEventListener('click', ()=>{
      const [_, productId] = state.route.split('/');
      const prod = state.products.find(x=>x.id===productId);
      if(!prod) return;
      if(prod.cat==='service'){
        const notesEl = document.querySelector('textarea.opt[data-key="notes"]');
        const notes = (notesEl && notesEl.value) || '';
        addToCart(productId, {notes});
      }else{
        const key = prod.options[0].key;
        if(!selectedChoice){ return; }
        const val = selectedChoice;
        addToCart(productId, {[key]: val});
      }
    });
  }

  // Cart bindings
  const cartBackBtn = document.getElementById('cart-top-back');
  if(cartBackBtn){
    cartBackBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      try{ if(window.history.length>1) return window.history.back(); }catch(_){ }
      navigate('store');
    });
  }
  document.querySelectorAll('[data-remove]').forEach(btn=> btn.addEventListener('click', ()=> removeFromCart(btn.getAttribute('data-remove'))));
  document.querySelectorAll('[data-qty]').forEach(btn=> btn.addEventListener('click', ()=>{
    const [id,delta] = btn.getAttribute('data-qty').split('|'); changeQty(id, Number(delta));
  }));
  // Row click opens item detail modal
  document.querySelectorAll('tr.cart-row').forEach(tr=>{
    tr.addEventListener('click', (e)=>{
      if(e.target.closest('[data-remove]') || e.target.closest('[data-qty]')) return;
      const id = tr.getAttribute('data-item');
      const it = state.cart.find(x=>x.id===id);
      if(it && document.getElementById('item-modal')){ openItemModal(it); }
    });
  });


  // Open item modal on row click
  document.querySelectorAll('tr.cart-row').forEach(tr=>{
    tr.addEventListener('click', (e)=>{
      if(e.target.closest('[data-remove]') || e.target.closest('[data-qty]')) return;
      const id = tr.getAttribute('data-item');
      const it = state.cart.find(x=>x.id===id);
      if(!it) return;
      const m = document.getElementById('item-modal');
      m.classList.add('open');
      document.getElementById('im-title').textContent = it.title;
      document.getElementById('im-qty').textContent = String(it.qty);
      var imu=document.getElementById('im-unit'); if(imu) imu.textContent = it.unitPrice? fmtIQD(it.unitPrice): (state.lang==='ar'? 'عند الطلب':'On request');
      var ims=document.getElementById('im-sub'); if(ims) ims.textContent = it.unitPrice? fmtIQD(it.unitPrice*it.qty): '—';
      var imsel=document.getElementById('im-sel'); if(imsel) imsel.textContent = Object.entries(it.selections||{}).map(([k,v])=>`${k}: ${v}`).join(', ');
    });
  });

  // Close modal
  document.querySelectorAll('[data-close-modal]').forEach(btn=> btn.addEventListener('click', ()=>{
    const m = document.getElementById('item-modal'); m && m.classList.remove('open');
  }));

  // Close custom service modal
  document.querySelectorAll('#custom-service-modal [data-close-modal]').forEach(btn=> btn.addEventListener('click', ()=>{
    const modal = document.getElementById('custom-service-modal');
    if(modal) modal.classList.remove('open');
  }));

  // Sheet product add to cart
  document.querySelectorAll('[data-add-sheet-item]').forEach(btn=> btn.addEventListener('click', ()=>{
    const itemId = btn.getAttribute('data-add-sheet-item');
    const price = parseFloat(btn.getAttribute('data-price'));
    const description = btn.getAttribute('data-description');
    const [_, productId] = state.route.split('/');
    const p = state.products.find(x=>x.id===productId);
    if(!p) return;
    const selections = { itemId: itemId, description: description, price: price };
    addToCart(productId, selections);
  }));

  const checkoutBtn = document.getElementById('checkout');
  if(checkoutBtn){
    checkoutBtn.addEventListener('click', ()=>{
      if(!state.cart.length){ return; }
      window.location.href = 'checkout-' + state.lang + '.html';
    });
  }

  // Checkout form
  if(cont){
    cont.onclick = ()=>{
      const phoneRaw = document.getElementById('phone').value;
      const city = document.getElementById('city').value.trim();
      const normalized = normalizeIraqPhone(phoneRaw);
      if(!normalized){ alert(state.lang==='ar'?'أدخل رقم هاتف عراقي صحيح':'Please enter a valid Iraqi mobile number'); return; }
      if(!city){ alert(state.lang==='ar'?'أدخل المدينة':'Please enter your city'); return; }

      const cartHasService = state.cart.some(cartItemIsService);
      const orderTypeEl = document.getElementById('order-type');
      const chosenType = (orderTypeEl && orderTypeEl.value) ? orderTypeEl.value : 'account';
      const orderType = cartHasService ? 'service' : chosenType;

      let serviceTarget = '';
      if(orderType === 'service'){
        const targetEl = document.getElementById('service-target');
        serviceTarget = (targetEl && targetEl.value || '').trim();
        if(!serviceTarget){
          alert(state.lang==='ar'?'أدخل يوزر/رابط الخدمة':'Please enter the service username/link');
          return;
        }
      }

      state.invoiceDetails = { phone: normalized, city, orderType, serviceTarget, createdAt: new Date().toISOString() };
      cont.setAttribute('disabled', '');
      navigate('invoice');
    };
  }


  const copyBtn = document.getElementById('copy-invoice');
  if(copyBtn){
    copyBtn.addEventListener('click', async ()=>{
      const txt = document.getElementById('invoice-text').value;
      try{
        await navigator.clipboard.writeText(txt);
        copyBtn.textContent = state.lang==='ar'?'تم النسخ!':'Copied!';
        setTimeout(()=> copyBtn.textContent=t('copyInvoice'), 1200);
      }catch(e){ alert('Copy failed: ' + e.message); }
    });
  }





  
  // Checkout validation
  const phoneEl = document.getElementById('phone');
  const cityEl = document.getElementById('city');
  const orderTypeEl = document.getElementById('order-type');
  const serviceFields = document.getElementById('service-fields');
  const serviceTargetEl = document.getElementById('service-target');
  const cartHasService = state.cart.some(cartItemIsService);

  function syncServiceFields(){
    if(!orderTypeEl || !serviceFields) return;
    const isServiceOrder = cartHasService || orderTypeEl.value === 'service';
    serviceFields.style.display = isServiceOrder ? '' : 'none';
  }

  function enableIfValid(){
    if(!cont) return;
    const phone = normalizeIraqPhone(phoneEl && phoneEl.value);
    const city = (cityEl && cityEl.value||'').trim();
    const isServiceOrder = cartHasService || (orderTypeEl && orderTypeEl.value === 'service');
    const target = (serviceTargetEl && serviceTargetEl.value||'').trim();
    const isValid = (!!phone && !!city && state.cart.length>0 && (!isServiceOrder || !!target));
    if(isValid){ cont.removeAttribute('disabled'); } else { cont.setAttribute('disabled',''); }
  }

  if(orderTypeEl){
    orderTypeEl.addEventListener('change', ()=>{ syncServiceFields(); enableIfValid(); });
    syncServiceFields();
  }

  if(cont){
    phoneEl && phoneEl.addEventListener('input', enableIfValid);
    cityEl && cityEl.addEventListener('input', enableIfValid);
    serviceTargetEl && serviceTargetEl.addEventListener('input', enableIfValid);
    enableIfValid();
  }


  // Header single toggle for language
  (function(){
    var lt = document.getElementById('lang-toggle');
    if(lt){ lt.addEventListener('click', function(){ setLang(state.lang==='ar' ? 'en' : 'ar'); }); }
  })();

  // Custom service modal
  document.querySelectorAll('[data-add-details]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = btn.getAttribute('data-add-details');
      const service = state.services.find(s => s.key === serviceKey);
      if (service) {
        // Pre-fill modal title with service name
        const modal = document.getElementById('custom-service-modal');
        const titleEl = modal.querySelector('h3');
        if (titleEl) titleEl.textContent = serviceTitle(service);
        // Store service key for later
        modal.setAttribute('data-service-key', serviceKey);
        modal.classList.add('open');
      }
    });
  });

  const addCustomService = document.getElementById('add-custom-service');
  if(addCustomService){
    addCustomService.addEventListener('click', ()=>{
      const modal = document.getElementById('custom-service-modal');
      const serviceKey = modal.getAttribute('data-service-key');
      const service = state.services.find(s => s.key === serviceKey);
      const notesEl = document.getElementById('custom-service-notes');
      const notes = (notesEl && notesEl.value.trim()) || '';
      if(!notes){
        alert(state.lang === 'ar' ? 'يرجى كتابة تفاصيل الخدمة' : 'Please describe the service');
        return;
      }
      // Add specific service to cart
      const customService = {
        id: serviceKey + '-' + uid(),
        productId: serviceKey,
        title: serviceTitle(service),
        selections: { notes },
        unitPrice: 0, // On request
        qty: 1,
        image: service.image || 'assets/apps.png',
        cat: 'service'
      };
      state.cart.push(customService);
      saveCart();
      triggerAddToCartAnimation();
      // Close modal
      if(modal) modal.classList.remove('open');
      notesEl.value = '';
      renderCartIndicator();
    });
  }

  renderCartIndicator();
}

if (document.readyState !== 'loading') { try { const r = location.hash.replace('#',''); state.route = r || 'home'; render(); } catch(e) { console.error(e); } }

// Sync hamburger icon with drawer open/close
(function(){
  function syncHamburger(){
    var d = document.getElementById('drawer');
    var h = document.getElementById('hamburger');
    if(!d || !h) return;
    if(d.classList.contains('open')){
      h.classList.add('open');
      h.setAttribute('aria-label', state.lang==='ar' ? 'إغلاق القائمة' : 'Close menu');
    } else {
      h.classList.remove('open');
      h.setAttribute('aria-label', state.lang==='ar' ? 'فتح القائمة' : 'Open menu');
    }
  }
  var mo = new MutationObserver(syncHamburger);
  document.addEventListener('DOMContentLoaded', function(){
    var d = document.getElementById('drawer');
    if(d){ mo.observe(d, {attributes:true, attributeFilter:['class']}); syncHamburger(); }
  });
})();


document.addEventListener('DOMContentLoaded', async ()=>{
  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  }

  if(!localStorage.getItem('siteLanguage')){ try{ const pref = ((typeof navigator!=='undefined' && navigator.language) ? navigator.language : 'en').toLowerCase(); if(pref.startsWith('ar')){ localStorage.setItem('siteLanguage','ar'); } else { localStorage.setItem('siteLanguage','en'); } }catch(e){} }
  const r = location.hash.replace('#',''); state.route = r || 'home';

  // Add sheet loading indicator
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'sheet-loading';
  loadingDiv.innerHTML = '<span class="loader"></span>';
  loadingDiv.classList.add('hidden');
  document.body.appendChild(loadingDiv);

  // Load sheet products and then render
  await loadSheetProducts();
  adjustCatalog();
  render();

  // Now hide the initial loading screen
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    setTimeout(() => loadingScreen.style.display = 'none', 500);
  }
});

function mapEmbed(){
  const online = (typeof navigator!=='undefined' && navigator.onLine);
  if(!online){
    return `<div class="card"><div class="body"><strong>Map unavailable offline</strong><p class="small">Connect to the internet to load the map.</p></div></div>`;
  }
  // Simple Google Maps embed iframe (Najaf, Iraq)
  const src = "https://www.google.com/maps?q=Najaf%2C%20Iraq&output=embed";
  return `<iframe class="iframe-map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${src}" width="100%" height="240" style="border:0;" allowfullscreen></iframe>`;
}
