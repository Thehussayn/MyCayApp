/* ==========================================
   MyCayApp by Jeje-Ola — Investor Dashboard
   Portfolio Analytics, Holdings, Payouts & Document Vault
   ========================================== */

class InvestorDashboard {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    document.querySelectorAll('.investor-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    document.getElementById('btn-open-withdrawal-modal')?.addEventListener('click', () => {
      this.submitWithdrawal();
    });
  }

  switchTab(tabId) {
    document.querySelectorAll('.investor-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.investor-tab-content').forEach(c => c.classList.add('hidden'));

    document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');
    document.getElementById(`tab-content-${tabId}`)?.classList.remove('hidden');
  }

  submitWithdrawal() {
    const amountNGN = 2000000;
    const newWithdrawal = {
      id: `WTH-${Math.floor(100 + Math.random() * 900)}`,
      plan: 'WealthStream Fixed Income',
      amountNGN: amountNGN,
      dateSubmitted: new Date().toISOString().split('T')[0],
      noticePeriodDays: 30,
      countdownRemaining: '30 days remaining',
      status: '30-Day Notice Active'
    };

    window.app.state.withdrawals.unshift(newWithdrawal);
    window.app.showToast('Withdrawal request submitted! 30-day notice period active.');
    window.app.render();
  }

  render() {
    const app = window.app;
    if (!app) return;

    const totalCapital = app.state.investments.reduce((sum, inv) => sum + inv.capitalNGN, 0);
    const totalEarnings = app.state.investments.reduce((sum, inv) => sum + inv.earningsNGN, 0);
    const activePlansCount = app.state.investments.length;

    const elemCapital = document.getElementById('metric-total-capital');
    const elemEarnings = document.getElementById('metric-total-earnings');
    const elemPlansCount = document.getElementById('metric-active-plans-count');
    const elemNextPayout = document.getElementById('metric-next-payout');

    if (elemCapital) elemCapital.textContent = app.formatMoney(totalCapital);
    if (elemEarnings) elemEarnings.textContent = app.formatMoney(totalEarnings);
    if (elemPlansCount) elemPlansCount.textContent = `${activePlansCount}`;
    if (elemNextPayout) elemNextPayout.textContent = `${app.formatMoney(200000)} (Oct 1, 2026)`;

    // Render Holdings Grid
    const containerInvestments = document.getElementById('container-my-investments');
    if (containerInvestments) {
      containerInvestments.innerHTML = app.state.investments.map(inv => `
        <div class="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="badge-mycay ${inv.type === 'GIAP' ? 'badge-gold' : 'badge-approved'}">${inv.type}</span>
              <h4 class="font-heading font-extrabold text-base text-slate-900">${inv.planName}</h4>
            </div>
            <span class="badge-mycay badge-approved">● ${inv.status}</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-150">
            <div>
              <span class="text-[10px] font-mono uppercase text-slate-400 block">Capital Invested</span>
              <span class="font-mono font-bold text-sm text-slate-900">${app.formatMoney(inv.capitalNGN)}</span>
            </div>
            <div>
              <span class="text-[10px] font-mono uppercase text-slate-400 block">Total Earnings</span>
              <span class="font-mono font-bold text-sm text-[#16A34A]">${app.formatMoney(inv.earningsNGN)}</span>
            </div>
            <div>
              <span class="text-[10px] font-mono uppercase text-slate-400 block">Terms / Yield</span>
              <span class="font-semibold text-xs text-slate-700">${inv.profitShare || inv.roiRate}</span>
            </div>
            <div>
              <span class="text-[10px] font-mono uppercase text-slate-400 block">Next Scheduled Payout</span>
              <span class="font-mono font-bold text-xs text-[#C59B27]">${app.formatMoney(inv.nextPayoutNGN)} (${inv.nextPayoutDate})</span>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-1">
            <button class="btn-mycay btn-mycay-outline text-xs h-9" onclick="window.app.showToast('Downloading Digital Contract PDF...')">
              <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
              <span>Download Contract (PDF)</span>
            </button>
          </div>
        </div>
      `).join('');
    }

    // Render Payouts Table
    const tablePayouts = document.getElementById('table-payout-body');
    if (tablePayouts) {
      tablePayouts.innerHTML = app.state.payouts.map(p => `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="p-4 font-mono font-bold text-slate-900">${p.id}</td>
          <td class="p-4 text-slate-600">${p.date}</td>
          <td class="p-4 font-semibold text-slate-800">${p.plan}</td>
          <td class="p-4 font-mono font-bold text-[#16A34A]">${app.formatMoney(p.amountNGN)}</td>
          <td class="p-4"><span class="badge-mycay badge-approved">✓ ${p.status}</span></td>
          <td class="p-4 text-right">
            <button class="btn-mycay btn-mycay-outline text-xs h-8 px-3" onclick="window.app.showToast('Downloading Payout Receipt ${p.ref} (PDF)...')">Receipt PDF</button>
          </td>
        </tr>
      `).join('');
    }

    // Render Withdrawals List
    const containerWithdrawals = document.getElementById('container-withdrawals-list');
    if (containerWithdrawals) {
      containerWithdrawals.innerHTML = app.state.withdrawals.map(w => `
        <div class="bg-white rounded-2xl p-5 shadow-xl border border-slate-200 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-heading font-bold text-base text-slate-900">${w.plan} Withdrawal Request</h4>
              <span class="text-xs text-slate-500">Submitted on ${w.dateSubmitted} • Amount: <strong class="text-slate-900 font-mono">${app.formatMoney(w.amountNGN)}</strong></span>
            </div>
            <span class="badge-mycay badge-pending">⏳ ${w.status}</span>
          </div>

          <div class="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-mono">
            <span>Notice Period Countdown:</span>
            <span class="font-bold">⏱️ ${w.countdownRemaining}</span>
          </div>
        </div>
      `).join('');
    }

    // Render Contracts Vault List
    const containerAgreements = document.getElementById('container-document-agreements');
    if (containerAgreements) {
      containerAgreements.innerHTML = app.state.investments.map(inv => `
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div class="flex items-center gap-2 font-semibold text-slate-800">
            <i data-lucide="file-check" class="w-4 h-4 text-[#C59B27]"></i>
            <span>${inv.planName} Agreement</span>
          </div>
          <button class="btn-mycay btn-mycay-outline text-xs h-8 px-3" onclick="window.app.showToast('Downloading Agreement PDF...')">PDF</button>
        </div>
      `).join('');
    }

    if (window.lucide) lucide.createIcons();
  }
}

// Global instance
window.investorDashboard = new InvestorDashboard();
