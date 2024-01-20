const crypto = require('crypto');

export function extractShortCode(longUrl) {
    const hash = crypto.createHash('sha256').update(longUrl).digest('base64');
    const shortCode = hash.replace(/[^a-zA-Z0-9]/g, '').slice(-8);  
    return shortCode;
}