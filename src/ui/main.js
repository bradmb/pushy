import { showToast } from './utils.js';

async function fetchMergedPRs() {
    try {
        const response = await fetch('/api/prs');
        if (!response.ok) throw new Error('Failed to fetch PRs');
        const prs = await response.json();
        console.log('Fetched PRs:', prs);
        
        // Filter for merged PRs and valid objects
        const validPRs = prs.filter(pr => 
            pr && 
            typeof pr === 'object' && 
            pr.merged_at !== null
        );
        
        displayPRs(validPRs);
    } catch (error) {
        console.error('Error details:', error);
        showToast('Error fetching PRs: ' + error.message);
    }
}

function displayPRs(prs) {
    console.log('Displaying PRs:', prs);
    const prList = document.getElementById('prList');
    if (!prList) {
        console.error('Could not find prList element');
        return;
    }
    
    prList.innerHTML = prs.map(pr => {
        if (!pr) return '';
        
        const number = pr.number || 'Unknown';
        const title = pr.title || 'Untitled PR';
        const htmlUrl = pr.html_url || '#';
        const author = pr.user?.login || 'Unknown';
        const mergedAt = pr.merged_at ? new Date(pr.merged_at).toLocaleString() : 'Unknown';
        const labels = Array.isArray(pr.labels) ? pr.labels : [];

        try {
            return `
                <div class="pr-item">
                    <div class="pr-header">
                        <strong>#${number}</strong>
                        <a href="${htmlUrl}" target="_blank">${title}</a>
                    </div>
                    <div class="pr-details">
                        <div>Author: ${author}</div>
                        <div>Merged: ${mergedAt}</div>
                        ${labels.length ? `
                            <div class="pr-labels">
                                ${labels.map(label => `
                                    <span class="label" style="background-color: #${label.color || 'e1e4e8'}">
                                        ${label.name || ''}
                                    </span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering PR:', pr, error);
            return '';
        }
    }).join('');
}

async function mergePRToDemo() {
    const prNumber = document.getElementById('prNumber').value;
    if (!prNumber) {
        showToast('Please enter a PR number');
        return;
    }

    try {
        const response = await fetch('/api/merge-to-demo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prNumber }),
        });

        if (!response.ok) throw new Error('Failed to merge PR');
        showToast('Successfully merged PR to demo branch');
        fetchMergedPRs();
    } catch (error) {
        showToast('Error merging PR: ' + error.message);
    }
}

async function triggerGitHubAction() {
    try {
        const response = await fetch('/api/trigger-action', {
            method: 'POST',
        });

        if (!response.ok) throw new Error('Failed to trigger action');
        showToast('Successfully triggered GitHub Action');
    } catch (error) {
        showToast('Error triggering action: ' + error.message);
    }
}

// Event Listeners
document.getElementById('refreshButton').addEventListener('click', fetchMergedPRs);
document.getElementById('mergeToDemo').addEventListener('click', mergePRToDemo);
document.getElementById('triggerAction').addEventListener('click', triggerGitHubAction);

// Initial load
fetchMergedPRs(); 