/**
 * Custom Payment Method Selector with Logos
 * Replaces native <select> with a styled dropdown showing payment logos.
 * Also handles payment page theming based on the selected method.
 */
(function () {
    const PAYMENT_METHODS = {
        'Zain Cash': {
            logo: 'assets/zaincash.png',
            color: '#7b2d8e',
            colorRgb: '123,45,142',
            gradient: 'linear-gradient(135deg, #5b2173, #9b4dca)',
        },
        'SuperQI': {
            logo: 'assets/superQI.png',
            color: '#efc800',
            colorRgb: '239,200,0',
            gradient: 'linear-gradient(135deg, #d4a800, #f5d800)',
        },
        'Mastercard': {
            logo: 'assets/mastercard.jpg',
            color: '#eb001b',
            colorRgb: '235,0,27',
            gradient: 'linear-gradient(135deg, #eb001b, #f79e1b)',
        },
        'Binance': {
            logo: 'assets/binance.jpg',
            color: '#f3ba2f',
            colorRgb: '243,186,47',
            gradient: 'linear-gradient(135deg, #c99400, #f3ba2f)',
        },
        'Asiacell Cards': {
            logo: 'assets/asiacell logo .png',
            color: '#e5232a',
            colorRgb: '229,35,42',
            gradient: 'linear-gradient(135deg, #b31217, #e5232a)',
        },
        'Zain Cards': {
            logo: 'assets/zain cards.jpg',
            color: '#6cc04a',
            colorRgb: '108,192,74',
            gradient: 'linear-gradient(135deg, #00b4d8, #8bc34a)',
        },
    };

    // Arabic labels for each method
    const AR_LABELS = {
        'Zain Cash': 'زين كاش',
        'SuperQI': 'سوبر كي',
        'Mastercard': 'ماستر',
        'Binance': 'باينانس',
        'Asiacell Cards': 'بطاقات آسياسيل',
        'Zain Cards': 'بطاقات زين',
    };

    document.addEventListener('DOMContentLoaded', () => {
        const isArabic = document.documentElement.lang === 'ar';
        const nativeSelect = document.getElementById('payment-method');
        if (!nativeSelect) return;

        // Hide native select
        nativeSelect.style.display = 'none';

        // Build custom dropdown
        const wrapper = document.createElement('div');
        wrapper.className = 'pm-selector';
        wrapper.id = 'pm-selector';

        // Selected display
        const selected = document.createElement('div');
        selected.className = 'pm-selected';
        selected.innerHTML = `<span class="pm-selected-text">${isArabic ? 'اختر طريقة الدفع' : 'Select Payment Method'}</span><span class="pm-arrow">▾</span>`;
        wrapper.appendChild(selected);

        // Dropdown list
        const dropdown = document.createElement('div');
        dropdown.className = 'pm-dropdown';

        // Build options from the native select
        const options = nativeSelect.querySelectorAll('option');
        options.forEach(opt => {
            if (!opt.value) return; // skip placeholder
            const method = PAYMENT_METHODS[opt.value];
            if (!method) return;

            const item = document.createElement('div');
            item.className = 'pm-option';
            item.dataset.value = opt.value;

            const label = isArabic ? (AR_LABELS[opt.value] || opt.textContent) : opt.textContent;

            item.innerHTML = `
        <img class="pm-logo" src="${method.logo}" alt="${opt.value}" style="width:16px;height:16px;border-radius:3px;object-fit:cover;flex-shrink:0;" />
        <span class="pm-label">${label}</span>
      `;

            item.addEventListener('click', () => {
                // Update native select
                nativeSelect.value = opt.value;
                nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));

                // Update display
                selected.innerHTML = `
          <span class="pm-selected-inner">
            <img class="pm-logo-sm" src="${method.logo}" alt="${opt.value}" style="width:14px;height:14px;border-radius:3px;object-fit:cover;" />
            <span>${label}</span>
          </span>
          <span class="pm-arrow">▾</span>
        `;
                selected.style.borderColor = method.color;

                // Close dropdown
                dropdown.classList.remove('open');
                wrapper.classList.remove('open');

                // Highlight selected
                dropdown.querySelectorAll('.pm-option').forEach(o => o.classList.remove('active'));
                item.classList.add('active');
            });

            dropdown.appendChild(item);
        });

        wrapper.appendChild(dropdown);

        // Toggle dropdown
        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.contains('open');
            dropdown.classList.toggle('open');
            wrapper.classList.toggle('open');
        });

        // Close on outside click
        document.addEventListener('click', () => {
            dropdown.classList.remove('open');
            wrapper.classList.remove('open');
        });
        wrapper.addEventListener('click', (e) => e.stopPropagation());

        // Insert after the hidden select
        nativeSelect.parentNode.insertBefore(wrapper, nativeSelect.nextSibling);

        // Force overflow visible on all parent elements so the dropdown isn't clipped
        let parent = wrapper.parentElement;
        while (parent && parent !== document.body) {
            parent.style.overflow = 'visible';
            parent = parent.parentElement;
        }

        // ========== PAYMENT PAGE THEMING ==========
        applyPaymentPageTheme();
    });

    function applyPaymentPageTheme() {
        // Only applies on payment.html / payment-ar.html
        const currentOrder = JSON.parse(localStorage.getItem('currentOrder') || 'null');
        if (!currentOrder || !currentOrder.paymentMethod) return;

        const method = PAYMENT_METHODS[currentOrder.paymentMethod];
        if (!method) return;

        // Check if we're on the payment page
        const paymentMethodTitle = document.getElementById('payment-method-title');
        if (!paymentMethodTitle) return;

        const root = document.documentElement;

        // Apply themed accent color
        root.style.setProperty('--pm-accent', method.color);
        root.style.setProperty('--pm-accent-rgb', method.colorRgb);
        root.style.setProperty('--pm-gradient', method.gradient);

        // Add logo hero at top of payment details
        const paymentDetails = document.getElementById('payment-details');
        if (paymentDetails) {
            const logoHero = document.createElement('div');
            logoHero.className = 'pm-hero';
            logoHero.innerHTML = `<img src="${method.logo}" alt="${currentOrder.paymentMethod}" class="pm-hero-logo" />`;
            logoHero.style.setProperty('--pm-glow', method.color);
            paymentDetails.parentNode.insertBefore(logoHero, paymentDetails);
        }

        // Theme the cards with accent border glow
        document.querySelectorAll('.card').forEach(card => {
            card.style.borderColor = `rgba(${method.colorRgb}, 0.25)`;
            card.style.boxShadow = `0 0 20px rgba(${method.colorRgb}, 0.08)`;
        });

        // Theme the finish button
        const finishBtn = document.getElementById('finish-payment');
        if (finishBtn) {
            finishBtn.style.background = method.gradient;
            finishBtn.style.borderColor = method.color;
        }

        // Theme kicker text
        const kicker = document.querySelector('.kicker');
        if (kicker) {
            kicker.style.color = method.color;
        }

        // Theme the total amount
        const totalEl = document.getElementById('total-amount');
        if (totalEl) {
            totalEl.style.color = method.color;
        }

        // Add subtle background radial glow
        const glow = document.createElement('div');
        glow.className = 'pm-bg-glow';
        glow.style.background = `radial-gradient(ellipse at 50% 0%, rgba(${method.colorRgb}, 0.12) 0%, transparent 70%)`;
        document.body.appendChild(glow);
    }
})();
