/**
 * HireSphere - Recruiter Dashboard & Applicant Management
 * Clean Production (No Demo Data)
 */

document.addEventListener('DOMContentLoaded', () => {
  initRecruiterDashboard();

  window.addEventListener('hiresphere:jobs-changed', () => {
    renderRecruiterDashboard();
  });

  window.addEventListener('hiresphere:applications-changed', () => {
    renderRecruiterDashboard();
  });

  window.addEventListener('hiresphere:auth-changed', () => {
    initRecruiterDashboard();
  });
});

function initRecruiterDashboard() {
  const user = window.HireSphereStore.getCurrentUser();

  if (!user || user.role !== 'recruiter') {
    renderRecruiterAuthPrompt();
    return;
  }

  renderRecruiterDashboard();
  bindPostJobForm();
}

function renderRecruiterAuthPrompt() {
  const container = document.getElementById('recruiter-dashboard-content');
  if (!container) return;

  const user = window.HireSphereStore.getCurrentUser();

  container.innerHTML = `
    <div class="bg-white rounded-3xl p-10 text-center border border-slate-200 max-w-md mx-auto my-12 shadow-sm">
      <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i data-lucide="briefcase" class="w-7 h-7"></i>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Recruiter Portal</h3>
      <p class="text-xs text-slate-500 mt-2 leading-relaxed">
        ${user ? 'You are currently signed in as a Candidate. Please sign in with a recruiter account to post jobs and review applicants.' : 'Please sign in or create an account as a recruiter to publish jobs and manage applications.'}
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

function renderRecruiterDashboard() {
  const user = window.HireSphereStore.getCurrentUser();
  if (!user) return;

  const nameEl = document.getElementById('recruiter-name-display');
  if (nameEl) nameEl.textContent = user.name;

  const avatarEl = document.getElementById('recruiter-avatar-display');
  if (avatarEl) avatarEl.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4F46E5&color=fff`;

  const allJobs = window.HireSphereStore.getJobs();
  // Filter jobs posted by this recruiter (or all jobs if user is admin)
  const myJobs = allJobs.filter(j => !j.recruiterId || j.recruiterId === user.id);
  const myJobIds = myJobs.map(j => j.id);

  const allApps = window.HireSphereStore.getApplications();
  const myApps = allApps.filter(a => myJobIds.includes(a.jobId));

  const totalJobs = myJobs.length;
  const totalApps = myApps.length;
  const totalShortlisted = myApps.filter(a => a.status === 'Shortlisted').length;
  const totalInReview = myApps.filter(a => a.status === 'Applied').length;

  const statJobsEl = document.getElementById('stat-jobs-posted');
  if (statJobsEl) statJobsEl.textContent = totalJobs;

  const statShortlistedEl = document.getElementById('stat-shortlisted');
  if (statShortlistedEl) statShortlistedEl.textContent = totalShortlisted;

  const statInReviewEl = document.getElementById('stat-in-review');
  if (statInReviewEl) statInReviewEl.textContent = totalInReview;

  const statCandidatesEl = document.getElementById('stat-total-candidates');
  if (statCandidatesEl) statCandidatesEl.textContent = totalApps;

  renderRecruiterJobsTable(myJobs, myApps);
  renderRecentApplicantsFeed(myApps);
}

function renderRecruiterJobsTable(jobs, applications) {
  const container = document.getElementById('recruiter-jobs-table-body');
  if (!container) return;

  if (jobs.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="5" class="py-12 text-center text-xs text-slate-400">
          <div class="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <i data-lucide="file-plus-2" class="w-6 h-6"></i>
          </div>
          <p class="font-bold text-slate-700 text-sm">No job postings created yet</p>
          <p class="text-slate-400 text-xs mt-1">Click "+ Post a Job" above to create and publish your first opening.</p>
        </td>
      </tr>
    `;
    UI.refreshIcons();
    return;
  }

  container.innerHTML = jobs.map(job => {
    const jobApps = applications.filter(a => a.jobId === job.id);
    const newApps = jobApps.filter(a => a.status === 'Applied').length;
    const shortlistedApps = jobApps.filter(a => a.status === 'Shortlisted').length;
    const rejectedApps = jobApps.filter(a => a.status === 'Rejected').length;

    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50/60 transition group">
        
        <td class="py-4 pl-4 pr-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs ${job.logoBg || 'bg-indigo-600'}">
              ${job.logoText || 'JB'}
            </div>
            <div>
              <p class="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center gap-2">
                ${job.title}
                ${job.isUrgent ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600">Urgent</span>` : ''}
              </p>
              <p class="text-[11px] text-slate-400 mt-0.5">
                Created: ${UI.formatDate(job.createdAt)} • Deadline: ${UI.formatDate(job.deadline)}
              </p>
            </div>
          </div>
        </td>

        <td class="py-4 px-3 text-xs text-slate-600 font-medium">
          <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
            ${job.category || 'General'}
          </span>
        </td>

        <td class="py-4 px-3">
          <div class="flex items-center gap-2 text-xs">
            <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold" title="Total Applicants">
              ${jobApps.length}
            </span>
            <span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold" title="In Review">
              ${newApps} review
            </span>
            <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold" title="Shortlisted">
              ${shortlistedApps} short
            </span>
            <span class="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold" title="Rejected">
              ${rejectedApps} rej
            </span>
          </div>
        </td>

        <td class="py-4 px-3 text-right">
          <button 
            onclick="openApplicantsReviewModal('${job.id}')" 
            class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 inline-flex shadow-sm">
            <i data-lucide="users" class="w-3.5 h-3.5"></i>
            <span>View Applicants (${jobApps.length})</span>
          </button>
        </td>

        <td class="py-4 pr-4 pl-2 text-right">
          <button onclick="deleteJobPosting('${job.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Delete Job Opening">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>

      </tr>
    `;
  }).join('');

  UI.refreshIcons();
}

function renderRecentApplicantsFeed(applications) {
  const container = document.getElementById('recent-activity-container');
  if (!container) return;

  if (applications.length === 0) {
    container.innerHTML = `
      <div class="py-6 text-center text-xs text-slate-400">
        No applicants received yet.
      </div>
    `;
    return;
  }

  const recentApps = applications.slice(0, 5);

  container.innerHTML = recentApps.map(app => `
    <div class="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/60 transition">
      <div class="flex items-center gap-3 min-w-0">
        <img 
          src="${app.candidateAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidateName)}&background=4F46E5&color=fff`}" 
          alt="${app.candidateName}" 
          class="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
        />
        <div class="truncate">
          <h5 class="text-xs font-bold text-slate-900 truncate">${app.candidateName}</h5>
          <p class="text-[11px] text-slate-500 truncate">${app.candidateEmail}</p>
        </div>
      </div>

      <div class="flex items-center gap-1.5 flex-shrink-0">
        ${UI.renderStatusBadge(app.status)}
      </div>
    </div>
  `).join('');

  UI.refreshIcons();
}

function openApplicantsReviewModal(jobId) {
  const job = window.HireSphereStore.getJobById(jobId);
  if (!job) return;

  const applicants = window.HireSphereStore.getApplicationsByJob(jobId);
  const container = document.getElementById('applicant-review-modal-body');
  if (!container) return;

  container.innerHTML = `
    <div class="pb-4 border-b border-slate-100 flex items-start justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>Applicants for: ${job.title}</span>
          <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">${applicants.length} Total</span>
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">${job.company} • ${job.location} • ${job.jobType}</p>
      </div>
    </div>

    <div class="my-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
      ${applicants.length === 0 ? `
        <div class="text-center py-8 text-xs text-slate-400">
          No candidates have applied for this position yet.
        </div>
      ` : applicants.map(app => `
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 hover:border-indigo-200 transition space-y-3">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <img 
                src="${app.candidateAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidateName)}&background=4F46E5&color=fff`}" 
                alt="${app.candidateName}" 
                class="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm"
              />
              <div>
                <h4 class="text-sm font-bold text-slate-900">${app.candidateName}</h4>
                <p class="text-xs text-slate-500 flex items-center gap-2">
                  <span>${app.candidateEmail}</span>
                  ${app.candidatePhone ? `<span>•</span><span>${app.candidatePhone}</span>` : ''}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-[11px] font-bold text-slate-400 uppercase">Status:</span>
              ${UI.renderStatusBadge(app.status)}
            </div>
          </div>

          <div class="bg-white p-3 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed italic">
            "${app.coverNote || 'No cover note submitted.'}"
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
            <span class="text-[11px] text-slate-400">Applied: ${UI.formatDate(app.appliedAt)}</span>

            <div class="flex items-center gap-2">
              <button 
                onclick="updateCandidateStatus('${app.id}', '${job.id}', 'Shortlisted')" 
                class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1">
                <i data-lucide="check" class="w-3.5 h-3.5"></i> Shortlist
              </button>

              <button 
                onclick="updateCandidateStatus('${app.id}', '${job.id}', 'Rejected')" 
                class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center gap-1">
                <i data-lucide="x" class="w-3.5 h-3.5"></i> Reject
              </button>

              <button 
                onclick="updateCandidateStatus('${app.id}', '${job.id}', 'Applied')" 
                class="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold rounded-xl hover:bg-slate-200/50 transition" 
                title="Reset to In Review">
                Reset
              </button>
            </div>
          </div>

        </div>
      `).join('')}
    </div>
  `;

  UI.openModal('applicant-review-modal');
  UI.refreshIcons();
}

function updateCandidateStatus(appId, jobId, newStatus) {
  try {
    window.HireSphereStore.updateApplicationStatus(appId, newStatus);
    UI.toast(`Application status updated to: ${newStatus}`, 'success');
    openApplicantsReviewModal(jobId);
    renderRecruiterDashboard();
  } catch (err) {
    UI.toast(err.message, 'error');
  }
}

function deleteJobPosting(jobId) {
  if (confirm('Are you sure you want to delete this job posting? This will also remove any candidate applications for this position.')) {
    window.HireSphereStore.deleteJob(jobId);
    UI.toast('Job posting deleted.', 'info');
    renderRecruiterDashboard();
  }
}

function bindPostJobForm() {
  const form = document.getElementById('post-job-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('job-form-title')?.value.trim();
    const company = document.getElementById('job-form-company')?.value.trim();
    const location = document.getElementById('job-form-location')?.value.trim();
    const jobType = document.getElementById('job-form-type')?.value;
    const workMode = document.getElementById('job-form-mode')?.value;
    const category = document.getElementById('job-form-category')?.value;
    const salary = document.getElementById('job-form-salary')?.value.trim();
    const exp = document.getElementById('job-form-experience')?.value;
    const description = document.getElementById('job-form-description')?.value.trim();
    const requirements = document.getElementById('job-form-requirements')?.value.trim();
    const deadline = document.getElementById('job-form-deadline')?.value;
    const isUrgent = document.getElementById('job-form-urgent')?.checked;

    if (!title || !company || !location || !description || !requirements) {
      UI.toast('Please fill in all required fields.', 'error');
      return;
    }

    const user = window.HireSphereStore.getCurrentUser();

    window.HireSphereStore.createJob({
      recruiterId: user ? user.id : 'user-recruiter',
      title,
      company,
      location,
      jobType,
      workMode,
      category,
      salaryText: salary || 'Competitive',
      salaryMin: 2000,
      salaryMax: 6000,
      experienceLevel: exp,
      description,
      requirements,
      deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      isUrgent: !!isUrgent,
      isFeatured: true
    });

    UI.toast('Job opening successfully published!', 'success');
    UI.closeModal('post-job-modal');
    form.reset();
    renderRecruiterDashboard();
  });
}
