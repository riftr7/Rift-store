const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbxT6fG1xBmhDWonLDSiXXZGwpXd00CIP0zHRs9t407983FHZ5ljPMkpjGQk_fObspgonA/exec';

document.addEventListener('DOMContentLoaded', () => {
  // Language flag (used across the whole page)
  const isArabic = document.documentElement.lang === 'ar';

  // Get order data from localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const invoiceID = urlParams.get('invoice') || (localStorage.getItem('currentOrder') ? JSON.parse(localStorage.getItem('currentOrder')).invoiceID : null);
  const token = urlParams.get('token') || (localStorage.getItem('currentOrder') ? JSON.parse(localStorage.getItem('currentOrder')).token : null);

  if (!invoiceID || !token) {
    const isArabic = document.documentElement.lang === 'ar';
    document.getElementById('status-title').textContent = isArabic ? 'لا يوجد طلب نشط' : 'No Active Order';
    document.getElementById('status-message').textContent = isArabic ? 'لم يتم العثور على طلب نشط. يرجى إنشاء طلب جديد.' : 'No active order found. Please create a new order.';
    document.getElementById('invoice-section').style.display = 'none';
    return;
  }

  // Display invoice ID
  document.getElementById('invoice-text').textContent = `${isArabic ? 'رقم الفاتورة:' : 'Invoice ID:'} ${invoiceID}`;

  // Copy invoice button functionality
  document.getElementById('copy-invoice-btn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(invoiceID);
      const btn = document.getElementById('copy-invoice-btn');
      const originalText = btn.textContent;
      btn.textContent = isArabic ? 'تم النسخ' : 'Copied';
      setTimeout(() => {
        btn.textContent = isArabic ? 'نسخ' : 'Copy';
      }, 1000);
    } catch (err) {
      console.error('Failed to copy invoice ID:', err);
    }
  });

  // Support button functionality
  document.getElementById('support-btn').addEventListener('click', () => {
    window.open('https://t.me/rift_r7support', '_blank');
  });

  // Status bubbles
  const statusBubbles = isArabic ? {
    'Checking Payment': '⏳ جاري فحص الدفع',
    'Payment Accepted': '✅ تم قبول الدفع',
    'Preparing Order': '📦 جاري تحضير الطلب',
    'Delivered': '🚚 تم التسليم'
  } : {
    'Checking Payment': '⏳ Checking Payment',
    'Payment Accepted': '✅ Payment Accepted',
    'Preparing Order': '📦 Preparing Order',
    'Delivered': '🚚 Delivered'
  };

  let currentStatus = 'Checking Payment';
  let pollingInterval;

  function updateStatusDisplay(status) {
    currentStatus = status;
    document.getElementById('status-title').textContent = statusBubbles[status] || status;

    // Highlight current status
    const statusKeys = Object.keys(statusBubbles);
    const currentIndex = statusKeys.indexOf(status);

    let statusHTML = '';
    statusKeys.forEach((key, index) => {
      const isActive = index <= currentIndex;
      const isCurrent = index === currentIndex;
      statusHTML += `<div class="status-bubble ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}">${statusBubbles[key]}</div>`;
    });

    document.getElementById('status-message').innerHTML = statusHTML;

    // Show delivery/account details if delivered
    if (status === 'Delivered') {
      fetchAccountDetails();
    } else {
      document.getElementById('account-details').style.display = 'none';
      const fields = document.getElementById('account-details-fields');
      const raw = document.getElementById('account-details-raw');
      if (fields) fields.innerHTML = '';
      if (raw) { raw.style.display = 'none'; raw.value = ''; }
    }
  }

  function renderKeyValue(key, value) {
    const safeKey = String(key || '').trim();
    const safeVal = String(value || '').trim();
    if (!safeKey || !safeVal) return '';
    return `
      <div style="display:flex; gap:12px; justify-content:space-between; align-items:flex-start; padding:10px 0; border-bottom:1px solid rgba(255,255,255,.06);">
        <div class="small" style="color: var(--text-secondary); min-width:110px;">${safeKey}</div>
        <div style="text-align:right; word-break:break-word;">${safeVal}</div>
      </div>
    `;
  }

  function parseDetailsFromString(str) {
    const out = {};
    const lines = String(str || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      const m = line.match(/^([^:：]+)[:：]\s*(.+)$/);
      if (m) {
        out[m[1].trim()] = m[2].trim();
      }
    }
    return out;
  }

  function renderDeliveryDetails(data) {
    const isAr = document.documentElement.lang === 'ar';
    const container = document.getElementById('account-details-fields');
    const raw = document.getElementById('account-details-raw');
    const wrap = document.getElementById('account-details');
    const title = document.getElementById('account-details-title');
    if (!container || !wrap || !title) return;

    // Prefer structured fields if available
    let detailsObj = null;

    // 1) New-style object field
    if (data && typeof data.deliveryDetails === 'object' && data.deliveryDetails) detailsObj = data.deliveryDetails;
    if (data && typeof data.details === 'object' && data.details) detailsObj = detailsObj || data.details;

    // 2) Common flat fields
    const flat = {};
    const pick = (labelEn, labelAr, keys) => {
      for (const k of keys) {
        if (data && data[k] != null && String(data[k]).trim() !== '') {
          flat[isAr ? labelAr : labelEn] = String(data[k]).trim();
          return;
        }
      }
    };
    pick('Account / Email', 'الحساب / البريد', ['account', 'email', 'login', 'username']);
    pick('Password', 'كلمة المرور', ['password', 'pass']);
    pick('Profile / Link', 'الرابط / الملف', ['link', 'profile', 'target']);
    pick('Notes', 'ملاحظات', ['note', 'notes', 'message']);

    // 3) Raw delivery string (preferred for exact formatting from Google Sheets)
    let legacyString = null;
    const pickRaw = (k) => (data && typeof data[k] === 'string' ? data[k] : null);
    legacyString = pickRaw('accountDetails') || pickRaw('deliveredText') || pickRaw('deliveryDetailsText') || pickRaw('detailsText') || pickRaw('deliveryDetails');

    // Build final display
    const merged = { ...(detailsObj || {}), ...flat };
    const mergedKeys = Object.keys(merged).filter(k => String(merged[k]).trim() !== '');

    title.textContent = isAr ? 'تفاصيل التسليم' : 'Delivery Details';
    container.innerHTML = '';

    // If we got a raw multi-line string, show it exactly as-is in the textarea.
    if (legacyString && raw) {
      container.innerHTML = '';
      raw.value = String(legacyString); // do NOT trim; preserve spaces/newlines exactly
      raw.style.display = 'block';
      wrap.style.display = 'block';
      return;
    }

    if (mergedKeys.length) {
      container.innerHTML = mergedKeys.map(k => renderKeyValue(k, merged[k])).join('');
      if (raw) raw.style.display = 'none';
      wrap.style.display = 'block';
      return;
    }

    // No legacy string + no structured fields

    // Absolute fallback: show the raw response (minus noisy fields)
    const cleaned = { ...(data || {}) };
    delete cleaned.status;
    delete cleaned.success;
    delete cleaned.invoiceID;
    delete cleaned.invoice;
    delete cleaned.token;
    if (raw) {
      raw.value = JSON.stringify(cleaned, null, 2);
      raw.style.display = 'block';
    }
    wrap.style.display = 'block';
  }

  async function fetchStatus() {
    try {
      const response = await fetch(`${BACKEND_URL}?invoice=${invoiceID}&token=${token}`);
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Invalid response format');
      }

      if (data && data.status) {
        // Normalize status to match expected keys
        let normalizedStatus = data.status.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        updateStatusDisplay(normalizedStatus);
      } else {
        // Keep current status if fetch fails
        console.log('No status in response, keeping current status');
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      // Keep current status if fetch fails
    }
  }

  async function fetchAccountDetails() {
    try {
      const response = await fetch(`${BACKEND_URL}?invoice=${invoiceID}&token=${token}`);
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Invalid response format');
      }

      if (data) {
        renderDeliveryDetails(data);
      }
    } catch (error) {
      console.error('Error fetching account details:', error);
    }
  }

  // Initial fetch
  fetchStatus();

  // Poll every 5 seconds
  pollingInterval = setInterval(fetchStatus, 5000);

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  });
});
