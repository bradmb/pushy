import { getLastMergedPRs, getOpenPRs } from '../../api/github.js';
import { getAuthenticatedUser, isAuthorizedUser } from '../../auth.js';

export async function handleUserEndpoint(request) {
    const userEmail = getAuthenticatedUser(request);
    if (!userEmail) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify({ email: userEmail }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function handlePRsEndpoint(request, env) {
    if (request.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const userEmail = getAuthenticatedUser(request);
        const isAuthorized = isAuthorizedUser(env, userEmail);
        
        // Fetch both merged and open PRs in parallel
        const [mergedPRs, openPRs] = await Promise.all([
            getLastMergedPRs(env),
            getOpenPRs(env)
        ]);

        const response = {
            jiraUrl: env.JIRA_URL,
            labelToIgnore: env.LABEL_TO_IGNORE,
            isAuthorized,
            prs: mergedPRs,
            openPrs: openPRs
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