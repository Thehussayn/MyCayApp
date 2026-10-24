/* ==========================================
   MyCayApp by Jeje-Ola — Staff Operations CRM
   Investor Approval Pipeline, Property Mapping & Express Onboarding
   ========================================== */

class StaffDashboard {
  constructor() {
    this.investors = [
      {
        id: 'INV-2026-8801',
        name: 'Chief Babatunde Ola',
        email: 'babatunde.ola@example.com',
        phone: '+234 803 123 4567',
        plan: 'GIAP & WealthStream',
        capitalNGN: 35000000,
        status: 'pending',
        dateRegistered: '2026-09-15',
        documents: ['gov_id_babatunde.pdf', 'utility_bill_2026.pdf', 'specimen_signature.jpg']
      },
      {
        id: 'INV-2026-8790',
        name: 'Dr. Amina Bello',
        email: 'amina.bello@example.com',
        phone: '+234 802 334 5566',
        plan: 'WealthStream Income',
        capitalNGN: 15000000,
        status: 'active',
        dateRegistered: '2026-08-20',
        documents: ['passport_amina.pdf', 'utility_bill_amina.pdf']
      },
      {
        id: 'INV-2026-8740',
        name: 'Engr. Emeka Okonkwo',
        email: 'emeka.okonkwo@example.com',
        phone: '+234 805 778 9900',
        plan: 'GIAP Asset-Backed',
        capitalNGN: 50000000,
        status: 'active',
        dateRegistered: '2026-06-10',
        documents: ['nimc_emeka.pdf', 'bank_statement.pdf']
      },
      {
        id: 'INV-2026-8650',
        name: 'High Chief Samuel Adebayo',
        email: 'adebayo.samuel@example.com',
        phone: '+234 803 444 1122',
        plan: 'WealthStream Income',
        capitalNGN: 5000000,
        status: 'withdrawn',
        dateRegistered: '2025-11-04',
        documents: ['drivers_license_adebayo.pdf']
      }
    ];

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    document.getElementById('input-staff-search')?.addEventListener('input', (e) => {
      this.filterKanban(e.target.value);
    });

    document.getElementById('btn-walkin-onboard')?.addEventListener('click', () => {
      window.app.showToast('Launching Express Walk-In Onboarding Wizard (<15 mins)...');
      window.app.switchView('onboarding-wizard');
    });
  }

  approveInvestor(id) {
    const inv = this.investors.find(i => i.id === id);
    if (!inv) return;

    inv.status = 'active';
    window.app.state.user.status = 'approved';
    window.app.showToast(`Investor ${inv.name} APPROVED! Automated email & SLA agreement dispatched.`);
    this.render();
  }

  declineInvestor(id) {
    const inv = this.investors.find(i => i.id === id);
    if (!inv) return;

    inv.status = 'declined';
    window.app.showToast(`Investor ${inv.name} DECLINED. Notice template dispatched.`);
    this.render();
  }

  filterKanban(query) {
    const q = query.toLowerCase();
    const filtered = this.investors.filter(i => 
      i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
    );
    this.renderKanbanList(filtered);
  }

  renderKanbanList(list) {
    const colPending = document.getElementById('kanban-col-pending');
    const colActive = document.getElementById('kanban-col-active');
    const colWithdrawn = document.getElementById('kanban-col-withdrawn');

    if (!colPending || !colActive || !colWithdrawn) return;

    colPending.innerHTML = '';
    colActive.innerHTML = '';
    colWithdrawn.innerHTML = '';

    list.forEach(inv => {
      const isPending = inv.status === 'pending';
      const cardHtml = `
        <div class="bg-white rounded-xl p-4 shadow-md border border-slate-200 space-y-3 hover:border-[#C59B27] transition-all">
          <div class="flex items-center justify-between">
            <h4 class="font-heading font-extrabold text-sm text-slate-900">${inv.name}</h4>
            <span class="badge-mycay ${inv.status === 'pending' ? 'badge-pending' : inv.status === 'active' ? 'badge-approved' : 'badge-gold'}">${inv.status}</span>
          </div>

          <div class="text-xs text-slate-500 font-mono">
            <span>${inv.id} • ${inv.plan}</span>
            <div class="font-bold text-slate-900 text-sm mt-0.5">${window.app.formatMoney(inv.capitalNGN)}</div>
          </div>

          <div class="space-y-1">
            <span class="text-[10px] font-mono uppercase text-slate-400 block">KYC Documents Uploaded</span>
            <div class="flex flex-wrap gap-1">
              ${inv.documents.map(d => `<span class="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600 border border-slate-200">${d}</span>`).join('')}
            </div>
          </div>

          ${isPending ? `
            <div class="flex gap-2 pt-2 border-t border-slate-100">
              <button class="btn-mycay btn-mycay-primary text-xs h-8 px-3 flex-1" onclick="window.staffDashboard.approveInvestor('${inv.id}')">Approve</button>
              <button class="btn-mycay btn-mycay-outline text-xs h-8 px-3" onclick="window.staffDashboard.declineInvestor('${inv.id}')">Decline</button>
            </div>
          ` : ''}
        </div>
      `;

      if (inv.status === 'pending') colPending.innerHTML += cardHtml;
      else if (inv.status === 'active') colActive.innerHTML += cardHtml;
      else colWithdrawn.innerHTML += cardHtml;
    });

    if (window.lucide) lucide.createIcons();
  }

  render() {
    this.renderKanbanList(this.investors);
  }
}

// Global instance
window.staffDashboard = new StaffDashboard();
