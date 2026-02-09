// Configuration file for Talabat Server
module.exports = {
    // Telegram Bot Configuration
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE',
        chatId: process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE'
    },
    
    // Server Configuration
    server: {
        name: 'Talabat Server API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'production'
    }
};
