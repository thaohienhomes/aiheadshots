// src/lib/replicate.ts

import Replicate from 'replicate';
import { supabase } from './supabaseClient';
import type { Generation } from '../types/supabase';

// Initialize Replicate client
const replicate = new Replicate({
  auth: import.meta.env.VITE_REPLICATE_API_TOKEN!,
});

// Replicate model for SDXL
const SDXL_MODEL = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

interface GenerateHeadshotParams {
  uploadUrl: string;
  style: string;
  personalInfo: {
    age?: number;
    ethnicity?: string;
    preferences?: string[];
    gender?: string;
    hairColor?: string;
    eyeColor?: string;
  };
}

interface ReplicateJob {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string | string[];
  error?: string;
}

export async function generateHeadshot(params: GenerateHeadshotParams): Promise<{
  success: boolean;
  jobId?: string;
  generationId?: string;
  error?: string;
}> {
  try {
    // Build prompt based on style and personal info
    const prompt = buildPrompt(params.style, params.personalInfo);
    
    console.log('Starting Replicate job with prompt:', prompt);

    // Start Replicate prediction
    const prediction = await replicate.predictions.create({
      version: SDXL_MODEL,
      input: {
        image: params.uploadUrl,
        prompt: prompt,
        negative_prompt: "blurry, low quality, distorted, deformed, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, ugly, bad hands, bad fingers, watermark, signature",
        width: 1024,
        height: 1024,
        guidance_scale: 7.5,
        num_inference_steps: 50,
        scheduler: "K_EULER",
        num_outputs: 1,
        quality: 100,
        lora_scale: 0.6,
      },
    });

    console.log('Replicate prediction created:', prediction.id);

    return {
      success: true,
      jobId: prediction.id,
    };
  } catch (error) {
    console.error('Replicate generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start generation',
    };
  }
}

export async function createGenerationWithReplicate(
  uploadId: string,
  model: string,
  style: string,
  personalInfo: any,
  uploadUrl: string
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

    // Start Replicate job
    const replicateResult = await generateHeadshot({
      uploadUrl,
      style,
      personalInfo,
    });

    if (!replicateResult.success) {
      // Update generation status to failed
      await supabase
        .from('generations')
        .update({ status: 'failed' })
        .eq('id', generation.id);

      return {
        success: false,
        error: replicateResult.error,
      };
    }

    // Update generation with Replicate job ID and set status to processing
    const { data: updatedGeneration, error: updateError } = await supabase
      .from('generations')
      .update({ 
        status: 'processing',
        // Store Replicate job ID in personal_info for tracking
        personal_info: {
          ...personalInfo,
          replicate_job_id: replicateResult.jobId,
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
    console.error('Generation creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create generation',
    };
  }
}

export async function checkReplicateStatus(jobId: string): Promise<ReplicateJob | null> {
  try {
    const prediction = await replicate.predictions.get(jobId);
    
    return {
      id: prediction.id,
      status: prediction.status as ReplicateJob['status'],
      output: prediction.output,
      error: prediction.error,
    };
  } catch (error) {
    console.error('Failed to check Replicate status:', error);
    return null;
  }
}

export async function processReplicateWebhook(payload: {
  id: string;
  status: string;
  output?: string | string[];
  error?: string;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log('Processing Replicate webhook:', payload);

    // Find generation by Replicate job ID
    const { data: generations, error: findError } = await supabase
      .from('generations')
      .select('*')
      .contains('personal_info', { replicate_job_id: payload.id });

    if (findError) throw findError;

    if (!generations || generations.length === 0) {
      console.warn('No generation found for Replicate job:', payload.id);
      return { success: false, error: 'Generation not found' };
    }

    const generation = generations[0];
    let updateData: Partial<Generation> = {};

    switch (payload.status) {
      case 'succeeded':
        updateData = {
          status: 'completed',
          result_url: Array.isArray(payload.output) ? payload.output[0] : payload.output,
          completed_at: new Date().toISOString(),
        };
        break;
      
      case 'failed':
      case 'canceled':
        updateData = {
          status: 'failed',
        };
        break;
      
      case 'processing':
        updateData = {
          status: 'processing',
        };
        break;
      
      default:
        console.log('Unknown status:', payload.status);
        return { success: true }; // Don't update for unknown statuses
    }

    // Update generation in Supabase
    const { error: updateError } = await supabase
      .from('generations')
      .update(updateData)
      .eq('id', generation.id);

    if (updateError) throw updateError;

    console.log('Generation updated successfully:', generation.id);
    return { success: true };
  } catch (error) {
    console.error('Webhook processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Webhook processing failed',
    };
  }
}

export async function pollReplicateJob(jobId: string): Promise<{
  success: boolean;
  status?: string;
  output?: string | string[];
  error?: string;
}> {
  try {
    const job = await checkReplicateStatus(jobId);

    if (!job) {
      return {
        success: false,
        error: 'Failed to fetch job status',
      };
    }

    return {
      success: true,
      status: job.status,
      output: job.output,
      error: job.error,
    };
  } catch (error) {
    console.error('Polling error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Polling failed',
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
