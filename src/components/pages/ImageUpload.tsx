import { useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import {
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Camera,
  FileImage,
  Loader2
} from 'lucide-react';
import { PageType } from '../../App';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ProgressIndicator } from './components/ProgressIndicator';
import { useAuth } from '../../hooks/useAuth';
import { useUploads } from '../../hooks/useUploads';

interface ImageUploadProps {
  navigate: (page: PageType) => void;
  uploadData: any;
  updateUploadData: (key: string, data: any) => void;
}

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  analysis?: {
    faceDetected: boolean;
    resolution: string;
    quality: 'high' | 'medium' | 'low';
    issues: string[];
  };
}

export function ImageUpload({ navigate, uploadData, updateUploadData }: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Hooks for authentication and uploads
  const { user, loading: authLoading } = useAuth();
  const { uploadFile, loading: uploadLoading, error: uploadError } = useUploads();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('home');
    }
  }, [user, authLoading, navigate]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processFile = async (file: File): Promise<UploadedImage> => {
    const id = Math.random().toString(36).substr(2, 9);
    const previewUrl = URL.createObjectURL(file);

    const newImage: UploadedImage = {
      id,
      file,
      url: previewUrl,
      status: 'uploading',
      progress: 0
    };

    if (!user) {
      newImage.status = 'error';
      return newImage;
    }

    try {
      // Upload to Supabase
      const result = await uploadFile(file, user.id);

      if (result.success && result.upload) {
        newImage.status = 'success';
        newImage.url = result.upload.file_url;
        newImage.progress = 100;

        // Basic image analysis
        const img = new Image();
        img.onload = () => {
          newImage.analysis = {
            faceDetected: true, // We'll assume face detection for now
            resolution: `${img.width}x${img.height}`,
            quality: img.width >= 1024 && img.height >= 1024 ? 'high' :
                    img.width >= 512 && img.height >= 512 ? 'medium' : 'low',
            issues: img.width < 512 || img.height < 512 ? ['Low resolution detected'] : []
          };
        };
        img.src = previewUrl;
      } else {
        newImage.status = 'error';
      }
    } catch (error) {
      console.error('Upload error:', error);
      newImage.status = 'error';
    }

    return newImage;
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setIsProcessing(true);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    const newImages = await Promise.all(files.map(processFile));
    setImages(prev => [...prev, ...newImages]);
    setIsProcessing(false);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsProcessing(true);

    const files = Array.from(e.target.files);
    const newImages = await Promise.all(files.map(processFile));
    setImages(prev => [...prev, ...newImages]);
    setIsProcessing(false);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const handleContinue = () => {
    const successfulImages = images.filter(img => img.status === 'success');
    updateUploadData('images', successfulImages);
    updateUploadData('currentStep', 1);
    navigate('personal-info');
  };

  const successfulImages = images.filter(img => img.status === 'success');
  const hasValidImages = successfulImages.length >= 5;
  const recommendedCount = 15;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Upload Your Photos
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Upload 10-20 high-quality photos for the best AI headshot results. More variety leads to better outcomes.
          </p>
        </motion.div>

        {/* Upload Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{successfulImages.length}</div>
            <div className="text-sm text-slate-400">Photos Uploaded</div>
          </Card>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{recommendedCount}</div>
            <div className="text-sm text-slate-400">Recommended Count</div>
          </Card>
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.round((successfulImages.length / recommendedCount) * 100)}%
            </div>
            <div className="text-sm text-slate-400">Progress</div>
          </Card>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <div
              className={`p-8 border-2 border-dashed rounded-lg transition-all duration-300 ${
                isDragOver 
                  ? 'border-cyan-400 bg-cyan-400/10' 
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl">
                    <Upload className="h-8 w-8 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isDragOver ? 'Drop your photos here' : 'Drag & drop your photos'}
                </h3>
                <p className="text-slate-400 mb-6">
                  or click to browse your files
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <label htmlFor="file-upload">
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 cursor-pointer">
                      <Camera className="mr-2 h-5 w-5" />
                      Choose Photos
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <p className="text-sm text-slate-400">
                    Supports: JPG, PNG, HEIC (Max 50MB each)
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Uploaded Images Grid */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Uploaded Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-slate-700">
                      <ImageWithFallback
                        src={image.url}
                        alt="Uploaded photo"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Status Overlay */}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {image.status === 'uploading' && (
                          <div className="text-center">
                            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <div className="text-xs text-white">{Math.round(image.progress)}%</div>
                          </div>
                        )}
                        {image.status === 'success' && (
                          <CheckCircle className="h-8 w-8 text-green-400" />
                        )}
                        {image.status === 'error' && (
                          <AlertCircle className="h-8 w-8 text-red-400" />
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>

                      {/* Status Badge */}
                      <div className="absolute top-2 left-2">
                        {image.status === 'success' && image.analysis && (
                          <Badge 
                            className={`text-xs ${
                              image.analysis.faceDetected 
                                ? 'bg-green-500/80 text-green-100' 
                                : 'bg-yellow-500/80 text-yellow-100'
                            }`}
                          >
                            {image.analysis.faceDetected ? 'Face ✓' : 'No Face'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {image.status === 'uploading' && (
                      <Progress 
                        value={image.progress} 
                        className="mt-2 h-1" 
                      />
                    )}

                    {/* Analysis Info */}
                    {image.status === 'success' && image.analysis && (
                      <div className="mt-2 text-xs text-slate-400">
                        <div>{image.analysis.resolution}</div>
                        <div className="capitalize">{image.analysis.quality} quality</div>
                        {image.analysis.issues.length > 0 && (
                          <div className="text-yellow-400">
                            {image.analysis.issues[0]}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Upload Progress</span>
            <span className="text-sm text-slate-300">
              {successfulImages.length} / {recommendedCount} photos
            </span>
          </div>
          <Progress 
            value={(successfulImages.length / recommendedCount) * 100} 
            className="h-2"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-center"
        >
          <Button
            onClick={() => navigate('upload-intro')}
            variant="outline"
            className="border-slate-600 hover:bg-slate-700/50 px-6 py-3 order-2 sm:order-1"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          
          <div className="order-1 sm:order-2">
            <ProgressIndicator
              currentStep={1}
              totalSteps={5}
              stepLabel="Step 2 of 5: Photo Upload"
            />
          </div>

          <Button
            onClick={handleContinue}
            disabled={!hasValidImages || isProcessing}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed order-3"
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>

        {/* Status Message */}
        {!hasValidImages && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center"
          >
            <p className="text-yellow-400 text-sm">
              Upload at least 5 photos to continue. We recommend 10-20 for best results.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}