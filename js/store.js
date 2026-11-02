/**
 * HireSphere - Central Data Store & LocalStorage Management
 * Clean Production MVP (No Demo Data)
 */

const STORAGE_KEYS = {
  USERS: 'hiresphere_users_data',
  JOBS: 'hiresphere_jobs_data',
  APPLICATIONS: 'hiresphere_applications_data',
  CURRENT_USER: 'hiresphere_current_user_data'
};

// Clean default state - No hardcoded mock/demo data
const DEFAULT_USERS = [];
const DEFAULT_JOBS = [];
const DEFAULT_APPLICATIONS = [];

class Store {
  constructor() {
    this.init();
  }

  init() {
    // Clean up any legacy demo keys from previous runs
    const legacyKeys = [
      'hiresphere_users',
      'hiresphere_jobs',
      'hiresphere_applications',
      'hiresphere_current_user',
      'hiresphere_users_v2',
      'hiresphere_jobs_v2',
      'hiresphere_applications_v2',
      'hiresphere_current_user_v2'
    ];
    legacyKeys.forEach(k => {
      try { localStorage.removeItem(k); } catch (e) {}
    });

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.saveUsers(DEFAULT_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
      this.saveJobs(DEFAULT_JOBS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      this.saveApplications(DEFAULT_APPLICATIONS);
    }
  }

  // Clear all data (Users, Jobs, Applications)
  clearAllData() {
    this.saveUsers([]);
    this.saveJobs([]);
    this.saveApplications([]);
    this.setCurrentUser(null);
  }

  // Users
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    } catch (e) {
      return [];
    }
  }

  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  getUserById(id) {
    return this.getUsers().find(u => u.id === id) || null;
  }

  getUserByEmail(email) {
    if (!email) return null;
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  }

  createUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: 'user-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=4F46E5&color=fff&bold=true`,
      ...userData
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  // Current Session User
  getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
    window.dispatchEvent(new CustomEvent('hiresphere:auth-changed', { detail: user }));
  }

  logout() {
    this.setCurrentUser(null);
  }

  // Jobs
  getJobs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS)) || [];
    } catch (e) {
      return [];
    }
  }

  saveJobs(jobs) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    window.dispatchEvent(new CustomEvent('hiresphere:jobs-changed', { detail: jobs }));
  }

  getJobById(id) {
    return this.getJobs().find(j => j.id === id) || null;
  }

  createJob(jobData) {
    const jobs = this.getJobs();
    const companyName = jobData.company || 'Company';
    const newJob = {
      id: 'job-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
      logoText: companyName.length >= 2 ? companyName.substring(0, 2).toUpperCase() : 'CO',
      logoBg: jobData.logoBg || 'bg-indigo-600',
      logoIcon: 'briefcase',
      ...jobData
    };
    jobs.unshift(newJob);
    this.saveJobs(jobs);
    return newJob;
  }

  updateJob(id, updatedFields) {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...updatedFields };
      this.saveJobs(jobs);
      return jobs[index];
    }
    return null;
  }

  deleteJob(id) {
    const jobs = this.getJobs().filter(j => j.id !== id);
    this.saveJobs(jobs);
    // Also remove applications associated with this job
    const apps = this.getApplications().filter(a => a.jobId !== id);
    this.saveApplications(apps);
    return true;
  }

  // Applications
  getApplications() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) || [];
    } catch (e) {
      return [];
    }
  }

  saveApplications(apps) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    window.dispatchEvent(new CustomEvent('hiresphere:applications-changed', { detail: apps }));
  }

  getApplicationsByCandidate(candidateId) {
    const apps = this.getApplications().filter(a => a.candidateId === candidateId);
    const jobs = this.getJobs();
    return apps.map(app => {
      const job = jobs.find(j => j.id === app.jobId) || {
        title: 'Archived Job Position',
        company: 'Organization',
        location: 'Remote',
        jobType: 'Full-Time'
      };
      return { ...app, job };
    });
  }

  getApplicationsByJob(jobId) {
    return this.getApplications().filter(a => a.jobId === jobId);
  }

  hasCandidateApplied(jobId, candidateId) {
    if (!candidateId) return false;
    return this.getApplications().some(a => a.jobId === jobId && a.candidateId === candidateId);
  }

  applyToJob(appData) {
    if (this.hasCandidateApplied(appData.jobId, appData.candidateId)) {
      throw new Error('You have already submitted an application for this position.');
    }

    const apps = this.getApplications();
    const newApp = {
      id: 'app-' + Date.now(),
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'Applied',
      ...appData
    };
    apps.unshift(newApp);
    this.saveApplications(apps);
    return newApp;
  }

  updateApplicationStatus(appId, newStatus) {
    const validStatuses = ['Applied', 'Shortlisted', 'Rejected'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Invalid status: ' + newStatus);
    }
    const apps = this.getApplications();
    const index = apps.findIndex(a => a.id === appId);
    if (index !== -1) {
      apps[index].status = newStatus;
      this.saveApplications(apps);
      return apps[index];
    }
    return null;
  }
}

// Global instance
window.HireSphereStore = new Store();
