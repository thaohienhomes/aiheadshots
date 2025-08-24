// src/lib/runpod.ts

import { supabaseServer as supabase } from './supabaseServer';
import type { Generation } from '../types/supabase';

// RunPod API configuration
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY!;
const RUNPOD_ENDPOINT_ID = process.env.RUNPOD_ENDPOINT_ID!;
const RUNPOD_BASE_URL = 'https://api.runpod.ai/v2';

interface RunPodJobPayload {
  input: {
    image_url: string;
    prompt: string;
    negative_prompt?: string;
    style: string;
    personal_info: {
      age?: number;
      ethnicity?: string;
      gender?: string;
      preferences?: string[];
      hairColor?: string;
      eyeColor?: string;
    };
    // Replicate-specific parameters
    width?: number;
    height?: number;
    guidance_scale?: number;
    num_inference_steps?: number;
    scheduler?: string;
    num_outputs?: number;
    quality?: number;
    lora_scale?: number;
  };
  webhook?: string;
}

interface RunPodJobResponse {
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

interface RunPodSubmitResponse {
  id: string;
  status: string;
}

export async function submitJob(payload: RunPodJobPayload): Promise<{
  success: boolean;
  jobId?: string;
  error?: string;
}> {
  try {
    console.log('Submitting job to RunPod:', {
      endpoint: RUNPOD_ENDPOINT_ID,
      hasImage: !!payload.input.image_url,
      style: payload.input.style,
    });

    const response = await fetch(`${RUNPOD_BASE_URL}/${RUNPOD_ENDPOINT_ID}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RUNPOD_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RunPod API error: ${response.status} - ${errorText}`);
    }

    const data: RunPodSubmitResponse = await response.json();
    
    console.log('RunPod job submitted successfully:', data.id);

    return {
      success: true,
      jobId: data.id,
    };
  } catch (error) {
    console.error('RunPod job submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit job to RunPod',
    };
  }
}

export async function getJobStatus(jobId: string): Promise<{
  success: boolean;
  job?: RunPodJobResponse;
  error?: string;
}> {
  try {
    const response = await fetch(`${RUNPOD_BASE_URL}/${RUNPOD_ENDPOINT_ID}/status/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RUNPOD_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RunPod status API error: ${response.status} - ${errorText}`);
    }

    const data: RunPodJobResponse = await response.json();
    
    return {
      success: true,
      job: data,
    };
  } catch (error) {
    console.error('RunPod status check error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get job status from RunPod',
    };
  }
}

export async function createGenerationWithRunPod(
  uploadId: string,
  model: string,
  style: string,
  personalInfo: any,
  uploadUrl: string,
  webhookUrl?: string
): Promise<{
  success: boolean;
  generation?: Generation;
  error?: string;
}> {
  try {
    // Create generation record in Supabase first
    const { data: generation, error: dbError } = await supabase
      .from('generations')
      .insert({
        upload_id: uploadId,
        model,
        style,
        personal_info: personalInfo,
        status: 'queued',
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Build prompt for RunPod job
    const prompt = buildPrompt(style, personalInfo);
    const negativePrompt = "blurry, low quality, distorted, deformed, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, ugly, bad hands, bad fingers, watermark, signature";

    // Submit job to RunPod
    const runpodResult = await submitJob({
      input: {
        image_url: uploadUrl,
        prompt,
        negative_prompt: negativePrompt,
        style,
        personal_info: personalInfo,
        width: 1024,
        height: 1024,
        guidance_scale: 7.5,
        num_inference_steps: 50,
        scheduler: "K_EULER",
        num_outputs: 1,
        quality: 100,
        lora_scale: 0.6,
      },
      webhook: webhookUrl,
    });

    if (!runpodResult.success) {
      // Update generation status to failed
      await supabase
        .from('generations')
        .update({ status: 'failed' })
        .eq('id', generation.id);

      return {
        success: false,
        error: runpodResult.error,
      };
    }

    // Update generation with RunPod job ID and set status to processing
    const { data: updatedGeneration, error: updateError } = await supabase
      .from('generations')
      .update({ 
        status: 'processing',
        // Store RunPod job ID in personal_info for tracking
        personal_info: {
          ...personalInfo,
          runpod_job_id: runpodResult.jobId,
        }
      })
      .eq('id', generation.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      success: true,
      generation: updatedGeneration,
    };
  } catch (error) {
    console.error('RunPod generation creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create generation with RunPod',
    };
  }
}

export async function pollRunPodJob(jobId: string): Promise<{
  success: boolean;
  status?: string;
  output?: any;
  error?: string;
}> {
  try {
    const result = await getJobStatus(jobId);
    
    if (!result.success || !result.job) {
      return {
        success: false,
        error: result.error || 'Failed to fetch job status',
      };
    }

    return {
      success: true,
      status: result.job.status,
      output: result.job.output,
      error: result.job.error,
    };
  } catch (error) {
    console.error('RunPod polling error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Polling failed',
    };
  }
}

export async function processRunPodWebhook(payload: {
  id: string;
  status: string;
  output?: {
    result_url?: string;
    error?: string;
    replicate_job_id?: string;
  };
  error?: string;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log('Processing RunPod webhook:', payload);

    // Find generation by RunPod job ID
    const { data: generations, error: findError } = await supabase
      .from('generations')
      .select('*')
      .contains('personal_info', { runpod_job_id: payload.id });

    if (findError) throw findError;

    if (!generations || generations.length === 0) {
      console.warn('No generation found for RunPod job:', payload.id);
      return { success: false, error: 'Generation not found' };
    }

    const generation = generations[0];
    let updateData: Partial<Generation> = {};

    switch (payload.status) {
      case 'COMPLETED':
        updateData = {
          status: 'completed',
          result_url: payload.output?.result_url,
          completed_at: new Date().toISOString(),
        };
        break;
      
      case 'FAILED':
      case 'CANCELLED':
      case 'TIMED_OUT':
        updateData = {
          status: 'failed',
        };
        break;
      
      case 'IN_PROGRESS':
        updateData = {
          status: 'processing',
        };
        break;
      
      case 'IN_QUEUE':
        updateData = {
          status: 'queued',
        };
        break;
      
      default:
        console.log('Unknown RunPod status:', payload.status);
        return { success: true }; // Don't update for unknown statuses
    }

    // Update generation in Supabase
    const { error: updateError } = await supabase
      .from('generations')
      .update(updateData)
      .eq('id', generation.id);

    if (updateError) throw updateError;

    console.log('Generation updated successfully from RunPod webhook:', generation.id);
    return { success: true };
  } catch (error) {
    console.error('RunPod webhook processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Webhook processing failed',
    };
  }
}

function buildPrompt(style: string, personalInfo: any): string {
  let prompt = "Professional headshot, studio lighting";
  
  // Add style
  if (style) {
    prompt += `, ${style} style`;
  }
  
  // Add personal info details
  if (personalInfo.gender) {
    prompt += `, ${personalInfo.gender}`;
  }
  
  if (personalInfo.age) {
    prompt += `, ${personalInfo.age} years old`;
  }
  
  if (personalInfo.ethnicity) {
    prompt += `, ${personalInfo.ethnicity}`;
  }
  
  if (personalInfo.hairColor) {
    prompt += `, ${personalInfo.hairColor} hair`;
  }
  
  if (personalInfo.eyeColor) {
    prompt += `, ${personalInfo.eyeColor} eyes`;
  }
  
  // Add preferences
  if (personalInfo.preferences && personalInfo.preferences.length > 0) {
    prompt += `, ${personalInfo.preferences.join(', ')}`;
  }
  
  // Add quality modifiers
  prompt += ", high quality, detailed, sharp focus, professional photography, 8k resolution";
  
  return prompt;
}
