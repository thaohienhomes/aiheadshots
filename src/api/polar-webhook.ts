// src/api/polar-webhook.ts
// This file contains the webhook handler logic for Polar payments

import { processPolarWebhook } from '../lib/polar';
import crypto from 'crypto';

export interface PolarWebhookPayload {
  type: string;
  data: any;
  created_at: string;
}

/**
 * Webhook handler for Polar payment events
 * This should be deployed as an API endpoint at /api/polar-webhook
 * 
 * Example deployment:
 * - Vercel: Create /api/polar-webhook.js in your API routes
 * - Netlify: Create /.netlify/functions/polar-webhook.js
 * - Express: app.post('/api/polar-webhook', polarWebhookHandler)
 */
export async function polarWebhookHandler(
  payload: PolarWebhookPayload,
  signature?: string,
  rawBody?: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    console.log('Received Polar webhook:', {
      type: payload.type,
      timestamp: payload.created_at,
    });

    // Verify webhook signature if provided
    if (signature && rawBody) {
      const isValid = verifyPolarSignature(rawBody, signature);
      if (!isValid) {
        return {
          success: false,
          error: 'Invalid webhook signature',
        };
      }
    }

    // Validate payload
    if (!payload.type || !payload.data) {
      return {
        success: false,
        error: 'Invalid webhook payload: missing type or data',
      };
    }

    // Process the webhook
    const result = await processPolarWebhook({
      type: payload.type,
      data: payload.data,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to process webhook',
      };
    }

    return {
      success: true,
      message: 'Polar webhook processed successfully',
    };
  } catch (error) {
    console.error('Polar webhook handler error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    };
  }
}

/**
 * Verify Polar webhook signature
 * This ensures the webhook is actually from Polar
 */
function verifyPolarSignature(rawBody: string, signature: string): boolean {
  try {
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET || import.meta.env.VITE_POLAR_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.warn('No Polar webhook secret configured');
      return true; // Skip verification if no secret is set
    }

    // Polar uses HMAC SHA256 for webhook signatures
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody, 'utf8')
      .digest('hex');

    // Compare signatures securely
    const providedSignature = signature.replace('sha256=', '');
    
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

// Example Vercel API route implementation
// Create this file at /api/polar-webhook.js in your Vercel project:
/*
import { polarWebhookHandler } from '../src/api/polar-webhook';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const signature = req.headers['polar-signature'];
    const rawBody = JSON.stringify(req.body);
    
    const result = await polarWebhookHandler(req.body, signature, rawBody);
    
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
import { polarWebhookHandler } from './src/api/polar-webhook';

const app = express();

// Use raw body parser for webhook signature verification
app.use('/api/polar-webhook', express.raw({ type: 'application/json' }));

app.post('/api/polar-webhook', async (req, res) => {
  try {
    const signature = req.headers['polar-signature'];
    const rawBody = req.body.toString();
    const payload = JSON.parse(rawBody);
    
    const result = await polarWebhookHandler(payload, signature, rawBody);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Polar webhook error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});
*/

// Example Netlify function implementation:
// Create this file at /.netlify/functions/polar-webhook.js:
/*
import { polarWebhookHandler } from '../../src/api/polar-webhook';

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const signature = event.headers['polar-signature'];
    const payload = JSON.parse(event.body);
    
    const result = await polarWebhookHandler(payload, signature, event.body);
    
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
