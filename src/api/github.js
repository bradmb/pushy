import { getToken } from '@sagi.io/workers-jwt';

// Function to generate a JWT for GitHub App authentication
async function generateJWT(env) {
    const privateKeyPEM = env.GITHUB_PRIVATE_KEY;
    const payload = {
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 600, // JWT expiration time (10 minutes)
        iss: env.GITHUB_APP_ID
    };

    const token = await getToken({
        privateKeyPEM: privateKeyPEM,
        payload: payload,
        alg: 'RS256',
    });

    return token;
}

// Function to get the installation access token
async function getInstallationToken(env) {
    const jwt = await generateJWT(env);

    const response = await fetch(`https://api.github.com/app/installations/${env.GITHUB_INSTALLATION_ID}/access_tokens`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'YourAppName/1.0.0' // Replace with your app's name and version
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get installation token: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.token;
}

// Function to get last merged PRs
export async function getLastMergedPRs(env) {
    const token = await getInstallationToken(env);

    const response = await fetch(`https://api.github.com/repos/${env.TARGET_REPO}/pulls?state=closed&base=${env.TARGET_BRANCH}&sort=updated&direction=desc&per_page=10`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'YourAppName/1.0.0' // Replace with your app's name and version
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    const prs = await response.json();
    const mergedPRs = prs.filter(pr => pr.merged_at !== null);
    return mergedPRs;
}

// Function to merge a PR to the demo branch
export async function mergePRToDemo(prNumber, env) {
    const token = await getInstallationToken(env);

    // Update the base branch of the PR to DEMO_BRANCH
    const updateResponse = await fetch(`https://api.github.com/repos/${env.TARGET_REPO}/pulls/${prNumber}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'YourAppName/1.0.0' // Replace with your app's name and version
        },
        body: JSON.stringify({
            base: env.DEMO_BRANCH
        })
    });

    if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Failed to update PR base branch: ${updateResponse.status} - ${errorText}`);
    }

    // Merge the PR
    const mergeResponse = await fetch(`https://api.github.com/repos/${env.TARGET_REPO}/pulls/${prNumber}/merge`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'YourAppName/1.0.0' // Replace with your app's name and version
        }
    });

    if (!mergeResponse.ok) {
        const errorText = await mergeResponse.text();
        throw new Error(`Failed to merge PR: ${mergeResponse.status} - ${errorText}`);
    }

    const data = await mergeResponse.json();
    return data;
}

// Function to trigger a GitHub Action workflow
export async function triggerGitHubAction(env, parameters = {}) {
    const token = await getInstallationToken(env);

    const response = await fetch(`https://api.github.com/repos/${env.TARGET_REPO}/actions/workflows/${env.GITHUB_ACTION_NAME}/dispatches`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'YourAppName/1.0.0' // Replace with your app's name and version
        },
        body: JSON.stringify({
            ref: env.TARGET_BRANCH,
            inputs: parameters
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to trigger GitHub Action: ${response.status} - ${errorText}`);
    }

    return true;
}

// Function to get details for a specific PR
export async function getPRDetails(prNumber, env) {
    const token = await getInstallationToken(env);

    const response = await fetch(`https://api.github.com/repos/${env.TARGET_REPO}/pulls/${prNumber}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'YourAppName/1.0.0'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

// Function to get PR diff
export async function getPRDiff(prNumber, env) {
    const token = await getInstallationToken(env);

    // Log for debugging
    console.log('Fetching PR diff:', {
        url: `https://api.github.com/repos/${env.TARGET_REPO}/pulls/${prNumber}/files`,
        token: token ? 'present' : 'missing',
        repo: env.TARGET_REPO
    });

    // First, get the PR to ensure it exists
    const prResponse = await fetch(`https://api.github.com/repos/${env.TARGET_REPO}/pulls/${prNumber}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'YourAppName/1.0.0'
        }
    });

    if (!prResponse.ok) {
        const errorText = await prResponse.text();
        throw new Error(`GitHub API error (PR not found): ${prResponse.status} - ${errorText}`);
    }

    // Then get the files
    const response = await fetch(`https://api.github.com/repos/${env.TARGET_REPO}/pulls/${prNumber}/files`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'YourAppName/1.0.0'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub API error (files): ${response.status} - ${errorText}`);
    }

    const files = await response.json();
    
    // Format the diff in a way that's easy to understand
    const formattedDiff = files.map(file => {
        return `File: ${file.filename}
Status: ${file.status}
Changes: +${file.additions} -${file.deletions}
Patch:
${file.patch || 'No patch available'}\n`;
    }).join('\n');

    return formattedDiff;
}

// Function to check if PR can be merged to demo branch
export async function canMergeToDemoBranch(prNumber, env) {
    const token = await getInstallationToken(env);

    try {
        // First get the PR details to get the head SHA
        const prResponse = await fetch(`https://api.github.com/repos/${env.TARGET_REPO}/pulls/${prNumber}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'YourAppName/1.0.0'
            }
        });

        if (!prResponse.ok) {
            throw new Error(`Failed to fetch PR: ${prResponse.status}`);
        }

        const pr = await prResponse.json();
        const headSha = pr.head.sha;

        // Then check if this can be merged into the demo branch
        const mergeCheckResponse = await fetch(`https://api.github.com/repos/${env.TARGET_REPO}/merges`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'YourAppName/1.0.0'
            },
            body: JSON.stringify({
                base: env.DEMO_BRANCH,
                head: headSha,
                // Don't actually merge, just check if it's possible
                commit_message: 'Merge test - DO NOT MERGE'
            })
        });

        // If we get a 201 (Created) or 204 (No Content), the merge is possible
        // 409 (Conflict) means it can't be merged cleanly
        // 404 (Not Found) might mean the demo branch doesn't exist
        const canMerge = mergeCheckResponse.status === 201 || mergeCheckResponse.status === 204;
        const demoBranchExists = mergeCheckResponse.status !== 404;

        return {
            canMerge,
            demoBranchExists,
            status: mergeCheckResponse.status,
            message: canMerge ? 'Can be merged to demo branch' :
                    !demoBranchExists ? 'Demo branch does not exist' :
                    'Cannot be merged cleanly to demo branch'
        };
    } catch (error) {
        console.error('Error checking merge possibility:', error);
        throw error;
    }
}

// Function to get open PRs
export async function getOpenPRs(env) {
    const token = await getInstallationToken(env);

    const response = await fetch(
        `https://api.github.com/repos/${env.TARGET_REPO}/pulls?state=open&base=${env.TARGET_BRANCH}&sort=updated&direction=desc`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'YourAppName/1.0.0'
            }
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

// Function to add a label to a PR
export async function addLabelToPR(prNumber, label, env) {
    const token = await getInstallationToken(env);

    const response = await fetch(
        `https://api.github.com/repos/${env.TARGET_REPO}/issues/${prNumber}/labels`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'YourAppName/1.0.0'
            },
            body: JSON.stringify({
                labels: [label]
            })
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add label: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

// Function to add a comment to a PR
export async function addCommentToPR(prNumber, comment, env) {
    const token = await getInstallationToken(env);

    const response = await fetch(
        `https://api.github.com/repos/${env.TARGET_REPO}/issues/${prNumber}/comments`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'YourAppName/1.0.0'
            },
            body: JSON.stringify({
                body: comment
            })
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add comment: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

// Function to get PR review comments
export async function getPRReviewComments(prNumber, env) {
    const token = await getInstallationToken(env);

    // Get review comments (comments on specific lines of code)
    const reviewCommentsResponse = await fetch(
        `https://api.github.com/repos/${env.TARGET_REPO}/pulls/${prNumber}/comments`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'YourAppName/1.0.0'
            }
        }
    );

    if (!reviewCommentsResponse.ok) {
        const errorText = await reviewCommentsResponse.text();
        throw new Error(`GitHub API error (review comments): ${reviewCommentsResponse.status} - ${errorText}`);
    }

    const reviewComments = await reviewCommentsResponse.json();

    // Get PR reviews (overall review comments)
    const reviewsResponse = await fetch(
        `https://api.github.com/repos/${env.TARGET_REPO}/pulls/${prNumber}/reviews`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'YourAppName/1.0.0'
            }
        }
    );

    if (!reviewsResponse.ok) {
        const errorText = await reviewsResponse.text();
        throw new Error(`GitHub API error (reviews): ${reviewsResponse.status} - ${errorText}`);
    }

    const reviews = await reviewsResponse.json();

    // Combine and format all comments
    const allComments = [];

    // Add review comments (inline comments)
    reviewComments.forEach(comment => {
        allComments.push({
            type: 'inline',
            id: comment.id,
            user: comment.user.login,
            avatar: comment.user.avatar_url,
            body: comment.body,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
            path: comment.path,
            line: comment.line,
            diff_hunk: comment.diff_hunk,
            in_reply_to: comment.in_reply_to_id
        });
    });

    // Add review comments (overall review comments)
    reviews.forEach(review => {
        if (review.body) {
            allComments.push({
                type: 'review',
                id: review.id,
                user: review.user.login,
                avatar: review.user.avatar_url,
                body: review.body,
                created_at: review.submitted_at,
                state: review.state
            });
        }
    });

    // Sort all comments by creation date
    allComments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Group inline comments by thread
    const commentThreads = {};
    allComments
        .filter(comment => comment.type === 'inline')
        .forEach(comment => {
            const threadId = comment.in_reply_to || comment.id;
            if (!commentThreads[threadId]) {
                commentThreads[threadId] = [];
            }
            commentThreads[threadId].push(comment);
        });

    return {
        threads: Object.values(commentThreads),
        reviews: allComments.filter(comment => comment.type === 'review')
    };
}