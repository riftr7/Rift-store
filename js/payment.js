// Helper function for formatting IQD
const fmtIQD = (n) => new Intl.NumberFormat('en-US').format(n) + ' IQD';

document.addEventListener('DOMContentLoaded', () => {
  // Get current order from localStorage
  const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
  if (!currentOrder) {
    // No current order, redirect to home
    window.location.href = 'index.html';
    return;
  }

  // Get orders from localStorage to find the current order
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = orders.find(o => o.invoiceID === currentOrder.invoiceID && o.token === currentOrder.token);
  if (!order) {
    window.location.href = 'index.html';
    return;
  }

  // Calculate total
  const total = order.cart.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);

  // Display total amount
  const totalEl = document.getElementById('total-amount');
  if (totalEl) {
    totalEl.textContent = fmtIQD(total);
  }

  // Display payment method title
  const methodTitle = document.getElementById('payment-method-title');
  if (methodTitle) {
    methodTitle.textContent = `Payment Method: ${currentOrder.paymentMethod}`;
  }

  // Display payment details
  const paymentDetails = document.getElementById('payment-details');
  if (paymentDetails) {
    if (currentOrder.paymentMethod === 'Zain Cash') {
      paymentDetails.innerHTML = `
        <div style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 12px; padding: 16px; margin: 16px 0;">
          <h4 style="color: #22c55e; margin: 0 0 8px 0;">Zain Cash Payment</h4>
          <p style="margin: 0; font-size: 18px; font-weight: bold;">Phone Number: <span id="zain-number">07814175536</span></p>
          <button class="btn accent" id="copy-zain-number" style="margin-top: 12px;">Copy Phone Number</button>
        </div>
      `;

      // Copy Zain Cash number
      document.getElementById('copy-zain-number').addEventListener('click', async () => {
        const number = document.getElementById('zain-number').textContent;
        try {
          await navigator.clipboard.writeText(number);
          alert('Phone number copied!');
        } catch (err) {
          alert('Failed to copy phone number.');
        }
      });
    } else if (currentOrder.paymentMethod === 'USDT') {
      paymentDetails.innerHTML = `
        <div style="background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); border-radius: 12px; padding: 16px; margin: 16px 0;">
          <h4 style="color: #3b82f6; margin: 0 0 8px 0;">USDT Payment</h4>
          <p style="margin: 0; font-size: 16px; word-break: break-all;">Wallet Address: <span id="usdt-address">TPJ3KonAkmM1YX7mnSo186SJy1EULPcj6Y</span></p>
          <button class="btn accent" id="copy-usdt-address" style="margin-top: 12px;">Copy Wallet Address</button>
        </div>
      `;

      // Copy USDT address
      document.getElementById('copy-usdt-address').addEventListener('click', async () => {
        const address = document.getElementById('usdt-address').textContent;
        try {
          await navigator.clipboard.writeText(address);
          alert('Wallet address copied!');
        } catch (err) {
          alert('Failed to copy wallet address.');
        }
      });
    }
  }

  // Display Invoice ID
  const invoiceIdEl = document.getElementById('invoice-id-display');
  if (invoiceIdEl) {
    invoiceIdEl.textContent = currentOrder.invoiceID;
  }

  // Copy Invoice ID button
  document.getElementById('copy-invoice-id').addEventListener('click', async () => {
    const invoiceId = currentOrder.invoiceID;
    try {
      await navigator.clipboard.writeText(invoiceId);
      alert('Invoice ID copied!');
    } catch (err) {
      alert('Failed to copy Invoice ID.');
    }
  });

  // Finish button
  document.getElementById('finish-payment').addEventListener('click', () => {
    // Redirect to status page
    window.location.href = 'status.html';
  });
});

