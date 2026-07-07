import { useState, useEffect } from 'react';
import { getSessionId, subscribeToSessionUpdate } from './session';


export const useSession = () => {
    const [sessionId, setSessionId] = useState(getSessionId());

    useEffect(() => {
        
        const unsubscribe = subscribeToSessionUpdate((newId) => {
            setSessionId(newId);
        });

        return () => unsubscribe();
    }, []);

    const refreshSession = () => {
        setSessionId(getSessionId());
    };

    return { sessionId, refreshSession };
};
