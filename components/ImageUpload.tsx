'use client';

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload: (file: File, cropData?: Crop) => Promise<void>;
  currentImageUrl?: string;
  aspectRatio?: number;
  maxSize?: number; // in MB
  className?: string;
}

export default function ImageUpload({
  onUpload,
  currentImageUrl,
  aspectRatio = 1,
  maxSize = 5,
  className = '',
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
      setShowCrop(true);
    };
    reader.readAsDataURL(file);
  }, [maxSize]);

  const handleCropComplete = useCallback((crop: PixelCrop) => {
    setCrop(crop);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      await onUpload(selectedFile, crop);
      setSelectedFile(null);
      setPreviewUrl(null);
      setShowCrop(false);
      setCrop({
        unit: '%',
        width: 90,
        height: 90,
        x: 5,
        y: 5,
      });
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowCrop(false);
    setError(null);
    setCrop({
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Profile Image */}
      {currentImageUrl && !showCrop && (
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <Image
              src={currentImageUrl}
              alt="Current profile"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover border-4 border-amber-200"
            />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Current profile image
          </p>
        </div>
      )}

      {/* File Input */}
      {!showCrop && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Upload New Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-slate-500 dark:text-slate-400
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-amber-50 file:text-amber-700
                     hover:file:bg-amber-100
                     dark:file:bg-amber-900/30 dark:file:text-amber-300
                     dark:hover:file:bg-amber-900/50"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Max size: {maxSize}MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Crop Interface */}
      {showCrop && previewUrl && (
        <div className="space-y-4">
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Crop your image
            </h3>
            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
                aspect={aspectRatio}
                circularCrop
              >
                <Image
                  ref={imgRef}
                  src={previewUrl}
                  alt="Crop preview"
                  width={128}
                  height={128}
                  className="max-w-full max-h-96 object-contain"
                />
              </ReactCrop>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium
                       hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       dark:focus:ring-offset-slate-800"
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium
                       hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       dark:focus:ring-offset-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 