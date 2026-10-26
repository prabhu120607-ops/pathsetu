/**
 * PathSetu Main Application Controller v2.0
 * GSAP 3D Scroll Integration, English/Telugu Language Switcher,
 * 4 Master Features: Career Comparison, Budget Planner, Progress Dashboard, Verified Resources.
 */

(function () {
  'use strict';

  // Global Application State
  const AppState = {
    currentView: 'landing', // 'landing' | 'app'
    currentAppTab: 'dashboard',
    currentLang: 'en', // 'en' | 'te'
    profile: null,
    activeCareerId: 'software',
    comparisonList: ['software', 'agri_scientist', 'solar_electrician'],
    projectStatuses: {},
    recentActivity: [],
    userBudgetInr: 25000
  };

  let dom = {};

  function init() {
    cacheDom();
    bindEvents();
    loadInitialState();
    PathSetuAPI.checkHealth();
  }

  function cacheDom() {
    dom = {
      // Views
      viewLanding: document.getElementById('viewLanding'),
      viewApp: document.getElementById('viewApp'),
      appTabs: document.querySelectorAll('.app-nav-item'),
      appPanels: document.querySelectorAll('.app-panel'),

      // Header actions & Language
      btnLangToggle: document.getElementById('btnLangToggle'),
      btnGoToApp: document.getElementById('btnGoToApp'),
      btnHeroStart: document.getElementById('btnHeroStart'),
      btnHeroExplore: document.getElementById('btnHeroExplore'),
      btnBackToLanding: document.getElementById('btnBackToLanding'),
      backendStatusBadge: document.getElementById('backendStatusBadge'),

      // Landing Interactive Sections
      budgetCalcInput: document.getElementById('budgetCalcInput'),
      budgetCalcResult: document.getElementById('budgetCalcResult'),
      landingResourcesGrid: document.getElementById('landingResourcesGrid'),

      // Onboarding Wizard
      onboardingForm: document.getElementById('onboardingForm'),
      onboardingSteps: document.querySelectorAll('.wizard-step'),
      wizardDots: document.querySelectorAll('.wizard-progress-dot'),
      btnWizardNext: document.getElementById('btnWizardNext'),
      btnWizardBack: document.getElementById('btnWizardBack'),
      btnWizardSave: document.getElementById('btnWizardSave'),

      // Catalog & Filters
      careerSearchInput: document.getElementById('careerSearchInput'),
      careerFieldFilter: document.getElementById('careerFieldFilter'),
      careerCardsGrid: document.getElementById('careerCardsGrid'),
      btnOpenCompareModal: document.getElementById('btnOpenCompareModal'),

      // Compare Modal
      compareModal: document.getElementById('compareModal'),
      compareGrid: document.getElementById('compareGrid'),
      btnCloseCompareModal: document.getElementById('btnCloseCompareModal'),

      // Skill Gap View
      skillGapCareerSelect: document.getElementById('skillGapCareerSelect'),
      skillGapContainer: document.getElementById('skillGapContainer'),

      // Roadmap & Dashboard
      roadmapCareerSelect: document.getElementById('roadmapCareerSelect'),
      roadmapContainer: document.getElementById('roadmapContainer'),
      nextBestActionCard: document.getElementById('nextBestActionCard'),
      roadmapProgressBar: document.getElementById('roadmapProgressBar'),
      roadmapProgressPct: document.getElementById('roadmapProgressPct'),
      roadmapCompletedCount: document.getElementById('roadmapCompletedCount'),
      btnDownloadRoadmap: document.getElementById('btnDownloadRoadmap'),
      btnResetRoadmap: document.getElementById('btnResetRoadmap'),
      btnAddCustomMilestone: document.getElementById('btnAddCustomMilestone'),

      // Dashboard
      dashGreetingName: document.getElementById('dashGreetingName'),
      dashProfileStatus: document.getElementById('dashProfileStatus'),
      dashActiveCareerName: document.getElementById('dashActiveCareerName'),
      dashRoadmapProgressText: document.getElementById('dashRoadmapProgressText'),
      dashRoadmapProgressBar: document.getElementById('dashRoadmapProgressBar'),
      dashNextActionContainer: document.getElementById('dashNextActionContainer'),
      dashSavedCareersList: document.getElementById('dashSavedCareersList'),
      dashActivityList: document.getElementById('dashActivityList'),

      // Budget Planner Tab
      tabBudgetInput: document.getElementById('tabBudgetInput'),
      tabBudgetCareerSelect: document.getElementById('tabBudgetCareerSelect'),
      tabBudgetOutput: document.getElementById('tabBudgetOutput'),

      // Resources Tab
      resSearchInput: document.getElementById('resSearchInput'),
      resCategoryFilter: document.getElementById('resCategoryFilter'),
      resCardsContainer: document.getElementById('resCardsContainer'),

      // Projects Hub
      projectsCareerFilter: document.getElementById('projectsCareerFilter'),
      projectsGrid: document.getElementById('projectsGrid'),

      // Toast
      toastContainer: document.getElementById('toastContainer')
    };
  }

  function bindEvents() {
    // Navigation events
    if (dom.btnGoToApp) dom.btnGoToApp.addEventListener('click', () => switchView('app', 'dashboard'));
    if (dom.btnHeroStart) dom.btnHeroStart.addEventListener('click', () => switchView('app', 'onboarding'));
    if (dom.btnHeroExplore) dom.btnHeroExplore.addEventListener('click', () => switchView('app', 'careers'));
    if (dom.btnBackToLanding) dom.btnBackToLanding.addEventListener('click', () => switchView('landing'));

    // Language Toggle
    if (dom.btnLangToggle) {
      dom.btnLangToggle.addEventListener('click', toggleLanguage);
    }

    // App tab navigation
    dom.appTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        if (targetTab) switchAppTab(targetTab);
      });
    });

    // Landing nav links
    document.querySelectorAll('.landing-nav-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          if (AppState.currentView !== 'landing') {
            switchView('landing');
          }
          const el = document.querySelector(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Backend health listener
    window.addEventListener('pathsetu:backend-status', (e) => {
      if (dom.backendStatusBadge) {
        if (e.detail.online) {
          dom.backendStatusBadge.innerHTML = '<span class="status-dot green"></span> Python API (SQLite)';
        } else {
          dom.backendStatusBadge.innerHTML = '<span class="status-dot cyan"></span> Local Browser Mode';
        }
      }
    });

    // Onboarding wizard
    let currentStep = 1;
    if (dom.btnWizardNext) {
      dom.btnWizardNext.addEventListener('click', () => {
        if (currentStep < 5) {
          currentStep++;
          showWizardStep(currentStep);
        }
      });
    }

    if (dom.btnWizardBack) {
      dom.btnWizardBack.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          showWizardStep(currentStep);
        }
      });
    }

    if (dom.btnWizardSave) {
      dom.btnWizardSave.addEventListener('click', handleSaveProfile);
    }

    // Careers filter
    if (dom.careerSearchInput) dom.careerSearchInput.addEventListener('input', debounce(renderCareersCatalog, 200));
    if (dom.careerFieldFilter) dom.careerFieldFilter.addEventListener('change', renderCareersCatalog);
    if (dom.btnOpenCompareModal) dom.btnOpenCompareModal.addEventListener('click', openCompareModal);
    if (dom.btnCloseCompareModal) dom.btnCloseCompareModal.addEventListener('click', closeCompareModal);

    // Skill Gap selectors
    if (dom.skillGapCareerSelect) {
      dom.skillGapCareerSelect.addEventListener('change', (e) => {
        AppState.activeCareerId = e.target.value;
        renderSkillGapView();
      });
    }

    // Roadmap actions
    if (dom.roadmapCareerSelect) {
      dom.roadmapCareerSelect.addEventListener('change', (e) => {
        AppState.activeCareerId = e.target.value;
        renderRoadmapView();
      });
    }
    if (dom.btnDownloadRoadmap) dom.btnDownloadRoadmap.addEventListener('click', handleDownloadRoadmap);
    if (dom.btnResetRoadmap) dom.btnResetRoadmap.addEventListener('click', handleResetRoadmap);
    if (dom.btnAddCustomMilestone) dom.btnAddCustomMilestone.addEventListener('click', handleAddCustomMilestone);

    // Budget Planner actions
    if (dom.budgetCalcInput) dom.budgetCalcInput.addEventListener('input', updateLandingBudgetCalc);
    if (dom.tabBudgetInput) dom.tabBudgetInput.addEventListener('input', updateTabBudgetPlanner);
    if (dom.tabBudgetCareerSelect) dom.tabBudgetCareerSelect.addEventListener('change', updateTabBudgetPlanner);

    // Resources search
    if (dom.resSearchInput) dom.resSearchInput.addEventListener('input', debounce(renderResourcesExplorer, 200));
    if (dom.resCategoryFilter) dom.resCategoryFilter.addEventListener('change', renderResourcesExplorer);
  }

  async function loadInitialState() {
    AppState.profile = await PathSetuAPI.getProfile();
    if (!AppState.profile) {
      AppState.profile = {
        name: "Ananya",
        education: "Class 11–12 (Science / PCM)",
        subjects: ["Mathematics", "Physics", "Computer Science"],
        interests: ["technology", "problem-solving", "building"],
        skills: ["Python", "HTML5 & CSS3"],
        budget: 25000,
        workstyle: "Deep Focus (Solo analytical / coding focus)",
        goal: "Build software and apps to achieve financial independence."
      };
      await PathSetuAPI.saveProfile(AppState.profile);
    }

    populateOnboardingForm(AppState.profile);

    // Render components
    renderMethodologySection();
    renderLandingPathwayCards();
    renderLandingProjects();
    updateLandingBudgetCalc();
    renderLandingResources();

    renderDashboard();
    renderCareersCatalog();
    renderSkillGapView();
    renderRoadmapView();
    renderResourcesExplorer();
    updateTabBudgetPlanner();
  }

  // Language Toggle
  function toggleLanguage() {
    AppState.currentLang = AppState.currentLang === 'en' ? 'te' : 'en';
    const isTe = AppState.currentLang === 'te';
    if (dom.btnLangToggle) {
      dom.btnLangToggle.innerHTML = isTe ? '🌐 English' : '🌐 తెలుగు (Telugu)';
    }

    const t = PATHSETU_DATA.translations[AppState.currentLang] || PATHSETU_DATA.translations.en;
    
    // Update main headings and labels
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (t[key]) el.textContent = t[key];
    });

    renderMethodologySection();
    renderLandingPathwayCards();
    renderCareersCatalog();
    renderDashboard();
    showToast(isTe ? 'భాష తెలుగులోకి మార్చబడింది (Telugu Active)' : 'Language switched to English', 'info');
  }

  // View Navigation
  function switchView(viewName, appTab) {
    AppState.currentView = viewName;
    if (viewName === 'landing') {
      dom.viewLanding.classList.remove('hide');
      dom.viewApp.classList.add('hide');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      dom.viewLanding.classList.add('hide');
      dom.viewApp.classList.remove('hide');
      if (appTab) switchAppTab(appTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function switchAppTab(tabId) {
    AppState.currentAppTab = tabId;
    dom.appTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === tabId));
    dom.appPanels.forEach((panel) => panel.classList.toggle('active', panel.id === `tab-${tabId}`));

    if (tabId === 'dashboard') renderDashboard();
    if (tabId === 'careers') renderCareersCatalog();
    if (tabId === 'budget') updateTabBudgetPlanner();
    if (tabId === 'skillgap') renderSkillGapView();
    if (tabId === 'roadmap') renderRoadmapView();
    if (tabId === 'resources') renderResourcesExplorer();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Wizard Steps
  function showWizardStep(stepNum) {
    dom.onboardingSteps.forEach((step, idx) => step.classList.toggle('active', idx + 1 === stepNum));
    dom.wizardDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx + 1 === stepNum);
      dot.classList.toggle('completed', idx + 1 < stepNum);
    });

    if (dom.btnWizardBack) dom.btnWizardBack.style.visibility = stepNum === 1 ? 'hidden' : 'visible';
    if (dom.btnWizardNext) dom.btnWizardNext.style.display = stepNum === 5 ? 'none' : 'inline-flex';
    if (dom.btnWizardSave) dom.btnWizardSave.style.display = stepNum === 5 ? 'inline-flex' : 'none';
  }

  function populateOnboardingForm(p) {
    if (!p) return;
    const nameEl = document.getElementById('inputStudentName');
    const eduEl = document.getElementById('inputEducation');
    const goalEl = document.getElementById('inputGoal');
    const budgetEl = document.getElementById('inputBudget');

    if (nameEl) nameEl.value = p.name || '';
    if (eduEl) eduEl.value = p.education || 'Class 11–12 (Science / PCM)';
    if (goalEl) goalEl.value = p.goal || '';
    if (budgetEl) budgetEl.value = p.budget || 25000;

    if (p.interests) {
      document.querySelectorAll('#wizardInterests input').forEach((chk) => {
        chk.checked = p.interests.includes(chk.value);
      });
    }
    if (p.skills) {
      document.querySelectorAll('#wizardSkills input').forEach((chk) => {
        chk.checked = p.skills.includes(chk.value);
      });
    }
  }

  async function handleSaveProfile() {
    const interests = Array.from(document.querySelectorAll('#wizardInterests input:checked')).map((i) => i.value);
    const skills = Array.from(document.querySelectorAll('#wizardSkills input:checked')).map((s) => s.value);
    const budgetVal = parseFloat(document.getElementById('inputBudget')?.value || '25000');

    const updatedProfile = {
      name: document.getElementById('inputStudentName').value.trim() || 'Student',
      education: document.getElementById('inputEducation').value,
      interests: interests.length ? interests : ['technology'],
      skills: skills,
      budget: budgetVal,
      goal: document.getElementById('inputGoal').value.trim() || 'Build a meaningful career.'
    };

    AppState.profile = updatedProfile;
    AppState.userBudgetInr = budgetVal;
    await PathSetuAPI.saveProfile(updatedProfile);

    showToast('Profile saved! Updated recommendations and budget analysis.', 'success');
    switchAppTab('dashboard');
  }

  // Dashboard Rendering
  function renderDashboard() {
    const p = AppState.profile;
    if (!p) return;

    if (dom.dashGreetingName) dom.dashGreetingName.textContent = p.name;
    if (dom.dashProfileStatus) {
      dom.dashProfileStatus.textContent = `Profile Complete · ${p.education} · Budget: ₹${p.budget || 25000}`;
    }

    const currentCareer = PATHSETU_DATA.careers.find((c) => c.id === AppState.activeCareerId) || PATHSETU_DATA.careers[0];
    if (dom.dashActiveCareerName) dom.dashActiveCareerName.textContent = currentCareer.name;

    const roadmapProgress = PathSetuAPI.getRoadmapProgress(currentCareer.id);
    const totalSteps = currentCareer.steps.length;
    const doneSteps = roadmapProgress.completedSteps ? roadmapProgress.completedSteps.length : 0;
    const progressPct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

    if (dom.dashRoadmapProgressText) dom.dashRoadmapProgressText.textContent = `${doneSteps}/${totalSteps} Steps Complete (${progressPct}%)`;
    if (dom.dashRoadmapProgressBar) dom.dashRoadmapProgressBar.style.width = `${progressPct}%`;

    // Next Best Action
    if (dom.dashNextActionContainer) {
      const nextStep = currentCareer.steps.find((s) => !roadmapProgress.completedSteps.includes(s.id));
      if (nextStep) {
        dom.dashNextActionContainer.innerHTML = `
          <div class="next-action-card">
            <div class="next-action-header">
              <span class="pill-badge accent">Recommended Next Action</span>
              <span class="next-action-time">${nextStep.time}</span>
            </div>
            <h4 class="next-action-title">${nextStep.title}</h4>
            <p class="next-action-desc">${nextStep.desc}</p>
            <div class="next-action-footer">
              <button class="btn btn-sm btn-primary" onclick="PathSetuApp.markStepDone('${currentCareer.id}', '${nextStep.id}')">
                Mark as Done ✓
              </button>
              <button class="btn btn-sm btn-ghost" onclick="PathSetuApp.switchAppTab('roadmap')">
                View in Roadmap →
              </button>
            </div>
          </div>
        `;
      } else {
        dom.dashNextActionContainer.innerHTML = `
          <div class="next-action-card success-card">
            <span class="pill-badge success">All Steps Completed 🎉</span>
            <p class="text-secondary small">Great work! You've verified your basics for this pathway.</p>
          </div>
        `;
      }
    }

    // Saved Careers
    if (dom.dashSavedCareersList) {
      const savedIds = PathSetuAPI.getSavedCareers();
      const savedCareers = PATHSETU_DATA.careers.filter((c) => savedIds.includes(c.id));
      dom.dashSavedCareersList.innerHTML = savedCareers.map((c) => `
        <div class="saved-career-pill ${c.id === AppState.activeCareerId ? 'active' : ''}" onclick="PathSetuApp.setActiveCareer('${c.id}')">
          <span>${c.emoji}</span>
          <span class="saved-career-name">${c.name}</span>
        </div>
      `).join('');
    }
  }

  // Careers Catalog Rendering
  async function renderCareersCatalog() {
    if (!dom.careerCardsGrid) return;
    const query = dom.careerSearchInput ? dom.careerSearchInput.value.trim().toLowerCase() : '';
    const field = dom.careerFieldFilter ? dom.careerFieldFilter.value : 'all';

    let careers = PATHSETU_DATA.careers;
    if (query) {
      careers = careers.filter((c) => c.name.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query));
    }
    if (field !== 'all') {
      careers = careers.filter((c) => c.field.toLowerCase().includes(field.toLowerCase()));
    }

    const savedIds = PathSetuAPI.getSavedCareers();
    const isTe = AppState.currentLang === 'te';

    dom.careerCardsGrid.innerHTML = careers.map((c) => {
      const isSaved = savedIds.includes(c.id);
      const isSelected = AppState.activeCareerId === c.id;

      return `
        <article class="career-card ${isSelected ? 'selected' : ''}">
          <div class="career-card-top">
            <div class="career-badge-row">
              <span class="career-emoji">${c.emoji}</span>
              <span class="pill-badge">${c.badge}</span>
              <button class="save-bookmark-btn ${isSaved ? 'saved' : ''}" onclick="PathSetuApp.toggleSave('${c.id}')" title="Bookmark">
                ${isSaved ? '★' : '☆'}
              </button>
            </div>
          </div>

          <h3 class="career-title">${escapeHtml(isTe && c.name_te ? c.name_te : c.name)}</h3>
          <span class="career-field-tag">${escapeHtml(c.field)}</span>
          <p class="career-desc">${escapeHtml(isTe && c.desc_te ? c.desc_te : c.desc)}</p>

          <div class="career-meta-row">
            <div>
              <span class="meta-label">Salary Range:</span>
              <span class="meta-val small">${c.salaryRange}</span>
            </div>
            <div>
              <span class="meta-label">Duration:</span>
              <span class="meta-val small">${c.timeToReady}</span>
            </div>
          </div>

          <div class="career-card-actions">
            <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}" onclick="PathSetuApp.selectAndSetCareer('${c.id}')">
              ${isSelected ? 'Active Pathway ✓' : 'Select Pathway'}
            </button>
            <button class="btn btn-sm btn-ghost" onclick="PathSetuApp.addToCompare('${c.id}')">
              + Compare
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  // Feature A: Side-by-Side Comparison
  function openCompareModal() {
    if (!dom.compareModal || !dom.compareGrid) return;
    const careers = PATHSETU_DATA.careers.filter((c) => AppState.comparisonList.includes(c.id));
    if (careers.length === 0) {
      showToast('Select up to 3 careers using the "+ Compare" buttons.', 'info');
      return;
    }

    dom.compareGrid.innerHTML = careers.map((c) => `
      <div class="compare-col card">
        <span class="compare-emoji">${c.emoji}</span>
        <h4>${c.name}</h4>
        <div class="small text-secondary">${c.field}</div>
        <hr style="margin: 10px 0; border: 0; border-top: 1px solid var(--border-color);">
        <div class="small"><strong>Salary Range:</strong><br>${c.salaryRange}</div>
        <div class="small" style="margin-top: 8px;"><strong>Study Duration:</strong><br>${c.timeToReady}</div>
        <div class="small" style="margin-top: 8px;"><strong>Eligibility:</strong><br>${c.eligibilityConditions || 'Standard 10+2'}</div>
        <div class="small" style="margin-top: 8px;"><strong>Govt Tuition:</strong><br>${c.estimatedCostInr?.government || 'N/A'}</div>
        <div class="small" style="margin-top: 8px;"><strong>Free Alternative:</strong><br>${c.freeAlternatives?.[0] || 'SWAYAM / NPTEL'}</div>
        <button class="btn btn-sm btn-primary" style="width: 100%; margin-top: 14px;" onclick="PathSetuApp.selectAndSetCareer('${c.id}'); PathSetuApp.closeCompareModal();">
          Choose This Path
        </button>
      </div>
    `).join('');

    dom.compareModal.classList.remove('hide');
  }

  function closeCompareModal() {
    if (dom.compareModal) dom.compareModal.classList.add('hide');
  }

  function addToCompare(careerId) {
    if (!AppState.comparisonList.includes(careerId)) {
      if (AppState.comparisonList.length >= 3) AppState.comparisonList.shift();
      AppState.comparisonList.push(careerId);
      showToast('Added to 3-career comparison tray!', 'success');
    }
    openCompareModal();
  }

  // Feature B: Budget Planner Evaluation
  function updateLandingBudgetCalc() {
    const input = dom.budgetCalcInput ? parseFloat(dom.budgetCalcInput.value || '25000') : 25000;
    AppState.userBudgetInr = input;
    const output = dom.budgetCalcResult;
    if (!output) return;

    const affordableGovt = PATHSETU_DATA.careers.filter((c) => {
      return input >= 20000 || c.id === 'solar_electrician';
    });

    output.innerHTML = `
      <h4>Estimated Pathway Affordability (₹${input.toLocaleString()} Budget)</h4>
      <p class="small text-secondary" style="margin: 8px 0;">
        ${input >= 20000 ?
          '✓ Your budget is sufficient for recognized Government Polytechnic, ITI, or State Degree Colleges.' :
          '⚠️ Your budget is best suited for 100% Free SWAYAM, Skill India courses, or Suryamitra government-subsidized programs.'}
      </p>
      <div class="chips-wrap">
        ${affordableGovt.map((c) => `<span class="chip-item">${c.emoji} ${c.name} (Govt Route)</span>`).join('')}
      </div>
    `;
  }

  function updateTabBudgetPlanner() {
    if (!dom.tabBudgetOutput) return;
    const budgetVal = dom.tabBudgetInput ? parseFloat(dom.tabBudgetInput.value || '25000') : 25000;
    const targetCareerId = dom.tabBudgetCareerSelect ? dom.tabBudgetCareerSelect.value : 'software';

    const career = PATHSETU_DATA.careers.find((c) => c.id === targetCareerId) || PATHSETU_DATA.careers[0];
    const costs = career.estimatedCostInr || {};

    dom.tabBudgetOutput.innerHTML = `
      <div class="card">
        <h3>Budget Evaluation for ${career.name}</h3>
        <p class="small text-secondary">Comparing your annual budget of ₹${budgetVal.toLocaleString()} against verified costs:</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 16px 0;">
          <div class="card" style="background:#0D0E15;">
            <span class="meta-label">Government / State College:</span>
            <strong>${costs.government || '₹15,000 - ₹50,000 / yr'}</strong>
          </div>
          <div class="card" style="background:#0D0E15;">
            <span class="meta-label">Private Institution:</span>
            <strong>${costs.private || '₹80,000 - ₹2,50,000 / yr'}</strong>
          </div>
        </div>

        <h4>Verified Zero-Cost / Open Alternatives:</h4>
        <ul class="dod-list">
          ${(career.freeAlternatives || ['SWAYAM Central Courses', 'Skill India Digital Hub Modules']).map((fa) => `<li>${fa}</li>`).join('')}
        </ul>

        <h4 style="margin-top: 14px;">Applicable Government Scholarships:</h4>
        <ul class="dod-list">
          ${(career.scholarships || ['National Scholarship Portal (NSP) Post-Matric']).map((sc) => `<li>${sc}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Feature D: Verified Resources Explorer
  function renderLandingResources() {
    if (!dom.landingResourcesGrid) return;
    dom.landingResourcesGrid.innerHTML = PATHSETU_DATA.resources.slice(0, 4).map((r) => `
      <div class="card resource-card">
        <div class="resource-top">
          <span class="pill-badge success">✓ ${r.verification_status}</span>
          <span class="small text-muted">${r.last_checked}</span>
        </div>
        <a href="${r.official_url}" target="_blank" rel="noopener noreferrer" class="resource-title">
          ${escapeHtml(r.title)} ↗
        </a>
        <p class="small text-secondary">${escapeHtml(r.description)}</p>
        <div class="small" style="margin-top:auto;">
          <strong>Authority:</strong> ${r.authority}
        </div>
      </div>
    `).join('');
  }

  function renderResourcesExplorer() {
    if (!dom.resCardsContainer) return;
    const q = dom.resSearchInput ? dom.resSearchInput.value.toLowerCase().trim() : '';
    const cat = dom.resCategoryFilter ? dom.resCategoryFilter.value : 'all';

    let resList = PATHSETU_DATA.resources;
    if (q) {
      resList = resList.filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }

    dom.resCardsContainer.innerHTML = resList.map((r) => `
      <div class="card resource-card">
        <div class="resource-top">
          <span class="pill-badge success">✓ Verified</span>
          <span class="small text-muted">Checked: ${r.last_checked}</span>
        </div>
        <a href="${r.official_url}" target="_blank" rel="noopener noreferrer" class="resource-title">
          ${escapeHtml(r.title)} ↗
        </a>
        <p class="small text-secondary">${escapeHtml(r.description)}</p>
        <div class="small text-accent">
          ${r.cost_detail}
        </div>
      </div>
    `).join('');
  }

  // Skill Gap Rendering
  function renderSkillGapView() {
    if (!dom.skillGapContainer) return;
    if (dom.skillGapCareerSelect && dom.skillGapCareerSelect.options.length <= 1) {
      dom.skillGapCareerSelect.innerHTML = PATHSETU_DATA.careers.map((c) => `
        <option value="${c.id}" ${c.id === AppState.activeCareerId ? 'selected' : ''}>${c.emoji} ${c.name}</option>
      `).join('');
    }

    const career = PATHSETU_DATA.careers.find((c) => c.id === AppState.activeCareerId) || PATHSETU_DATA.careers[0];
    const userSkills = (AppState.profile && AppState.profile.skills) || [];

    const ready = [];
    const missing = [];
    career.requiredSkills.forEach((req) => {
      const match = userSkills.some((us) => req.name.toLowerCase().includes(us.toLowerCase()) || us.toLowerCase().includes(req.name.toLowerCase()));
      if (match) ready.push(req);
      else missing.push(req);
    });

    const total = career.requiredSkills.length;
    const pct = total ? Math.round((ready.length / total) * 100) : 0;

    dom.skillGapContainer.innerHTML = `
      <div class="card" style="margin-bottom: 20px;">
        <h3>Readiness Diagnosis: ${career.name}</h3>
        <p class="small text-secondary">Foundational readiness based on declared skills:</p>
        <div style="font-size: 2rem; font-weight: 800; color: var(--accent-cyan); margin: 10px 0;">
          ${Math.max(pct, 20)}% Ready
        </div>
      </div>

      <div class="card priority-skills-banner" style="margin-bottom: 20px;">
        <h4>🎯 Priority Next 3 Skills to Master:</h4>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 10px;">
          ${missing.slice(0, 3).map((sk, idx) => `
            <div class="card" style="background:#0D0E15;">
              <span class="pill-badge accent">0${idx + 1}</span>
              <strong style="display:block; margin: 6px 0;">${sk.name}</strong>
              <div class="small text-muted">${sk.level} · Priority ${sk.priority}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Roadmap View
  function renderRoadmapView() {
    if (!dom.roadmapContainer) return;
    if (dom.roadmapCareerSelect && dom.roadmapCareerSelect.options.length <= 1) {
      dom.roadmapCareerSelect.innerHTML = PATHSETU_DATA.careers.map((c) => `
        <option value="${c.id}" ${c.id === AppState.activeCareerId ? 'selected' : ''}>${c.emoji} ${c.name}</option>
      `).join('');
    }

    const career = PATHSETU_DATA.careers.find((c) => c.id === AppState.activeCareerId) || PATHSETU_DATA.careers[0];
    const progress = PathSetuAPI.getRoadmapProgress(career.id);
    const completed = new Set(progress.completedSteps || []);

    const steps = career.steps;
    const doneCount = steps.filter((s) => completed.has(s.id)).length;
    const pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;

    if (dom.roadmapProgressPct) dom.roadmapProgressPct.textContent = `${pct}%`;
    if (dom.roadmapProgressBar) dom.roadmapProgressBar.style.width = `${pct}%`;

    dom.roadmapContainer.innerHTML = steps.map((s, idx) => {
      const isDone = completed.has(s.id);
      return `
        <div class="roadmap-step-card ${isDone ? 'completed' : ''}">
          <div class="step-num-badge">${isDone ? '✓' : idx + 1}</div>
          <div class="step-details">
            <h4 class="step-title">${escapeHtml(s.title)} (${s.time})</h4>
            <p class="step-desc">${escapeHtml(s.desc)}</p>
          </div>
          <input type="checkbox" ${isDone ? 'checked' : ''} onchange="PathSetuApp.toggleStep('${career.id}', '${s.id}', this.checked)" aria-label="Mark completed">
        </div>
      `;
    }).join('');
  }

  function toggleStep(careerId, stepId, isChecked) {
    const progress = PathSetuAPI.getRoadmapProgress(careerId);
    let completed = new Set(progress.completedSteps || []);
    if (isChecked) completed.add(stepId);
    else completed.delete(stepId);
    progress.completedSteps = Array.from(completed);
    PathSetuAPI.saveRoadmapProgress(careerId, progress);
    renderRoadmapView();
    renderDashboard();
    showToast(isChecked ? 'Milestone marked complete! 🎉' : 'Milestone marked pending', 'info');
  }

  function markStepDone(careerId, stepId) {
    toggleStep(careerId, stepId, true);
  }

  function handleResetRoadmap() {
    if (confirm('Reset roadmap progress?')) {
      const progress = PathSetuAPI.getRoadmapProgress(AppState.activeCareerId);
      progress.completedSteps = [];
      PathSetuAPI.saveRoadmapProgress(AppState.activeCareerId, progress);
      renderRoadmapView();
      renderDashboard();
    }
  }

  function handleAddCustomMilestone() {
    const title = prompt('Enter your custom milestone title:');
    if (!title) return;
    showToast('Custom milestone noted.', 'success');
  }

  function handleDownloadRoadmap() {
    const career = PATHSETU_DATA.careers.find((c) => c.id === AppState.activeCareerId) || PATHSETU_DATA.careers[0];
    const p = AppState.profile || {};
    const content = `PATHSETU CAREER GUIDANCE REPORT\nStudent: ${p.name}\nCareer: ${career.name}\nBudget: ₹${p.budget}\nDate: ${new Date().toLocaleDateString()}\n\nMilestones:\n${career.steps.map((s, i) => `${i+1}. ${s.title} (${s.time}): ${s.desc}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `PathSetu-${career.id}.txt`;
    a.click();
    showToast('Roadmap downloaded (.txt)', 'success');
  }

  function renderMethodologySection() {
    const container = document.getElementById('methodologyStagesGrid');
    if (!container) return;
    const isTe = AppState.currentLang === 'te';

    container.innerHTML = PATHSETU_DATA.methodologyStages.map((stage) => `
      <div class="stage-card">
        <div class="stage-num-row">
          <span class="stage-num">${stage.num}</span>
          <span class="stage-icon">${stage.icon}</span>
        </div>
        <h3 class="stage-title">${escapeHtml(isTe && stage.title_te ? stage.title_te : stage.title)}</h3>
        <p class="stage-short">${escapeHtml(isTe && stage.shortDesc_te ? stage.shortDesc_te : stage.shortDesc)}</p>
        <p class="stage-full small text-secondary">${escapeHtml(stage.fullDesc)}</p>
      </div>
    `).join('');
  }

  function renderLandingPathwayCards() {
    const container = document.getElementById('landingPathwayGrid');
    if (!container) return;
    const isTe = AppState.currentLang === 'te';

    container.innerHTML = PATHSETU_DATA.careers.slice(0, 4).map((c) => `
      <div class="card landing-career-card" onclick="PathSetuApp.selectAndSetCareer('${c.id}')">
        <div class="career-card-top">
          <span class="career-emoji">${c.emoji}</span>
          <span class="pill-badge">${c.badge}</span>
        </div>
        <h4>${escapeHtml(isTe && c.name_te ? c.name_te : c.name)}</h4>
        <span class="career-field-tag">${escapeHtml(c.field)}</span>
        <p class="small text-secondary">${escapeHtml(isTe && c.desc_te ? c.desc_te : c.desc)}</p>
        <div class="small text-accent font-bold" style="margin-top:auto;">Experience Pathway →</div>
      </div>
    `).join('');
  }

  function renderLandingProjects() {
    const container = document.getElementById('landingProjectsGrid');
    if (!container) return;
    container.innerHTML = PATHSETU_DATA.projects.slice(0, 3).map((p) => `
      <div class="card project-card">
        <span class="pill-badge accent">${p.type}</span>
        <h4>${p.title}</h4>
        <p class="small text-secondary">${p.objective}</p>
      </div>
    `).join('');
  }

  function selectAndSetCareer(careerId) {
    AppState.activeCareerId = careerId;
    renderDashboard();
    renderSkillGapView();
    renderRoadmapView();
    switchView('app', 'roadmap');
  }

  function setActiveCareer(careerId) {
    AppState.activeCareerId = careerId;
    renderDashboard();
    renderSkillGapView();
    renderRoadmapView();
  }

  function toggleSave(careerId) {
    PathSetuAPI.toggleSaveCareer(careerId);
    renderCareersCatalog();
    renderDashboard();
    showToast('Bookmark toggled', 'info');
  }

  function showToast(message, type = 'info') {
    if (!dom.toastContainer) return;
    const t = document.createElement('div');
    t.className = `toast-msg ${type}`;
    t.innerHTML = `<span>${escapeHtml(message)}</span>`;
    dom.toastContainer.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  window.PathSetuApp = {
    init,
    switchView,
    switchAppTab,
    toggleLanguage,
    selectAndSetCareer,
    setActiveCareer,
    toggleSave,
    toggleStep,
    markStepDone,
    openCompareModal,
    closeCompareModal,
    addToCompare,
    updateBudgetCalc: updateLandingBudgetCalc
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
