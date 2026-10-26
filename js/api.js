/**
 * PathSetu API Client
 * Seamlessly interfaces with Python FastAPI backend (/api/*) when online,
 * with deterministic client-side calculation and localStorage fallback when offline.
 */

const PathSetuAPI = (function () {
  'use strict';

  let backendAvailable = false;
  const API_BASE = '/api';

  // Check backend health
  async function checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        backendAvailable = true;
      } else {
        backendAvailable = false;
      }
    } catch (err) {
      backendAvailable = false;
    }
    window.dispatchEvent(
      new CustomEvent('pathsetu:backend-status', {
        detail: { online: backendAvailable }
      })
    );
    return backendAvailable;
  }

  // Profile persistence
  async function getProfile() {
    if (backendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/profile`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.profile) return data.profile;
        }
      } catch (e) {
        console.warn('API error, falling back to local storage', e);
      }
    }
    const local = localStorage.getItem('pathsetu_student_profile');
    return local ? JSON.parse(local) : null;
  }

  async function saveProfile(profile) {
    localStorage.setItem('pathsetu_student_profile', JSON.stringify(profile));
    if (backendAvailable) {
      try {
        await fetch(`${API_BASE}/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        });
      } catch (e) {
        console.warn('Backend sync failed, saved locally', e);
      }
    }
    return profile;
  }

  // Career discovery
  async function getCareers(filters = {}) {
    if (backendAvailable) {
      try {
        const params = new URLSearchParams(filters);
        const res = await fetch(`${API_BASE}/careers?${params.toString()}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Failed fetching careers from API, using local dataset', e);
      }
    }

    let careers = [...PATHSETU_DATA.careers];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      careers = careers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          c.field.toLowerCase().includes(q) ||
          c.requiredSkills.some((s) => s.name.toLowerCase().includes(q))
      );
    }
    if (filters.field && filters.field !== 'all') {
      careers = careers.filter((c) => c.field.toLowerCase().includes(filters.field.toLowerCase()));
    }
    return careers;
  }

  // Transparent AI Analysis / Recommendation Engine
  async function analyzeProfile(profile) {
    if (!profile) return [];

    if (backendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('API analysis failed, using deterministic local engine', e);
      }
    }

    // Deterministic Rule-Based Scoring Engine
    // Transparently evaluates:
    // 1. Interest overlap (up to 40 pts)
    // 2. Existing skill overlap (up to 35 pts)
    // 3. Workstyle/Priority synergy (up to 25 pts)
    const results = PATHSETU_DATA.careers.map((career) => {
      let interestScore = 0;
      let matchedInterests = [];
      if (profile.interests && Array.isArray(profile.interests)) {
        profile.interests.forEach((userInt) => {
          if (career.targetInterests.includes(userInt)) {
            interestScore += 10;
            matchedInterests.push(userInt);
          }
        });
      }
      interestScore = Math.min(interestScore, 40);

      let skillScore = 0;
      let readySkills = [];
      let userSkills = profile.skills || [];
      career.requiredSkills.forEach((req) => {
        const hasSkill = userSkills.some(
          (us) =>
            req.name.toLowerCase().includes(us.toLowerCase()) ||
            us.toLowerCase().includes(req.name.toLowerCase())
        );
        if (hasSkill) {
          skillScore += 10;
          readySkills.push(req.name);
        }
      });
      skillScore = Math.min(skillScore, 35);

      // Workstyle and priority bonus
      let synergyScore = 15; // base baseline
      if (profile.priority === 'interest' && interestScore >= 20) synergyScore += 10;
      if (profile.priority === 'stability' && (career.id === 'software' || career.id === 'cloud-devops' || career.id === 'healthcare')) synergyScore += 10;
      if (profile.priority === 'creativity' && (career.id === 'design' || career.id === 'product-marketing')) synergyScore += 10;
      if (profile.priority === 'impact' && (career.id === 'healthcare' || career.id === 'educator')) synergyScore += 10;

      const totalScore = Math.min(Math.round(interestScore + skillScore + synergyScore), 98);

      return {
        careerId: career.id,
        careerName: career.name,
        matchPercentage: Math.max(totalScore, 42),
        breakdown: {
          interestPoints: interestScore,
          skillPoints: skillScore,
          synergyPoints: synergyScore
        },
        matchedInterests,
        readySkills,
        rationale: `Matched ${matchedInterests.length} core interest(s) and ${readySkills.length} prerequisite skill(s). Fits your priority for ${profile.priority || 'career growth'}.`
      };
    });

    results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    return results;
  }

  // Skill-Gap Matrix
  function computeSkillGap(profile, careerId) {
    const career = PATHSETU_DATA.careers.find((c) => c.id === careerId);
    if (!career) return null;

    const userSkills = (profile && profile.skills) ? profile.skills : [];
    const ready = [];
    const inProgress = [];
    const missing = [];

    career.requiredSkills.forEach((req) => {
      const match = userSkills.some(
        (us) =>
          req.name.toLowerCase().includes(us.toLowerCase()) ||
          us.toLowerCase().includes(req.name.toLowerCase())
      );
      if (match) {
        ready.push(req);
      } else if (req.priority >= 3) {
        inProgress.push(req);
      } else {
        missing.push(req);
      }
    });

    const totalReq = career.requiredSkills.length;
    const readinessPct = totalReq ? Math.round(((ready.length + inProgress.length * 0.4) / totalReq) * 100) : 0;

    // Manageable next 3 skills to focus on
    const priorityNext = missing.slice(0, 3);

    return {
      careerId: career.id,
      careerName: career.name,
      readinessPercentage: Math.min(Math.max(readinessPct, 25), 95),
      ready,
      inProgress,
      missing,
      priorityNext,
      isDemoData: true
    };
  }

  // Roadmap & Milestones
  function getRoadmapProgress(careerId) {
    const store = localStorage.getItem(`pathsetu_roadmap_${careerId}`);
    return store ? JSON.parse(store) : { completedSteps: [], customSteps: [] };
  }

  function saveRoadmapProgress(careerId, progress) {
    localStorage.setItem(`pathsetu_roadmap_${careerId}`, JSON.stringify(progress));
    return progress;
  }

  // Saved / Bookmarked Careers
  function getSavedCareers() {
    const list = localStorage.getItem('pathsetu_saved_careers');
    return list ? JSON.parse(list) : ['software', 'design'];
  }

  function toggleSaveCareer(careerId) {
    let saved = getSavedCareers();
    if (saved.includes(careerId)) {
      saved = saved.filter((id) => id !== careerId);
    } else {
      saved.push(careerId);
    }
    localStorage.setItem('pathsetu_saved_careers', JSON.stringify(saved));
    return saved;
  }

  return {
    checkHealth,
    getProfile,
    saveProfile,
    getCareers,
    analyzeProfile,
    computeSkillGap,
    getRoadmapProgress,
    saveRoadmapProgress,
    getSavedCareers,
    toggleSaveCareer,
    isBackendOnline: () => backendAvailable
  };
})();
