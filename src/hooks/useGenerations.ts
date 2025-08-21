// src/hooks/useGenerations.ts

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Generation } from '../types/supabase';

interface GenerationState {
  generations: Generation[];
  loading: boolean;
  error: string | null;
}

interface CreateGenerationParams {
  uploadId: string;
  model: string;
  style?: string;
  personalInfo?: {
    age?: number;
    ethnicity?: string;
    preferences?: string[];
  };
}

export function useGenerations() {
  const [state, setState] = useState<GenerationState>({
    generations: [],
    loading: false,
    error: null,
  });

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const createGeneration = async (params: CreateGenerationParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase
        .from('generations')
        .insert({
          upload_id: params.uploadId,
          model: params.model,
          style: params.style,
          personal_info: params.personalInfo,
          status: 'queued',
        })
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        generations: [data, ...prev.generations],
        loading: false,
      }));

      return { success: true, generation: data };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create generation';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  const getGenerationsByUpload = async (uploadId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('upload_id', uploadId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        generations: data || [],
        loading: false,
      }));

      return { success: true, generations: data || [] };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch generations';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  const getGenerationById = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        loading: false,
      }));

      return { success: true, generation: data };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch generation';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  const updateGenerationStatus = async (
    id: string, 
    status: Generation['status'],
    resultUrl?: string
  ) => {
    try {
      const updateData: Partial<Generation> = { status };
      
      if (status === 'completed' && resultUrl) {
        updateData.result_url = resultUrl;
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('generations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        generations: prev.generations.map(gen => 
          gen.id === id ? data : gen
        ),
      }));

      return { success: true, generation: data };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update generation status';
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  const pollGenerationStatus = (id: string, onStatusChange?: (generation: Generation) => void) => {
    // Clear existing polling
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    pollIntervalRef.current = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('generations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Polling error:', error);
          return;
        }

        // Update state
        setState(prev => ({
          ...prev,
          generations: prev.generations.map(gen => 
            gen.id === id ? data : gen
          ),
        }));

        // Call callback if provided
        if (onStatusChange) {
          onStatusChange(data);
        }

        // Stop polling if generation is complete or failed
        if (data.status === 'completed' || data.status === 'failed') {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000); // Poll every 3 seconds

    // Return cleanup function
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  return {
    generations: state.generations,
    loading: state.loading,
    error: state.error,
    createGeneration,
    getGenerationsByUpload,
    getGenerationById,
    updateGenerationStatus,
    pollGenerationStatus,
    stopPolling,
  };
}
