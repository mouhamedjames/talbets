// Configuration file for Talabat Server
module.exports = {
    // Telegram Bot Configuration
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || '8339822460:AAH0henAILHylbYCj9Ac9Hqpz0OeNiURrKQ',
        chatId: process.env.TELEGRAM_CHAT_ID || '-5282262655'
    },
    
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        name: 'Talabat Server API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    }
};
