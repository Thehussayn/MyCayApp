/* ==========================================
   MyCayApp by Jeje-Ola — Core Application Engine
   Router, State Management, Currency & Utilities
   ========================================== */

class MyCayApp {
  constructor() {
    this.state = {
      currentRole: 'investor', // 'public', 'investor', 'staff', 'finance', 'admin'
      currentView: 'public-landing',
      currency: 'NGN', // 'NGN' or 'USD'
      exchangeRate: 1550, // 1 USD = 1,550 NGN
      user: {
        id: 'INV-2026-8801',
        name: 'Chief Babatunde Ola',
        email: 'babatunde.ola@example.com',
        phone: '+234 803 123 4567',
        status: 'approved',
        biodataStep: 7,
        biodataCompleted: true,
        kycStatus: 'verified'
      },
      investments: [
        {
          id: 'INV-GIAP-001',
          planName: 'GIAP — Lekki Luxury Residences',
          type: 'GIAP',
          capitalNGN: 25000000,
          profitShare: '70/30 Profit Split',
          startDate: '2026-01-15',
          status: 'Active',
          earningsNGN: 4375000,
          nextPayoutDate: '2026-10-15',
          nextPayoutNGN: 1458333
        },
        {
          id: 'INV-WS-002',
          planName: 'WealthStream High-Yield Income',
          type: 'WealthStream',
          capitalNGN: 10000000,
          frequency: 'Monthly (1st)',
          roiRate: '24% p.a.',
          startDate: '2026-03-01',
          status: 'Active',
          earningsNGN: 1200000,
          nextPayoutDate: '2026-10-01',
          nextPayoutNGN: 200000
        }
      ],
      payouts: [
        { id: 'PAY-8801', date: '2026-09-01', plan: 'WealthStream Fixed Income', amountNGN: 200000, ref: 'TXN-99812481', status: 'Completed' },
        { id: 'PAY-8799', date: '2026-08-01', plan: 'WealthStream Fixed Income', amountNGN: 200000, ref: 'TXN-99711204', status: 'Completed' },
        { id: 'PAY-8750', date: '2026-07-15', plan: 'GIAP Property Resale Distribution', amountNGN: 1458333, ref: 'TXN-99540019', status: 'Completed' }
      ],
      withdrawals: [
        { id: 'WTH-102', plan: 'WealthStream', amountNGN: 2000000, dateSubmitted: '2026-09-10', noticePeriodDays: 30, countdownRemaining: '20 days remaining', status: '30-Day Notice Active' }
      ]
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Role switcher change
    const roleSelect = document.getElementById('role-switcher');
    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        this.switchRole(e.target.value);
      });
    }

    // Currency toggle
    const ngnBtn = document.getElementById('curr-ngn');
    const usdBtn = document.getElementById('curr-usd');
    if (ngnBtn && usdBtn) {
      ngnBtn.addEventListener('click', () => this.setCurrency('NGN'));
      usdBtn.addEventListener('click', () => this.setCurrency('USD'));
    }

    // Desktop Navigation click
    document.querySelectorAll('.desktop-nav-link').forEach(item => {
      item.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        if (view) this.switchView(view);
      });
    });
  }

  switchRole(role) {
    this.state.currentRole = role;
    this.showToast(`Switched portal mode to ${role.toUpperCase()}`);
    
    if (role === 'public') this.switchView('public-landing');
    else if (role === 'investor') this.switchView('investor-overview');
    else if (role === 'staff') this.switchView('staff-kanban');
    else if (role === 'finance') this.switchView('finance-ledger');
    else if (role === 'admin') this.switchView('admin-panel');
  }

  setCurrency(curr) {
    this.state.currency = curr;
    
    const ngnBtn = document.getElementById('curr-ngn');
    const usdBtn = document.getElementById('curr-usd');

    if (ngnBtn && usdBtn) {
      if (curr === 'NGN') {
        ngnBtn.className = 'px-2.5 py-1 rounded-full text-slate-900 bg-white font-bold cursor-pointer transition-all';
        usdBtn.className = 'px-2.5 py-1 rounded-full text-zinc-400 hover:text-white cursor-pointer transition-all';
      } else {
        usdBtn.className = 'px-2.5 py-1 rounded-full text-slate-900 bg-white font-bold cursor-pointer transition-all';
        ngnBtn.className = 'px-2.5 py-1 rounded-full text-zinc-400 hover:text-white cursor-pointer transition-all';
      }
    }

    this.showToast(`Currency updated to ${curr}`);
    this.render();
  }

  formatMoney(amountNGN) {
    if (this.state.currency === 'USD') {
      const usdVal = amountNGN / this.state.exchangeRate;
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(usdVal);
    }
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amountNGN);
  }

  switchView(viewId) {
    this.state.currentView = viewId;
    
    // Hide all view containers
    document.querySelectorAll('.view-container').forEach(view => {
      view.classList.add('hidden');
    });

    // Show target view
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.remove('hidden');
    }

    // Update desktop nav active state
    document.querySelectorAll('.desktop-nav-link').forEach(nav => {
      nav.classList.toggle('active', nav.getAttribute('data-view') === viewId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-[#C59B27]"></i><span>${message}</span>`;
    
    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      toast.style.transition = 'all 250ms ease';
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  openNewInvestmentModal(planType = 'GIAP') {
    const modal = document.getElementById('new-investment-modal');
    const select = document.getElementById('select-new-plan-type');
    if (select) select.value = planType;
    if (modal) modal.classList.remove('hidden');
    this.toggleNewPlanOptions();
  }

  toggleNewPlanOptions() {
    const planType = document.getElementById('select-new-plan-type')?.value;
    const giapGroup = document.getElementById('group-giap-options');
    if (giapGroup) {
      giapGroup.style.display = planType === 'GIAP' ? 'block' : 'none';
    }
    this.updateInvestmentCalculations();
  }

  updateInvestmentCalculations() {
    const amount = parseInt(document.getElementById('select-new-capital-amount')?.value || '10000000');
    const planType = document.getElementById('select-new-plan-type')?.value;

    const roiLabel = document.getElementById('label-calc-roi');
    const scheduleLabel = document.getElementById('label-calc-schedule');

    if (planType === 'WealthStream') {
      const annualRoi = amount * 0.24;
      const monthlyRoi = annualRoi / 12;
      if (roiLabel) roiLabel.textContent = `${this.formatMoney(annualRoi)} / year (24%) • ${this.formatMoney(monthlyRoi)} / month`;
      if (scheduleLabel) scheduleLabel.textContent = 'Monthly on 1st of Month';
    } else {
      const estReturn = amount * 0.35;
      if (roiLabel) roiLabel.textContent = `Est. Capital Growth ${this.formatMoney(estReturn)} (70/30 Split)`;
      if (scheduleLabel) scheduleLabel.textContent = 'Upon Property Development Resale';
    }
  }

  submitNewInvestment() {
    const planType = document.getElementById('select-new-plan-type')?.value;
    const amount = parseInt(document.getElementById('select-new-capital-amount')?.value || '10000000');
    const asset = document.getElementById('select-giap-asset')?.value || 'Prime Property Asset';

    const newInv = {
      id: `INV-${planType}-${Math.floor(100 + Math.random() * 900)}`,
      planName: planType === 'GIAP' ? `GIAP — ${asset}` : 'WealthStream High-Yield Income',
      type: planType,
      capitalNGN: amount,
      profitShare: planType === 'GIAP' ? '70/30 Profit Split' : 'Monthly Cash Flow',
      roiRate: planType === 'WealthStream' ? '24% p.a.' : '35% Est. Growth',
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      earningsNGN: 0,
      nextPayoutDate: '2026-10-01',
      nextPayoutNGN: planType === 'WealthStream' ? amount * 0.02 : 0
    };

    this.state.investments.unshift(newInv);
    document.getElementById('new-investment-modal')?.classList.add('hidden');
    this.showToast(`Subscribed to ${newInv.planName} (${this.formatMoney(amount)})`);
    this.render();
  }

  openStatementModal() {
    const modal = document.getElementById('statement-modal');
    if (modal) modal.classList.remove('hidden');
  }

  filterOpportunities() {
    this.showToast('Filtering investment opportunities...');
  }

  render() {
    if (window.lucide) lucide.createIcons();
    if (window.investorDashboard) window.investorDashboard.render();
    if (window.onboardingWizard) window.onboardingWizard.render();
    if (window.staffDashboard) window.staffDashboard.render();
    if (window.financeDashboard) window.financeDashboard.render();
  }
}

// Global App Instance
window.app = new MyCayApp();
