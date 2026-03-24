require('dotenv').config();
const Razorpay = require('razorpay');

// Sensitive but necessary for debugging why authentication is failing
console.log('--- Razorpay SDK Handshake ---');
console.log('ID Detected:', (process.env.RAZORPAY_KEY_ID || 'MISSING').substring(0, 10) + '...');
console.log('Secret Detected:', process.env.RAZORPAY_KEY_SECRET ? 'YES' : 'NO');
console.log('Secret length:', process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.length : 0);
console.log('------------------------------');

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('[CRITICAL] Razorpay Keys are missing from environment!');
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;
