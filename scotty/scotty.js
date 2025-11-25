// Scotty AI - Marketing Manager Dashboard
// 2025 Modern Design with Agent Orchestration

// Agent Data
const agents = [
    {
        id: 'marcus-hayes',
        name: 'Marcus Hayes',
        role: 'Content Strategist',
        emoji: '✍️',
        department: 'content-creation',
        status: 'active',
        tasksCompleted: 142,
        efficiency: 96,
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        id: 'sarah-chen',
        name: 'Sarah Chen',
        role: 'Lead Generation',
        emoji: '🔍',
        department: 'lead-generation',
        status: 'working',
        tasksCompleted: 89,
        efficiency: 94,
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
    },
    {
        id: 'emma-wilson',
        name: 'Emma Wilson',
        role: 'Email Marketing',
        emoji: '⏰',
        department: 'email-marketing',
        status: 'active',
        tasksCompleted: 156,
        efficiency: 98,
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
        id: 'alex-rodriguez',
        name: 'Alex Rodriguez',
        role: 'Social Advertising',
        emoji: '🎯',
        department: 'social-media',
        status: 'working',
        tasksCompleted: 73,
        efficiency: 91,
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
        id: 'victor-stone',
        name: 'Victor Stone',
        role: 'Video Producer',
        emoji: '🎬',
        department: 'video-marketing',
        status: 'active',
        tasksCompleted: 45,
        efficiency: 89,
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
        id: 'natalie-brooks',
        name: 'Natalie Brooks',
        role: 'Influencer Manager',
        emoji: '🌟',
        department: 'influencer-marketing',
        status: 'active',
        tasksCompleted: 62,
        efficiency: 92,
        color: '#f97316',
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    {
        id: 'oliver-grant',
        name: 'Oliver Grant',
        role: 'CRO Specialist',
        emoji: '📈',
        department: 'conversion-optimization',
        status: 'working',
        tasksCompleted: 38,
        efficiency: 95,
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
        id: 'nathan-cross',
        name: 'Nathan Cross',
        role: 'Competitive Intelligence',
        emoji: '🕷️',
        department: 'competitive-intelligence',
        status: 'active',
        tasksCompleted: 127,
        efficiency: 97,
        color: '#64748b',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
        id: 'maya-patel',
        name: 'Maya Patel',
        role: 'Personalization Engineer',
        emoji: '🎨',
        department: 'personalization',
        status: 'active',
        tasksCompleted: 91,
        efficiency: 93,
        color: '#d946ef',
        gradient: 'linear-gradient(135deg, #fa71cd 0%, #c471f5 100%)'
    },
    {
        id: 'david-kim',
        name: 'David Kim',
        role: 'Analytics Director',
        emoji: '📊',
        department: 'analytics',
        status: 'active',
        tasksCompleted: 203,
        efficiency: 99,
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        id: 'ryan-mitchell',
        name: 'Ryan Mitchell',
        role: 'SEO Specialist',
        emoji: '🏄',
        department: 'seo',
        status: 'active',
        tasksCompleted: 134,
        efficiency: 96,
        color: '#22c55e',
        gradient: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)'
    },
    {
        id: 'sophie-anderson',
        name: 'Sophie Anderson',
        role: 'Support Lead',
        emoji: '💬',
        department: 'customer-support',
        status: 'active',
        tasksCompleted: 312,
        efficiency: 97,
        color: '#14b8a6',
        gradient: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)'
    },
    {
        id: 'ava-martinez',
        name: 'Ava Martinez',
        role: 'ABM Specialist',
        emoji: '🎯',
        department: 'account-based-marketing',
        status: 'working',
        tasksCompleted: 56,
        efficiency: 90,
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
    },
    {
        id: 'robert-davis',
        name: 'Robert Davis',
        role: 'Revenue Intelligence',
        emoji: '💰',
        department: 'revenue-intelligence',
        status: 'active',
        tasksCompleted: 178,
        efficiency: 98,
        color: '#eab308',
        gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
    },
    {
        id: 'oscar-wright',
        name: 'Oscar Wright',
        role: 'Operations Coordinator',
        emoji: '🎼',
        department: 'orchestration',
        status: 'active',
        tasksCompleted: 421,
        efficiency: 99,
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
];

// Recent Activity Data
const activities = [
    {
        agent: 'Marcus Hayes',
        emoji: '✍️',
        action: 'Created 3 blog posts',
        description: 'Generated SEO-optimized content for Q4 campaign',
        time: '2 min ago',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        agent: 'Sarah Chen',
        emoji: '🔍',
        action: 'Found 847 new leads',
        description: 'Qualified prospects matching ICP criteria',
        time: '15 min ago',
        gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
    },
    {
        agent: 'Emma Wilson',
        emoji: '⏰',
        action: 'Sent email campaign',
        description: '12,500 emails with 43% open rate',
        time: '1 hour ago',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
        agent: 'Nathan Cross',
        emoji: '🕷️',
        action: 'Competitor alert',
        description: 'Detected pricing change from top competitor',
        time: '2 hours ago',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
        agent: 'David Kim',
        emoji: '📊',
        action: 'Generated insights report',
        description: 'Weekly performance analysis with 8 actionable insights',
        time: '3 hours ago',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
];

// Initialize Dashboard
function initDashboard() {
    renderAgents();
    renderActivityFeed();
    setupEventListeners();
    startLiveUpdates();
}

// Render Agent Cards
function renderAgents(filter = 'all') {
    const grid = document.getElementById('agentsGrid');
    const filteredAgents = filter === 'all'
        ? agents
        : agents.filter(a => a.status === filter);

    grid.innerHTML = filteredAgents.map(agent => `
        <div class="agent-card" data-agent-id="${agent.id}" onclick="navigateToAgent('${agent.id}')">
            <div class="agent-header">
                <div class="agent-info">
                    <div class="agent-avatar" style="background: ${agent.gradient};">
                        ${agent.emoji}
                    </div>
                    <div>
                        <div class="agent-name">${agent.name}</div>
                        <div class="agent-role">${agent.role}</div>
                    </div>
                </div>
                <div class="status-badge ${agent.status}">${agent.status}</div>
            </div>
            <div class="agent-metrics">
                <div class="metric">
                    <div class="metric-value">${agent.tasksCompleted}</div>
                    <div class="metric-label">Tasks</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${agent.efficiency}%</div>
                    <div class="metric-label">Efficiency</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Show Agent Splash Screen with Blast of Color
function showAgentSplash(agentId) {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    // Create splash screen overlay
    const splash = document.createElement('div');
    splash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${agent.gradient};
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        animation: splashIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;

    splash.innerHTML = `
        <style>
            @keyframes splashIn {
                from {
                    opacity: 0;
                    transform: scale(0.8) rotate(-5deg);
                }
                to {
                    opacity: 1;
                    transform: scale(1) rotate(0deg);
                }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            @keyframes particles {
                0% {
                    opacity: 0;
                    transform: translateY(0) scale(0);
                }
                50% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                    transform: translateY(-100px) scale(1);
                }
            }
            .splash-particles {
                position: absolute;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
            .particle {
                position: absolute;
                width: 10px;
                height: 10px;
                background: white;
                border-radius: 50%;
                animation: particles 2s ease-out infinite;
            }
        </style>
        <div class="splash-particles" id="particles"></div>
        <div style="
            font-size: 8rem;
            animation: float 3s ease-in-out infinite;
            margin-bottom: 2rem;
            filter: drop-shadow(0 10px 30px rgba(0,0,0,0.3));
        ">
            ${agent.emoji}
        </div>
        <h1 style="
            font-size: 3rem;
            font-weight: 800;
            color: white;
            margin-bottom: 1rem;
            text-shadow: 0 5px 20px rgba(0,0,0,0.3);
            animation: pulse 2s ease-in-out infinite;
        ">
            ${agent.name}
        </h1>
        <p style="
            font-size: 1.5rem;
            color: rgba(255,255,255,0.9);
            margin-bottom: 3rem;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        ">
            ${agent.role}
        </p>
        <div style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            background: rgba(255,255,255,0.2);
            padding: 2rem 4rem;
            border-radius: 2rem;
            backdrop-filter: blur(10px);
        ">
            <div style="text-align: center;">
                <div style="font-size: 2.5rem; font-weight: 800; color: white;">${agent.tasksCompleted}</div>
                <div style="color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem;">Tasks Done</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 2.5rem; font-weight: 800; color: white;">${agent.efficiency}%</div>
                <div style="color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem;">Efficiency</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 2.5rem; font-weight: 800; color: white;">${agent.status === 'active' ? '✓' : '⚡'}</div>
                <div style="color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem;">${agent.status}</div>
            </div>
        </div>
        <button onclick="closeAgentSplash()" style="
            margin-top: 3rem;
            padding: 1rem 3rem;
            background: white;
            color: ${agent.color};
            border: none;
            border-radius: 1rem;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Close
        </button>
    `;

    document.body.appendChild(splash);

    // Add particles
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particlesContainer.appendChild(particle);
        }, i * 50);
    }

    // Store reference for closing
    window.currentSplash = splash;
}

// Close Agent Splash
function closeAgentSplash() {
    if (window.currentSplash) {
        window.currentSplash.style.animation = 'splashIn 0.5s reverse';
        setTimeout(() => {
            window.currentSplash.remove();
            window.currentSplash = null;
        }, 500);
    }
}

// Navigate to Agent Page
function navigateToAgent(agentId) {
    window.location.href = `agents/${agentId}.html`;
}

// Render Activity Feed
function renderActivityFeed() {
    const feed = document.getElementById('activityFeed');
    feed.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon" style="background: ${activity.gradient};">
                ${activity.emoji}
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.agent} - ${activity.action}</div>
                <div class="activity-description">${activity.description}</div>
            </div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

// Filter Agents
function filterAgents(filter) {
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Render filtered agents
    renderAgents(filter);
}

// Send AI Command
function sendCommand() {
    const input = document.getElementById('aiCommand');
    const command = input.value.trim();

    if (!command) return;

    // Show loading state
    input.value = 'Processing...';
    input.disabled = true;

    // Simulate AI processing
    setTimeout(() => {
        const agent = determineAgentForTask(command);
        showTaskAssignmentNotification(command, agent);

        // Navigate to agent page after 2 seconds
        setTimeout(() => {
            navigateToAgent(agent.id);
        }, 2000);
    }, 1500);
}

// Determine which agent should handle the task
function determineAgentForTask(command) {
    const lowerCommand = command.toLowerCase();

    // Content Creation
    if (lowerCommand.includes('content') || lowerCommand.includes('blog') || lowerCommand.includes('write') || lowerCommand.includes('article')) {
        return agents.find(a => a.id === 'marcus-hayes');
    }
    // Lead Generation
    else if (lowerCommand.includes('lead') || lowerCommand.includes('prospect') || lowerCommand.includes('outreach')) {
        return agents.find(a => a.id === 'sarah-chen');
    }
    // Email Marketing
    else if (lowerCommand.includes('email') || lowerCommand.includes('newsletter') || lowerCommand.includes('drip')) {
        return agents.find(a => a.id === 'emma-wilson');
    }
    // Social Advertising
    else if (lowerCommand.includes('social') || lowerCommand.includes('ad') || lowerCommand.includes('facebook') || lowerCommand.includes('instagram')) {
        return agents.find(a => a.id === 'alex-rodriguez');
    }
    // Video Marketing
    else if (lowerCommand.includes('video') || lowerCommand.includes('youtube') || lowerCommand.includes('film')) {
        return agents.find(a => a.id === 'victor-stone');
    }
    // Influencer Marketing
    else if (lowerCommand.includes('influencer') || lowerCommand.includes('partnership') || lowerCommand.includes('collaboration')) {
        return agents.find(a => a.id === 'natalie-brooks');
    }
    // Conversion Optimization
    else if (lowerCommand.includes('conversion') || lowerCommand.includes('a/b') || lowerCommand.includes('optimize') || lowerCommand.includes('cro')) {
        return agents.find(a => a.id === 'oliver-grant');
    }
    // Competitive Intelligence
    else if (lowerCommand.includes('competitor') || lowerCommand.includes('competitive') || lowerCommand.includes('market research')) {
        return agents.find(a => a.id === 'nathan-cross');
    }
    // Personalization
    else if (lowerCommand.includes('personalization') || lowerCommand.includes('personalize') || lowerCommand.includes('segment')) {
        return agents.find(a => a.id === 'maya-patel');
    }
    // Analytics
    else if (lowerCommand.includes('analytic') || lowerCommand.includes('report') || lowerCommand.includes('data') || lowerCommand.includes('dashboard')) {
        return agents.find(a => a.id === 'david-kim');
    }
    // SEO
    else if (lowerCommand.includes('seo') || lowerCommand.includes('search') || lowerCommand.includes('rank') || lowerCommand.includes('keyword')) {
        return agents.find(a => a.id === 'ryan-mitchell');
    }
    // Customer Support
    else if (lowerCommand.includes('support') || lowerCommand.includes('customer') || lowerCommand.includes('help') || lowerCommand.includes('chatbot')) {
        return agents.find(a => a.id === 'sophie-anderson');
    }
    // ABM
    else if (lowerCommand.includes('abm') || lowerCommand.includes('account-based') || lowerCommand.includes('enterprise')) {
        return agents.find(a => a.id === 'ava-martinez');
    }
    // Revenue Intelligence
    else if (lowerCommand.includes('revenue') || lowerCommand.includes('forecast') || lowerCommand.includes('pipeline') || lowerCommand.includes('sales')) {
        return agents.find(a => a.id === 'robert-davis');
    }
    // Default to Operations Coordinator
    else {
        return agents.find(a => a.id === 'oscar-wright');
    }
}

// Show Task Assignment Notification
function showTaskAssignmentNotification(task, agent) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: ${agent.gradient};
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 1rem;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 9998;
        animation: slideIn 0.5s ease-out;
        max-width: 400px;
    `;

    notification.innerHTML = `
        <style>
            @keyframes slideIn {
                from {
                    transform: translateX(500px);
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
                    transform: translateX(500px);
                    opacity: 0;
                }
            }
        </style>
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
            <div style="font-size: 2rem;">${agent.emoji}</div>
            <div>
                <div style="font-weight: 700; font-size: 1.1rem;">Task Assigned to ${agent.name}</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">${agent.role}</div>
            </div>
        </div>
        <div style="font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.9;">
            "${task}"
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Quick Actions
function quickAction(action) {
    const actions = {
        'content': 'Generate comprehensive content campaign for Q4 product launch',
        'leads': 'Find and qualify 1000 B2B leads matching our ICP',
        'email': 'Create and send personalized email nurture campaign',
        'social': 'Optimize Facebook and LinkedIn ad campaigns for better ROAS',
        'analyze': 'Generate weekly marketing performance report with insights',
        'competitor': 'Scan top 10 competitors for pricing and feature changes'
    };

    const command = actions[action];
    document.getElementById('aiCommand').value = command;
    sendCommand();
}

// Setup Event Listeners
function setupEventListeners() {
    // Enter key on command input
    document.getElementById('aiCommand').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendCommand();
        }
    });
}

// Start Live Updates
function startLiveUpdates() {
    setInterval(() => {
        // Update metrics randomly to simulate live data
        agents.forEach(agent => {
            if (Math.random() > 0.7) {
                agent.tasksCompleted += Math.floor(Math.random() * 3);
                agent.efficiency = Math.min(99, agent.efficiency + (Math.random() > 0.5 ? 1 : -1));
            }
        });

        // Re-render if needed
        if (Math.random() > 0.8) {
            renderAgents();
        }
    }, 5000);
}

// Show/Hide Agents Dropdown
function showAgentsDropdown() {
    const dropdown = document.getElementById('agentsDropdown');

    if (!dropdown.classList.contains('show')) {
        // Populate dropdown with agents
        dropdown.innerHTML = `
            <div class="dropdown-header">All Agents (${agents.length})</div>
            ${agents.map(agent => `
                <div class="dropdown-agent" onclick="navigateToAgent('${agent.id}'); event.stopPropagation();">
                    <div class="dropdown-agent-emoji">${agent.emoji}</div>
                    <div class="dropdown-agent-info">
                        <div class="dropdown-agent-name">${agent.name}</div>
                        <div class="dropdown-agent-role">${agent.role}</div>
                    </div>
                </div>
            `).join('')}
        `;

        dropdown.classList.add('show');

        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', closeDropdown);
        }, 10);
    } else {
        dropdown.classList.remove('show');
    }
}

function closeDropdown(e) {
    const dropdown = document.getElementById('agentsDropdown');
    const agentsBtn = document.getElementById('agentsBtn');

    if (!dropdown.contains(e.target) && e.target !== agentsBtn) {
        dropdown.classList.remove('show');
        document.removeEventListener('click', closeDropdown);
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initDashboard);
