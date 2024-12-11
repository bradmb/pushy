/**
 * Gets the authenticated user's email from Cloudflare Access headers
 * @param {Request} request - The incoming request
 * @returns {string|null} The authenticated user's email or null if not authenticated
 */
export function getAuthenticatedUser(request) {
    return request.headers.get('cf-access-authenticated-user-email');
}

/**
 * Checks if a request is authenticated via Cloudflare Access
 * @param {Request} request - The incoming request
 * @returns {boolean} Whether the request is authenticated
 */
export function isAuthenticated(request) {
    return !!getAuthenticatedUser(request);
}

/**
 * Checks if a user is authorized to perform privileged actions
 * @param {Object} env - Environment variables containing AUTHORIZED_USERS configuration
 * @param {string} userEmail - Email of the user to check
 * @returns {boolean} Whether the user is authorized
 */
export function isAuthorizedUser(env, userEmail) {
    if (!userEmail || !env.AUTHORIZED_USERS) return false;
    const authorizedUsers = env.AUTHORIZED_USERS.split(',').map(email => email.trim());
    return authorizedUsers.includes(userEmail);
}

/**
 * Middleware to ensure user is authenticated via Cloudflare Access
 * @param {Request} request - The incoming request
 * @param {Object} env - Environment variables
 * @returns {Response|null} Unauthorized response or null if authenticated
 */
export function requireAuth(request) {
    if (!isAuthenticated(request)) {
        return new Response('Unauthorized: Authentication required', { 
            status: 401,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
    return null;
}

/**
 * Middleware to ensure user is authorized for privileged actions
 * @param {Request} request - The incoming request
 * @param {Object} env - Environment variables
 * @returns {Response|null} Unauthorized response or null if authorized
 */
export function requireAuthorization(request, env) {
    const userEmail = getAuthenticatedUser(request);
    if (!isAuthorizedUser(env, userEmail)) {
        return new Response('Forbidden: User not authorized for this action', {
            status: 403,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
    return null;
} 