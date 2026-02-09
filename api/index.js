// Vercel Serverless Function - Root endpoint (Health Check)
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    return res.status(200).json({
        success: true,
        message: 'Talabat Server API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            'POST /api/send-payment': 'Send payment/billing data',
            'POST /api/send-sms': 'Send SMS/OTP code data'
        }
    });
};
