/**
 * Session Extraction Middleware
 * Identifies users by sessionId without login.
 */

const authSession = (req, res, next) => {
    const sessionId = req.headers['x-session-id'];
    
    // In a pure session-based app, we MUST have a sessionId
    // We can either auto-assign one or require it from frontend
    if (!sessionId) {
        return res.status(401).json({ 
            error: 'Session identity missing', 
            message: 'Please ensure x-session-id header is included' 
        });
    }

    // Attach to request object for use in controllers/models
    req.sessionId = sessionId;
    
    // Optional: Log session activity (for internal tracking)
    // console.log(`[Session: ${sessionId}] ${req.method} ${req.url}`);
    
    next();
};

module.exports = authSession;
