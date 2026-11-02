/**
 * HireSphere - Job Search, Filters, Detail Modal & Application Flow
 * Clean Production (No Demo Data)
 */

let currentJobs = [];
let selectedJobId = null;

document.addEventListener('DOMContentLoaded', () => {
  initJobsPage();
});

function initJobsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q') || '';
  const locParam = urlParams.get('loc') || '';
  const jobIdParam = urlParams.get('jobId') || '';

  const searchInput = document.getElementById('search-job-input');
  if (searchInput && qParam) searchInput.value = qParam;

  const locInput = document.getElementById('filter-location-input');
  if (locInput && locParam) locInput.value = locParam;

  bindFilterEvents();
  applyFilters();

  if (jobIdParam) {
    setTimeout(() => {
      openJobDetail(jobIdParam);
    }, 250);
  }
}

function bindFilterEvents() {
  const searchInput = document.getElementById('search-job-input');
  const searchBtn = document.getElementById('search-job-btn');

  if (searchInput) {
    searchInput.addEventListener('input', () => applyFilters());
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applyFilters();
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => applyFilters());
  }

  const locInput = document.getElementById('filter-location-input');
  if (locInput) {
    locInput.addEventListener('input', () => applyFilters());
  }

  const salaryRange = document.getElementById('salary-range');
  const salaryDisplay = document.getElementById('salary-display');

  if (salaryRange && salaryDisplay) {
    salaryRange.addEventListener('input', (e) => {
      salaryDisplay.textContent = `$${parseInt(e.target.value).toLocaleString()}`;
      applyFilters();
    });
  }

  document.querySelectorAll('.filter-checkbox').forEach(cb => {
    cb.addEventListener('change', () => applyFilters());
  });

  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (locInput) locInput.value = '';
      if (salaryRange) {
        salaryRange.value = 1000;
        salaryDisplay.textContent = '$1,000';
      }
      document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
      applyFilters();
      UI.toast('All filters reset', 'info');
    });
  }
}

function applyFilters() {
  const allJobs = window.HireSphereStore.getJobs().filter(j => j.isActive);
  const searchVal = document.getElementById('search-job-input')?.value.toLowerCase().trim() || '';
  const locVal = document.getElementById('filter-location-input')?.value.toLowerCase().trim() || '';
  const minSalary = parseInt(document.getElementById('salary-range')?.value || 0);

  const checkedTypes = Array.from(document.querySelectorAll('input[name="job-type"]:checked')).map(cb => cb.value);
  const checkedExp = Array.from(document.querySelectorAll('input[name="exp-level"]:checked')).map(cb => cb.value);
  const checkedModes = Array.from(document.querySelectorAll('input[name="work-mode"]:checked')).map(cb => cb.value);

  const filtered = allJobs.filter(job => {
    if (searchVal) {
      const matchTitle = (job.title || '').toLowerCase().includes(searchVal);
      const matchComp = (job.company || '').toLowerCase().includes(searchVal);
      const matchCat = (job.category || '').toLowerCase().includes(searchVal);
      const matchDesc = (job.description || '').toLowerCase().includes(searchVal);
      if (!matchTitle && !matchComp && !matchCat && !matchDesc) return false;
    }

    if (locVal) {
      if (!(job.location || '').toLowerCase().includes(locVal)) return false;
    }

    if (minSalary > 1000 && job.salaryMax && job.salaryMax < minSalary) {
      return false;
    }

    if (checkedTypes.length > 0) {
      const hasType = checkedTypes.some(type => {
        if (type === 'Urgent') return job.isUrgent;
        if (type === 'Remote') return job.workMode === 'Remote' || (job.location || '').toLowerCase().includes('remote');
        return job.jobType === type;
      });
      if (!hasType) return false;
    }

    if (checkedExp.length > 0) {
      if (!checkedExp.includes(job.experienceLevel)) return false;
    }

    if (checkedModes.length > 0) {
      if (!checkedModes.includes(job.workMode)) return false;
    }

    return true;
  });

  currentJobs = filtered;
  renderJobsFeed(filtered);
  renderSuggestedJobs(allJobs);
}

function renderJobsFeed(jobs) {
  const container = document.getElementById('jobs-feed-container');
  const countDisplay = document.getElementById('jobs-count-display');

  if (countDisplay) {
    countDisplay.textContent = `Showing ${jobs.length} jobs available`;
  }

  if (!container) return;

  if (jobs.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <div class="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <i data-lucide="search-x" class="w-8 h-8"></i>
        </div>
        <h4 class="text-lg font-bold text-slate-800">No jobs found</h4>
        <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">There are currently no job postings matching your selection. Recruiters can post new opportunities from the recruiter portal.</p>
        <div class="mt-5 flex items-center justify-center gap-3">
          <button onclick="document.getElementById('clear-filters-btn').click()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">
            Reset Filters
          </button>
          <a href="recruiter-dashboard.html" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition">
            Post a Job
          </a>
        </div>
      </div>
    `;
    UI.refreshIcons();
    return;
  }

  const currentUser = window.HireSphereStore.getCurrentUser();

  container.innerHTML = jobs.map(job => {
    const hasApplied = currentUser ? window.HireSphereStore.hasCandidateApplied(job.id, currentUser.id) : false;
    const applicantsCount = window.HireSphereStore.getApplicationsByJob(job.id).length;

    return `
      <div class="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-200 group">
        
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0 ${job.logoBg || 'bg-indigo-600'}">
              ${job.logoText || 'JB'}
            </div>

            <div>
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h3 class="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition cursor-pointer" onclick="openJobDetail('${job.id}')">
                  ${job.title}
                </h3>
                ${job.isUrgent ? `
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Urgent
                  </span>
                ` : ''}
              </div>
              <p class="text-xs font-semibold text-slate-500">
                ${job.company}
              </p>
            </div>
          </div>

          <button onclick="openJobDetail('${job.id}')" class="text-slate-400 hover:text-indigo-600 p-1.5 rounded-xl hover:bg-slate-50 transition">
            <i data-lucide="more-vertical" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-4 text-xs text-slate-500 my-4 py-2 border-y border-slate-100">
          <span class="flex items-center gap-1.5 font-medium">
            <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i> ${job.jobType || 'Full-Time'}
          </span>
          <span class="flex items-center gap-1.5 font-medium">
            <i data-lucide="briefcase" class="w-3.5 h-3.5 text-slate-400"></i> ${job.experienceLevel || 'Intermediate'}
          </span>
          <span class="flex items-center gap-1.5 font-medium">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i> ${job.location || 'Remote'}
          </span>
          <span class="flex items-center gap-1.5 font-medium text-slate-400 ml-auto">
            ${UI.timeAgo(job.createdAt)}
          </span>
        </div>

        <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-5">
          ${job.description || ''}
        </p>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div class="flex items-center gap-4">
            <span class="font-bold text-slate-900 text-sm flex items-center gap-1">
              <span class="text-emerald-600">$</span> ${job.salaryText || 'Competitive'}
            </span>
            <span class="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full">
              <i data-lucide="users" class="w-3 h-3 text-slate-400"></i> ${applicantsCount} Applied
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="openJobDetail('${job.id}')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs rounded-xl transition">
              Details
            </button>
            
            ${hasApplied ? `
              <button disabled class="px-5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-default">
                <i data-lucide="check" class="w-3.5 h-3.5"></i> Applied
              </button>
            ` : `
              <button onclick="openJobDetail('${job.id}', true)" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition hover:scale-105">
                Apply Now
              </button>
            `}
          </div>
        </div>

      </div>
    `;
  }).join('');

  UI.refreshIcons();
}

function renderSuggestedJobs(jobs) {
  const container = document.getElementById('suggested-jobs-container');
  if (!container) return;

  const suggestions = jobs.slice(0, 4);

  if (suggestions.length === 0) {
    container.innerHTML = `
      <div class="py-4 text-center text-xs text-slate-400">
        No suggested jobs currently available.
      </div>
    `;
    return;
  }

  container.innerHTML = suggestions.map(job => `
    <div onclick="openJobDetail('${job.id}')" class="cursor-pointer p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition group">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs ${job.logoBg || 'bg-indigo-600'}">
            ${job.logoText || 'JB'}
          </div>
          <div>
            <h5 class="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">${job.company}</h5>
            <p class="text-[11px] text-slate-400">${job.location}</p>
          </div>
        </div>
        <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition"></i>
      </div>

      <h4 class="text-xs font-bold text-slate-800 line-clamp-1 mb-1">${job.title}</h4>
      <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>${job.salaryText || 'Competitive'}</span>
        <span class="text-indigo-600 font-semibold">${job.jobType || 'Full-Time'}</span>
      </div>
    </div>
  `).join('');

  UI.refreshIcons();
}

function openJobDetail(jobId, directToApply = false) {
  const job = window.HireSphereStore.getJobById(jobId);
  if (!job) return;

  selectedJobId = jobId;
  const currentUser = window.HireSphereStore.getCurrentUser();
  const hasApplied = currentUser ? window.HireSphereStore.hasCandidateApplied(job.id, currentUser.id) : false;
  const applicants = window.HireSphereStore.getApplicationsByJob(job.id);

  const modalContainer = document.getElementById('job-detail-modal-body');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="flex items-start justify-between gap-4 pb-6 border-b border-slate-100">
      <div class="flex items-start gap-4">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md ${job.logoBg || 'bg-indigo-600'}">
          ${job.logoText || 'JB'}
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h2 class="text-xl font-bold text-slate-900">${job.title}</h2>
            ${job.isUrgent ? `<span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">Urgent</span>` : ''}
          </div>
          <p class="text-sm font-semibold text-slate-600 mt-0.5">${job.company} • <span class="font-normal text-slate-500">${job.location} (${job.workMode || 'Standard'})</span></p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
      <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <p class="text-[11px] text-slate-400 uppercase font-semibold">Compensation</p>
        <p class="text-sm font-bold text-slate-800 mt-0.5">${job.salaryText || 'Competitive'}</p>
      </div>
      <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <p class="text-[11px] text-slate-400 uppercase font-semibold">Job Type</p>
        <p class="text-sm font-bold text-slate-800 mt-0.5">${job.jobType || 'Full-Time'}</p>
      </div>
      <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <p class="text-[11px] text-slate-400 uppercase font-semibold">Experience</p>
        <p class="text-sm font-bold text-slate-800 mt-0.5">${job.experienceLevel || 'Intermediate'}</p>
      </div>
      <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <p class="text-[11px] text-slate-400 uppercase font-semibold">Applicants</p>
        <p class="text-sm font-bold text-slate-800 mt-0.5">${applicants.length} candidates</p>
      </div>
    </div>

    <div class="space-y-4 mb-6">
      <div>
        <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">About the Role</h4>
        <p class="text-sm text-slate-600 leading-relaxed">${job.description || 'No description provided.'}</p>
      </div>

      <div>
        <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Key Requirements & Skills</h4>
        <p class="text-sm text-slate-600 leading-relaxed">${job.requirements || 'Requirements not specified.'}</p>
      </div>
    </div>

    <div class="pt-6 border-t border-slate-200">
      ${hasApplied ? `
        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <i data-lucide="check-circle" class="w-5 h-5"></i>
            </div>
            <div>
              <h5 class="text-sm font-bold text-emerald-900">Application Submitted</h5>
              <p class="text-xs text-emerald-700">You have already submitted an application for this position.</p>
            </div>
          </div>
          <a href="candidate-dashboard.html" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
            View in Dashboard
          </a>
        </div>
      ` : `
        <div id="apply-form-container">
          <h4 class="text-base font-bold text-slate-900 mb-2">Apply for this Position</h4>
          <p class="text-xs text-slate-500 mb-4">Submit your application directly to ${job.company}.</p>

          <form id="submit-application-form" class="space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <input 
                  type="text" 
                  id="app-candidate-name" 
                  required 
                  value="${currentUser ? currentUser.name : ''}" 
                  placeholder="Full name"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  id="app-candidate-email" 
                  required 
                  value="${currentUser ? currentUser.email : ''}" 
                  placeholder="you@example.com"
                  class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Cover Note or Message *</label>
              <textarea 
                id="app-candidate-note" 
                rows="3" 
                required 
                placeholder="Share your background and why you are interested in this position..."
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"></textarea>
            </div>

            <button 
              type="submit" 
              class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/30 transition hover:scale-[1.01] flex items-center justify-center gap-2">
              <i data-lucide="send" class="w-4 h-4"></i> Submit Application
            </button>
          </form>
        </div>
      `}
    </div>
  `;

  UI.openModal('job-detail-modal');

  const form = document.getElementById('submit-application-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleApplicationSubmit(job);
    });
  }
}

function handleApplicationSubmit(job) {
  let currentUser = window.HireSphereStore.getCurrentUser();

  const name = document.getElementById('app-candidate-name')?.value.trim();
  const email = document.getElementById('app-candidate-email')?.value.trim();
  const note = document.getElementById('app-candidate-note')?.value.trim();

  if (!name || !email || !note) {
    UI.toast('Please provide your name, email, and cover note.', 'error');
    return;
  }

  if (!currentUser) {
    // If not logged in, register candidate
    const existing = window.HireSphereStore.getUserByEmail(email);
    if (existing) {
      currentUser = existing;
    } else {
      currentUser = window.HireSphereStore.createUser({
        name,
        email,
        role: 'candidate',
        title: 'Candidate'
      });
    }
    window.HireSphereStore.setCurrentUser(currentUser);
  }

  try {
    window.HireSphereStore.applyToJob({
      jobId: job.id,
      candidateId: currentUser.id,
      candidateName: name,
      candidateEmail: email,
      candidatePhone: currentUser.phone || '',
      candidateTitle: currentUser.title || 'Applicant',
      candidateAvatar: currentUser.avatar,
      coverNote: note,
      status: 'Applied'
    });

    UI.toast(`Application sent to ${job.company}!`, 'success');
    UI.closeModal('job-detail-modal');
    applyFilters();
  } catch (err) {
    UI.toast(err.message, 'warning');
  }
}
