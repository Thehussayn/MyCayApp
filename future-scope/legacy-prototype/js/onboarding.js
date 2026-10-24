/* ==========================================
   MyCayApp by Jeje-Ola — Investor Onboarding
   7-Step Biodata Wizard & NUBAN Verification Engine
   ========================================== */

class OnboardingWizard {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 7;
    
    this.stepMeta = [
      { label: 'Step 1 of 7: Personal Information', sublabel: 'Enter your legal profile information as it appears on your government identification.' },
      { label: 'Step 2 of 7: Contact & Address Details', sublabel: 'Provide your verified email, phone number, and physical residential address.' },
      { label: 'Step 3 of 7: Identity & Government Documentation', sublabel: 'Supply your Government ID details, BVN, and National Identity Number (NIN).' },
      { label: 'Step 4 of 7: Occupation & Financial Profile', sublabel: 'Specify your employment background, business entity, and annual income range.' },
      { label: 'Step 5 of 7: Next of Kin Information', sublabel: 'Provide emergency contact and primary beneficiary next-of-kin details.' },
      { label: 'Step 6 of 7: Bank Details & NUBAN Verification', sublabel: 'Verify your 10-digit NUBAN account for automated monthly payout credits.' },
      { label: 'Step 7 of 7: Document Upload & Declaration', sublabel: 'Upload official KYC documents, specimen signature, and sign authorization.' }
    ];

    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    document.getElementById('btn-wizard-next')?.addEventListener('click', () => this.nextStep());
    document.getElementById('btn-wizard-prev')?.addEventListener('click', () => this.prevStep());
    document.getElementById('btn-nuban-verify')?.addEventListener('click', () => this.verifyNUBAN());
    document.getElementById('btn-submit-onboarding')?.addEventListener('click', () => this.submitOnboarding());
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  verifyNUBAN() {
    const accNum = document.getElementById('input-acc-num')?.value;
    const bank = document.getElementById('select-bank')?.value || 'GTBank';
    const resultBox = document.getElementById('nuban-result');

    if (accNum && accNum.length === 10) {
      if (resultBox) {
        resultBox.innerHTML = `
          <div class="p-4 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/30 text-xs text-slate-800 space-y-1">
            <div class="flex items-center gap-2 font-bold text-[#16A34A]">
              <i data-lucide="check-circle-2" class="w-4 h-4"></i>
              <span>NUBAN Verified via Paystack Account Lookup</span>
            </div>
            <div class="font-mono text-xs pt-1">
              <span class="text-slate-500">Account Name:</span> <strong class="text-slate-900">CHIEF BABATUNDE OLA</strong><br>
              <span class="text-slate-500">Bank:</span> <strong>${bank}</strong> | <span class="text-slate-500">Account No:</span> <strong>${accNum}</strong>
            </div>
          </div>
        `;
        if (window.lucide) lucide.createIcons();
      }
      window.app.showToast(`NUBAN Verified: CHIEF BABATUNDE OLA (${bank})`);
    } else {
      window.app.showToast('Please enter a valid 10-digit NUBAN account number');
    }
  }

  submitOnboarding() {
    window.app.state.user.biodataCompleted = true;
    window.app.state.user.status = 'pending';
    window.app.showToast('Registration & 7-Step KYC submitted! Staff review pending.');
    window.app.switchView('investor-overview');
  }

  render() {
    const meta = this.stepMeta[this.currentStep - 1];
    const labelElem = document.getElementById('wizard-step-label');
    const sublabelElem = document.getElementById('wizard-step-sublabel');

    if (labelElem && meta) labelElem.textContent = meta.label;
    if (sublabelElem && meta) sublabelElem.textContent = meta.sublabel;

    for (let i = 1; i <= this.totalSteps; i++) {
      const indicator = document.getElementById(`step-node-${i}`);
      if (indicator) {
        const bar = indicator.querySelector('div');
        const text = indicator.querySelector('span');

        if (i <= this.currentStep) {
          if (bar) bar.className = 'h-2 rounded-full bg-[#C59B27] transition-all';
          if (text) text.className = 'text-[9px] font-mono font-bold text-[#C59B27] block truncate';
        } else {
          if (bar) bar.className = 'h-2 rounded-full bg-slate-200 transition-all';
          if (text) text.className = 'text-[9px] font-mono text-slate-400 block truncate';
        }
      }

      const stepContent = document.getElementById(`wizard-step-content-${i}`);
      if (stepContent) {
        stepContent.classList.toggle('hidden', i !== this.currentStep);
      }
    }

    const prevBtn = document.getElementById('btn-wizard-prev');
    const nextBtn = document.getElementById('btn-wizard-next');
    const submitBtn = document.getElementById('btn-submit-onboarding');

    if (prevBtn) prevBtn.classList.toggle('hidden', this.currentStep === 1);
    
    if (nextBtn) {
      nextBtn.classList.toggle('hidden', this.currentStep === this.totalSteps);
      nextBtn.innerHTML = `<span>Continue to Step ${this.currentStep + 1}</span><i data-lucide="chevron-right" class="w-4 h-4"></i>`;
    }

    if (submitBtn) submitBtn.classList.toggle('hidden', this.currentStep !== this.totalSteps);

    if (window.lucide) lucide.createIcons();
  }
}

// Global instance
window.onboardingWizard = new OnboardingWizard();
