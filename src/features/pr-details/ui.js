export const prDetailsHtml = `
    <section class="pr-details-page">
        <div class="back-button">
            <a href="/" class="back-link">← Back to PR List</a>
        </div>

        <div class="card pr-header-card">
            <div class="pr-title-section">
                <h1 id="prTitle">Loading PR...</h1>
                <div id="prMeta" class="pr-meta"></div>
            </div>
            <div id="prDescription" class="pr-description"></div>
            <div id="prLabels" class="pr-labels"></div>
            <div class="pr-stats">
                <div class="stat-item">
                    <span class="stat-label">Lines Changed</span>
                    <span id="linesChanged" class="stat-value">-</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Related PRs</span>
                    <span id="relatedPRCount" class="stat-value">-</span>
                </div>
            </div>
        </div>

        <div class="card">
            <h2>AI Summary</h2>
            <div id="aiSummary" class="ai-summary">
                <div class="loading">Analyzing changes...</div>
            </div>
        </div>

        <div class="card">
            <h2>Code Review Comments</h2>
            <div id="reviewComments" class="review-comments">
                <div class="loading">Loading comments...</div>
            </div>
        </div>

        <div class="card">
            <h2>JIRA Activity</h2>
            <div id="jiraComments" class="jira-comments">
                <div class="loading">Loading comments...</div>
            </div>
        </div>

        <div id="addToDemo" class="card action-card" style="display: none;">
            <h2>Add to Demo</h2>
            <p>This will merge the PR to the demo branch and trigger the deployment action.</p>
            <div id="mergeStatus" class="merge-status"></div>
            <div class="action-buttons">
                <button id="confirmAddToDemo" class="primary-button">
                    <span class="button-text">Confirm Add to Demo</span>
                    <span class="spinner" style="display: none;"></span>
                </button>
            </div>
        </div>

        <div id="successModal" class="modal" style="display: none;">
            <div class="modal-content">
                <h3>Success!</h3>
                <p>The label has been added to the pull request.</p>
                <button onclick="window.location.href = '/'" class="primary-button">Return to PR List</button>
            </div>
        </div>
    </section>
`;

export const prDetailsCss = `
    .pr-details-page {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .back-button {
        margin-bottom: 2rem;
    }

    .back-link {
        color: var(--text-color);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        font-weight: 500;
        opacity: 0.7;
    }

    .back-link:hover {
        opacity: 1;
    }

    .pr-header-card {
        border-left: 4px solid var(--primary-color);
    }

    .pr-title-section {
        margin-bottom: 1.5rem;
    }

    .pr-title-section h1 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .pr-meta {
        color: var(--text-color);
        opacity: 0.7;
        font-size: 0.9rem;
    }

    .pr-description {
        margin: 1.5rem 0;
        padding: 1rem;
        background: var(--background-color);
        border-radius: 0.25rem;
        white-space: pre-wrap;
    }

    .pr-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-color);
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .stat-label {
        font-size: 0.875rem;
        color: var(--text-color);
        opacity: 0.7;
        margin-bottom: 0.25rem;
    }

    .stat-value {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--primary-color);
    }

    .jira-comments {
        margin-top: 1rem;
    }

    .comment-item {
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    .comment-item:last-child {
        border-bottom: none;
    }

    .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
    }

    .comment-author {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
    }

    .comment-date {
        color: var(--text-color);
        opacity: 0.7;
    }

    .comment-body {
        font-size: 0.9rem;
        line-height: 1.5;
    }

    .comment-body p {
        margin-bottom: 0.5rem;
    }

    .comment-body p:last-child {
        margin-bottom: 0;
    }

    .comment-body code {
        background: var(--background-color);
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-family: monospace;
        font-size: 0.85em;
    }

    .comment-body a {
        color: var(--primary-color);
        text-decoration: none;
    }

    .comment-body a:hover {
        text-decoration: underline;
    }

    .mention {
        color: var(--primary-color);
        font-weight: 500;
    }

    .action-card {
        background: white;
        border: 1px solid var(--border-color);
    }

    .action-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    .primary-button, .secondary-button {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.2s;
    }

    .primary-button {
        background: var(--primary-color);
        color: white;
        border: none;
    }

    .primary-button:hover {
        opacity: 0.9;
    }

    .secondary-button {
        background: transparent;
        color: var(--text-color);
        border: 1px solid var(--border-color);
    }

    .secondary-button:hover {
        background: var(--border-color);
    }

    .loading {
        text-align: center;
        color: var(--text-color);
        opacity: 0.7;
        padding: 2rem;
    }

    .pr-labels {
        margin: 1rem 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .label {
        display: inline-block;
        padding: 0.15rem 0.4rem;
        font-size: 0.8rem;
        font-weight: 500;
        border-radius: 2px;
        color: #000;
        opacity: 0.8;
    }

    .ai-summary {
        font-size: 0.95rem;
        line-height: 1.6;
        color: var(--text-color);
        padding: 1.5rem;
        background: var(--background-color);
        border-radius: 0.25rem;
        margin-top: 1rem;
    }

    .ai-summary h3 {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 0.75rem 0;
        color: var(--primary-color);
    }

    .ai-summary section {
        margin-bottom: 1.5rem;
    }

    .ai-summary section:last-child {
        margin-bottom: 0;
    }

    .ai-summary ul {
        margin: 0;
        padding-left: 1.5rem;
    }

    .ai-summary li {
        margin-bottom: 0.5rem;
    }

    .ai-summary li:last-child {
        margin-bottom: 0;
    }

    .ai-summary .overview {
        font-weight: 500;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    .merge-status {
        margin: 1rem 0;
        padding: 0.75rem 1rem;
        border-radius: 0.25rem;
        font-size: 0.9rem;
    }

    .merge-status.success {
        background-color: rgba(52, 211, 153, 0.1);
        color: rgb(6, 95, 70);
        border: 1px solid rgba(52, 211, 153, 0.2);
    }

    .merge-status.warning {
        background-color: rgba(251, 191, 36, 0.1);
        color: rgb(146, 64, 14);
        border: 1px solid rgba(251, 191, 36, 0.2);
    }

    .merge-status.error {
        background-color: rgba(239, 68, 68, 0.1);
        color: rgb(153, 27, 27);
        border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(2px);
    }

    .modal-content {
        background: var(--background-color, #ffffff);
        padding: 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        width: 90%;
        text-align: center;
        border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
    }

    .modal-content h3 {
        margin: 0 0 1rem 0;
        color: var(--text-color);
        font-size: 1.25rem;
        font-weight: 600;
    }

    .modal-content p {
        margin: 0 0 1.5rem 0;
        color: var(--text-muted);
        font-size: 0.95rem;
        line-height: 1.5;
    }

    .spinner {
        display: none;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s linear infinite;
        margin-left: 0.5rem;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .primary-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 120px;
    }

    .primary-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .review-comments {
        margin-top: 1rem;
    }

    .review-thread {
        margin-bottom: 2rem;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        overflow: hidden;
    }

    .review-thread:last-child {
        margin-bottom: 0;
    }

    .diff-header {
        background: var(--background-color);
        padding: 0.75rem;
        border-bottom: 1px solid var(--border-color);
        font-family: monospace;
        font-size: 0.9rem;
        color: var(--text-muted);
    }

    .diff-content {
        background: var(--background-color);
        padding: 0.75rem;
        border-bottom: 1px solid var(--border-color);
        font-family: monospace;
        font-size: 0.9rem;
        white-space: pre-wrap;
        overflow-x: auto;
    }

    .review-comment {
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
        background: var(--card-bg);
    }

    .review-comment:last-child {
        border-bottom: none;
    }

    .review-comment .header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .review-comment .avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
    }

    .review-comment .username {
        font-weight: 500;
        color: var(--text-color);
    }

    .review-comment .date {
        color: var(--text-muted);
        font-size: 0.9rem;
    }

    .review-comment .body {
        color: var(--text-color);
        line-height: 1.5;
    }

    .review-state {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: 500;
        margin-left: 0.5rem;
    }

    .review-state.approved {
        background: #2da44e33;
        color: #2da44e;
    }

    .review-state.changes-requested {
        background: #cf222e33;
        color: #cf222e;
    }

    .review-state.commented {
        background: #6e768166;
        color: #6e7681;
    }

    .logo {
        color: var(--primary-color);
        transition: transform 0.2s ease;
        margin: -5px 0.75rem 0 0;
        vertical-align: middle;
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

export const prDetailsJs = `
let prNumber = null;
let jiraUrl = '';
let labelToIgnore = '';
let currentPR = null;
let userEmail = '';

function renderJiraComment(comment) {
    function renderContent(content) {
        if (!content) return '';
        
        return content.map(node => {
            if (node.type === 'paragraph') {
                return \`<p>\${node.content ? renderContent(node.content) : ''}</p>\`;
            }
            if (node.type === 'text') {
                let text = node.text;
                if (node.marks) {
                    node.marks.forEach(mark => {
                        if (mark.type === 'link') {
                            text = \`<a href="\${mark.attrs.href}" target="_blank">\${text}</a>\`;
                        }
                        if (mark.type === 'code') {
                            text = \`<code>\${text}</code>\`;
                        }
                    });
                }
                return text;
            }
            if (node.type === 'mention') {
                return \`<span class="mention">@\${node.attrs.text.replace('@', '')}</span>\`;
            }
            if (node.type === 'hardBreak') {
                return '<br>';
            }
            return '';
        }).join('');
    }

    return \`
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-author">
                    <img src="\${comment.author.avatarUrls['24x24']}" alt="\${comment.author.displayName}" class="avatar">
                    <span>\${comment.author.displayName}</span>
                </div>
                <span class="comment-date">\${new Date(comment.created).toLocaleString()}</span>
            </div>
            <div class="comment-body">
                \${renderContent(comment.body.content)}
            </div>
        </div>
    \`;
}

function renderReviewState(state) {
    if (!state) return '';
    const stateMap = {
        'APPROVED': { class: 'approved', text: 'Approved' },
        'CHANGES_REQUESTED': { class: 'changes-requested', text: 'Changes Requested' },
        'COMMENTED': { class: 'commented', text: 'Reviewed' }
    };
    const stateInfo = stateMap[state] || { class: '', text: state };
    return \`<span class="review-state \${stateInfo.class}">\${stateInfo.text}</span>\`;
}

function renderReviewThread(thread) {
    const firstComment = thread[0];
    return \`
        <div class="review-thread">
            <div class="diff-header">
                \${firstComment.path}:\${firstComment.line}
            </div>
            <div class="diff-content">
                \${firstComment.diff_hunk}
            </div>
            \${thread.map(comment => \`
                <div class="review-comment">
                    <div class="header">
                        <img src="\${comment.avatar}" alt="\${comment.user}" class="avatar">
                        <span class="username">\${comment.user}</span>
                        <span class="date">\${new Date(comment.created_at).toLocaleString()}</span>
                    </div>
                    <div class="body">\${comment.body}</div>
                </div>
            \`).join('')}
        </div>
    \`;
}

function renderReview(review) {
    return \`
        <div class="review-thread">
            <div class="review-comment">
                <div class="header">
                    <img src="\${review.avatar}" alt="\${review.user}" class="avatar">
                    <span class="username">\${review.user}</span>
                    <span class="date">\${new Date(review.created_at).toLocaleString()}</span>
                    \${renderReviewState(review.state)}
                </div>
                <div class="body">\${review.body}</div>
            </div>
        </div>
    \`;
}

async function loadPRDetails() {
    const params = new URLSearchParams(window.location.search);
    prNumber = params.get('pr');
    if (!prNumber) {
        showToast('No PR number provided');
        return;
    }

    // Load PR details first as it contains essential information
    try {
        const prResponse = await fetch(\`/api/pr/\${prNumber}\`);
        if (!prResponse.ok) throw new Error('Failed to fetch PR details');
        const data = await prResponse.json();
        
        // Store current PR data
        currentPR = data;
        jiraUrl = data.jiraUrl;
        labelToIgnore = data.labelToIgnore;
        
        // Update basic PR information
        document.getElementById('prTitle').textContent = data.title;
        document.getElementById('prMeta').textContent = \`#\${data.number} by \${data.user.login}\`;
        document.getElementById('prDescription').textContent = data.body || 'No description provided.';
        document.getElementById('linesChanged').textContent = \`+\${data.additions} -\${data.deletions}\`;
        
        // Render labels
        const labelsContainer = document.getElementById('prLabels');
        if (data.labels && data.labels.length > 0) {
            labelsContainer.innerHTML = data.labels.map(label => \`
                <span class="label" style="background-color: #\${label.color || 'e1e4e8'}">
                    \${label.name || ''}
                </span>
            \`).join('');
        }

        // Handle Add to Demo section
        const hasIgnoreLabel = data.labels?.some(label => label.name === labelToIgnore);
        const addToDemoSection = document.getElementById('addToDemo');
        const mergeStatus = document.getElementById('mergeStatus');
        const confirmButton = document.getElementById('confirmAddToDemo');
        const actionButtons = document.querySelector('.action-buttons');
        const actionCardTitle = document.getElementById('addToDemo').querySelector('h2');
        const actionCardDescription = document.getElementById('addToDemo').querySelector('p');

        if (!hasIgnoreLabel && data.isAuthorized) {
            addToDemoSection.style.display = 'block';

            if (!data.merged_at) {
                // Open PR - Show request to add to demo option
                actionCardTitle.textContent = 'Request to Add to Demo';
                actionCardDescription.textContent = 'This will add a label to the PR to indicate it should be added to demo when merged.';
                confirmButton.querySelector('.button-text').textContent = 'Request Add to Demo';
                mergeStatus.style.display = 'none';
                actionButtons.style.display = 'flex';
            } else {
                // Merged PR - Show merge to demo option
                actionCardTitle.textContent = 'Add to Demo';
                actionCardDescription.textContent = 'This will merge the PR to the demo branch and trigger the deployment action.';
                confirmButton.querySelector('.button-text').textContent = 'Confirm Add to Demo';
                
                // Show merge status for merged PRs
                mergeStatus.style.display = 'block';
                if (data.mergeCheck) {
                    if (!data.mergeCheck.demoBranchExists) {
                        mergeStatus.className = 'merge-status error';
                        mergeStatus.textContent = 'Cannot proceed: Demo branch does not exist. Please contact a member of the development team.';
                        actionButtons.style.display = 'none';
                    } else if (!data.mergeCheck.canMerge) {
                        mergeStatus.className = 'merge-status warning';
                        mergeStatus.textContent = 'This PR cannot be merged cleanly into the demo branch. Please reach out to a member of the development team for assistance with merging.';
                        actionButtons.style.display = 'none';
                    } else {
                        mergeStatus.className = 'merge-status success';
                        mergeStatus.textContent = 'Ready to be added to demo';
                        actionButtons.style.display = 'flex';
                    }
                }
            }
        }

        // Load review comments
        fetch(\`/api/pr/\${prNumber}/reviews\`)
            .then(response => response.json())
            .then(reviewData => {
                const reviewsContainer = document.getElementById('reviewComments');
                if (reviewData.threads.length === 0 && reviewData.reviews.length === 0) {
                    reviewsContainer.innerHTML = '<div class="no-comments">No review comments yet.</div>';
                } else {
                    reviewsContainer.innerHTML = \`
                        \${reviewData.reviews.map(renderReview).join('')}
                        \${reviewData.threads.map(renderReviewThread).join('')}
                    \`;
                }
            })
            .catch(error => {
                console.error('Error loading review comments:', error);
                document.getElementById('reviewComments').innerHTML = 
                    '<div class="error">Failed to load review comments.</div>';
            });

        // Start loading AI summary and JIRA data independently
        const ticketMatch = data.title.match(/^([A-Z]{2,3}-[0-9]+)/);
        
        // Load AI Summary independently
        fetch(\`/api/pr/\${prNumber}/summary\`)
            .then(response => response.json())
            .then(summaryData => {
                const summary = summaryData.summary;
                document.getElementById('aiSummary').innerHTML = \`
                    \${summary.overview ? \`
                        <div class="overview">\${summary.overview}</div>
                    \` : ''}
                    
                    \${summary.keyChanges?.length ? \`
                        <section>
                            <h3>Key Changes</h3>
                            <ul>
                                \${summary.keyChanges.map(change => \`
                                    <li>\${change}</li>
                                \`).join('')}
                            </ul>
                        </section>
                    \` : ''}
                \`;
            })
            .catch(error => {
                console.error('Error loading AI summary:', error);
                document.getElementById('aiSummary').innerHTML = 'Failed to generate AI summary';
            });

        // Load JIRA data independently if ticket number is present
        if (ticketMatch) {
            const ticketNumber = ticketMatch[1];
            
            // Load related PRs count
            fetch(\`/api/prs/ticket/\${ticketNumber}\`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('relatedPRCount').textContent = data.count;
                })
                .catch(error => {
                    console.error('Error loading related PRs:', error);
                    document.getElementById('relatedPRCount').textContent = 'Error';
                });

            // Load JIRA comments
            fetch(\`/api/jira/\${ticketNumber}/comments\`)
                .then(response => response.json())
                .then(comments => {
                    const commentsContainer = document.getElementById('jiraComments');
                    if (comments.length === 0) {
                        commentsContainer.innerHTML = '<div class="comment-item">No comments found.</div>';
                    } else {
                        commentsContainer.innerHTML = comments.map(renderJiraComment).join('');
                    }
                })
                .catch(error => {
                    console.error('Error loading JIRA comments:', error);
                    document.getElementById('jiraComments').innerHTML = 
                        '<div class="comment-item">Failed to load comments.</div>';
                });
        } else {
            document.getElementById('relatedPRCount').textContent = 'N/A';
            document.getElementById('jiraComments').innerHTML = 
                '<div class="comment-item">No JIRA ticket found in PR title</div>';
        }
    } catch (error) {
        console.error('Error loading PR details:', error);
        showToast('Error: ' + error.message);
    }
}

document.getElementById('confirmAddToDemo').addEventListener('click', async () => {
    const button = document.getElementById('confirmAddToDemo');
    const buttonText = button.querySelector('.button-text');
    const spinner = button.querySelector('.spinner');
    
    // Disable button and show spinner
    button.disabled = true;
    buttonText.style.opacity = '0.7';
    spinner.style.display = 'inline-block';
    
    try {
        if (currentPR && !currentPR.merged_at) {
            // For open PRs, add the demo trigger label
            const response = await fetch('/api/add-label', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prNumber }),
            });

            if (!response.ok) throw new Error('Failed to add label to PR');
            
            // Show success modal
            const modal = document.getElementById('successModal');
            modal.style.display = 'flex';
        } else {
            // For merged PRs, proceed with merge to demo branch
            const mergeResponse = await fetch('/api/merge-to-demo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prNumber }),
            });

            if (!mergeResponse.ok) throw new Error('Failed to merge PR');
            
            const actionResponse = await fetch('/api/trigger-action', {
                method: 'POST',
            });

            if (!actionResponse.ok) throw new Error('Failed to trigger action');
            showToast('Successfully added PR to demo and triggered action');
            window.location.href = '/';
        }
    } catch (error) {
        showToast('Error: ' + error.message);
        // Reset button state
        button.disabled = false;
        buttonText.style.opacity = '1';
        spinner.style.display = 'none';
    }
});

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

// Add to initialization
document.addEventListener('DOMContentLoaded', () => {
    fetchUserInfo();
    loadPRDetails();
});
`; 