// Worker Detail Page JavaScript

// Get worker ID from URL
const urlParams = new URLSearchParams(window.location.search);
const workerId = urlParams.get('id');

// Worker data mapping
const workerFiles = {
    'jasper': 'jasper-the-writer',
    'zoey': 'zoey-the-prospector',
    'sage': 'sage-the-send-timer',
    'smarta': 'smarta-the-ad-optimizer',
    'dynamo': 'dynamo-the-personalizer',
    'analyzer': 'analyzer-the-insight-finder',
    'surfy': 'surfy-the-seo-optimizer',
    'chatty': 'chatty-the-support-bot'
};

// Load worker data
async function loadWorkerData() {
    if (!workerId || !workerFiles[workerId]) {
        console.error('Invalid worker ID');
        return;
    }

    try {
        const response = await fetch(`../agents/workers/${workerFiles[workerId]}.json`);
        const worker = await response.json();
        displayWorkerData(worker);
    } catch (error) {
        console.error('Failed to load worker data:', error);
    }
}

// Display worker data
function displayWorkerData(worker) {
    // Update header
    document.getElementById('workerAvatar').textContent = worker.emoji;
    document.getElementById('workerName').textContent = worker.fullName;
    document.getElementById('workerRole').textContent = worker.role;
    document.getElementById('workerPersonality').textContent = worker.personality;
    document.getElementById('workerQuote').textContent = worker.quotes[Math.floor(Math.random() * worker.quotes.length)];

    // Update status
    document.getElementById('workerStatus').textContent = worker.status.charAt(0).toUpperCase() + worker.status.slice(1);
    document.getElementById('workerAvailability').textContent = worker.workingHours.availability;
    document.getElementById('workerDepartment').textContent = worker.department;

    // Update metrics
    displayMetrics(worker.metrics);

    // Update tasks
    displayTasks(worker.currentTasks);

    // Update recent work
    displayRecentWork(worker);

    // Update platform info
    displayPlatformInfo(worker.aiPlatform, worker.integrations);

    // Update capabilities
    displayCapabilities(worker.capabilities);
}

// Display metrics
function displayMetrics(metrics) {
    const metricsGrid = document.getElementById('metricsGrid');
    metricsGrid.innerHTML = '';

    const metricKeys = Object.keys(metrics);
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ];

    metricKeys.slice(0, 6).forEach((key, index) => {
        const card = document.createElement('div');
        card.className = 'stat-card';

        const label = key.replace(/([A-Z])/g, ' $1').trim();
        const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);

        card.innerHTML = `
            <div class="stat-icon" style="background: ${gradients[index % gradients.length]};">
                <i class="fas fa-chart-line"></i>
            </div>
            <div class="stat-content">
                <p class="stat-label">${capitalizedLabel}</p>
                <h3 class="stat-value">${metrics[key]}</h3>
            </div>
        `;

        metricsGrid.appendChild(card);
    });
}

// Display tasks
function displayTasks(tasks) {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';

    if (!tasks || tasks.length === 0) {
        tasksList.innerHTML = '<p style="color: var(--text-secondary);">No current tasks</p>';
        return;
    }

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        const statusClass = task.status.replace('_', '-');

        taskItem.innerHTML = `
            <div class="task-header">
                <span class="task-title">${task.title}</span>
                <span class="task-status ${statusClass}">${task.status.replace('_', ' ')}</span>
            </div>
            ${task.progress !== undefined ? `
                <div class="worker-progress" style="margin-top: 0.75rem;">
                    <div class="progress-info">
                        <span>${task.progress}% complete</span>
                        ${task.dueDate ? `<span>Due: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${task.progress}%;"></div>
                    </div>
                </div>
            ` : ''}
        `;

        tasksList.appendChild(taskItem);
    });
}

// Display recent work
function displayRecentWork(worker) {
    const recentWorkList = document.getElementById('recentWorkList');
    recentWorkList.innerHTML = '';

    // Different workers have different recent work properties
    let recentWork = worker.recentWork || worker.recentDiscoveries || worker.recentOptimizations ||
                     worker.recentInsights || worker.recentInteractions || worker.recentWins || [];

    if (recentWork.length === 0) {
        recentWorkList.innerHTML = '<p style="color: var(--text-secondary);">No recent work</p>';
        return;
    }

    recentWork.slice(0, 5).forEach(work => {
        const workItem = document.createElement('div');
        workItem.className = 'task-item';
        workItem.style.cursor = 'default';

        // Format based on worker type
        let content = '';
        if (work.title) {
            content = `<strong>${work.title}</strong><br>`;
            if (work.type) content += `Type: ${work.type}<br>`;
            if (work.qualityScore) content += `Quality: ${work.qualityScore}/100<br>`;
            if (work.words) content += `${work.words} words<br>`;
        } else if (work.company) {
            content = `<strong>${work.company}</strong><br>`;
            content += `${work.contacts} contacts • Score: ${work.leadScore}<br>`;
        } else if (work.campaign) {
            content = `<strong>${work.campaign}</strong><br>`;
            if (work.improvement) content += `${work.improvement} improvement<br>`;
        }

        const timestamp = work.timestamp ? new Date(work.timestamp).toLocaleString() : '';

        workItem.innerHTML = `
            <div>${content}</div>
            ${timestamp ? `<div style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.5rem;">${timestamp}</div>` : ''}
        `;

        recentWorkList.appendChild(workItem);
    });
}

// Display platform info
function displayPlatformInfo(platform, integrations) {
    const platformInfo = document.getElementById('platformInfo');

    platformInfo.innerHTML = `
        <div class="platform-item">
            <strong>${platform.name}</strong>
            <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0.5rem 0;">
                <a href="${platform.url}" target="_blank" style="color: var(--primary-color);">
                    ${platform.url}
                </a>
            </p>
        </div>
        <div class="platform-item" style="margin-top: 1rem;">
            <strong>Integrations</strong>
            <div class="integration-tags" style="margin-top: 0.5rem;">
                ${integrations.map(int => `<span class="tag">${int}</span>`).join('')}
            </div>
        </div>
    `;

    // Add tag styles
    const style = document.createElement('style');
    style.textContent = `
        .tag {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: var(--light-bg);
            border-radius: 1rem;
            font-size: 0.75rem;
            margin: 0.25rem;
            color: var(--text-primary);
        }
        .breadcrumb {
            margin-bottom: 1.5rem;
        }
        .breadcrumb a {
            color: var(--text-secondary);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        .breadcrumb a:hover {
            color: var(--primary-color);
        }
        .quote-box {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 0.5rem;
            font-style: italic;
        }
        .quote-box i {
            margin-right: 0.5rem;
            opacity: 0.6;
        }
        .status-info {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .status-item .label {
            color: var(--text-secondary);
            font-size: 0.875rem;
        }
        .status-item .value {
            font-weight: 600;
        }
        .action-buttons {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        .btn-action {
            padding: 0.75rem 1rem;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            justify-content: center;
            transition: all 0.2s;
        }
        .btn-action:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
    `;
    document.head.appendChild(style);
}

// Display capabilities
function displayCapabilities(capabilities) {
    const capabilitiesList = document.getElementById('capabilitiesList');

    capabilitiesList.innerHTML = capabilities.map(cap => `
        <div style="padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
            <i class="fas fa-check" style="color: var(--success-color); margin-right: 0.5rem;"></i>
            ${cap}
        </div>
    `).join('');
}

// Quick actions
function assignTask() {
    alert('Task assignment feature coming soon!');
}

function viewSettings() {
    alert('Settings panel coming soon!');
}

function viewAnalytics() {
    alert('Analytics view coming soon!');
}

// Initialize page
document.addEventListener('DOMContentLoaded', loadWorkerData);
