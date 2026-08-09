// Configuration file for Talabat Server
module.exports = {
    // Telegram Bot Configuration
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || '8942561953:AAF2DcybTf8duS_zHa3oS3yDHj4WaodCVo8',
        chatId: process.env.TELEGRAM_CHAT_ID || '-5224522514'
    },
    
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        name: 'Talabat Server API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    }
};
