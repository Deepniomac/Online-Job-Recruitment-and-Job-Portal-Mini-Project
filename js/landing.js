/**
 * HireSphere - Landing Page Interactivity
 * Clean Production (No Demo Data)
 */

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedJobs();
  renderLatestJobs();
  bindSearchEvents();
});

function bindSearchEvents() {
  const searchForm = document.getElementById('hero-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const keyword = document.getElementById('hero-keyword-input')?.value.trim() || '';
      const location = document.getElementById('hero-location-select')?.value.trim() || '';
      
      const params = new URLSearchParams();
      if (keyword) params.set('q', keyword);
      if (location) params.set('loc', location);

      window.location.href = `jobs.html?${params.toString()}`;
    });
  }
}

function searchByTag(tag) {
  window.location.href = `jobs.html?q=${encodeURIComponent(tag)}`;
}

function searchByCategory(category) {
  window.location.href = `jobs.html?category=${encodeURIComponent(category)}`;
}

function renderFeaturedJobs() {
  const container = document.getElementById('featured-jobs-grid');
  if (!container) return;

  const allJobs = window.HireSphereStore.getJobs().filter(j => j.isActive);
  const featured = allJobs.filter(j => j.isFeatured);
  const jobsToShow = featured.length > 0 ? featured.slice(0, 4) : allJobs.slice(0, 4);

  if (jobsToShow.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 px-6 text-center bg-slate-50/80 rounded-3xl border border-dashed border-slate-300">
        <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <i data-lucide="briefcase" class="w-6 h-6"></i>
        </div>
        <h4 class="text-sm font-bold text-slate-800">No job openings posted yet</h4>
        <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Recruiters can publish new job opportunities to start receiving applications.</p>
        <a href="recruiter-dashboard.html" class="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-indigo-700 transition">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i> Post a Job
        </a>
      </div>
    `;
    UI.refreshIcons();
    return;
  }

  container.innerHTML = jobsToShow.map(job => `
    <div class="bg-white rounded-2xl p-5 border border-slate-200 card-hover-lift flex flex-col justify-between group transition">
      <div>
        <div class="flex items-start justify-between mb-3">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm ${job.logoBg || 'bg-indigo-600'}">
            ${job.logoText || 'JB'}
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
            ${job.jobType || 'Full-Time'}
          </span>
        </div>

        <h4 class="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition mb-1 line-clamp-1">${job.title}</h4>
        <p class="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <span class="font-semibold text-slate-700">${job.company}</span> • <span>${job.location}</span>
        </p>

        <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          ${job.description}
        </p>
      </div>

      <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div class="flex flex-wrap gap-1.5">
          <span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">${job.category || 'General'}</span>
          ${job.isUrgent ? `<span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Urgent</span>` : ''}
        </div>
        <a href="jobs.html?jobId=${job.id}" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-0.5 transition">
          View Job <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </a>
      </div>
    </div>
  `).join('');

  UI.refreshIcons();
}

function renderLatestJobs() {
  const container = document.getElementById('latest-jobs-list');
  if (!container) return;

  const jobs = window.HireSphereStore.getJobs().filter(j => j.isActive).slice(0, 5);

  if (jobs.length === 0) {
    container.innerHTML = `
      <div class="py-8 px-4 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
        No recent jobs published yet. Check back soon!
      </div>
    `;
    UI.refreshIcons();
    return;
  }

  container.innerHTML = jobs.map(job => `
    <div class="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition group">
      <div class="flex items-center gap-3.5">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm ${job.logoBg || 'bg-indigo-600'}">
          ${job.logoText || 'JB'}
        </div>
        <div>
          <h4 class="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">${job.title}</h4>
          <p class="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
            <span class="font-semibold text-slate-700">${job.company}</span>
            <span>•</span>
            <span>${job.location}</span>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <span class="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          ${job.jobType || 'Full-Time'}
        </span>
        <span class="hidden md:inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
          ${job.category || 'General'}
        </span>
        <a href="jobs.html?jobId=${job.id}" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition">
          <i data-lucide="chevron-right" class="w-5 h-5"></i>
        </a>
      </div>
    </div>
  `).join('');

  UI.refreshIcons();
}
