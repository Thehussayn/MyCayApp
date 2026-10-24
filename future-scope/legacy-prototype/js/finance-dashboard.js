/* ==========================================
   MyCayApp by Jeje-Ola — Finance Desk & Ledger
   Capital Under Management (CUM), FX Rate & Batch Payouts
   ========================================== */

class FinanceDashboard {
  constructor() {
    this.ledger = [
      { id: 'LEDG-001', investor: 'Chief Babatunde Ola', plan: 'GIAP Asset-Backed', capitalNGN: 25000000, profitSplit: '70/30', nextPayoutDate: '2026-10-15', nextPayoutNGN: 1458333, status: 'Active' },
      { id: 'LEDG-002', investor: 'Chief Babatunde Ola', plan: 'WealthStream Fixed', capitalNGN: 10000000, frequency: 'Monthly', nextPayoutDate: '2026-10-01', nextPayoutNGN: 200000, status: 'Active' },
      { id: 'LEDG-003', investor: 'Dr. Amina Bello', plan: 'WealthStream Fixed', capitalNGN: 15000000, frequency: 'Monthly', nextPayoutDate: '2026-10-01', nextPayoutNGN: 300000, status: 'Active' },
      { id: 'LEDG-004', investor: 'Engr. Emeka Okonkwo', plan: 'GIAP Asset-Backed', capitalNGN: 50000000, profitSplit: '70/30', nextPayoutDate: '2026-11-01', nextPayoutNGN: 2916666, status: 'Active' }
    ];

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    document.getElementById('btn-update-exchange-rate')?.addEventListener('click', () => {
      const rateInput = parseFloat(document.getElementById('input-exchange-rate')?.value);
      if (rateInput && rateInput > 0) {
        window.app.state.exchangeRate = rateInput;
        window.app.showToast(`Daily Exchange Rate updated: $1 = ₦${rateInput.toLocaleString()}`);
        window.app.render();
      }
    });

    document.getElementById('btn-process-batch-payouts')?.addEventListener('click', () => {
      this.processBatchPayouts();
    });

    document.getElementById('btn-export-cum-pdf')?.addEventListener('click', () => {
      window.app.showToast('Exporting CUM Report (PDF)...');
    });

    document.getElementById('btn-export-ledger-csv')?.addEventListener('click', () => {
      window.app.showToast('Exporting Investment Ledger (CSV)...');
    });
  }

  processBatchPayouts() {
    window.app.showToast('Batch Payouts Executed! 3 investor accounts credited & PDF receipts issued.');
    window.app.state.payouts.unshift({
      id: `PAY-${Math.floor(8800 + Math.random() * 100)}`,
      date: new Date().toISOString().split('T')[0],
      plan: 'Batch Monthly Payout',
      amountNGN: 1958333,
      ref: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'Completed'
    });
    window.app.render();
  }

  render() {
    const app = window.app;
    if (!app) return;

    const tableLedger = document.getElementById('table-finance-ledger-body');
    if (tableLedger) {
      tableLedger.innerHTML = this.ledger.map(row => `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="p-3 font-mono font-bold text-slate-900">${row.id}</td>
          <td class="p-3 font-semibold text-slate-800">${row.investor}</td>
          <td class="p-3"><span class="badge-mycay ${row.plan.includes('GIAP') ? 'badge-gold' : 'badge-approved'}">${row.plan}</span></td>
          <td class="p-3 font-mono font-bold text-slate-900">${app.formatMoney(row.capitalNGN)}</td>
          <td class="p-3 font-mono text-slate-600">${row.nextPayoutDate}</td>
          <td class="p-3 font-mono font-bold text-[#C59B27]">${app.formatMoney(row.nextPayoutNGN)}</td>
          <td class="p-3"><span class="badge-mycay badge-approved">● ${row.status}</span></td>
          <td class="p-3 text-right">
            <button class="btn-mycay btn-mycay-outline text-xs h-8 px-3" onclick="window.financeDashboard.processBatchPayouts()">Execute Payout</button>
          </td>
        </tr>
      `).join('');
    }

    const totalCUM = this.ledger.reduce((sum, item) => sum + item.capitalNGN, 0);
    const elemCUM = document.getElementById('finance-cum-total');
    if (elemCUM) elemCUM.textContent = app.formatMoney(totalCUM);

    if (window.lucide) lucide.createIcons();
  }
}

// Global instance
window.financeDashboard = new FinanceDashboard();
