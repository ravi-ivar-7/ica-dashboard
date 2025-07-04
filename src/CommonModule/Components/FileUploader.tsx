import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image, Video, Music, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFilesAccepted: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  maxSize?: number; // in bytes
  title?: string;
  description?: string;
  className?: string;
}

export default function FileUploader({
  onFilesAccepted,
  acceptedFileTypes = ['image/*', 'video/*', 'audio/*'],
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024, // 100MB default
  title = 'Drag & drop files here',
  description = 'or click to browse',
  className = ''
}: FileUploaderProps) {
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [previewFiles, setPreviewFiles] = useState<Array<{ file: File, preview: string }>>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle accepted files
    if (acceptedFiles.length > 0) {
      onFilesAccepted(acceptedFiles);
      
      // Create previews for accepted files
      const newPreviews = acceptedFiles.map(file => {
        // Create preview URLs for images
        if (file.type.startsWith('image/')) {
          return {
            file,
            preview: URL.createObjectURL(file)
          };
        }
        
        // For non-image files, we'll just show an icon based on type
        return {
          file,
          preview: ''
        };
      });
      
      setPreviewFiles(prev => [...prev, ...newPreviews]);
    }
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(rejection => {
        const { file, errors } = rejection;
        return `${file.name}: ${errors.map((e: any) => e.message).join(', ')}`;
      });
      setFileErrors(errors);
    }
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles,
    maxSize,
  });

  const removeFile = (index: number) => {
    setPreviewFiles(prev => {
      const newFiles = [...prev];
      // Revoke the object URL to avoid memory leaks
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const clearErrors = () => {
    setFileErrors([]);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-pink-400" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="w-5 h-5 text-red-400" />;
    } else if (file.type.startsWith('audio/')) {
      return <Music className="w-5 h-5 text-blue-400" />;
    } else {
      return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className={className}>
      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-purple-500 bg-purple-500/10' 
            : 'border-white/30 hover:border-purple-500/50 hover:bg-white/5'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl mb-3">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
          <p className="text-white/70 text-base mb-2">{description}</p>
          <p className="text-white/50 text-sm">
            Accepted: {acceptedFileTypes.join(', ')} (Max: {maxFiles} files, {(maxSize / (1024 * 1024)).toFixed(0)}MB each)
          </p>
        </div>
      </div>

      {/* File Previews */}
      {previewFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-white font-semibold text-base mb-2">Selected Files ({previewFiles.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {previewFiles.map((fileObj, index) => (
              <div 
                key={index} 
                className="bg-white/10 border border-white/20 rounded-lg p-3 flex items-center space-x-3 group"
              >
                {fileObj.preview ? (
                  <img 
                    src={fileObj.preview} 
                    alt={fileObj.file.name}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                    {getFileIcon(fileObj.file)}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{fileObj.file.name}</p>
                  <p className="text-white/50 text-xs">
                    {(fileObj.file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                
                <button 
                  onClick={() => removeFile(index)}
                  className="text-white/40 hover:text-white/80 p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Messages */}
      {fileErrors.length > 0 && (
        <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-semibold text-base">Upload Errors</h4>
                <button 
                  onClick={clearErrors}
                  className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ul className="space-y-1 text-red-300 text-sm">
                {fileErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}