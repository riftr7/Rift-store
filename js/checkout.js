const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbxT6fG1xBmhDWonLDSiXXZGwpXd00CIP0zHRs9t407983FHZ5ljPMkpjGQk_fObspgonA/exec';

// Helper function for formatting IQD
const fmtIQD = (n) => new Intl.NumberFormat('en-US').format(n) + ' IQD';

document.addEventListener('DOMContentLoaded', () => {
  const isArabic = document.documentElement.lang === 'ar';

  // Back button (placed inside page content, not in the top bar)
  const backBtn = document.getElementById('page-back') || document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = isArabic ? 'index-ar.html#store' : 'index.html#store';
      }
    });
  }

  // Display cart items
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartDisplay = document.getElementById('cart-items-display');
  if (cartDisplay) {
    if (cart.length === 0) {
      cartDisplay.innerHTML = '<p class="small">Your cart is empty.</p>';
    } else {
      let total = 0;
      const cartHTML = cart.map(item => {
        const subtotal = item.unitPrice * item.qty;
        total += subtotal;
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,.06);">
            <div>
              <strong>${item.title}</strong>
              <div class="small">${Object.entries(item.selections || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}</div>
            </div>
            <div style="text-align: right;">
              <div class="small">Qty: ${item.qty}</div>
              <div>${item.unitPrice ? fmtIQD(item.unitPrice) : 'On request'}</div>
              <div class="small">Subtotal: ${item.unitPrice ? fmtIQD(subtotal) : '—'}</div>
            </div>
          </div>
        `;
      }).join('');
      cartDisplay.innerHTML = cartHTML + `<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,.12); text-align: right;"><strong>Total: ${fmtIQD(total)}</strong></div>`;
    }
  }

  const form = document.getElementById('checkout-form');
  const orderTypeSelect = document.getElementById('order-type');
  const targetField = document.getElementById('target-field');
  const targetInput = document.getElementById('target');
  const submitOrder = document.getElementById('submit-order');
  const paymentMethodSelect = document.getElementById('payment-method');

  // Auto-detect order type from cart (SERVICE if any item is service)
  try {
    const hasService = cart.some(it => (it && ((it.kind || '').toString().toLowerCase() === 'service' || (it.cat || '').toString().toLowerCase() === 'service')));
    if (hasService) {
      orderTypeSelect.value = 'SERVICE';
    } else {
      orderTypeSelect.value = 'ACCOUNT';
    }
    // Lock the dropdown to avoid mismatch
    orderTypeSelect.disabled = true;
  } catch (_e) { }

  // Order type logic
  orderTypeSelect.addEventListener('change', () => {
    if (orderTypeSelect.value === 'SERVICE') {
      targetField.style.display = 'block';
      targetInput.required = true;
    } else {
      targetField.style.display = 'none';
      targetInput.required = false;
    }
    validateForm();
  });
  // Apply initial state
  orderTypeSelect.dispatchEvent(new Event('change'));

  // Payment method change — no card number field at checkout anymore
  paymentMethodSelect.addEventListener('change', () => {
    validateForm();
  });

  // Form validation
  function validateForm() {
    const customerName = document.getElementById('customer-name').value.trim();
    const contactInfo = document.getElementById('contact-info').value.trim();
    const address = document.getElementById('address').value.trim();
    const orderType = orderTypeSelect.value;
    const target = targetInput.value.trim();
    const paymentMethod = paymentMethodSelect.value;

    const isValid = customerName && contactInfo && address && orderType &&
      (orderType !== 'SERVICE' || target) && paymentMethod;

    submitOrder.disabled = !isValid;
  }

  form.addEventListener('input', validateForm);
  form.addEventListener('change', validateForm);
  paymentMethodSelect.addEventListener('change', validateForm);

  // Helper: build receipt text from cart
  function buildReceiptText(cart, paymentMethod) {
    let receiptText = isArabic ? '🧾 إيصال الطلب\n\n' : '🧾 Order Receipt\n\n';
    let total = 0;
    cart.forEach((item, index) => {
      const emoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][index] || '📦';
      const subtotal = item.unitPrice * item.qty;
      total += subtotal;

      const sel = item.selections || {};
      const accRaw = (sel.accType || '').toString().trim().toLowerCase();
      const durationLabel = (sel.quantity || '').toString().trim();
      const optionLabel = (sel.option || '').toString().trim();

      const accLabelEn = accRaw === 'shared' ? 'Shared' : accRaw === 'private' ? 'Private' : '-';
      const accLabelAr = accRaw === 'shared' ? 'حساب مشترك' : accRaw === 'private' ? 'حساب خاص' : '-';
      const accLabel = isArabic ? accLabelAr : accLabelEn;

      receiptText += `${emoji} ${item.title}\n`;
      receiptText += `${isArabic ? 'نوع الحساب' : 'Account type'}: ${accLabel}\n`;
      receiptText += `${isArabic ? 'عدد الحسابات' : 'Qty'}: ${item.qty}\n`;
      if (durationLabel) {
        receiptText += `${isArabic ? 'المدة / الباقة' : 'Duration / Package'}: ${durationLabel}\n`;
      }
      if (optionLabel) {
        receiptText += `${isArabic ? 'الخيار' : 'Option'}: ${optionLabel}\n`;
      }
      receiptText += `${isArabic ? 'السعر' : 'Price'}: ${item.unitPrice} IQD\n`;
      receiptText += `${isArabic ? 'المجموع الفرعي' : 'Subtotal'}: ${subtotal} IQD\n\n`;
    });

    // Add 2000 IQD fee for Asiacell Cards or Zain Cards
    if (paymentMethod === 'Asiacell Cards' || paymentMethod === 'Zain Cards') {
      total += 2000;
      receiptText += `${isArabic ? 'رسوم التحويل' : 'Transfer Fee'}: 2,000 IQD\n\n`;
    }

    receiptText += '------------------\n';
    receiptText += `${isArabic ? 'المجموع' : 'Total'}: ${total} IQD`;

    return { receiptText, total };
  }

  submitOrder.addEventListener('click', async (e) => {
    e.preventDefault();

    const paymentMethod = paymentMethodSelect.value;
    const isCardPayment = (paymentMethod === 'Asiacell Cards' || paymentMethod === 'Zain Cards');

    // Show loading overlay
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-content">
        <span class="loader"></span>
        <p>${isCardPayment ? (isArabic ? 'جارٍ التحويل...' : 'Redirecting...') : (isArabic ? 'جارٍ إرسال الطلب...' : 'Sending Order...')}</p>
      </div>
    `;
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px);
      z-index: 9999; display: flex; align-items: center; justify-content: center;
    `;
    const loadingContent = overlay.querySelector('.loading-content');
    loadingContent.style.cssText = `
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; color: white; font-size: 18px; font-weight: 500;
    `;
    loadingContent.querySelector('.loader').style.cssText = 'margin-bottom: 20px;';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Disable the button
    submitOrder.disabled = true;

    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const { receiptText } = buildReceiptText(cart, paymentMethod);

      // Gather customer info
      const customerInfo = {
        customerName: document.getElementById('customer-name').value.trim(),
        contact: document.getElementById('contact-info').value.trim(),
        address: document.getElementById('address').value.trim(),
        orderType: orderTypeSelect.value,
        target: targetInput.value.trim(),
        paymentMethod: paymentMethod,
        receiptText: receiptText
      };

      if (isCardPayment) {
        // ========== CARD PAYMENT: Do NOT submit order yet ==========
        // Save everything to localStorage, redirect to payment page
        // The order will be submitted from the payment page after card number is entered
        const orderData = {
          ...customerInfo,
          cart: cart.map(item => ({ title: item.title, name: item.title, qty: item.qty, unitPrice: item.unitPrice, selections: item.selections })),
          timestamp: new Date().toISOString(),
          createdAt: Date.now(),
          status: 'Awaiting Card Number',
          pendingSubmission: true  // Flag: order not yet sent to backend
        };

        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        // Redirect to payment page
        window.location.href = isArabic ? 'payment-ar.html' : 'payment.html';

      } else {
        // ========== NON-CARD PAYMENT: Submit order now ==========
        const payload = {
          customerName: customerInfo.customerName,
          contact: customerInfo.contact,
          address: customerInfo.address,
          productName: receiptText,
          orderType: customerInfo.orderType,
          target: customerInfo.target,
          paymentMethod: paymentMethod
        };

        const response = await fetch(BACKEND_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ payload: JSON.stringify(payload) })
        });
        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } catch { }

        if (data && data.success && data.invoiceID) {
          const orderData = {
            invoiceID: data.invoiceID,
            token: data.token,
            cart: cart.map(item => ({ title: item.title, name: item.title, qty: item.qty, unitPrice: item.unitPrice, selections: item.selections })),
            customerName: customerInfo.customerName,
            contact: customerInfo.contact,
            address: customerInfo.address,
            orderType: customerInfo.orderType,
            target: customerInfo.target,
            paymentMethod: paymentMethod,
            timestamp: new Date().toISOString(),
            createdAt: Date.now(),
            status: 'Checking Payment'
          };

          const orders = JSON.parse(localStorage.getItem('orders') || '[]');
          orders.push(orderData);
          localStorage.setItem('orders', JSON.stringify(orders));
          localStorage.setItem('currentOrder', JSON.stringify(orderData));

          window.location.href = isArabic ? 'payment-ar.html' : 'payment.html';
        } else {
          alert(isArabic ? 'تم إرسال الطلب. يرجى الانتظار والتحقق من Telegram.' : 'Order submitted. Please wait and check Telegram.');
        }
      }
    } catch (error) {
      alert(isArabic ? 'خطأ في إرسال الطلب.' : 'Error submitting order.');
    } finally {
      const overlay = document.getElementById('loading-overlay');
      if (overlay) overlay.remove();
      document.body.style.overflow = '';
      submitOrder.disabled = false;
    }
  });
});
