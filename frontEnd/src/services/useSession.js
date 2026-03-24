import { useState, useEffect } from 'react';
import { getSessionId, subscribeToSessionUpdate } from './session';

/**
 * Hook to access and sync current session identity across tabs.
 */
export const useSession = () => {
    const [sessionId, setSessionId] = useState(getSessionId());

    useEffect(() => {
        // Subscribe to cross-tab updates (storage events)
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
