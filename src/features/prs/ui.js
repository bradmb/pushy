export const prListHtml = `
    <section id="prSection" class="card">
        <div id="prList" class="list"></div>
    </section>
`;

export const headerHtml = `
    <header class="header">
        <div class="header-content">
            <div class="brand">
                <h1><svg class="logo" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Pushy</h1>
            </div>
            <div class="user-info">
                <span class="user-email"></span>
            </div>
        </div>
    </header>
`;

export const headerCss = `
    .header {
        background: var(--card-bg);
        border-bottom: 1px solid var(--border-color);
        padding: 1rem;
        margin-bottom: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .header-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
    }

    .brand {
        display: flex;
        align-items: center;
    }

    .logo {
        color: var(--primary-color);
        transition: transform 0.2s ease;
        margin: -5px 0.75rem 0 0;
        vertical-align: middle;
    }

    .brand:hover .logo {
        transform: translateY(-1px);
    }

    .header h1 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-color);
        margin: 0;
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-light, #6366f1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -0.5px;
        display: flex;
        align-items: center;
    }

    .user-info {
        color: var(--text-muted);
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .user-email {
        padding: 0.5rem 1rem;
        background: var(--background-color);
        border-radius: 9999px;
        border: 1px solid var(--border-color);
    }
`;

export const prListCss = `
.pr-list {
    padding: 1rem;
}

.section-header {
    margin: 2rem 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--primary-color);
    color: var(--text-color);
    font-size: 1.4rem;
    font-weight: 600;
}

.section-header:first-child {
    margin-top: 0;
}

.merged-header {
    margin-top: 3rem;
}

.day-header {
    margin: 1.5rem 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-color);
    font-size: 1.2rem;
    font-weight: 500;
}

.day-header:first-child {
    margin-top: 0;
}

.pr-item {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: var(--card-bg);
}

.pr-item:hover {
    background-color: var(--hover-bg, rgba(0, 0, 0, 0.05));
    transform: translateX(4px);
    border-left: 4px solid var(--primary-color, #0366d6);
    padding-left: calc(1rem - 4px);
}

.pr-item:last-child {
    border-bottom: none;
}

.pr-header {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
}

.pr-header .ticket {
    color: var(--link-color);
    text-decoration: none;
    font-weight: 500;
}

.pr-header .ticket:hover {
    text-decoration: underline;
}

.pr-header .title {
    color: var(--text-color);
    flex-grow: 1;
}

.pr-details {
    font-size: 0.9rem;
    color: var(--text-muted);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.pr-info {
    flex-grow: 1;
}

.pr-labels {
    margin-top: 0.5rem;
}

.label {
    display: inline-block;
    padding: 0.15rem 0.4rem;
    margin: 0 0.25rem 0.25rem 0;
    font-size: 0.8rem;
    font-weight: 500;
    border-radius: 2px;
    color: #000;
    opacity: 0.8;
}

.no-prs, .error {
    text-align: center;
    padding: 2rem;
    color: var(--text-muted);
}

.error {
    color: var(--error-color);
}

.header {
    background: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
    padding: 1rem;
    margin-bottom: 2rem;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
}

.user-info {
    color: var(--text-muted);
    font-size: 0.9rem;
}
`;

export const prListJs = `
let jiraUrl = '';
let labelToIgnore = '';
let userEmail = '';
let isAuthorized = false;

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function extractTicketNumber(title) {
    const match = title.match(/^([A-Z]{2,3}-[0-9]+)/);
    return match ? match[1] : null;
}

function groupPRsByDay(prs) {
    if (!Array.isArray(prs)) {
        console.error('Expected prs to be an array, got:', typeof prs);
        return {};
    }

    const grouped = {};
    prs.forEach(pr => {
        if (pr && pr.merged_at) {
            const day = formatDate(pr.merged_at);
            if (!grouped[day]) {
                grouped[day] = [];
            }
            grouped[day].push(pr);
        }
    });
    return grouped;
}

function renderPR(pr, showMergeTime = true) {
    const ticketNumber = extractTicketNumber(pr.title);
    const titleWithoutTicket = ticketNumber ? pr.title.replace(ticketNumber, '').trim() : pr.title;

    const prElement = document.createElement('div');
    prElement.className = 'pr-item';
    prElement.onclick = () => window.location.href = \`/pr-details?pr=\${pr.number}\`;

    const header = document.createElement('div');
    header.className = 'pr-header';
    
    const prNumber = document.createElement('strong');
    prNumber.textContent = \`#\${pr.number}\`;
    header.appendChild(prNumber);

    if (ticketNumber) {
        const ticketLink = document.createElement('a');
        ticketLink.href = \`\${jiraUrl}/browse/\${ticketNumber}\`;
        ticketLink.className = 'ticket';
        ticketLink.textContent = ticketNumber;
        ticketLink.target = '_blank';
        ticketLink.onclick = (e) => e.stopPropagation();
        header.appendChild(ticketLink);
    }

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = titleWithoutTicket;
    header.appendChild(title);

    const details = document.createElement('div');
    details.className = 'pr-details';
    
    const info = document.createElement('div');
    info.className = 'pr-info';
    info.innerHTML = \`
        <div>Author: \${pr.user?.login || 'unknown'}</div>
        \${showMergeTime ? \`<div>Merged: \${new Date(pr.merged_at).toLocaleString()}</div>\` : 
        \`<div>Updated: \${new Date(pr.updated_at).toLocaleString()}</div>\`}
    \`;

    if (pr.labels && pr.labels.length > 0) {
        const labels = document.createElement('div');
        labels.className = 'pr-labels';
        labels.innerHTML = pr.labels.map(label => \`
            <span class="label" style="background-color: #\${label.color || 'e1e4e8'}">
                \${label.name || ''}
            </span>
        \`).join('');
        info.appendChild(labels);
    }

    details.appendChild(info);
    prElement.appendChild(header);
    prElement.appendChild(details);
    return prElement;
}

async function fetchUserInfo() {
    try {
        const response = await fetch('/api/user');
        if (!response.ok) throw new Error('Failed to fetch user info');
        const data = await response.json();
        userEmail = data.email;
        
        // Update UI
        const userInfoElement = document.querySelector('.user-email');
        if (userInfoElement) {
            userInfoElement.textContent = userEmail;
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}

async function loadPRs() {
    try {
        const response = await fetch('/api/prs');
        if (!response.ok) throw new Error('Failed to fetch PRs');
        const data = await response.json();

        // Store config values
        jiraUrl = data.jiraUrl;
        labelToIgnore = data.labelToIgnore;
        isAuthorized = data.isAuthorized;

        const prList = document.getElementById('prList');
        prList.innerHTML = '';

        // Ensure data.prs and data.openPrs are arrays
        const mergedPRs = Array.isArray(data.prs) ? data.prs : [];
        const openPRs = Array.isArray(data.openPrs) ? data.openPrs : [];
        
        if (mergedPRs.length === 0 && openPRs.length === 0) {
            prList.innerHTML = '<p class="no-prs">No PRs found</p>';
            return;
        }

        // Add Open PRs section if there are any
        if (openPRs.length > 0) {
            const openHeader = document.createElement('h2');
            openHeader.className = 'section-header';
            openHeader.textContent = 'Open PRs';
            prList.appendChild(openHeader);

            // Sort open PRs by update time, newest first
            const sortedOpenPRs = openPRs.sort((a, b) => 
                new Date(b.updated_at) - new Date(a.updated_at)
            );

            sortedOpenPRs.forEach(pr => {
                prList.appendChild(renderPR(pr, false));
            });

            // Add a separator between open and merged PRs
            if (mergedPRs.length > 0) {
                const separator = document.createElement('h2');
                separator.className = 'section-header merged-header';
                separator.textContent = 'Recently Merged';
                prList.appendChild(separator);
            }
        }

        // Add Merged PRs grouped by day
        const groupedPRs = groupPRsByDay(mergedPRs);
        
        // Sort days in reverse chronological order
        const sortedDays = Object.entries(groupedPRs).sort((a, b) => {
            return new Date(b[0]) - new Date(a[0]);
        });
        
        for (const [day, dayPRs] of sortedDays) {
            const dayHeader = document.createElement('h2');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            prList.appendChild(dayHeader);

            dayPRs.forEach(pr => {
                prList.appendChild(renderPR(pr, true));
            });
        }
    } catch (error) {
        console.error('Error loading PRs:', error);
        const prList = document.getElementById('prList');
        prList.innerHTML = '<p class="error">Error loading PRs: ' + error.message + '</p>';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchUserInfo();
    loadPRs();
    // Add refresh button handler
    const refreshButton = document.getElementById('refreshButton');
    if (refreshButton) {
        refreshButton.addEventListener('click', loadPRs);
    }

    // Add favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    const svgContent = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="8" fill="#4F46E5"/><path d="M16 8L8 12L16 16L24 12L16 8Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 20L16 24L24 20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 16L16 20L24 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    favicon.href = 'data:image/svg+xml,' + encodeURIComponent(svgContent);
    document.head.appendChild(favicon);
});
`; 