const SESSION_KEY = 'movie_mokkalu_session_id';

/**
 * Get or generate a unique session identifier
 * @returns {string} The unique sessionId
 */
export const getSessionId = () => {
    // 1. Initial check
    let sessionId = localStorage.getItem(SESSION_KEY);
    
    if (!sessionId) {
        // 2. Generate a potential ID
        const newId = crypto.randomUUID?.() || 
                    ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => 
                        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
                    );
        
        // 3. Re-verify before setting (in case another tab just created it)
        // Since localStorage is synchronous in terms of the browser's response, 
        // this is usually safe.
        sessionId = localStorage.getItem(SESSION_KEY);
        if (!sessionId) {
            localStorage.setItem(SESSION_KEY, newId);
            sessionId = newId;
        }
    }
    
    return sessionId;
};

/**
 * Clear session (manual reset)
 */
export const clearSessionId = () => {
    localStorage.removeItem(SESSION_KEY);
    // Broadcast change to other tabs if manually cleared
    window.dispatchEvent(new Event('storage')); 
};

/**
 * Sync logic: Notifies window when storage changes
 * Note: 'storage' event fires ONLY for other windows by default.
 */
export const subscribeToSessionUpdate = (callback) => {
    const handler = (e) => {
        if (e.key === SESSION_KEY || !e.key) { // !e.key handles custom storage events
            callback(getSessionId());
        }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
};
