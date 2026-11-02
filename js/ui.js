/**
 * HireSphere - UI Utilities, Toast Notifications, Modals & Render Helpers
 */

const UI = {
  // Toast notifications
  toast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 transform translate-y-4 opacity-0`;

    let colorStyles = '';
    let iconName = 'info';

    switch (type) {
      case 'success':
        colorStyles = 'bg-white text-emerald-800 border-emerald-200 shadow-emerald-500/10';
        iconName = 'check-circle-2';
        break;
      case 'error':
        colorStyles = 'bg-white text-rose-800 border-rose-200 shadow-rose-500/10';
        iconName = 'alert-circle';
        break;
      case 'warning':
        colorStyles = 'bg-white text-amber-800 border-amber-200 shadow-amber-500/10';
        iconName = 'alert-triangle';
        break;
      default:
        colorStyles = 'bg-white text-slate-800 border-slate-200 shadow-slate-500/10';
        iconName = 'info';
    }

    toast.className += ` ${colorStyles}`;
    toast.innerHTML = `
      <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0"></i>
      <span class="flex-1">${message}</span>
      <button class="text-slate-400 hover:text-slate-600 focus:outline-none" onclick="this.parentElement.remove()">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    // Trigger entrance animation
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Modal helpers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    if (window.lucide) lucide.createIcons();
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  },

  // Status Badge Component Generator
  renderStatusBadge(status) {
    switch (status) {
      case 'Shortlisted':
        return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Shortlisted
        </span>`;
      case 'Rejected':
        return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Rejected
        </span>`;
      case 'Applied':
      default:
        return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> In Review
        </span>`;
    }
  },

  // Date formatter
  formatDate(dateString) {
    if (!dateString) return 'Recent';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString;
    }
  },

  // Relative time helper
  timeAgo(dateString) {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? '1 day ago' : `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? '1 hour ago' : `${interval} hours ago`;

    return 'Recently';
  },

  // Refresh Lucide Icons
  refreshIcons() {
    if (window.lucide) {
      lucide.createIcons();
    }
  }
};

window.UI = UI;
