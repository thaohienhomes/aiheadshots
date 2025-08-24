import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createAIGeneration } from '../src/lib/aiOrchestrator';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, uploadId, model, style, personalInfo, uploadUrl } = req.body;

    if (!userId || !uploadId || !model || !uploadUrl) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Build base URL for webhooks
    const baseUrl =
      process.env.SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const webhookUrl = `${baseUrl}/api/runpod-webhook`;

    // Call orchestrator to create generation job
    const generation = await createAIGeneration({
      userId,
      uploadId,
      model,
      style,
      personalInfo,
      uploadUrl,
      webhookUrl,
    });

    return res.status(200).json({ success: true, generation });
  } catch (error) {
    console.error('Create generation error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
