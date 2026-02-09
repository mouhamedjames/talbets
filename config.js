// Configuration file for Talabat Server
module.exports = {
    // Telegram Bot Configuration
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || '8400132592:AAFoz2e2d60iLFcLBXEX3077BAlWjVdh85I',
        chatId: process.env.TELEGRAM_CHAT_ID || '-5200817415'
    },
    
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        name: 'Talabat Server API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    }
};
