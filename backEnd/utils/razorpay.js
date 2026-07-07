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


module.exports = new Proxy({}, {
    get: (target, prop) => {
        
        if (prop === 'then' || prop === 'inspector_hold' || prop === 'prototype') return undefined;
        
        const rzp = getRazorpayInstance();
        let value = rzp[prop];
        
        
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
