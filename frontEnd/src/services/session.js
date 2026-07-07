const SESSION_KEY = 'movie_mukkalu_session_id';


export const getSessionId = () => {
    
    let sessionId = localStorage.getItem(SESSION_KEY);
    
    if (!sessionId) {
        
        const newId = crypto.randomUUID?.() || 
                    ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => 
                        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
                    );
        
        
        
        
        sessionId = localStorage.getItem(SESSION_KEY);
        if (!sessionId) {
            localStorage.setItem(SESSION_KEY, newId);
            sessionId = newId;
        }
    }
    
    return sessionId;
};


export const clearSessionId = () => {
    localStorage.removeItem(SESSION_KEY);
    
    window.dispatchEvent(new Event('storage')); 
};


export const subscribeToSessionUpdate = (callback) => {
    const handler = (e) => {
        if (e.key === SESSION_KEY || !e.key) { 
            callback(getSessionId());
        }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
};
