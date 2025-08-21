// src/api/runpod-webhook.ts
// This file contains the webhook handler logic for RunPod serverless jobs

import { processRunPodWebhook } from '../lib/runpod';

export interface RunPodWebhookPayload {
  id: string;
  status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'TIMED_OUT';
  delayTime?: number;
  executionTime?: number;
  output?: {
    result_url?: string;
    error?: string;
    replicate_job_id?: string;
  };
  error?: string;
}

/**
 * Webhook handler for RunPod serverless jobs
 * This should be deployed as an API endpoint at /api/runpod-webhook
 * 
 * Example deployment:
 * - Vercel: Create /api/runpod-webhook.js in your API routes
 * - Netlify: Create /.netlify/functions/runpod-webhook.js
 * - Express: app.post('/api/runpod-webhook', runpodWebhookHandler)
 */
export async function runpodWebhookHandler(
  payload: RunPodWebhookPayload
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    console.log('Received RunPod webhook:', {
      id: payload.id,
      status: payload.status,
      hasOutput: !!payload.output,
      executionTime: payload.executionTime,
    });

    // Validate payload
    if (!payload.id || !payload.status) {
      return {
        success: false,
        error: 'Invalid webhook payload: missing id or status',
      };
    }

    // Process the webhook
    const result = await processRunPodWebhook({
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
      message: 'RunPod webhook processed successfully',
    };
  } catch (error) {
    console.error('RunPod webhook handler error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    };
  }
}

// Example Vercel API route implementation
// Create this file at /api/runpod-webhook.js in your Vercel project:
/*
import { runpodWebhookHandler } from '../src/api/runpod-webhook';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await runpodWebhookHandler(req.body);
    
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
import { runpodWebhookHandler } from './src/api/runpod-webhook';

const app = express();
app.use(express.json());

app.post('/api/runpod-webhook', async (req, res) => {
  try {
    const result = await runpodWebhookHandler(req.body);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('RunPod webhook error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});
*/

// Example Netlify function implementation:
// Create this file at /.netlify/functions/runpod-webhook.js:
/*
import { runpodWebhookHandler } from '../../src/api/runpod-webhook';

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const result = await runpodWebhookHandler(payload);
    
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
