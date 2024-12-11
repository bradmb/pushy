import { handlePRsEndpoint, handleUserEndpoint } from './features/prs/index.js';
import { prListHtml, prListCss, prListJs, headerHtml } from './features/prs/ui.js';
import { prDetailsHtml, prDetailsCss, prDetailsJs } from './features/pr-details/ui.js';
import { requireAuth, getAuthenticatedUser, isAuthorizedUser } from './auth.js';
import { getPRDetails, getPRDiff, getLastMergedPRs, canMergeToDemoBranch, addLabelToPR, addCommentToPR, getPRReviewComments } from './api/github.js';
import { getIssue } from './api/jira.js';
import { generateCodeSummary } from './api/openai.js';

// Read and store static assets
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pushy - GitHub & JIRA Integration</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div class="app">
        ${headerHtml}
        <main id="mainContent">
            <!-- Content will be dynamically inserted here -->
        </main>
        
        <div id="toast" class="toast"></div>
    </div>
    <script type="module" src="/main.js"></script>
</body>
</html>`;

const cssContent = `:root {
    --primary-color: #6366f1;
    --background-color: #f8fafc;
    --card-background: #ffffff;
    --text-color: #1e293b;
    --border-color: #e2e8f0;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.5;
}

.app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

header {
    margin-bottom: 2rem;
}

h1 {
    font-size: 2rem;
    color: var(--primary-color);
}

.card {
    background: var(--card-background);
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

button {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: opacity 0.2s;
}

button:hover {
    opacity: 0.9;
}

.list {
    display: grid;
    gap: 1rem;
}

.toast {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 1rem;
    background: var(--primary-color);
    color: white;
    border-radius: 0.25rem;
    opacity: 0;
    transition: opacity 0.3s;
}

.toast.show {
    opacity: 1;
}

${prListCss}
${prDetailsCss}`;

const utilsJs = `export function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}`;

const jsContent = `import { showToast } from './utils.js';

// Router function
function renderPage() {
    const mainContent = document.getElementById('mainContent');
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path === '/pr-details' && params.get('pr')) {
        mainContent.innerHTML = \`${prDetailsHtml}\`;
        ${prDetailsJs}
    } else {
        mainContent.innerHTML = \`${prListHtml}\`;
        ${prListJs}
    }
}

// Initialize router
renderPage();
window.addEventListener('popstate', renderPage);`;

async function handleRequest(request, env) {
    // Check authentication for all routes except static assets
    const url = new URL(request.url);
    if (!url.pathname.match(/\.(css|js)$/)) {
        const authError = requireAuth(request);
        if (authError) return authError;
    }
    
    // API Routes
    if (url.pathname.startsWith('/api/')) {
        return handleApiRequest(request, url, env);
    }
    
    // Static Assets
    if (url.pathname === '/styles.css') {
        return new Response(cssContent, {
            headers: { 
                'Content-Type': 'text/css',
                'Cache-Control': 'public, max-age=3600'
            },
        });
    }
    
    if (url.pathname === '/main.js') {
        return new Response(jsContent, {
            headers: { 
                'Content-Type': 'application/javascript',
                'Cache-Control': 'public, max-age=3600'
            },
        });
    }
    
    if (url.pathname === '/utils.js') {
        return new Response(utilsJs, {
            headers: { 
                'Content-Type': 'application/javascript',
                'Cache-Control': 'public, max-age=3600'
            },
        });
    }
    
    // All other routes serve the HTML (client-side routing)
    return new Response(htmlContent, {
        headers: { 
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
        },
    });
}

async function handleApiRequest(request, url, env) {
    const path = url.pathname.split('/api/')[1];
    
    // Handle PR details endpoint
    if (path.startsWith('pr/')) {
        // Check if it's a review comments request
        if (path.endsWith('/reviews')) {
            const prNumber = path.match(/^pr\/(\d+)\/reviews$/)?.[1];
            if (!prNumber) {
                return new Response(JSON.stringify({ error: 'Invalid PR number' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return handlePRReviewsEndpoint(request, prNumber, env);
        }

        // Check if it's a summary request
        if (path.endsWith('/summary')) {
            const prNumber = path.match(/^pr\/(\d+)\/summary$/)?.[1];
            if (!prNumber) {
                return new Response(JSON.stringify({ error: 'Invalid PR number' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return handlePRSummaryEndpoint(request, prNumber, env);
        }
        
        // Regular PR details request
        const prNumber = path.split('pr/')[1];
        return handlePRDetailsEndpoint(request, prNumber, env);
    }
    
    // Handle PRs by ticket endpoint
    if (path.startsWith('prs/ticket/')) {
        const ticketNumber = path.split('prs/ticket/')[1];
        return handlePRsByTicketEndpoint(request, ticketNumber, env);
    }
    
    // Handle JIRA comments endpoint
    if (path.startsWith('jira/') && path.endsWith('/comments')) {
        const ticketNumber = path.split('jira/')[1].split('/comments')[0];
        return handleJiraCommentsEndpoint(request, ticketNumber, env);
    }

    // Handle PR summary endpoint
    if (path.startsWith('pr/') && path.endsWith('/summary')) {
        const prNumber = path.split('pr/')[1].split('/summary')[0];
        return handlePRSummaryEndpoint(request, prNumber, env);
    }
    
    // Handle other endpoints
    switch (path) {
        case 'user':
            return handleUserEndpoint(request);
            
        case 'prs':
            return handlePRsEndpoint(request, env);
            
        case 'merge-to-demo':
            // ... existing code ...
            
        case 'trigger-action':
            // ... existing code ...
            
        case 'add-label':
            if (request.method !== 'POST') {
                return new Response('Method not allowed', { status: 405 });
            }
            try {
                const { prNumber } = await request.json();
                const userEmail = getAuthenticatedUser(request);
                
                // Add label and comment in parallel
                await Promise.all([
                    addLabelToPR(prNumber, env.DEMO_TRIGGER_LABEL, env),
                    addCommentToPR(prNumber, `@${userEmail} has requested that this PR be added to demo.`, env)
                ]);

                return new Response(JSON.stringify({ success: true }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: error.message }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
        default:
            return new Response('Not found', { status: 404 });
    }
}

async function handlePRDetailsEndpoint(request, prNumber, env) {
    if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const userEmail = getAuthenticatedUser(request);
        const isAuthorized = isAuthorizedUser(env, userEmail);
        
        // Get PR details and merge possibility in parallel
        const [pr, mergeCheck] = await Promise.all([
            getPRDetails(prNumber, env),
            canMergeToDemoBranch(prNumber, env)
        ]);
        
        const response = {
            ...pr,
            jiraUrl: env.JIRA_URL,
            labelToIgnore: env.LABEL_TO_IGNORE,
            isAuthorized,
            mergeCheck
        };
        
        return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handlePRsByTicketEndpoint(request, ticketNumber, env) {
    if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        // Get all PRs and filter by ticket number
        const allPRs = await getLastMergedPRs(env);
        const relatedPRs = allPRs.filter(pr => pr.title.startsWith(ticketNumber));
        
        return new Response(JSON.stringify({ count: relatedPRs.length }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleJiraCommentsEndpoint(request, ticketNumber, env) {
    if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const issue = await getIssue(ticketNumber, env);
        const comments = issue.fields.comment.comments || [];
        
        // Sort comments by created date, newest first
        comments.sort((a, b) => new Date(b.created) - new Date(a.created));
        
        return new Response(JSON.stringify(comments.slice(0, 5)), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handlePRSummaryEndpoint(request, prNumber, env) {
    if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        // Log for debugging
        console.log('Handling PR summary request:', {
            prNumber,
            url: request.url,
            targetRepo: env.TARGET_REPO
        });

        const diff = await getPRDiff(prNumber, env);
        const summary = await generateCodeSummary(diff, env);
        
        return new Response(JSON.stringify({ summary }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error in PR summary endpoint:', error);
        return new Response(JSON.stringify({ 
            error: error.message,
            details: {
                prNumber,
                targetRepo: env.TARGET_REPO
            }
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handlePRReviewsEndpoint(request, prNumber, env) {
    if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const reviews = await getPRReviewComments(prNumber, env);
        return new Response(JSON.stringify(reviews), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export default {
    fetch: handleRequest
}; 