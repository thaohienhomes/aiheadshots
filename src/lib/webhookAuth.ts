import type { VercelRequest } from '@vercel/node';
import { createHmac, timingSafeEqual } from 'crypto';

async function getRawBody(req: VercelRequest): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
  });
}

function verifyHmacSignature(secret: string, body: string, signature: string): boolean {
  try {
    const hmac = createHmac('sha256', secret);
    hmac.update(body, 'utf8');
    const digest = Buffer.from(`sha256=${hmac.digest('hex')}`, 'utf8');
    const sig = Buffer.from(signature, 'utf8');
    return digest.length === sig.length && timingSafeEqual(digest, sig);
  } catch (error) {
    console.error('Error verifying HMAC signature:', error);
    return false;
  }
}

function verifyBearerToken(secret: string, authorizationHeader?: string): boolean {
  if (!authorizationHeader) return false;
  const [type, token] = authorizationHeader.split(' ');
  return type === 'Bearer' && token === secret;
}

interface AuthResult {
  success: boolean;
  error?: string;
  body?: any;
  rawBody?: string;
}

export async function authenticateWebhook(
  req: VercelRequest,
  provider: 'polar' | 'replicate' | 'runpod'
): Promise<AuthResult> {
  const rawBody = await getRawBody(req);
  if (!rawBody) {
    return { success: false, error: 'Missing request body' };
  }

  let secret: string | undefined;
  let signature: string | undefined;

  switch (provider) {
    case 'polar': {
      secret = process.env.POLAR_WEBHOOK_SECRET;
      signature =
        (req.headers['polar-signature'] as string) ||
        (req.headers['x-polar-signature'] as string);
      if (!secret || !signature) {
        return { success: false, error: 'Polar webhook secret or signature missing' };
      }
      const ok = verifyHmacSignature(secret, rawBody, signature);
      if (!ok) return { success: false, error: 'Invalid Polar signature' };
      break;
    }
    case 'replicate': {
      secret = process.env.REPLICATE_WEBHOOK_SECRET;
      signature =
        (req.headers['svix-signature'] as string) ||
        (req.headers['x-replicate-signature'] as string);
      if (!secret || !signature) {
        return { success: false, error: 'Replicate secret or signature missing' };
      }
      if (signature.startsWith('sha256=')) {
        const ok = verifyHmacSignature(secret, rawBody, signature);
        if (!ok) return { success: false, error: 'Invalid Replicate signature' };
      }
      break;
    }
    case 'runpod': {
      secret = process.env.RUNPOD_WEBHOOK_TOKEN;
      if (secret) {
        const authorization = req.headers.authorization as string | undefined;
        const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
        const tokenParam = url.searchParams.get('token') || undefined;
        const authorized =
          (authorization && verifyBearerToken(secret, authorization)) ||
          tokenParam === secret;
        if (!authorized) return { success: false, error: 'Invalid RunPod webhook token' };
      }
      break;
    }
  }

  try {
    return { success: true, body: JSON.parse(rawBody), rawBody };
  } catch {
    return { success: false, error: 'Failed to parse request body' };
  }
}
