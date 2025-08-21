// src/lib/aiOrchestrator.ts
// AI service orchestrator that manages job distribution between Replicate and RunPod

import { createGenerationWithReplicate } from './replicate';
import { createGenerationWithRunPod } from './runpod';
import { checkAndIncrementUsage } from './usage';
import { supabase } from './supabaseClient';
import type { Generation } from '../types/supabase';
import type { SubscriptionTier } from '../types/limits';

export type AIProvider = 'replicate' | 'runpod';

interface GenerationParams {
  userId: string;
  uploadId: string;
  model: string;
  style: string;
  personalInfo: any;
  uploadUrl: string;
  webhookUrl?: string;
}

interface AIServiceConfig {
  preferredProvider: AIProvider;
  fallbackProvider?: AIProvider;
  enableLoadBalancing: boolean;
  maxReplicateJobs?: number;
}

// Default configuration
const defaultConfig: AIServiceConfig = {
  preferredProvider: 'runpod', // RunPod for scaling, Replicate as fallback
  fallbackProvider: 'replicate',
  enableLoadBalancing: true,
  maxReplicateJobs: 5, // Limit concurrent Replicate jobs
};

export class AIOrchestrator {
  private config: AIServiceConfig;
  private activeJobs: Map<AIProvider, number> = new Map([
    ['replicate', 0],
    ['runpod', 0],
  ]);

  constructor(config: Partial<AIServiceConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Create a new AI generation job using the best available provider
   */
  async createGeneration(params: GenerationParams): Promise<{
    success: boolean;
    generation?: Generation;
    provider?: AIProvider;
    error?: string;
  }> {
    // First, check and enforce usage limits
    try {
      // Get user's subscription tier
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', params.userId)
        .single();

      if (profileError || !profile) {
        throw new Error('User profile not found');
      }

      const tier = profile.subscription_tier as SubscriptionTier;

      // Check and increment usage
      const usageResult = await checkAndIncrementUsage(params.userId, tier);

      if (!usageResult.allowed) {
        return {
          success: false,
          error: `Generation limit reached for ${tier} plan. You have ${usageResult.remaining} generations remaining. Upgrade to continue.`,
        };
      }

      console.log(`Usage check passed: ${usageResult.remaining} generations remaining`);
    } catch (error) {
      console.error('Usage limit check failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check generation limits',
      };
    }

    const provider = this.selectProvider();

    console.log(`Creating generation with provider: ${provider}`);

    try {
      this.incrementActiveJobs(provider);
      
      let result;
      
      if (provider === 'runpod') {
        result = await createGenerationWithRunPod(
          params.uploadId,
          params.model,
          params.style,
          params.personalInfo,
          params.uploadUrl,
          params.webhookUrl
        );
      } else {
        result = await createGenerationWithReplicate(
          params.uploadId,
          params.model,
          params.style,
          params.personalInfo,
          params.uploadUrl
        );
      }

      if (result.success) {
        return {
          ...result,
          provider,
        };
      }

      // If primary provider fails, try fallback
      if (this.config.fallbackProvider && this.config.fallbackProvider !== provider) {
        console.log(`Primary provider ${provider} failed, trying fallback: ${this.config.fallbackProvider}`);
        
        this.incrementActiveJobs(this.config.fallbackProvider);
        
        if (this.config.fallbackProvider === 'runpod') {
          result = await createGenerationWithRunPod(
            params.uploadId,
            params.model,
            params.style,
            params.personalInfo,
            params.uploadUrl,
            params.webhookUrl
          );
        } else {
          result = await createGenerationWithReplicate(
            params.uploadId,
            params.model,
            params.style,
            params.personalInfo,
            params.uploadUrl
          );
        }

        this.decrementActiveJobs(this.config.fallbackProvider);

        if (result.success) {
          return {
            ...result,
            provider: this.config.fallbackProvider,
          };
        }
      }

      return result;
    } catch (error) {
      console.error('AI orchestrator error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed',
      };
    } finally {
      this.decrementActiveJobs(provider);
    }
  }

  /**
   * Select the best provider based on current load and configuration
   */
  private selectProvider(): AIProvider {
    if (!this.config.enableLoadBalancing) {
      return this.config.preferredProvider;
    }

    const replicateJobs = this.activeJobs.get('replicate') || 0;
    const runpodJobs = this.activeJobs.get('runpod') || 0;

    // If Replicate is at capacity, use RunPod
    if (this.config.maxReplicateJobs && replicateJobs >= this.config.maxReplicateJobs) {
      return 'runpod';
    }

    // Simple load balancing: use the provider with fewer active jobs
    if (this.config.preferredProvider === 'replicate') {
      return replicateJobs <= runpodJobs ? 'replicate' : 'runpod';
    } else {
      return runpodJobs <= replicateJobs ? 'runpod' : 'replicate';
    }
  }

  /**
   * Track active jobs for load balancing
   */
  private incrementActiveJobs(provider: AIProvider): void {
    const current = this.activeJobs.get(provider) || 0;
    this.activeJobs.set(provider, current + 1);
  }

  private decrementActiveJobs(provider: AIProvider): void {
    const current = this.activeJobs.get(provider) || 0;
    this.activeJobs.set(provider, Math.max(0, current - 1));
  }

  /**
   * Get current job statistics
   */
  getJobStats(): {
    replicate: number;
    runpod: number;
    total: number;
  } {
    const replicate = this.activeJobs.get('replicate') || 0;
    const runpod = this.activeJobs.get('runpod') || 0;
    
    return {
      replicate,
      runpod,
      total: replicate + runpod,
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AIServiceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): AIServiceConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const aiOrchestrator = new AIOrchestrator();

// Export convenience function
export async function createAIGeneration(params: GenerationParams): Promise<{
  success: boolean;
  generation?: Generation;
  provider?: AIProvider;
  error?: string;
}> {
  return aiOrchestrator.createGeneration(params);
}
