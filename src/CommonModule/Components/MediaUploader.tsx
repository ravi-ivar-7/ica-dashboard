import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  X, 
  File, 
  Image, 
  Video, 
  Music, 
  AlertCircle, 
  Check, 
  Cloud, 
  FolderOpen,
  Search,
  Grid,
  List,
  Download,
  ExternalLink,
  Filter
} from 'lucide-react';
import { Asset } from '@/AssetsModule/Types/assets';
import { mockApi } from '../APIs/api';
import LoadingSpinner from './LoadingSpinner';

interface MediaUploaderProps {
  onFilesAccepted: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  maxSize?: number; // in bytes
  title?: string;
  description?: string;
  className?: string;
  mediaType: 'image' | 'video' | 'audio';
  onClose: () => void;
}

type UploadSource = 'device' | 'drive' | 'assets';

export default function MediaUploader({
  onFilesAccepted,
  acceptedFileTypes = [],
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024, // 100MB default
  title = 'Upload Media',
  description = 'Select files to upload',
  className = '',
  mediaType,
  onClose
}: MediaUploaderProps) {
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [previewFiles, setPreviewFiles] = useState<Array<{ file: File, preview: string }>>([]);
  const [activeSource, setActiveSource] = useState<UploadSource>('device');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [assetViewMode, setAssetViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ready' | 'processing' | 'failed'>('all');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch assets when the assets tab is selected
  React.useEffect(() => {
    if (activeSource === 'assets') {
      setLoading(true);
      // For demo purposes, use mock data
      const mockAssets = mockApi.getAssets().filter(asset => asset.type === mediaType);
      setAssets(mockAssets);
      
      // Simulate API delay
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [activeSource, mediaType]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle accepted files
    if (acceptedFiles.length > 0) {
      // Create previews for accepted files
      const newPreviews = acceptedFiles.map(file => {
        // Create preview URLs for images and videos
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          return {
            file,
            preview: URL.createObjectURL(file)
          };
        }
        
        // For non-image/video files, we'll just show an icon based on type
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
  }, []);

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

  const handleAssetToggle = (id: string) => {
    setSelectedAssets(prev => 
      prev.includes(id) 
        ? prev.filter(assetId => assetId !== id) 
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (activeSource === 'device' && previewFiles.length > 0) {
      onFilesAccepted(previewFiles.map(pf => pf.file));
      onClose();
    } else if (activeSource === 'assets' && selectedAssets.length > 0) {
      // In a real app, we would fetch the actual files from the server
      // For demo purposes, just show a success message
      onClose();
    } else if (activeSource === 'drive') {
      // In a real app, we would handle Google Drive integration
      // For demo purposes, just show a success message
      onClose();
    }
  };

  // Filter assets based on search and filter
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = searchQuery === '' || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || asset.status === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Get the appropriate title and description based on media type
  const getMediaTypeInfo = () => {
    switch (mediaType) {
      case 'image':
        return {
          title: title || 'Upload Images',
          description: description || 'JPG, PNG, WebP, SVG (max 10MB each)',
          acceptedTypes: 'JPG, PNG, WebP, SVG'
        };
      case 'video':
        return {
          title: title || 'Upload Videos',
          description: description || 'MP4, MOV, AVI (max 100MB each)',
          acceptedTypes: 'MP4, MOV, AVI'
        };
      case 'audio':
        return {
          title: title || 'Upload Audio',
          description: description || 'MP3, WAV, OGG (max 50MB each)',
          acceptedTypes: 'MP3, WAV, OGG'
        };
      default:
        return {
          title: title || 'Upload Files',
          description: description || 'Select files to upload',
          acceptedTypes: 'Various formats'
        };
    }
  };

  const mediaInfo = getMediaTypeInfo();

  return (
    <div className={className}>
      {/* Tabs for upload sources */}
      <div className="flex mb-6 bg-white/5 rounded-xl p-1">
        <button
          onClick={() => setActiveSource('device')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-colors ${
            activeSource === 'device' 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
              : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload from Device</span>
        </button>
        
        <button
          onClick={() => setActiveSource('drive')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-colors ${
            activeSource === 'drive' 
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
              : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>Import from Drive</span>
        </button>
        
        <button
          onClick={() => setActiveSource('assets')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-colors ${
            activeSource === 'assets' 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
              : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Choose from Assets</span>
        </button>
      </div>

      {/* Content based on active source */}
      {activeSource === 'device' && (
        <>
          <div 
            {...getRootProps()} 
            className={`
              border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all mb-4
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
              <h3 className="text-white font-bold text-lg mb-2">{mediaInfo.title}</h3>
              <p className="text-white/70 text-base mb-2">{mediaInfo.description}</p>
              <p className="text-white/50 text-sm">
                Drag & drop or click to browse
              </p>
            </div>
          </div>

          {/* File Previews */}
          {previewFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-semibold text-base mb-2">Selected Files ({previewFiles.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
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
        </>
      )}

      {activeSource === 'drive' && (
        <div className="bg-white/5 rounded-xl p-6 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl inline-block mb-4">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Import from Google Drive</h3>
          <p className="text-white/70 text-base mb-6">Connect your Google Drive account to import files</p>
          
          <button className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center space-x-2 mx-auto">
            <ExternalLink className="w-4 h-4" />
            <span>Connect to Google Drive</span>
          </button>
          
          <p className="text-white/50 text-sm mt-4">
            This feature is coming soon. Stay tuned for updates!
          </p>
        </div>
      )}

      {activeSource === 'assets' && (
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${mediaType}s...`}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border-white/20 text-white placeholder-white/50 border focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex rounded-lg overflow-hidden">
                <button
                  onClick={() => setAssetViewMode('grid')}
                  className={`p-1.5 ${
                    assetViewMode === 'grid' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  } transition-colors`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setAssetViewMode('list')}
                  className={`p-1.5 ${
                    assetViewMode === 'list' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  } transition-colors`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative">
                <button
                  className="p-1.5 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white rounded-lg transition-colors"
                  aria-label="Filter"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Assets Grid/List */}
          <div className="bg-white/5 rounded-xl p-4 max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="sm" text={`Loading ${mediaType}s...`} />
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-8 h-8 text-white/30 mx-auto mb-2" />
                <p className="text-white/70">
                  {searchQuery 
                    ? `No ${mediaType}s found matching your search` 
                    : `No ${mediaType}s available`}
                </p>
              </div>
            ) : (
              <div className={assetViewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-3 gap-3" 
                : "space-y-2"
              }>
                {filteredAssets.map((asset) => (
                  <div 
                    key={asset.id} 
                    onClick={() => handleAssetToggle(asset.id)}
                    className={`
                      cursor-pointer transition-all duration-200
                      ${assetViewMode === 'grid' 
                        ? 'relative rounded-lg overflow-hidden group' 
                        : 'flex items-center space-x-3 p-2 rounded-lg'
                      }
                      ${selectedAssets.includes(asset.id) 
                        ? 'ring-2 ring-purple-500 bg-purple-500/10' 
                        : assetViewMode === 'grid' ? '' : 'hover:bg-white/5'
                      }
                    `}
                  >
                    {assetViewMode === 'grid' ? (
                      <>
                        <img 
                          src={asset.thumbnail} 
                          alt={asset.name}
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-xs font-medium truncate">{asset.name}</p>
                        </div>
                        {selectedAssets.includes(asset.id) && (
                          <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <img 
                            src={asset.thumbnail} 
                            alt={asset.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {selectedAssets.includes(asset.id) && (
                            <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-1">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate">{asset.name}</p>
                          <p className="text-white/50 text-xs">{asset.size}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Selected Assets Count */}
          {selectedAssets.length > 0 && (
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-2 text-center">
              <p className="text-purple-400 text-sm font-semibold">
                {selectedAssets.length} {mediaType}{selectedAssets.length > 1 ? 's' : ''} selected
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors text-base"
        >
          Cancel
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={(activeSource === 'device' && previewFiles.length === 0) || 
                   (activeSource === 'assets' && selectedAssets.length === 0) ||
                   (activeSource === 'drive')}
          className={`
            font-bold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg flex items-center space-x-2 text-base
            ${(activeSource === 'device' && previewFiles.length === 0) || 
              (activeSource === 'assets' && selectedAssets.length === 0) ||
              (activeSource === 'drive')
              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              : activeSource === 'device'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105'
                : activeSource === 'assets'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-105'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:scale-105'
            }
          `}
        >
          <Check className="w-5 h-5" />
          <span>
            {activeSource === 'device' 
              ? 'Upload Files' 
              : activeSource === 'assets'
                ? 'Use Selected'
                : 'Import from Drive'
            }
          </span>
        </button>
      </div>
    </div>
  );
}