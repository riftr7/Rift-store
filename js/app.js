let cont = null;

// --- Config ---
const BOT_USERNAME = 'husseina028bot';
const CONTACT_EMAIL = 'abedihusseina028@gmail.com';
const INSTAGRAM = 'rift_r7';
const LOCATION_QUERY = 'Najaf, Iraq';

// --- Error overlay (avoids silent blank screens) ---
(function(){ window.__riftErrorOverlayInstalled = true; window.__RIFT_OVERLAY_DISABLED = true; function show(){ /* overlay disabled */ } })();
// uid helper for older browsers
function uid(){ try{ if(window.crypto && window.crypto.randomUUID){ return window.uid(); } }catch(e){} return 'id-' + Math.random().toString(36).slice(2); }


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
    heroLine: 'Secure. Professional. Trusted.',
    exploreServices: 'Explore Services',
    whatWeDo: 'What we do',
    goToStore: 'Go to Store',
    addViaStore: 'Add via Store',
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
    heroLine: 'آمن. احترافي. موثوق.',
    exploreServices: 'استكشف الخدمات',
    whatWeDo: 'ماذا نقدم',
    goToStore: 'اذهب للمتجر',
    addViaStore: 'أضف من المتجر',
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
    sendToBotNote: 'انسخ هذه الفاتورة، افتح تيليجرام، ثم أرسلها إلى',
    invoiceGrandTotal: 'الإجمالي النهائي',
    mapLink: LOCATION_QUERY,
  }
};

const t = (k)=> i18n[state.lang][k] || k;

// --- State ---
const state = {
  route: 'home',
  lang: localStorage.getItem('lang') || 'en',
  cart: JSON.parse(localStorage.getItem('cart')||'[]'),
  invoiceDetails: null,
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
        { id:'freefire', cat:'digital', title_en:'Free Fire Diamonds', title_ar:'ماسات Free Fire', image:'assets/freefire\.jpeg', options:[{key:'diamonds', choices:[100]}] },
    { id:'pubg', cat:'digital', title_en:'PUBG Mobile UC', title_ar:'شدات ببجي موبايل', image:'assets/pubg\.jpg', options:[{key:'uc', choices:[60,325,660,1800,3850,8100,16000,24300,32400,40500]}] },
    { id:'xbox', cat:'digital', title_en:'Xbox (Membership / Gift Cards)', title_ar:'اكس بوكس (اشتراك/بطاقات)', image:'assets/xbox\.png', options:[{key:'type', choices:['Membership 1 Month','Membership 3 Months','Membership 12 Months','$10','$15','$20']}] },
    { id:'minecraft', cat:'digital', title_en:'Minecraft Minecoins', title_ar:'Minecoins ماينكرافت', image:'assets/minecraft\.jpg', options:[{key:'minecoins', choices:[3500]}] },
    { id:'discord', cat:'digital', title_en:'Discord Nitro', title_ar:'ديسكورد نيترو', image:'assets/discord\.png', options:[{key:'plan', choices:['Nitro Classic Monthly (INT)','Nitro Monthly (INT)']}] },

    
        { id:'office', cat:'digital', title_en:'Microsoft Office', title_ar:'مايكروسوفت أوفيس', image:'assets/office\.png', options:[{key:'version', choices:['2016','2019']}] },
    { id:'perplexity', cat:'digital', title_en:'Perplexity Pro', title_ar:'بيربلكسيتي برو', image:'assets/perplexity\.png', options:[{key:'term', choices:['1 Year']}] },

    // Services
    { id:'svc-pc', cat:'service', title_en:'PC Optimization (Service)', title_ar:'تحسين الكمبيوتر', image:'assets/pcopt.png', options:[{key:'notes', textarea:true}] },
    { id:'svc-mobile', cat:'service', title_en:'Mobile Services', title_ar:'خدمات الموبايل', image:'assets/mobile.png', options:[{key:'notes', textarea:true}] },
    { id:'svc-cloud', cat:'service', title_en:'Cloud Accounts', title_ar:'حسابات سحابية', image:'assets/cloud.png', options:[{key:'notes', textarea:true}] },
    { id:'svc-webprog', cat:'service', title_en:'Website Programming', title_ar:'برمجة مواقع', image:'assets/apps.png', options:[{key:'notes', textarea:true}] },
    { id:'svc-appprog', cat:'service', title_en:'App Programming', title_ar:'برمجة تطبيقات', image:'assets/appprog\.png', options:[{key:'notes', textarea:true}] },
    { id:'svc-apps', cat:'service', title_en:'Apps', title_ar:'التطبيقات', image:'assets/apps.png', options:[{key:'notes', textarea:true}] },
    { id:'svc-programs', cat:'service', title_en:'Programs', title_ar:'البرامج', image:'assets/programs.png', options:[{key:'notes', textarea:true}] },

  ],
  
services: [
    {key:'pc-opt', title_en:'PC Optimization', title_ar:'تحسين الكمبيوتر', image:'assets/pcopt.png',
      desc_en:'Deep clean, boot speedup, driver updates, stability fixes.',
      desc_ar:'تنظيف عميق، تسريع الإقلاع، تحديث التعريفات، إصلاح الاستقرار.'},
    {key:'mobile', title_en:'Mobile Services', title_ar:'خدمات الموبايل', image:'assets/mobile.png',
      desc_en:'Repairs, optimization, backups, transfer, security.',
      desc_ar:'صيانة، تحسين، نسخ احتياطي، نقل، أمان.'},
    {key:'webprog', title_en:'Website Programming', title_ar:'برمجة مواقع',
      desc_en:'Custom websites, landing pages, stores.',
      desc_ar:'مواقع مخصصة، صفحات هبوط، متاجر.'},
    {key:'appprog', title_en:'App Programming', title_ar:'برمجة تطبيقات',
      desc_en:'Mobile/desktop app development on request.',
      desc_ar:'تطوير تطبيقات موبايل أو سطح المكتب عند الطلب.'},
    {key:'cloud', title_en:'Cloud Accounts', title_ar:'حسابات سحابية',
      desc_en:'Setup, recovery, storage, security.',
      desc_ar:'إعداد، استرجاع، تخزين، أمان.'},
    {key:'apps', title_en:'Apps', title_ar:'التطبيقات', image:'assets/apps.png',
      desc_en:'Install, configure, and update essential apps.',
      desc_ar:'تثبيت وإعداد وتحديث التطبيقات.'},
    {key:'programs', title_en:'Programs', title_ar:'البرامج', image:'assets/programs.png',
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
  netflix:{'1 Month':8000,'3 Months':12000,'6 Months':22000,'1 Year':35000},primevideo:{'1 Month':11000,'1 Year':65000},
  adobecc:{'1 Year':155000},
  duolingo:{'1 Year':20000,'Forever':40000},
  canva:{'1 Year':6000,'3 Years':11000,'Forever':21000},
  chatgptShared:{'1 Month':12000,'1 Year':50000},
  chatgptPersonal:{'1 Month':16000},
  office:{'2016':5000,'2019':10000},
  perplexity:{'1 Year':30000},
  chatgptPerMonth: 12000,
  itunes: {2:3000, 3:4500, 4:5500, 5:7000, 10:13000, 15:21000, 20:27000, 25:35000, 30:42000, 40:53000, 50:68500, 60:81500, 100:136500, 500:680000},
  freefire: {100:1500, 210:3000, 350:7000, 1080:14000, 2200:28000},
  pubg: {60:1250, 325:6250, 660:12250, 1800:32500, 3850:60500, 8100:121000, 16000:242000, 24300:362500, 32400:483500, 40500:604250},
  xbox: {'Membership 1 Month':13000,'Membership 3 Months':34000,'Membership 12 Months':100000,'$10':13000,'$15':20000,'$20':26000},
  minecraft: {3500:27000},
  discord: {'Nitro Classic Monthly (INT)':7000, 'Nitro Monthly (INT)':13000}
};

function productTitle(p){
  return state.lang==='ar' ? p.title_ar : p.title_en;
}
function serviceTitle(s){
  return state.lang==='ar' ? s.title_ar : s.title_en;
}
function serviceDesc(s){
  return state.lang==='ar' ? s.desc_ar : s.desc_en;
}

function priceFor(productId, selections){
  switch(productId){
    case 'capcut': return pricesIQD.capcut[selections.term]||0;
    case 'disneyplus': return pricesIQD.disneyplus[selections.term]||0;
    case 'shahid': return pricesIQD.shahid[selections.term]||0;
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
      const m = Number(selections.months);
      if(m===1) return 12000;
      if(m===3) return 20000;
      if(m===6) return 35000;
      if(m===12) return 55000;
      return 0;
    }
    case 'freefire': return pricesIQD.freefire[Number(selections.diamonds)]||0;
    case 'pubg': return pricesIQD.pubg[Number(selections.uc)]||0;
    case 'xbox': return pricesIQD.xbox[selections.type]||0;
    case 'minecraft': return pricesIQD.minecraft[Number(selections.minecoins)]||0;
    case 'discord': return pricesIQD.discord[selections.plan]||0;
    default: return 0;
  }
}

function minPrice(productId){
  switch(productId){
    case 'capcut': return Math.min(...Object.values(pricesIQD.capcut));
    case 'disneyplus': return Math.min(...Object.values(pricesIQD.disneyplus));
    case 'shahid': return Math.min(...Object.values(pricesIQD.shahid));
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
    default: return 0;
  }
}


function adjustCatalog(){
  // Remove unwanted services
  state.products = state.products.filter(p=> !['svc-appprog'].includes(p.id));

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
  const order = ['pubg','freefire','itunes','chatgpt','duolingo','adobecc','primevideo','netflix','minecraft'];
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
  if(state.lang!=='ar') return String(str);
  const map = {'0':'٠','1':'١','2':'٢','3':'٣','4':'٤','5':'٥','6':'٦','7':'٧','8':'٨','9':'٩'};
  return String(str).replace(/[0-9]/g, d=> map[d]);
}
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
function setLang(l){ state.lang=l; localStorage.setItem('lang', l); document.documentElement.setAttribute('lang', l); document.documentElement.dir = (l==='ar'?'rtl':'ltr'); render(); }
function navigate(route){ state.route = route; window.location.hash = route; render(); }
window.addEventListener('hashchange', ()=>{ const r = location.hash.replace('#',''); if(r){ if('scrollRestoration' in history){ history.scrollRestoration = 'manual'; } window.scrollTo(0,0); state.route = r; render(); } });

function addToCart(id, selections){
  const p = state.products.find(x=>x.id===id);
  if(!p) return;
  const unitPrice = priceFor(id, selections);
  state.cart.push({ id: uid(), productId:id, title: productTitle(p), selections, unitPrice, qty:1, image:p.image, cat:p.cat });
  saveCart();
  alert(state.lang==='ar'?'تمت الإضافة إلى السلة':'Added to cart');
  
  // Checkout validation
  const phoneEl = document.getElementById('phone');
  const cityEl = document.getElementById('city');
  function enableIfValid(){
    if(!cont) return;
    const phone = normalizeIraqPhone(phoneEl && phoneEl.value);
    const city = (cityEl && cityEl.value||'').trim();
    const isValid = (!!phone && !!city && state.cart.length>0);
    if(isValid){ cont.removeAttribute('disabled'); } else { cont.setAttribute('disabled',''); }
  }
  if(cont){
    phoneEl && phoneEl.addEventListener('input', enableIfValid);
    cityEl && cityEl.addEventListener('input', enableIfValid);
    enableIfValid();
  }

  // Header single toggle for language
  (function(){
    var lt = document.getElementById('lang-toggle');
    if(lt){ lt.addEventListener('click', function(){ setLang(state.lang==='ar' ? 'en' : 'ar'); }); }
  })();

  renderCartIndicator();
}
function removeFromCart(id){ state.cart = state.cart.filter(i=>i.id!==id); saveCart(); render(); }
function changeQty(id, delta){ const it = state.cart.find(i=>i.id===id); if(!it) return; it.qty = Math.max(1, it.qty + delta); saveCart(); render(); }
function cartTotal(){ return state.cart.reduce((s,i)=>s+(i.unitPrice*i.qty),0); }
function totalItems(){ return state.cart.reduce((s,i)=>s+i.qty,0); }
function renderCartIndicator(){ const el = document.querySelector('#cart-count'); if(!el) return; const c = totalItems(); el.textContent = c? String(c):''; }

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


// --- UI TEMPLATES ---

function header(){
  const l = state.lang;
  return `
  <header class="header">
    <div class="header-inner container">
      <a class="brand" href="#home" aria-label="Home">
        <img class="brand-logo" src="assets/rift-logo.jpg" alt="RIFT logo">
        <div>${t('brand')}</div>
      </a>
      <div class="right">
        <a class="btn ghost" href="#store">${t('store')}</a>
        <a class="btn ghost badge-btn" href="#cart" id="cart-btn" aria-label="${t('cart')}">🛒<span id="cart-count" class="badge"></span></a>
        <div class="hamburger" id="hamburger" aria-label="Open menu"><span></span></div>
        <div class="chip lang-toggle" id="lang-toggle">${state.lang==='ar'?'EN':'AR'}</div>
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
  </footer>
  <div class="watermark-fixed">${state.lang==='ar' ? 'حسين رحيم العابدي' : 'Hussein Raheem Al-Abedi'}</div>`;
}

function viewHome(){
  return `
  <section class="hero container">
    <div class="hero-card">
      <div class="kicker">${t('welcome')}</div>
      <h1>${t('heroLine')}</h1>
      
    </div>
  </section>
  ${viewServices(true)}
  `;
}

function viewServices(inHome=false){
  const cards = state.services.map(s=>`
    <div class="card">
      <a class="view-link" href="#store">
        <div class="img"><img src="${s.image || 'assets/apps.png'}" alt="${serviceTitle(s)}"></div>
      </a>
      <div class="body">
        <div class="kicker">${s.key.replace('-',' ')}</div>
        <strong>${serviceTitle(s)}</strong>
        <p class="small">${serviceDesc(s)}</p>
        <a class="btn ghost" href="#store">${t('addViaStore')}</a>
      </div>
    </div>
  `).join('');
  return `
  <section class="container">
    <div class="section-title">
      <div>
        <div class="kicker">${t('exploreServices')}</div>
        <h2>${inHome ? t('whatWeDo') : t('services')}</h2>
      </div>
      <a class="btn" href="#store">${t('goToStore')}</a>
    </div>
    <div class="grid cards mobile-two-col uniform-cards">${cards}</div>
  </section>`;
}

// --- Store cards now open a product detail page
const FIT_IDS = ['office','xbox','chatgpt-personal','chatgpt-shared'];
function productCard(p){
  const mp = minPrice(p.id);
  const title = productTitle(p);
  return `
  <div class="card" data-open="${p.id}">
    <div class="img ${FIT_IDS.includes(p.id)?'fit':''}"><img src="${p.image || 'assets/apps.png'}" alt="${title}"></div>
    <div class="body">
      <strong>${title}</strong>
        ${p.desc_en && state.lang==='en' ? `<p class="small">${p.desc_en}</p>` : ''}
        ${p.desc_ar && state.lang==='ar' ? `<p class="small">${p.desc_ar}</p>` : ''}
        <!--desc-injected-->
      ${mp ? `<div class="small">${t('price')}: ${fmtIQD(mp)} +</div>` : ''}
      <a class="btn accent block" href="#product/${p.id}">${t('view')}</a>
    </div>
  </div>`;
}

function viewStore(){
  const goods = state.products.filter(p=>p.cat==='digital').map(productCard).join('');
  const services = state.products.filter(p=>p.cat==='service').map(productCard).join('');
  return `
  <section class="container">
    <div class="section-title">
      <div>
        <div class="kicker">${t('store')}</div>
        <h2>${t('storeGoods')}</h2>
      </div>
      <div class="tag">Images • ${t('price')} • ${t('view')}</div>
    </div>
    <div class="grid cards mobile-two-col uniform-cards">${goods}</div>
    <div class="section-title">
      <div>
        <div class="kicker">${t('store')}</div>
        <h2>${t('storeServices')}</h2>
      </div>
      <div class="tag">${t('addDetails')}</div>
    </div>
    <div class="grid cards mobile-two-col uniform-cards">${services}</div>
  </section>`;
}

function viewProduct(id){
  const p = state.products.find(x=>x.id===id);
  if(!p) { navigate('store'); return ''; }
  const title = productTitle(p);
  const isService = p.cat==='service';

  
  // Merged ChatGPT special view
  if(id==='chatgpt'){
    const personalChoices = ['1 Month'];
    const sharedChoices = ['1 Month','1 Year'];
    function choiceGrid(idPrefix, prodId, choices){
      const buttons = choices.map(c=>{
        const price = priceFor(prodId, prodId==='chatgpt-personal'?{plan:c}:{plan:c});
        return `<div class="choice" data-choice="${c}"><span>${localizeDurationLabel(c)}</span><span>${fmtIQD(price)}</span></div>`;
      }).join('');
      return `<div class="choice-grid" id="${idPrefix}">${buttons}</div>`;
    }
    const content = `
      <div class="kicker">${state.lang==='ar'?'حسابات شخصية':'Personal Accounts'}</div>
      ${choiceGrid('choices-chatgpt-personal','chatgpt-personal', personalChoices)}
      <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:10px">
        <button class="btn accent" id="add-personal" disabled>${t('addToCart')}</button>
      </div>
      <hr style="opacity:.2;margin:14px 0">
      <div class="kicker">${state.lang==='ar'?'حسابات مشتركة':'Shared Accounts'}</div>
      ${choiceGrid('choices-chatgpt-shared','chatgpt-shared', sharedChoices)}
      <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:10px">
        <button class="btn accent" id="add-shared" disabled>${t('addToCart')}</button>
      </div>
    `;
    return `
      <section class="container">
        <div class="back-row">
          <a class="btn ghost" href="#store">‹ ${t('back')}</a>
        </div>
        <div class="card">
          <div class="img ${FIT_IDS.includes('chatgpt')?'fit':''}"><img src="assets/chatgpt.png" alt="ChatGPT"></div>
          <div class="body">
            <strong>${state.lang==='ar'?'شات جي بي تي':'ChatGPT'}</strong>
            ${content}
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
      return `<div class="choice" data-choice="${c}"><span>${p.id==='pubg'||p.id==='freefire'?(toArabicDigits(c)+' ' + (p.id==='freefire'?'💎':'')):localizeDurationLabel(c)}</span><span>${fmtIQD(price)}</span></div>`;
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
      <a class="btn ghost" href="#store">‹ ${t('back')}</a>
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
        <div style="display:flex;gap:12px;justify-content:flex-end">
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
        <label class="small">${t('iraqPhone')}</label>
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
  const date = now.toLocaleString();
  const phone = (state.invoiceDetails && state.invoiceDetails.phone) || '';
  const city = (state.invoiceDetails && state.invoiceDetails.city) || '';
  const lines = [];
  if(state.lang==='ar'){
    lines.push(`ريفت — فاتورة #${id}`);
    lines.push(`التاريخ/الوقت: ${date}`);
    lines.push(`الهاتف: ${phone}`);
    lines.push(`المدينة: ${city}`);
  }else{
    lines.push(`Rift — Invoice #${id}`);
    lines.push(`Date/Time: ${date}`);
    lines.push(`Phone: ${phone}`);
    lines.push(`City: ${city}`);
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
  return lines.join('\n');
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
        <textarea id="invoice-text" rows="10">${text}</textarea>
        <div style="display:flex;gap:12px;justify-content:flex-end">
          <button class="btn accent" id="copy-invoice">${t('copyInvoice')}</button>
          <a class="btn accent" id="open-telegram" href="${tgLink}" target="_blank" rel="noopener">${t('openTelegram')}</a>
          <button class="btn accent" id="print-invoice">${t('print')}</button>
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
      navigate('product/'+id);
    });
  });

  // Product detail choices
  const choices = document.getElementById('choices');
  let selectedChoice = null;
  if(choices){
    choices.querySelectorAll('.choice').forEach(ch=>{
      ch.addEventListener('click', ()=>{
        choices.querySelectorAll('.choice').forEach(x=>x.classList.remove('active'));
        ch.classList.add('active');
        selectedChoice = ch.getAttribute('data-choice'); const btn = document.getElementById('add-selected'); if(btn){ btn.removeAttribute('disabled'); }
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

  const checkoutBtn = document.getElementById('checkout');
  if(checkoutBtn){
    checkoutBtn.addEventListener('click', ()=>{
      if(!state.cart.length){ return; }
      navigate('checkout');
    });
  }

  // Checkout form
  if(cont){
    cont.addEventListener('click', ()=>{
      const phoneRaw = document.getElementById('phone').value;
      const city = document.getElementById('city').value.trim();
      const normalized = normalizeIraqPhone(phoneRaw);
      if(!normalized){ alert(state.lang==='ar'?'أدخل رقم هاتف عراقي صحيح':'Please enter a valid Iraqi mobile number'); return; }
      if(!city){ alert(state.lang==='ar'?'أدخل المدينة':'Please enter your city'); return; }
      state.invoiceDetails = { phone: normalized, city, createdAt: new Date().toISOString() };
      navigate('invoice');
    });
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

  const printBtn = document.getElementById('print-invoice');
  if(printBtn){ printBtn.addEventListener('click', ()=> window.print()); }

  
  // Checkout validation
  const phoneEl = document.getElementById('phone');
  const cityEl = document.getElementById('city');
  function enableIfValid(){
    if(!cont) return;
    const phone = normalizeIraqPhone(phoneEl && phoneEl.value);
    const city = (cityEl && cityEl.value||'').trim();
    const isValid = (!!phone && !!city && state.cart.length>0);
    if(isValid){ cont.removeAttribute('disabled'); } else { cont.setAttribute('disabled',''); }
  }
  if(cont){
    phoneEl && phoneEl.addEventListener('input', enableIfValid);
    cityEl && cityEl.addEventListener('input', enableIfValid);
    enableIfValid();
  }

  // Header single toggle for language
  (function(){
    var lt = document.getElementById('lang-toggle');
    if(lt){ lt.addEventListener('click', function(){ setLang(state.lang==='ar' ? 'en' : 'ar'); }); }
  })();

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


document.addEventListener('DOMContentLoaded', ()=>{
  if(!localStorage.getItem('lang')){ try{ const pref = ((typeof navigator!=='undefined' && navigator.language) ? navigator.language : 'en').toLowerCase(); if(pref.startsWith('ar')){ localStorage.setItem('lang','ar'); } else { localStorage.setItem('lang','en'); } }catch(e){} }
  const r = location.hash.replace('#',''); state.route = r || 'home'; adjustCatalog();render();
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