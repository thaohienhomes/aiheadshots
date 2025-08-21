// src/api/replicate-webhook.ts
// This file contains the webhook handler logic that can be deployed as a serverless function
// or integrated into your backend API

import { processReplicateWebhook } from '../lib/replicate';

export interface WebhookPayload {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string | string[];
  error?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

/**
 * Webhook handler for Replicate predictions
 * This should be deployed as an API endpoint at /api/replicate-webhook
 * 
 * Example deployment:
 * - Vercel: Create /api/replicate-webhook.js in your API routes
 * - Netlify: Create /.netlify/functions/replicate-webhook.js
 * - Express: app.post('/api/replicate-webhook', replicateWebhookHandler)
 */
export async function replicateWebhookHandler(
  payload: WebhookPayload
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    console.log('Received Replicate webhook:', {
      id: payload.id,
      status: payload.status,
      hasOutput: !!payload.output,
    });

    // Validate payload
    if (!payload.id || !payload.status) {
      return {
        success: false,
        error: 'Invalid webhook payload: missing id or status',
      };
    }

    // Process the webhook
    const result = await processReplicateWebhook({
      id: payload.id,
      status: payload.status,
      output: payload.output,
      error: payload.error,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to process webhook',
      };
    }

    return {
      success: true,
      message: 'Webhook processed successfully',
    };
  } catch (error) {
    console.error('Webhook handler error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    };
  }
}

// Example Vercel API route implementation
// Create this file at /api/replicate-webhook.js in your Vercel project:
/*
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
*/

// Example Express.js implementation:
/*
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
*/

// Example Netlify function implementation:
// Create this file at /.netlify/functions/replicate-webhook.js:
/*
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
*/
