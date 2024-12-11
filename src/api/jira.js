export async function getJiraAuth(env) {
    return `Basic ${btoa(`${env.JIRA_USERNAME}:${env.JIRA_API_KEY}`)}`;
}

export async function getIssue(issueKey, env) {
    const response = await fetch(`${env.JIRA_URL}/rest/api/3/issue/${issueKey}`, {
        headers: {
            'Authorization': await getJiraAuth(env),
            'Accept': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error(`JIRA API error: ${response.statusText}`);
    }
    
    return await response.json();
}

export async function updateIssueStatus(issueKey, statusId, env) {
    const response = await fetch(`${env.JIRA_URL}/rest/api/3/issue/${issueKey}/transitions`, {
        method: 'POST',
        headers: {
            'Authorization': await getJiraAuth(env),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            transition: {
                id: statusId,
            },
        }),
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update JIRA issue status: ${response.statusText}`);
    }
    
    return true;
} 