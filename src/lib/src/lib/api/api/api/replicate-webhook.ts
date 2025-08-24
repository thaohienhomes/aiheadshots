import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateWebhook } from '../src/lib/webhookAuth';
import { supabase } from '../src/lib/supabaseClient';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Xác thực webhook từ Replicate
  const auth = await authenticateWebhook(req, 'replicate');
  if (!auth.success) {
    return res.status(401).json({ success: false, error: auth.error });
  }

  try {
    const payload = auth.body as {
      id: string;
      status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
      output?: string | string[];
      error?: string;
    };

    // Cập nhật trạng thái generation trong Supabase
    const { error } = await supabase
      .from('generations')
      .update({
        status: payload.status,
        result_url: Array.isArray(payload.output)
          ? payload.output.join(',')
          : payload.output || null,
        error: payload.error || null,
      })
      .eq('id', payload.id);

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(500).json({ success: false, error: 'Database update failed' });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error('Replicate webhook error:', e);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
