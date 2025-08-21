# Replicate Webhook Setup Guide

This guide explains how to set up the Replicate webhook endpoint to receive real-time updates when AI headshot generation jobs complete.

## Overview

The webhook system works as follows:
1. User starts headshot generation → Replicate job created
2. Job ID stored in Supabase `generations` table
3. Replicate sends webhook when job completes
4. Webhook updates Supabase with results
5. Frontend polls Supabase for updates

## Webhook Endpoint Setup

### Option 1: Vercel (Recommended)

1. Create `/api/replicate-webhook.js` in your Vercel project:

```javascript
import { replicateWebhookHandler } from '../src/api/replicate-webhook';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await replicateWebhookHandler(req.body);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
```

2. Deploy to Vercel
3. Your webhook URL will be: `https://your-app.vercel.app/api/replicate-webhook`

### Option 2: Netlify Functions

1. Create `/.netlify/functions/replicate-webhook.js`:

```javascript
import { replicateWebhookHandler } from '../../src/api/replicate-webhook';

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const result = await replicateWebhookHandler(payload);
    
    return {
      statusCode: result.success ? 200 : 400,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Netlify function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
    };
  }
};
```

2. Deploy to Netlify
3. Your webhook URL will be: `https://your-app.netlify.app/.netlify/functions/replicate-webhook`

### Option 3: Express.js Server

```javascript
import express from 'express';
import { replicateWebhookHandler } from './src/api/replicate-webhook';

const app = express();
app.use(express.json());

app.post('/api/replicate-webhook', async (req, res) => {
  try {
    const result = await replicateWebhookHandler(req.body);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

app.listen(3001, () => {
  console.log('Webhook server running on port 3001');
});
```

## Configure Replicate Webhook

1. Go to [Replicate Dashboard](https://replicate.com/account)
2. Navigate to "Webhooks" section
3. Add your webhook URL
4. Select events: `predictions.completed`, `predictions.failed`

## Environment Variables

Make sure these are set in your deployment environment:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_REPLICATE_API_TOKEN=your_replicate_api_token
```

## Testing the Webhook

1. Use a tool like ngrok for local testing:
   ```bash
   ngrok http 3001
   ```

2. Set the ngrok URL as your webhook in Replicate

3. Start a generation and monitor the logs

## Webhook Payload Example

```json
{
  "id": "ufawqhfynnddngldkgtslldrkq",
  "status": "succeeded",
  "created_at": "2023-03-28T21:47:58.566434Z",
  "started_at": "2023-03-28T21:47:58.613766Z",
  "completed_at": "2023-03-28T21:48:02.670419Z",
  "output": [
    "https://replicate.delivery/pbxt/abc123/output.jpg"
  ]
}
```

## Troubleshooting

- **Webhook not receiving data**: Check your URL is publicly accessible
- **Database not updating**: Verify Supabase credentials and table permissions
- **Job not found**: Ensure Replicate job ID is stored correctly in `personal_info.replicate_job_id`

## Security Considerations

- Validate webhook signatures (implement if needed)
- Rate limit webhook endpoints
- Log webhook events for debugging
- Use HTTPS for webhook URLs
