/**
 * HireSphere - Authentication & Session Management
 * Clean Production Auth (No Demo Personas)
 */

const Auth = {
  init() {
    this.renderHeaderAuthState();
    this.injectAuthModals();
    this.bindEvents();

    window.addEventListener('hiresphere:auth-changed', () => {
      this.renderHeaderAuthState();
    });
  },

  getCurrentUser() {
    return window.HireSphereStore.getCurrentUser();
  },

  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  isCandidate() {
    const user = this.getCurrentUser();
    return user && user.role === 'candidate';
  },

  isRecruiter() {
    const user = this.getCurrentUser();
    return user && user.role === 'recruiter';
  },

  logout() {
    window.HireSphereStore.logout();
    UI.toast('You have been signed out.', 'info');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 400);
  },

  // Render Header Auth UI
  renderHeaderAuthState() {
    const user = this.getCurrentUser();
    const authContainer = document.getElementById('nav-auth-container');

    if (!authContainer) return;

    if (user) {
      const isCandidate = user.role === 'candidate';
      const dashboardUrl = isCandidate ? 'candidate-dashboard.html' : 'recruiter-dashboard.html';
      const dashboardLabel = isCandidate ? 'Candidate Dashboard' : 'Recruiter Dashboard';

      authContainer.innerHTML = `
        <div class="flex items-center gap-3">
          <a href="${dashboardUrl}" class="hidden md:inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition">
            <i data-lucide="${isCandidate ? 'layout-dashboard' : 'briefcase'}" class="w-4 h-4"></i>
            <span>${dashboardLabel}</span>
          </a>

          <div class="relative group">
            <button class="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-indigo-100 transition focus:outline-none">
              <img src="${user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4F46E5&color=fff`}" alt="${user.name}" class="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm" />
              <div class="hidden lg:block text-left text-xs leading-tight">
                <p class="font-bold text-slate-800">${user.name}</p>
                <p class="text-slate-500 capitalize">${user.role}</p>
              </div>
              <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 hidden lg:block"></i>
            </button>

            <!-- Dropdown Menu -->
            <div class="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 hidden group-hover:block transition-all z-50">
              <div class="px-4 py-2 border-b border-slate-100">
                <p class="text-xs text-slate-400">Signed in as</p>
                <p class="text-sm font-bold text-slate-800 truncate">${user.name}</p>
                <p class="text-xs text-slate-500 truncate">${user.email}</p>
                <span class="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${isCandidate ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}">${user.role}</span>
              </div>
              
              <a href="${dashboardUrl}" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                <i data-lucide="layout-dashboard" class="w-4 h-4 text-slate-400"></i> ${dashboardLabel}
              </a>

              ${isCandidate ? `
                <a href="candidate-dashboard.html#applications-section" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                  <i data-lucide="file-text" class="w-4 h-4 text-slate-400"></i> My Applications
                </a>
              ` : `
                <a href="recruiter-dashboard.html#recent-jobs-table" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                  <i data-lucide="plus-circle" class="w-4 h-4 text-slate-400"></i> Post a Job
                </a>
              `}

              <a href="jobs.html" class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                <i data-lucide="search" class="w-4 h-4 text-slate-400"></i> Browse Jobs
              </a>

              <div class="border-t border-slate-100 my-1"></div>

              <button onclick="Auth.logout()" class="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition">
                <i data-lucide="log-out" class="w-4 h-4"></i> Sign Out
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      authContainer.innerHTML = `
        <div class="flex items-center gap-2.5">
          <button onclick="UI.openModal('login-modal')" class="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition">
            Login
          </button>
          <button onclick="UI.openModal('register-modal')" class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-500/20 transition">
            Sign Up
          </button>
        </div>
      `;
    }

    UI.refreshIcons();
  },

  // Modal injector for Login & Register forms
  injectAuthModals() {
    if (document.getElementById('login-modal')) return;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
      <!-- Login Modal -->
      <div id="login-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
          <div class="p-6 md:p-8">
            <button onclick="UI.closeModal('login-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>

            <div class="text-center mb-6">
              <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <i data-lucide="lock" class="w-6 h-6"></i>
              </div>
              <h3 class="text-2xl font-bold text-slate-900">Welcome Back</h3>
              <p class="text-sm text-slate-500 mt-1">Sign in to your HireSphere account</p>
            </div>

            <form id="login-form" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                <div class="relative">
                  <i data-lucide="mail" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input type="email" id="login-email" required placeholder="you@example.com" class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
                <div class="relative">
                  <i data-lucide="key" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input type="password" id="login-password" required placeholder="••••••••" class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition" />
                </div>
              </div>

              <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-500/25 transition">
                Sign In
              </button>
            </form>

            <div class="mt-6 text-center text-xs text-slate-500">
              Don't have an account? 
              <button onclick="UI.closeModal('login-modal'); UI.openModal('register-modal')" class="text-indigo-600 font-bold hover:underline">
                Create an account
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Register Modal -->
      <div id="register-modal" class="fixed inset-0 z-50 hidden items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
          <div class="p-6 md:p-8">
            <button onclick="UI.closeModal('register-modal')" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>

            <div class="text-center mb-6">
              <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <i data-lucide="user-plus" class="w-6 h-6"></i>
              </div>
              <h3 class="text-2xl font-bold text-slate-900">Create an Account</h3>
              <p class="text-sm text-slate-500 mt-1">Select your account type to register</p>
            </div>

            <form id="register-form" class="space-y-4">
              <!-- Role Selector -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">I am registering as</label>
                <div class="grid grid-cols-2 gap-3">
                  <label class="cursor-pointer border border-slate-200 rounded-xl p-3 flex items-center gap-2.5 transition hover:border-indigo-400 [&:has(input:checked)]:border-indigo-600 [&:has(input:checked)]:bg-indigo-50/50">
                    <input type="radio" name="register-role" value="candidate" checked class="text-indigo-600 focus:ring-0" />
                    <div>
                      <p class="text-xs font-bold text-slate-800">Job Seeker</p>
                      <p class="text-[11px] text-slate-500">Find & apply for jobs</p>
                    </div>
                  </label>
                  <label class="cursor-pointer border border-slate-200 rounded-xl p-3 flex items-center gap-2.5 transition hover:border-indigo-400 [&:has(input:checked)]:border-indigo-600 [&:has(input:checked)]:bg-indigo-50/50">
                    <input type="radio" name="register-role" value="recruiter" class="text-indigo-600 focus:ring-0" />
                    <div>
                      <p class="text-xs font-bold text-slate-800">Recruiter</p>
                      <p class="text-[11px] text-slate-500">Post & manage jobs</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Full Name *</label>
                <div class="relative">
                  <i data-lucide="user" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input type="text" id="register-name" required placeholder="Jane Doe" class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address *</label>
                <div class="relative">
                  <i data-lucide="mail" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input type="email" id="register-email" required placeholder="jane@example.com" class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Professional Title or Company</label>
                <div class="relative">
                  <i data-lucide="briefcase" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input type="text" id="register-title" placeholder="e.g. Frontend Engineer or Acme Corp HR" class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Password *</label>
                <div class="relative">
                  <i data-lucide="key" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input type="password" id="register-password" required placeholder="Create a password" class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition" />
                </div>
              </div>

              <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-500/25 transition">
                Create Account
              </button>
            </form>

            <div class="mt-6 text-center text-xs text-slate-500">
              Already have an account? 
              <button onclick="UI.closeModal('register-modal'); UI.openModal('login-modal')" class="text-indigo-600 font-bold hover:underline">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalContainer);
    UI.refreshIcons();
  },

  bindEvents() {
    document.addEventListener('submit', (e) => {
      // Login Form
      if (e.target && e.target.id === 'login-form') {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
          UI.toast('Please enter both email and password.', 'error');
          return;
        }

        const user = window.HireSphereStore.getUserByEmail(email);
        if (!user) {
          UI.toast('No account registered with this email. Please sign up first.', 'error');
          return;
        }

        if (user.password && user.password !== password) {
          UI.toast('Incorrect password. Please try again.', 'error');
          return;
        }

        window.HireSphereStore.setCurrentUser(user);
        UI.closeModal('login-modal');
        UI.toast(`Welcome back, ${user.name}!`, 'success');
        
        setTimeout(() => {
          if (user.role === 'recruiter') {
            window.location.href = 'recruiter-dashboard.html';
          } else {
            window.location.href = 'candidate-dashboard.html';
          }
        }, 400);
      }

      // Register Form
      if (e.target && e.target.id === 'register-form') {
        e.preventDefault();
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const title = document.getElementById('register-title').value.trim();
        const roleRadio = document.querySelector('input[name="register-role"]:checked');
        const role = roleRadio ? roleRadio.value : 'candidate';

        if (!name || !email || !password) {
          UI.toast('Please fill in all required fields.', 'error');
          return;
        }

        const existing = window.HireSphereStore.getUserByEmail(email);
        if (existing) {
          UI.toast('An account with this email address already exists. Please sign in.', 'error');
          return;
        }

        const newUser = window.HireSphereStore.createUser({
          name,
          email,
          password,
          role,
          title: title || (role === 'candidate' ? 'Job Seeker' : 'Talent Recruiter')
        });

        window.HireSphereStore.setCurrentUser(newUser);
        UI.closeModal('register-modal');
        UI.toast(`Account created successfully! Welcome, ${newUser.name}.`, 'success');

        setTimeout(() => {
          if (role === 'recruiter') {
            window.location.href = 'recruiter-dashboard.html';
          } else {
            window.location.href = 'candidate-dashboard.html';
          }
        }, 400);
      }
    });
  }
};

window.Auth = Auth;

document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
