// src/hooks/useUploads.ts

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Upload } from '../types/supabase';

interface UploadState {
  uploads: Upload[];
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

export function useUploads() {
  const [state, setState] = useState<UploadState>({
    uploads: [],
    loading: false,
    error: null,
    uploadProgress: 0,
  });

  const uploadFile = async (file: File, userId: string) => {
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null, 
      uploadProgress: 0 
    }));

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      // Insert upload record into database
      const { data: dbData, error: dbError } = await supabase
        .from('uploads')
        .insert({
          user_id: userId,
          file_url: publicUrl,
          status: 'completed',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setState(prev => ({
        ...prev,
        uploads: [dbData, ...prev.uploads],
        loading: false,
        uploadProgress: 100,
      }));

      return { success: true, upload: dbData };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Upload failed';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        uploadProgress: 0,
      }));

      return { success: false, error: errorMessage };
    }
  };

  const getUserUploads = async (userId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase
        .from('uploads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        uploads: data || [],
        loading: false,
      }));

      return { success: true, uploads: data || [] };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch uploads';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  const updateUploadStatus = async (id: string, status: Upload['status']) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase
        .from('uploads')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({
        ...prev,
        uploads: prev.uploads.map(upload => 
          upload.id === id ? data : upload
        ),
        loading: false,
      }));

      return { success: true, upload: data };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update upload status';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  const deleteUpload = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Get upload info first to delete file from storage
      const { data: upload, error: fetchError } = await supabase
        .from('uploads')
        .select('file_url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Extract file path from URL
      const url = new URL(upload.file_url);
      const filePath = url.pathname.split('/').slice(-2).join('/'); // Get last two segments

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('uploads')
        .remove([filePath]);

      if (storageError) {
        console.warn('Storage deletion failed:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('uploads')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setState(prev => ({
        ...prev,
        uploads: prev.uploads.filter(upload => upload.id !== id),
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete upload';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  };

  return {
    uploads: state.uploads,
    loading: state.loading,
    error: state.error,
    uploadProgress: state.uploadProgress,
    uploadFile,
    getUserUploads,
    updateUploadStatus,
    deleteUpload,
  };
}
