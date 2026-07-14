
const authSession = (req, res, next) => {
    const sessionId = req.headers['x-session-id'];



    if (!sessionId) {
        return res.status(401).json({
            error: 'Session identity missing',
            message: 'Please ensure x-session-id header is included'
        });
    }


    req.sessionId = sessionId;




    next();
};

module.exports = authSession;
