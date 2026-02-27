const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbxT6fG1xBmhDWonLDSiXXZGwpXd00CIP0zHRs9t407983FHZ5ljPMkpjGQk_fObspgonA/exec';

// Helper function for formatting IQD
const fmtIQD = (n) => new Intl.NumberFormat('en-US').format(n) + ' IQD';

document.addEventListener('DOMContentLoaded', () => {
  const isArabic = document.documentElement.lang === 'ar';

  // Get current order from localStorage
  const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
  if (!currentOrder) {
    window.location.href = isArabic ? 'index-ar.html' : 'index.html';
    return;
  }

  const isCardPayment = (currentOrder.paymentMethod === 'Asiacell Cards' || currentOrder.paymentMethod === 'Zain Cards');
  const isPendingSubmission = currentOrder.pendingSubmission === true;

  // Calculate total
  let total = 0;
  if (currentOrder.cart && currentOrder.cart.length > 0) {
    total = currentOrder.cart.reduce((sum, item) => sum + ((item.unitPrice || 0) * (item.qty || 1)), 0);
  }

  // Add 2000 IQD fee for card payments
  if (isCardPayment) {
    total += 2000;
  }

  // Display total amount
  const totalEl = document.getElementById('total-amount');
  if (totalEl) {
    if (currentOrder.paymentMethod === 'Binance') {
      const usd = (total / 1320).toFixed(2);
      totalEl.textContent = fmtIQD(total) + '  (~$' + usd + ' USD)';
    } else {
      totalEl.textContent = fmtIQD(total);
    }
  }

  // Display payment method title
  const methodTitle = document.getElementById('payment-method-title');
  if (methodTitle) {
    const methodLabel = isArabic
      ? (currentOrder.paymentMethod === 'Zain Cash' ? 'زين كاش'
        : currentOrder.paymentMethod === 'Binance' ? 'Binance'
          : currentOrder.paymentMethod === 'Asiacell Cards' ? 'بطاقات آسياسيل'
            : currentOrder.paymentMethod === 'Zain Cards' ? 'بطاقات زين'
              : currentOrder.paymentMethod)
      : currentOrder.paymentMethod;
    methodTitle.textContent = `${isArabic ? 'طريقة الدفع' : 'Payment Method'}: ${methodLabel}`;
  }

  // Display payment details
  const paymentDetails = document.getElementById('payment-details');
  const paymentCardField = document.getElementById('payment-card-field');

  if (paymentDetails) {
    if (currentOrder.paymentMethod === 'Zain Cash') {
      paymentDetails.innerHTML = `
        <div style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 12px; padding: 16px; margin: 16px 0;">
          <h4 style="color: #22c55e; margin: 0 0 8px 0;">${isArabic ? 'الدفع عبر زين كاش' : 'Zain Cash Payment'}</h4>
          <p style="margin: 0; font-size: 18px; font-weight: bold;">${isArabic ? 'رقم الهاتف' : 'Phone Number'}: <span id="zain-number">07814175536</span></p>
          <button class="btn accent" id="copy-zain-number" style="margin-top: 12px;">${isArabic ? 'نسخ رقم الهاتف' : 'Copy Phone Number'}</button>
        </div>
      `;
      document.getElementById('copy-zain-number').addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText('07814175536');
          alert(isArabic ? 'تم نسخ رقم الهاتف!' : 'Phone number copied!');
        } catch (err) {
          alert(isArabic ? 'فشل في نسخ الرقم.' : 'Failed to copy phone number.');
        }
      });

    } else if (currentOrder.paymentMethod === 'Binance') {
      paymentDetails.innerHTML = `
        <div style="background: rgba(243,186,47,0.1); border: 1px solid rgba(243,186,47,0.3); border-radius: 12px; padding: 16px; margin: 16px 0;">
          <h4 style="color: #f3ba2f; margin: 0 0 8px 0;">
            <svg style="width:20px;height:20px;vertical-align:middle;margin-right:6px;" viewBox="0 0 126.61 126.61"><path fill="#f3ba2f" d="M38.73 53.2l24.59-24.58 24.6 24.6 14.3-14.31L63.32 0l-38.9 38.9zM0 63.31l14.3-14.31 14.31 14.31-14.31 14.3zm38.73 10.11l24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.91-38.88-.01-.02zM97.99 63.31l14.3-14.31 14.32 14.31-14.31 14.3z"/><path fill="#f3ba2f" d="M77.83 63.3L63.32 48.78 52.59 59.51l-1.24 1.23-2.54 2.54 14.51 14.52 14.52-14.51-.01-.01z"/></svg>
            ${isArabic ? 'الدفع عبر Binance' : 'Binance Payment'}
          </h4>
          <p style="margin: 0; font-size: 16px; word-break: break-all;">${isArabic ? 'معرف Binance' : 'Binance ID'}: <span id="binance-id" style="font-weight:bold; color: #f3ba2f;">926347203</span></p>
          <button class="btn accent" id="copy-binance-id" style="margin-top: 12px;">${isArabic ? 'نسخ معرف Binance' : 'Copy Binance ID'}</button>
        </div>
      `;
      document.getElementById('copy-binance-id').addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText('926347203');
          alert(isArabic ? 'تم نسخ معرف Binance!' : 'Binance ID copied!');
        } catch (err) {
          alert(isArabic ? 'فشل في نسخ المعرف.' : 'Failed to copy Binance ID.');
        }
      });

    } else if (currentOrder.paymentMethod === 'Asiacell Cards') {
      paymentDetails.innerHTML = `
        <div style="background: rgba(255,193,7,0.1); border: 1px solid rgba(255,193,7,0.3); border-radius: 12px; padding: 16px; margin: 16px 0;">
          <h4 style="color: #ffc107; margin: 0 0 8px 0;">${isArabic ? 'الدفع ببطاقة آسياسيل' : 'Asiacell Card Payment'}</h4>
          <p style="margin: 0 0 8px 0;">${isArabic ? 'اشترِ بطاقة آسياسيل (رصيد) بالمبلغ الدقيق الموضح أعلاه (بما في ذلك رسوم التحويل 2,000 د.ع).' : 'Purchase an Asiacell prepaid card for the exact amount shown above (including 2,000 IQD transfer fee).'}</p>
          <p style="margin: 0; font-weight: bold; color: #ffc107;">📸 ${isArabic ? 'أرسل صورة أو سكرين شوت للبطاقة عبر Telegram' : 'Send a screenshot or photo of the card via Telegram'}</p>
        </div>
      `;
      if (paymentCardField) paymentCardField.style.display = 'block';

    } else if (currentOrder.paymentMethod === 'Zain Cards') {
      paymentDetails.innerHTML = `
        <div style="background: rgba(255,193,7,0.1); border: 1px solid rgba(255,193,7,0.3); border-radius: 12px; padding: 16px; margin: 16px 0;">
          <h4 style="color: #ffc107; margin: 0 0 8px 0;">${isArabic ? 'الدفع ببطاقة زين' : 'Zain Card Payment'}</h4>
          <p style="margin: 0 0 8px 0;">${isArabic ? 'اشترِ بطاقة زين (رصيد) بالمبلغ الدقيق الموضح أعلاه (بما في ذلك رسوم التحويل 2,000 د.ع).' : 'Purchase a Zain prepaid card for the exact amount shown above (including 2,000 IQD transfer fee).'}</p>
          <p style="margin: 0; font-weight: bold; color: #ffc107;">📸 ${isArabic ? 'أرسل صورة أو سكرين شوت للبطاقة عبر Telegram' : 'Send a screenshot or photo of the card via Telegram'}</p>
        </div>
      `;
      if (paymentCardField) paymentCardField.style.display = 'block';
    }
  }

  // Customize instructions for card payments
  if (isCardPayment) {
    const instructionsCard = document.querySelector('.card:nth-child(3) ol, section .card:last-of-type ol');
    // Find the ol in the instructions card more reliably
    const allOls = document.querySelectorAll('ol');
    if (allOls.length > 0) {
      const ol = allOls[0];
      ol.innerHTML = isArabic
        ? `<li>اشترِ بطاقة <strong>بالمبلغ الدقيق</strong> الموضح أعلاه</li>
           <li>أدخل رقم البطاقة أدناه</li>
           <li>افتح دعم Telegram</li>
           <li>أرسل رقم الفاتورة <strong>أولاً</strong></li>
           <li>ثم أرسل <strong>صورة أو سكرين شوت</strong> للبطاقة</li>`
        : `<li>Purchase a prepaid card for the <strong>EXACT amount</strong> shown above</li>
           <li>Enter the card number below</li>
           <li>Open Telegram support</li>
           <li>Send Invoice ID <strong>FIRST</strong></li>
           <li>Then send a <strong>screenshot or photo</strong> of the card</li>`;
    }
  }

  // For non-card payments, show invoice ID and instructions
  // For card payments (pending), hide the invoice section until order is submitted
  const invoiceIdEl = document.getElementById('invoice-id-display');
  if (invoiceIdEl && currentOrder.invoiceID) {
    invoiceIdEl.textContent = currentOrder.invoiceID;
  } else if (invoiceIdEl && isPendingSubmission) {
    invoiceIdEl.textContent = isArabic ? 'سيتم إنشاؤه بعد الإرسال' : 'Generated after submission';
  }

  // Copy Invoice ID button
  const copyInvoiceBtn = document.getElementById('copy-invoice-id');
  if (copyInvoiceBtn) {
    copyInvoiceBtn.addEventListener('click', async () => {
      if (!currentOrder.invoiceID) {
        alert(isArabic ? 'لا يوجد رقم فاتورة بعد. أرسل الطلب أولاً.' : 'No invoice ID yet. Submit the order first.');
        return;
      }
      try {
        await navigator.clipboard.writeText(currentOrder.invoiceID);
        alert(isArabic ? 'تم نسخ رقم الفاتورة!' : 'Invoice ID copied!');
      } catch (err) {
        alert(isArabic ? 'فشل في نسخ رقم الفاتورة.' : 'Failed to copy Invoice ID.');
      }
    });
  }

  // Finish button
  document.getElementById('finish-payment').addEventListener('click', async () => {
    const paymentCardInput = document.getElementById('payment-card-number');
    const paymentCardNumber = paymentCardInput ? paymentCardInput.value.trim() : '';

    // If card payment, validate card number
    if (isCardPayment && !paymentCardNumber) {
      alert(isArabic ? '\u0627\u0644\u0631\u062c\u0627\u0621 \u0625\u062f\u062e\u0627\u0644 \u0631\u0642\u0645 \u0627\u0644\u0628\u0637\u0627\u0642\u0629.' : 'Please enter the payment card number.');
      return;
    }

    // === CARD PAYMENT: Submit the FULL order now (with card number) ===
    if (isCardPayment && isPendingSubmission) {
      const finishBtn = document.getElementById('finish-payment');
      finishBtn.disabled = true;
      finishBtn.textContent = isArabic ? '\u062c\u0627\u0631\u064d \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628...' : 'Submitting Order...';

      // Show loading overlay (same as checkout)
      const overlay = document.createElement('div');
      overlay.id = 'loading-overlay';
      overlay.innerHTML = '<div class="loading-content"><span class="loader"></span><p>' + (isArabic ? '\u062c\u0627\u0631\u064d \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628...' : 'Submitting Order...') + '</p></div>';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);backdrop-filter:blur(5px);z-index:9999;display:flex;align-items:center;justify-content:center;';
      const lc = overlay.querySelector('.loading-content');
      lc.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:white;font-size:18px;font-weight:500;';
      lc.querySelector('.loader').style.cssText = 'margin-bottom:20px;';
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      try {
        // Build the full order payload including card number
        const payload = {
          customerName: currentOrder.customerName,
          contact: currentOrder.contact,
          address: currentOrder.address,
          productName: currentOrder.receiptText,
          orderType: currentOrder.orderType,
          target: currentOrder.target,
          paymentMethod: currentOrder.paymentMethod,
          paymentCardNumber: paymentCardNumber
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
          // Order submitted successfully! Update localStorage
          const orderData = {
            invoiceID: data.invoiceID,
            token: data.token,
            cart: currentOrder.cart,
            customerName: currentOrder.customerName,
            contact: currentOrder.contact,
            address: currentOrder.address,
            orderType: currentOrder.orderType,
            target: currentOrder.target,
            paymentMethod: currentOrder.paymentMethod,
            paymentCardNumber: paymentCardNumber,
            timestamp: currentOrder.timestamp,
            createdAt: currentOrder.createdAt,
            status: 'Checking Payment'
          };

          const orders = JSON.parse(localStorage.getItem('orders') || '[]');
          orders.push(orderData);
          localStorage.setItem('orders', JSON.stringify(orders));
          localStorage.setItem('currentOrder', JSON.stringify(orderData));

          // Show success then redirect
          alert(isArabic ? '\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628 \u0628\u0646\u062c\u0627\u062d!' : 'Order submitted successfully!');
          window.location.href = isArabic ? 'status-ar.html' : 'status.html';
        } else {
          alert(isArabic ? '\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628. \u064a\u0631\u062c\u0649 \u0627\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 Telegram.' : 'Order submitted. Please check Telegram.');
          window.location.href = isArabic ? 'status-ar.html' : 'status.html';
        }
      } catch (error) {
        console.error('Error submitting card payment order:', error);
        alert(isArabic ? '\u062e\u0637\u0623 \u0641\u064a \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.' : 'Error submitting order. Please try again.');
        finishBtn.disabled = false;
        finishBtn.textContent = isArabic ? '\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628' : 'Submit Order';
      } finally {
        const ov = document.getElementById('loading-overlay');
        if (ov) ov.remove();
        document.body.style.overflow = '';
      }
      return;
    }

    // === NON-CARD PAYMENT: Just redirect to status ===
    window.location.href = isArabic ? 'status-ar.html' : 'status.html';
  });

  // Update Finish button text for card payments
  if (isCardPayment && isPendingSubmission) {
    const finishBtn = document.getElementById('finish-payment');
    if (finishBtn) {
      finishBtn.textContent = isArabic ? '\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628' : 'Submit Order';
    }
  }
});

