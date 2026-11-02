/**
 * HireSphere - Candidate Dashboard
 * Clean Production (No Demo Data)
 */

document.addEventListener('DOMContentLoaded', () => {
  initCandidateDashboard();

  window.addEventListener('hiresphere:applications-changed', () => {
    renderCandidateDashboard();
  });

  window.addEventListener('hiresphere:auth-changed', () => {
    initCandidateDashboard();
  });
});

function initCandidateDashboard() {
  const user = window.HireSphereStore.getCurrentUser();

  if (!user || user.role !== 'candidate') {
    renderCandidateAuthPrompt();
    return;
  }

  renderCandidateDashboard();
}

function renderCandidateAuthPrompt() {
  const container = document.getElementById('candidate-dashboard-content');
  if (!container) return;

  const user = window.HireSphereStore.getCurrentUser();

  container.innerHTML = `
    <div class="bg-white rounded-3xl p-10 text-center border border-slate-200 max-w-md mx-auto my-12 shadow-sm">
      <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i data-lucide="user" class="w-7 h-7"></i>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Candidate Portal</h3>
      <p class="text-xs text-slate-500 mt-2 leading-relaxed">
        ${user ? 'You are currently signed in as a Recruiter. Please sign in with a candidate account to view personal applications.' : 'Please sign in or create an account to view your candidate applications and track status updates.'}
      </p>
      <div class="mt-6 flex items-center justify-center gap-3">
        <button onclick="UI.openModal('login-modal')" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition">
          Sign In
        </button>
        <button onclick="UI.openModal('register-modal')" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition">
          Create Account
        </button>
      </div>
    </div>
  `;
  UI.refreshIcons();
}

function renderCandidateDashboard() {
  const user = window.HireSphereStore.getCurrentUser();
  if (!user) return;

  const greetingEl = document.getElementById('candidate-greeting-name');
  if (greetingEl) greetingEl.textContent = user.name;

  const profileNameEl = document.getElementById('sidebar-user-name');
  if (profileNameEl) profileNameEl.textContent = user.name;

  const profileEmailEl = document.getElementById('sidebar-user-email');
  if (profileEmailEl) profileEmailEl.textContent = user.email;

  const profileAvatarEl = document.getElementById('sidebar-user-avatar');
  if (profileAvatarEl) profileAvatarEl.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4F46E5&color=fff`;

  const myApplications = window.HireSphereStore.getApplicationsByCandidate(user.id);

  const totalApplied = myApplications.length;
  const shortlisted = myApplications.filter(a => a.status === 'Shortlisted').length;
  const inReview = myApplications.filter(a => a.status === 'Applied').length;
  const rejected = myApplications.filter(a => a.status === 'Rejected').length;

  const totalAppliedEl = document.getElementById('metric-total-applied');
  if (totalAppliedEl) totalAppliedEl.textContent = totalApplied;

  renderStatusDonutChart(totalApplied, shortlisted, inReview, rejected);
  renderApplicationsHistory(myApplications);
}

function renderStatusDonutChart(total, shortlisted, inReview, rejected) {
  const chartContainer = document.getElementById('donut-chart-container');
  if (!chartContainer) return;

  if (total === 0) {
    chartContainer.innerHTML = `
      <div class="text-center py-6 text-xs text-slate-400">
        No applications submitted yet.
      </div>
    `;
    return;
  }

  const shortlistedPct = Math.round((shortlisted / total) * 100);
  const inReviewPct = Math.round((inReview / total) * 100);
  const rejectedPct = Math.round((rejected / total) * 100);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const shortlistedStroke = (shortlisted / total) * circumference;
  const inReviewStroke = (inReview / total) * circumference;
  const rejectedStroke = (rejected / total) * circumference;

  chartContainer.innerHTML = `
    <div class="flex items-center gap-6 justify-center sm:justify-start">
      <div class="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
        <svg class="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="${radius}" fill="transparent" stroke="#F1F5F9" stroke-width="12"></circle>
          
          <circle 
            cx="50" 
            cy="50" 
            r="${radius}" 
            fill="transparent" 
            stroke="#4F46E5" 
            stroke-width="12" 
            stroke-dasharray="${shortlistedStroke} ${circumference}" 
            stroke-dashoffset="0"
            class="donut-segment"></circle>
          
          <circle 
            cx="50" 
            cy="50" 
            r="${radius}" 
            fill="transparent" 
            stroke="#F59E0B" 
            stroke-width="12" 
            stroke-dasharray="${inReviewStroke} ${circumference}" 
            stroke-dashoffset="-${shortlistedStroke}"
            class="donut-segment"></circle>

          <circle 
            cx="50" 
            cy="50" 
            r="${radius}" 
            fill="transparent" 
            stroke="#F43F5E" 
            stroke-width="12" 
            stroke-dasharray="${rejectedStroke} ${circumference}" 
            stroke-dashoffset="-${shortlistedStroke + inReviewStroke}"
            class="donut-segment"></circle>
        </svg>

        <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span class="text-lg font-black text-slate-800 leading-none">${total}</span>
          <span class="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Applied</span>
        </div>
      </div>

      <div class="space-y-2 text-xs font-semibold">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          <span class="text-slate-700">${shortlistedPct}% Shortlisted</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span class="text-slate-700">${inReviewPct}% In Review</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span class="text-slate-700">${rejectedPct}% Rejected</span>
        </div>
      </div>
    </div>
  `;
}

function renderApplicationsHistory(applications) {
  const container = document.getElementById('applications-history-container');
  if (!container) return;

  if (applications.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl p-10 text-center border border-slate-200">
        <div class="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <i data-lucide="file-question" class="w-6 h-6"></i>
        </div>
        <h4 class="text-sm font-bold text-slate-800">No applications submitted yet</h4>
        <p class="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Discover open roles and submit your application to track updates here.</p>
        <a href="jobs.html" class="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition">
          Browse Open Jobs
        </a>
      </div>
    `;
    UI.refreshIcons();
    return;
  }

  container.innerHTML = applications.map(app => {
    const job = app.job;

    return `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-200 hover:shadow-md transition gap-4">
        
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0 ${job.logoBg || 'bg-indigo-600'}">
            ${job.logoText || 'JB'}
          </div>

          <div>
            <h4 class="text-sm font-bold text-slate-900 hover:text-indigo-600 transition cursor-pointer" onclick="openJobDetailModal('${job.id}')">
              ${job.title}
            </h4>
            <p class="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 mt-0.5">
              <span class="font-semibold text-slate-700">${job.company}</span>
              <span>•</span>
              <span>${job.location}</span>
              <span>•</span>
              <span class="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600">${job.jobType || 'Full-Time'}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div class="text-left sm:text-right">
            <p class="text-[11px] text-slate-400 font-medium uppercase">Date Applied</p>
            <p class="text-xs font-bold text-slate-700 mt-0.5">${UI.formatDate(app.appliedAt)}</p>
          </div>

          <div class="flex items-center gap-3">
            ${UI.renderStatusBadge(app.status)}
            <button onclick="viewApplicationDetail('${app.id}')" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition" title="View Application Note">
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');

  UI.refreshIcons();
}

function viewApplicationDetail(appId) {
  const user = window.HireSphereStore.getCurrentUser();
  if (!user) return;

  const applications = window.HireSphereStore.getApplicationsByCandidate(user.id);
  const app = applications.find(a => a.id === appId);
  if (!app) return;

  const modal = document.getElementById('application-detail-modal-body');
  if (!modal) return;

  modal.innerHTML = `
    <div class="flex items-start justify-between pb-4 border-b border-slate-100">
      <div>
        <h3 class="text-lg font-bold text-slate-900">${app.job.title}</h3>
        <p class="text-xs text-slate-500">${app.job.company} • ${app.job.location}</p>
      </div>
      <div>
        ${UI.renderStatusBadge(app.status)}
      </div>
    </div>

    <div class="space-y-4 my-5 text-xs">
      <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
        <span class="font-bold text-slate-500 uppercase tracking-wider block mb-1">Application Date</span>
        <span class="text-slate-800 font-medium">${UI.formatDate(app.appliedAt)}</span>
      </div>

      <div>
        <span class="font-bold text-slate-700 uppercase tracking-wider block mb-1">Your Cover Note to Recruiter</span>
        <p class="text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed italic">
          "${app.coverNote || 'No cover note provided.'}"
        </p>
      </div>

      <div class="bg-indigo-50/60 border border-indigo-100 p-4 rounded-2xl">
        <h5 class="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
          <i data-lucide="info" class="w-4 h-4 text-indigo-600"></i> Status Info
        </h5>
        <p class="text-indigo-700 leading-relaxed text-[11px]">
          ${app.status === 'Shortlisted' 
            ? 'Your application has been shortlisted! The recruiter may contact you via email regarding the next steps.' 
            : app.status === 'Rejected' 
            ? 'The recruitment team decided not to proceed with this application. You can explore more open opportunities on the portal.' 
            : 'Your application is currently in review by the recruiter.'}
        </p>
      </div>
    </div>
  `;

  UI.openModal('application-detail-modal');
  UI.refreshIcons();
}

function openJobDetailModal(jobId) {
  window.location.href = `jobs.html?jobId=${jobId}`;
}
