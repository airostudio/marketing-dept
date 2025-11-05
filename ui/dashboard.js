// Dashboard JavaScript
const workers = {
    sonic: null,
    zoey: null,
    sage: null,
    smarta: null,
    dynamo: null,
    analyzer: null,
    surfy: null,
    chatty: null
};

// Load worker data
async function loadWorkerData(workerId) {
    try {
        const response = await fetch(`../agents/workers/${workerId}-*.json`);
        const data = await response.json();
        workers[workerId] = data;
        return data;
    } catch (error) {
        console.error(`Failed to load worker data for ${workerId}:`, error);
        return null;
    }
}

// View worker details
function viewWorker(workerId) {
    window.location.href = `worker.html?id=${workerId}`;
}

// Real-time updates (simulated)
function updateMetrics() {
    // Simulate real-time metric updates
    const metricElements = document.querySelectorAll('.stat-value');
    metricElements.forEach(element => {
        // Add subtle animation to show live updates
        element.style.transform = 'scale(1.05)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    });
}

// Add activity to feed
function addActivity(icon, workerName, message) {
    const activityFeed = document.querySelector('.activity-feed');
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.style.opacity = '0';

    activityItem.innerHTML = `
        <div class="activity-icon">${icon}</div>
        <div class="activity-content">
            <p><strong>${workerName}</strong> ${message}</p>
            <span class="activity-time">Just now</span>
        </div>
    `;

    activityFeed.insertBefore(activityItem, activityFeed.firstChild);

    // Fade in animation
    setTimeout(() => {
        activityItem.style.transition = 'opacity 0.3s';
        activityItem.style.opacity = '1';
    }, 10);

    // Keep only last 10 activities
    const activities = activityFeed.querySelectorAll('.activity-item');
    if (activities.length > 10) {
        activityFeed.removeChild(activities[activities.length - 1]);
    }
}

// Simulate worker activities
function simulateActivity() {
    const activities = [
        { icon: '✍️', worker: 'Sonic', message: 'completed a new blog post' },
        { icon: '🔍', worker: 'Zoey', message: 'found 15 new qualified leads' },
        { icon: '⏰', worker: 'Sage', message: 'optimized send times for 500 subscribers' },
        { icon: '🎯', worker: 'Smarta', message: 'improved campaign ROAS by 12%' },
        { icon: '🎨', worker: 'Dynamo', message: 'deployed winning A/B test variant' },
        { icon: '📊', worker: 'Analyzer', message: 'generated 3 new insights' },
        { icon: '🏄', worker: 'Surfy', message: 'improved content score to 92' },
        { icon: '💬', worker: 'Chatty', message: 'resolved 25 customer conversations' }
    ];

    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    addActivity(randomActivity.icon, randomActivity.worker, randomActivity.message);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('AI Marketing Dashboard loaded');

    // Update metrics every 10 seconds
    setInterval(updateMetrics, 10000);

    // Add new activity every 30 seconds
    setInterval(simulateActivity, 30000);

    // Handle navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Handle worker card clicks
    document.querySelectorAll('.worker-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn-view')) {
                const workerId = card.getAttribute('data-worker');
                viewWorker(workerId);
            }
        });
    });

    // Add hover effects
    document.querySelectorAll('.worker-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.cursor = 'pointer';
        });
    });
});

// Notification system
function showNotification(title, message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <strong>${title}</strong>
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Position notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .notification-content {
        margin-bottom: 0;
    }

    .notification-content strong {
        display: block;
        margin-bottom: 0.5rem;
    }

    .notification-content p {
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin: 0;
    }

    .notification-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-close:hover {
        color: var(--text-primary);
    }
`;
document.head.appendChild(style);

// Export functions for use in worker detail pages
window.MarketingDashboard = {
    viewWorker,
    showNotification,
    loadWorkerData
};
