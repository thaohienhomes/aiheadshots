import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateWebhook } from '../src/lib/webhookAuth';
import { processPolarWebhook } from '../src/lib/polarServer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Xác thực webhook từ Polar
  const auth = await authenticateWebhook(req, 'polar');
  if (!auth.success) {
    return res.status(401).json({ success: false, error: auth.error });
  }

  try {
    const result = await processPolarWebhook(auth.body);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (e) {
    console.error('Polar webhook error:', e);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
