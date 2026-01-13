// Dashboard Professional with Animations
class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Dashboard Initializing...');
        
        // Check authentication
        if (!this.checkAuth()) {
            window.location.href = 'index.html';
            return;
        }

        // Initialize components
        this.initSidebar();
        this.initDate();
        this.initGreeting();
        this.initAnimations();
        this.initSearch();
        this.initNotifications();
        this.initStats();
        this.initButtons();
        this.initTooltips();

        // Start animations
        this.startAnimations();

        console.log('✅ Dashboard Initialized Successfully');
    }

    checkAuth() {
        const user = sessionStorage.getItem('username');
        const email = sessionStorage.getItem('userEmail');
        return !!(user && email);
    }

    initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mobileOverlay = document.getElementById('mobileOverlay');

        // Toggle sidebar
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                mobileOverlay.classList.toggle('active');
                this.toggleSidebarIcon();
            });
        }

        // Close sidebar on overlay click
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                mobileOverlay.classList.remove('active');
                this.toggleSidebarIcon();
            });
        }

        // Handle navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Close sidebar on mobile
                if (window.innerWidth < 1200) {
                    sidebar.classList.remove('active');
                    mobileOverlay.classList.remove('active');
                    this.toggleSidebarIcon();
                }

                // Show loading animation
                this.showToast(`Loading ${item.querySelector('.nav-text').textContent}...`, 'info');
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1200) {
                sidebar.classList.remove('active');
                mobileOverlay.classList.remove('active');
                this.toggleSidebarIcon();
            }
        });
    }

    toggleSidebarIcon() {
        const sidebar = document.getElementById('sidebar');
        const toggleIcon = document.querySelector('.sidebar-toggle i');
        
        if (!toggleIcon) return;
        
        if (sidebar.classList.contains('active')) {
            toggleIcon.classList.remove('fa-bars');
            toggleIcon.classList.add('fa-times');
        } else {
            toggleIcon.classList.remove('fa-times');
            toggleIcon.classList.add('fa-bars');
        }
    }

    initDate() {
        const dateElement = document.getElementById('currentDate');
        if (!dateElement) return;

        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        dateElement.textContent = now.toLocaleDateString('en-US', options);

        // Update date every minute
        setInterval(() => {
            const now = new Date();
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }, 60000);
    }

    initGreeting() {
        const greetingElement = document.getElementById('greetingText');
        if (!greetingElement) return;

        const hour = new Date().getHours();
        let greeting;

        if (hour < 12) greeting = 'Good Morning';
        else if (hour < 18) greeting = 'Good Afternoon';
        else greeting = 'Good Evening';

        greetingElement.textContent = greeting;

        // Update greeting every hour
        setInterval(() => {
            const hour = new Date().getHours();
            if (hour < 12) greeting = 'Good Morning';
            else if (hour < 18) greeting = 'Good Afternoon';
            else greeting = 'Good Evening';
            greetingElement.textContent = greeting;
        }, 3600000);
    }

    initAnimations() {
        // Animate cards on scroll
        const animateOnScroll = () => {
            const cards = document.querySelectorAll('.card-animate');
            
            cards.forEach(card => {
                const cardTop = card.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (cardTop < windowHeight * 0.85) {
                    const delay = card.dataset.delay || 0;
                    
                    setTimeout(() => {
                        card.classList.add('animated');
                    }, delay * 1000);
                }
            });
        };

        // Initial animation
        setTimeout(animateOnScroll, 500);

        // Animate on scroll
        window.addEventListener('scroll', animateOnScroll);

        // Add hover animations
        this.addHoverAnimations();
    }

    addHoverAnimations() {
        // Card hover effects
        const cards = document.querySelectorAll('.stat-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-action');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-3px)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
    }

    initSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchClear = document.querySelector('.search-clear');

        if (!searchInput || !searchClear) return;

        // Show/hide clear button
        searchInput.addEventListener('input', () => {
            searchClear.style.opacity = searchInput.value ? '1' : '0';
        });

        // Clear search
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            searchClear.style.opacity = '0';
            this.showToast('Search cleared', 'info');
        });

        // Search on Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim()) {
                this.performSearch(searchInput.value);
            }
        });
    }

    performSearch(query) {
        if (!query.trim()) return;

        this.showToast(`Searching for "${query}"...`, 'info');

        // Simulate search
        setTimeout(() => {
            const results = [
                'Successful login',
                'Password updated',
                'Profile complete',
                'Security score'
            ].filter(item => item.toLowerCase().includes(query.toLowerCase()));

            if (results.length > 0) {
                this.showToast(`Found ${results.length} results`, 'success');
                
                // Highlight matching elements
                results.forEach(result => {
                    const elements = document.querySelectorAll('*');
                    elements.forEach(el => {
                        if (el.textContent.toLowerCase().includes(result.toLowerCase())) {
                            el.classList.add('search-highlight');
                            setTimeout(() => {
                                el.classList.remove('search-highlight');
                            }, 2000);
                        }
                    });
                });
            } else {
                this.showToast('No results found', 'warning');
            }
        }, 800);
    }

    initNotifications() {
        const notificationsBtn = document.querySelector('.notifications-btn');
        const markAllReadBtn = document.querySelector('.mark-all-read');
        const notificationItems = document.querySelectorAll('.notification-item');

        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', () => {
                this.toggleNotifications();
            });
        }

        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                this.markAllAsRead();
            });
        }

        notificationItems.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('unread')) {
                    item.classList.remove('unread');
                    this.updateNotificationCount();
                    this.showToast('Notification marked as read', 'success');
                }
            });
        });
    }

    toggleNotifications() {
        const count = document.querySelectorAll('.notification-item.unread').length;
        
        if (count > 0) {
            this.markAllAsRead();
        } else {
            this.showToast('No unread notifications', 'info');
        }
    }

    markAllAsRead() {
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        
        unreadItems.forEach(item => {
            item.classList.remove('unread');
        });
        
        this.updateNotificationCount();
        this.showToast(`Marked ${unreadItems.length} notifications as read`, 'success');
    }

    updateNotificationCount() {
        const count = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notification-count');
        
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'flex';
                badge.classList.add('pulse');
            } else {
                badge.style.display = 'none';
                badge.classList.remove('pulse');
            }
        }
    }

    initStats() {
        // Profile completion
        const completeProfileBtn = document.querySelector('.btn-action:has(i.fa-user-edit)');
        if (completeProfileBtn) {
            completeProfileBtn.addEventListener('click', () => {
                this.completeProfile();
            });
        }

        // View all buttons
        const viewAllButtons = document.querySelectorAll('.btn-action:has(i.fa-eye), .btn-action:has(i.fa-chart-line), .btn-action:has(i.fa-shield)');
        viewAllButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.querySelector('span').textContent;
                this.showToast(`Opening ${action}...`, 'info');
            });
        });

        // Card menu buttons
        const menuButtons = document.querySelectorAll('.card-menu-btn');
        menuButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showCardMenu(btn);
            });
        });
    }

    completeProfile() {
        const progressValue = document.querySelector('.progress-value');
        const progressFill = document.querySelector('.progress-fill');
        
        if (!progressValue || !progressFill) return;

        let current = parseInt(progressValue.textContent);
        
        if (current < 100) {
            const increment = Math.min(5, 100 - current);
            current += increment;
            
            // Update progress with animation
            progressValue.textContent = current + '%';
            progressFill.style.width = current + '%';
            
            // Add animation
            progressValue.classList.add('pulse');
            progressFill.classList.add('pulse');
            
            setTimeout(() => {
                progressValue.classList.remove('pulse');
                progressFill.classList.remove('pulse');
            }, 300);
            
            this.showToast(`Profile completion increased to ${current}%`, 'success');
            
            if (current === 100) {
                this.showToast('🎉 Profile completed! All features unlocked.', 'success');
                this.confettiEffect();
            }
        } else {
            this.showToast('Profile already completed!', 'info');
        }
    }

    showCardMenu(button) {
        const card = button.closest('.stat-card');
        const title = card.querySelector('.card-title').textContent;
        
        this.showToast(`Options for ${title}`, 'info');
    }

    initButtons() {
        // Refresh button
        const refreshBtn = document.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }

        // New Report button
        const newReportBtn = document.querySelector('.btn-primary:has(i.fa-plus)');
        if (newReportBtn) {
            newReportBtn.addEventListener('click', () => {
                this.createNewReport();
            });
        }

        // Export Data button
        const exportBtn = document.querySelector('.btn-secondary:has(i.fa-download)');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }

        // View All Activity button
        const viewAllActivityBtn = document.querySelector('.btn-view-all');
        if (viewAllActivityBtn) {
            viewAllActivityBtn.addEventListener('click', () => {
                this.viewAllActivity();
            });
        }
    }

    refreshDashboard() {
        this.showToast('Refreshing dashboard...', 'info');
        
        // Add loading animation
        const content = document.querySelector('.dashboard-content');
        content.style.opacity = '0.7';
        
        setTimeout(() => {
            // Simulate data update
            this.updateStats();
            content.style.opacity = '1';
            this.showToast('Dashboard refreshed successfully', 'success');
        }, 800);
    }

    updateStats() {
        // Update active days
        const activeDays = document.querySelector('.stat-number');
        if (activeDays) {
            const current = parseInt(activeDays.textContent);
            const newValue = current + 1;
            activeDays.textContent = newValue;
            
            // Animate the change
            activeDays.classList.add('pulse');
            setTimeout(() => activeDays.classList.remove('pulse'), 300);
        }

        // Update security score
        const scoreValue = document.querySelector('.score-value');
        if (scoreValue) {
            const current = parseInt(scoreValue.textContent);
            const change = Math.random() > 0.5 ? 1 : -1;
            const newValue = Math.min(Math.max(current + change, 85), 100);
            scoreValue.textContent = newValue;
            
            // Animate the change
            scoreValue.classList.add('pulse');
            setTimeout(() => scoreValue.classList.remove('pulse'), 300);
        }
    }

    createNewReport() {
        this.showModal('Create New Report', 'report');
    }

    exportData() {
        this.showToast('Preparing data for export...', 'info');
        
        setTimeout(() => {
            this.showToast('Data exported successfully', 'success');
        }, 1500);
    }

    viewAllActivity() {
        this.showToast('Loading all activity...', 'info');
        
        // Simulate loading
        setTimeout(() => {
            this.showToast('Activity loaded successfully', 'success');
        }, 1000);
    }

    initTooltips() {
        // Add tooltips to buttons
        const buttons = document.querySelectorAll('[title]');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = btn.title;
                tooltip.style.position = 'absolute';
                tooltip.style.background = 'var(--dark)';
                tooltip.style.color = 'white';
                tooltip.style.padding = '0.5rem 0.75rem';
                tooltip.style.borderRadius = 'var(--radius-sm)';
                tooltip.style.fontSize = '0.75rem';
                tooltip.style.zIndex = '1000';
                tooltip.style.whiteSpace = 'nowrap';
                
                const rect = btn.getBoundingClientRect();
                tooltip.style.top = `${rect.top - 40}px`;
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.transform = 'translateX(-50%)';
                
                document.body.appendChild(tooltip);
                
                btn.tooltip = tooltip;
            });
            
            btn.addEventListener('mouseleave', () => {
                if (btn.tooltip) {
                    btn.tooltip.remove();
                    delete btn.tooltip;
                }
            });
        });
    }

    startAnimations() {
        // Start pulse animations
        const pulseElements = document.querySelectorAll('.pulse');
        pulseElements.forEach(el => {
            el.style.animation = 'pulse 2s infinite';
        });

        // Start shimmer animations
        const progressFills = document.querySelectorAll('.progress-fill');
        progressFills.forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0';
            
            setTimeout(() => {
                fill.style.width = width;
                fill.style.transition = 'width 1.5s ease-out';
            }, 300);
        });

        // Start chart animations
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach((bar, index) => {
            const height = bar.style.height;
            bar.style.height = '0';
            
            setTimeout(() => {
                bar.style.height = height;
                bar.style.transition = 'height 0.8s ease-out';
            }, index * 100 + 500);
        });
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
            </div>
            <div class="toast-content">
                <p>${message}</p>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);

        // Auto remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 5000);
    }

    getToastIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    showModal(title, type) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${this.getModalContent(type)}
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary modal-cancel">Cancel</button>
                    <button class="btn-primary modal-confirm">Confirm</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const backdrop = modal.querySelector('.modal-backdrop');

        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        // Confirm button
        const confirmBtn = modal.querySelector('.modal-confirm');
        confirmBtn.addEventListener('click', () => {
            this.handleModalConfirm(type);
            closeModal();
        });

        // Animate in
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }

    getModalContent(type) {
        switch(type) {
            case 'report':
                return `
                    <div class="form-group">
                        <label>Report Type</label>
                        <select class="form-input">
                            <option>Activity Report</option>
                            <option>Security Report</option>
                            <option>Performance Report</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date Range</label>
                        <div class="date-range">
                            <input type="date" class="form-input">
                            <span>to</span>
                            <input type="date" class="form-input">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Format</label>
                        <div class="format-options">
                            <label><input type="radio" name="format" checked> PDF</label>
                            <label><input type="radio" name="format"> Excel</label>
                            <label><input type="radio" name="format"> CSV</label>
                        </div>
                    </div>
                `;
            default:
                return '<p>Modal content here...</p>';
        }
    }

    handleModalConfirm(type) {
        switch(type) {
            case 'report':
                this.showToast('Report created successfully', 'success');
                break;
            default:
                this.showToast('Action completed', 'success');
        }
    }

    confettiEffect() {
        const colors = ['#4361ee', '#7209b7', '#4cc9f0', '#f72585', '#f8961e'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}vw;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                opacity: ${Math.random() * 0.7 + 0.3};
                z-index: 9999;
                animation: fall ${Math.random() * 3 + 2}s linear forwards;
            `;

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5000);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

// Add CSS for toast and modal
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .tooltip {
            position: absolute;
            background: var(--dark);
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            z-index: 1000;
            white-space: nowrap;
            pointer-events: none;
            animation: fadeIn 0.2s ease;
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background: white;
            border-radius: var(--radius-xl);
            padding: 2rem;
            width: 90%;
            max-width: 500px;
            z-index: 1001;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .modal.show .modal-content {
            transform: scale(1);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: var(--gray);
            cursor: pointer;
            font-size: 1.25rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid var(--border);
            border-radius: var(--radius-md);
            font-size: 0.9375rem;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--primary);
        }
        
        .date-range {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .format-options {
            display: flex;
            gap: 1rem;
            margin-top: 0.5rem;
        }
        
        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .confetti {
            position: fixed;
            z-index: 9999;
        }
        
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    </style>
`);