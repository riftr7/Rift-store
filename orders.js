document.addEventListener('DOMContentLoaded', () => {
  const ordersList = document.getElementById('orders-list');
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const isArabic = document.documentElement.lang === 'ar';

  if (orders.length === 0) {
    ordersList.innerHTML = `<p>${isArabic ? 'لم يتم العثور على طلبات.' : 'No orders found.'}</p>`;
    return;
  }

  // Sort orders by createdAt descending
  orders.sort((a, b) => b.createdAt - a.createdAt);

  const ordersHTML = orders.map(order => {
    const date = new Date(order.createdAt).toLocaleDateString(isArabic ? 'ar' : 'en-US');
    const total = order.cart.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
    return `
      <div class="card" style="margin-bottom: 16px; cursor: pointer;" onclick="selectOrder('${order.invoiceID}', '${order.token}')">
        <div class="body">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>${isArabic ? 'الفاتورة:' : 'Invoice:'} ${order.invoiceID}</strong>
              <div class="small">${isArabic ? 'التاريخ:' : 'Date:'} ${date}</div>
              <div class="small">${isArabic ? 'الدفع:' : 'Payment:'} ${order.paymentMethod}</div>
            </div>
            <div style="text-align: right;">
              <div>${isArabic ? 'الإجمالي:' : 'Total:'} ${new Intl.NumberFormat(isArabic ? 'ar' : 'en-US').format(total)} IQD</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  ordersList.innerHTML = ordersHTML;
});

function selectOrder(invoiceID, token) {
  localStorage.setItem('currentOrder', JSON.stringify({ invoiceID, token }));
  const isArabic = document.documentElement.lang === 'ar';
  window.location.href = isArabic ? 'status-ar.html' : 'status.html';
}
