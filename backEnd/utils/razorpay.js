const Razorpay = require('razorpay');

let instance = null;

const getRazorpayInstance = () => {
    if (instance) return instance;

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
        console.error('[RAZORPAY] ERROR: Keys missing in environment variables!');
        throw new Error('Razorpay Keys are missing from environment!');
    }

    instance = new Razorpay({
        key_id,
        key_secret,
    });
    
    return instance;
};

/**
 * Deep Proxy for Razorpay SDK.
 * This allows require('../utils/razorpay') to succeed on boot
 * even if keys are missing (preventing the 500 OPTIONS error on Vercel).
 * It only initializes the real SDK when you try to access a property (like .orders).
 */
module.exports = new Proxy({}, {
    get: (target, prop) => {
        // Handle common Node properties and then/promise checks
        if (prop === 'then' || prop === 'inspector_hold' || prop === 'prototype') return undefined;
        
        const rzp = getRazorpayInstance();
        let value = rzp[prop];
        
        // If the property is an object (like .orders, .payments), wrap it to ensure its methods stay bound
        if (typeof value === 'object' && value !== null) {
            return new Proxy(value, {
                get: (subTarget, subProp) => {
                    const subValue = subTarget[subProp];
                    if (typeof subValue === 'function') {
                        return subValue.bind(subTarget);
                    }
                    return subValue;
                }
            });
        }
        
        if (typeof value === 'function') {
            return value.bind(rzp);
        }
        return value;
    }
});
