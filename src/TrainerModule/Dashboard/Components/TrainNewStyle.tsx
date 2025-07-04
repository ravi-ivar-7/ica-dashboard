import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Image, 
  Video, 
  Music, 
  Zap, 
  Settings, 
  Sliders, 
  AlertTriangle, 
  Info, 
  Eye, 
  EyeOff, 
  Sparkles,
  Clock
} from 'lucide-react';
import { toast } from '@/CommonModule/Contexts/ToastContext';

// Step types
type StepType = 'info' | 'upload' | 'config' | 'review' | 'training';

// Style type
interface StyleFormData {
  name: string;
  description: string;
  type: 'image' | 'video' | 'audio';
  category: string;
  isPublic: boolean;
  baseModel: string;
  learningRate: number;
  trainingSteps: number;
  resolution: string;
  advancedMode: boolean;
  rank: number;
  optimizer: string;
  termsAccepted: boolean;
}

// Training file type
interface TrainingFile {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  progress?: number;
  error?: string;
}

interface TrainNewStyleProps {
  onClose: () => void;
  onStyleCreated?: (styleId: string) => void;
}

export default function TrainNewStyle({ onClose, onStyleCreated }: TrainNewStyleProps) {
  // Current step state
  const [currentStep, setCurrentStep] = useState<StepType>('info');
  
  // Form data state
  const [formData, setFormData] = useState<StyleFormData>({
    name: '',
    description: '',
    type: 'image',
    category: 'portrait',
    isPublic: false,
    baseModel: 'stable-diffusion-xl',
    learningRate: 0.0001,
    trainingSteps: 1000,
    resolution: '1024',
    advancedMode: false,
    rank: 4,
    optimizer: 'adam',
    termsAccepted: false
  });
  
  // Training files state
  const [trainingFiles, setTrainingFiles] = useState<TrainingFile[]>([]);
  
  // Training progress state
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStatus, setTrainingStatus] = useState('');
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Process accepted files
    if (acceptedFiles.length > 0) {
      const newFiles = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        status: 'pending' as const
      }));
      
      setTrainingFiles(prev => [...prev, ...newFiles]);
    }
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(rejection => {
        const { file, errors } = rejection;
        toast.error(`${file.name} could not be uploaded`, {
          subtext: errors.map((e: any) => e.message).join(', '),
          duration: 5000
        });
      });
    }
  }, []);
  
  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'video/mp4': [],
      'video/quicktime': []
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    maxFiles: 20
  });
  
  // Remove a training file
  const removeFile = (index: number) => {
    setTrainingFiles(prev => {
      const newFiles = [...prev];
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };
  
  // Validate current step
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 'info':
        if (!formData.name.trim()) {
          newErrors.name = 'Style name is required';
        }
        if (!formData.type) {
          newErrors.type = 'Style type is required';
        }
        break;
        
      case 'upload':
        if (trainingFiles.length < 5) {
          newErrors.files = 'At least 5 files are required for training';
        }
        break;
        
      case 'config':
        if (!formData.baseModel) {
          newErrors.baseModel = 'Base model is required';
        }
        if (formData.trainingSteps < 100) {
          newErrors.trainingSteps = 'Training steps must be at least 100';
        }
        break;
        
      case 'review':
        if (!formData.termsAccepted) {
          newErrors.termsAccepted = 'You must accept the terms to proceed';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Navigate to next step
  const nextStep = () => {
    if (!validateStep()) return;
    
    switch (currentStep) {
      case 'info':
        setCurrentStep('upload');
        break;
      case 'upload':
        setCurrentStep('config');
        break;
      case 'config':
        setCurrentStep('review');
        break;
      case 'review':
        startTraining();
        break;
    }
  };
  
  // Navigate to previous step
  const prevStep = () => {
    switch (currentStep) {
      case 'upload':
        setCurrentStep('info');
        break;
      case 'config':
        setCurrentStep('upload');
        break;
      case 'review':
        setCurrentStep('config');
        break;
      case 'training':
        // Can't go back from training
        break;
    }
  };
  
  // Start the training process
  const startTraining = () => {
    setCurrentStep('training');
    setIsTraining(true);
    setTrainingStatus('Initializing training environment...');
    setTrainingProgress(0);
    setTrainingLogs(['Starting training process...']);
    setEstimatedTimeRemaining('Calculating...');
    
    // Simulate training progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 2;
      if (progress <= 100) {
        setTrainingProgress(Math.min(Math.round(progress), 100));
        
        // Update estimated time
        const remainingPercentage = 100 - progress;
        const secondsPerPercent = 6; // Adjust based on your actual training speed
        const secondsRemaining = Math.round(remainingPercentage * secondsPerPercent);
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        setEstimatedTimeRemaining(`${minutes}m ${seconds}s`);
        
        // Add log messages at certain points
        if (progress > 10 && trainingLogs.length === 1) {
          setTrainingLogs(prev => [...prev, 'Analyzing training images...']);
        }
        if (progress > 25 && trainingLogs.length === 2) {
          setTrainingLogs(prev => [...prev, 'Extracting style features...']);
        }
        if (progress > 40 && trainingLogs.length === 3) {
          setTrainingLogs(prev => [...prev, 'Training LoRA weights...']);
        }
        if (progress > 60 && trainingLogs.length === 4) {
          setTrainingLogs(prev => [...prev, 'Optimizing model parameters...']);
        }
        if (progress > 80 && trainingLogs.length === 5) {
          setTrainingLogs(prev => [...prev, 'Finalizing model...']);
        }
        if (progress > 95 && trainingLogs.length === 6) {
          setTrainingLogs(prev => [...prev, 'Saving model to storage...']);
        }
      } else {
        clearInterval(interval);
        setTrainingProgress(100);
        setTrainingStatus('Training complete!');
        setTrainingLogs(prev => [...prev, 'Training completed successfully!']);
        setEstimatedTimeRemaining('0m 0s');
        
        // Simulate a new style ID
        const newStyleId = `style-${Date.now()}`;
        
        // Notify parent component
        if (onStyleCreated) {
          onStyleCreated(newStyleId);
        }
        
        // Show success toast
        toast.success('Style training completed!', {
          subtext: 'Your new style is now ready to use',
          duration: 5000
        });
      }
    }, 300);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  };
  
  // Render step indicator
  const renderStepIndicator = () => {
    const steps: StepType[] = ['info', 'upload', 'config', 'review', 'training'];
    const stepLabels: Record<StepType, string> = {
      info: 'Style Info',
      upload: 'Upload',
      config: 'Configure',
      review: 'Review',
      training: 'Training'
    };
    
    return (
      <div className="flex items-center justify-between mb-6 px-2">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full 
              ${currentStep === step 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : steps.indexOf(currentStep) > index 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white/10 text-white/50'
              }
              transition-all duration-300
            `}>
              {steps.indexOf(currentStep) > index ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-xs font-bold">{index + 1}</span>
              )}
            </div>
            <span className={`
              text-xs mt-1 font-medium
              ${currentStep === step 
                ? 'text-white' 
                : steps.indexOf(currentStep) > index 
                  ? 'text-green-400' 
                  : 'text-white/50'
              }
            `}>
              {stepLabels[step]}
            </span>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden sm:block absolute left-0 right-0 h-0.5 bg-white/10" style={{
                width: `${100 / (steps.length - 1)}%`,
                left: `${(index + 0.5) * (100 / steps.length)}%`,
                top: '1rem',
                transform: 'translateY(-50%)'
              }}></div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'info':
        return renderInfoStep();
      case 'upload':
        return renderUploadStep();
      case 'config':
        return renderConfigStep();
      case 'review':
        return renderReviewStep();
      case 'training':
        return renderTrainingStep();
      default:
        return null;
    }
  };
  
  // Render info step
  const renderInfoStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-white font-semibold text-sm mb-1">
          Style Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Professional Portrait, Cinematic Film"
          className={`
            w-full bg-white/10 border rounded-lg px-3 py-2 text-white placeholder-white/50 
            focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all
            ${errors.name ? 'border-red-500' : 'border-white/20'}
          `}
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <label className="block text-white font-semibold text-sm mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your style to help you remember what it's for"
          rows={3}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all resize-none"
        />
      </div>
      
      <div>
        <label className="block text-white font-semibold text-sm mb-1">
          Style Type <span className="text-red-400">*</span>
        </label>
        <div className="flex space-x-3">
          {[
            { value: 'image', label: 'Image', icon: <Image className="w-4 h-4" /> },
            { value: 'video', label: 'Video', icon: <Video className="w-4 h-4" /> },
            { value: 'audio', label: 'Audio', icon: <Music className="w-4 h-4" /> }
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: type.value as any }))}
              className={`
                flex-1 py-2 rounded-lg text-center font-semibold transition-colors flex items-center justify-center space-x-2
                ${formData.type === type.value 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20'
                }
              `}
            >
              {type.icon}
              <span>{type.label}</span>
            </button>
          ))}
        </div>
        {errors.type && <p className="text-red-400 text-xs mt-1">{errors.type}</p>}
      </div>
      
      <div>
        <label className="block text-white font-semibold text-sm mb-1">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all"
        >
          {formData.type === 'image' && (
            <>
              <option value="portrait" className="bg-gray-900">Portrait</option>
              <option value="landscape" className="bg-gray-900">Landscape</option>
              <option value="product" className="bg-gray-900">Product</option>
              <option value="anime" className="bg-gray-900">Anime</option>
              <option value="abstract" className="bg-gray-900">Abstract</option>
            </>
          )}
          {formData.type === 'video' && (
            <>
              <option value="cinematic" className="bg-gray-900">Cinematic</option>
              <option value="animation" className="bg-gray-900">Animation</option>
              <option value="motion" className="bg-gray-900">Motion Graphics</option>
            </>
          )}
          {formData.type === 'audio' && (
            <>
              <option value="music" className="bg-gray-900">Music</option>
              <option value="voice" className="bg-gray-900">Voice</option>
              <option value="sfx" className="bg-gray-900">Sound Effects</option>
            </>
          )}
        </select>
      </div>
      
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="isPublic"
          name="isPublic"
          checked={formData.isPublic}
          onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
          className="h-4 w-4 rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-400 focus:ring-1"
        />
        <label htmlFor="isPublic" className="text-white text-sm">
          Make this style public and shareable with other users
        </label>
      </div>
    </div>
  );
  
  // Render upload step
  const renderUploadStep = () => (
    <div className="space-y-4">
      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-yellow-300 font-semibold text-sm mb-1">Training Requirements</h3>
            <ul className="text-yellow-200/80 text-xs space-y-1">
              <li>• Upload 5-20 high-quality reference files</li>
              <li>• Ensure consistent style across all references</li>
              <li>• For best results, use similar lighting and composition</li>
              <li>• Maximum file size: 20MB per file</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-purple-500 bg-purple-500/10' 
            : 'border-white/30 hover:border-purple-500/50 hover:bg-white/5'
          }
          ${errors.files ? 'border-red-500' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg mb-3">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Drag & drop files here</h3>
          <p className="text-white/70 text-sm mb-2">or click to browse</p>
          <p className="text-white/50 text-xs">
            {formData.type === 'image' ? 'JPG, PNG, WebP (max 20MB each)' : 
             formData.type === 'video' ? 'MP4, MOV (max 20MB each)' : 
             'MP3, WAV (max 20MB each)'}
          </p>
        </div>
      </div>
      {errors.files && <p className="text-red-400 text-xs">{errors.files}</p>}
      
      {/* File Previews */}
      {trainingFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold text-sm">Selected Files ({trainingFiles.length})</h4>
            <button 
              onClick={() => setTrainingFiles([])}
              className="text-white/60 hover:text-white text-xs hover:underline"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {trainingFiles.map((file, index) => (
              <div 
                key={index} 
                className="relative group bg-white/10 border border-white/20 rounded-lg overflow-hidden"
              >
                <img 
                  src={file.preview} 
                  alt={file.file.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="bg-red-500/80 text-white p-1 rounded-full hover:bg-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2 text-xs text-white truncate">
                  {file.file.name.length > 15 
                    ? file.file.name.substring(0, 12) + '...' 
                    : file.file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
  // Render config step
  const renderConfigStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-white font-semibold text-sm mb-1">
          Base Model <span className="text-red-400">*</span>
        </label>
        <select
          name="baseModel"
          value={formData.baseModel}
          onChange={handleChange}
          className={`
            w-full bg-white/10 border rounded-lg px-3 py-2 text-white 
            focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all
            ${errors.baseModel ? 'border-red-500' : 'border-white/20'}
          `}
        >
          {formData.type === 'image' && (
            <>
              <option value="stable-diffusion-xl" className="bg-gray-900">Stable Diffusion XL</option>
              <option value="midjourney-v6" className="bg-gray-900">Midjourney v6</option>
              <option value="dall-e-3" className="bg-gray-900">DALL-E 3</option>
            </>
          )}
          {formData.type === 'video' && (
            <>
              <option value="runway-gen3" className="bg-gray-900">Runway Gen-3</option>
              <option value="pika-labs" className="bg-gray-900">Pika Labs</option>
              <option value="stable-video" className="bg-gray-900">Stable Video Diffusion</option>
            </>
          )}
          {formData.type === 'audio' && (
            <>
              <option value="musicgen-large" className="bg-gray-900">MusicGen Large</option>
              <option value="audiocraft" className="bg-gray-900">AudioCraft</option>
              <option value="bark" className="bg-gray-900">Bark</option>
            </>
          )}
        </select>
        {errors.baseModel && <p className="text-red-400 text-xs mt-1">{errors.baseModel}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-semibold text-sm mb-1">
            Learning Rate
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              name="learningRate"
              min="0.00001"
              max="0.001"
              step="0.00001"
              value={formData.learningRate}
              onChange={handleChange}
              className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-white/70 text-xs w-16 text-right">
              {formData.learningRate.toExponential(4)}
            </span>
          </div>
          <p className="text-white/50 text-xs mt-1">Controls how quickly the model adapts to your style</p>
        </div>
        
        <div>
          <label className="block text-white font-semibold text-sm mb-1">
            Training Steps <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              name="trainingSteps"
              min="100"
              max="2000"
              step="100"
              value={formData.trainingSteps}
              onChange={handleChange}
              className={`
                flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-purple-500
                ${errors.trainingSteps ? 'border-red-500' : ''}
              `}
            />
            <span className="text-white/70 text-xs w-16 text-right">
              {formData.trainingSteps}
            </span>
          </div>
          <p className="text-white/50 text-xs mt-1">More steps = better quality but longer training time</p>
          {errors.trainingSteps && <p className="text-red-400 text-xs mt-1">{errors.trainingSteps}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-white font-semibold text-sm mb-1">
          Resolution
        </label>
        <select
          name="resolution"
          value={formData.resolution}
          onChange={handleChange}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all"
        >
          <option value="512" className="bg-gray-900">512 × 512</option>
          <option value="768" className="bg-gray-900">768 × 768</option>
          <option value="1024" className="bg-gray-900">1024 × 1024</option>
        </select>
        <p className="text-white/50 text-xs mt-1">Higher resolution = better quality but more resource intensive</p>
      </div>
      
      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-purple-400" />
          <span className="text-white font-semibold text-sm">Advanced Settings</span>
        </div>
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, advancedMode: !prev.advancedMode }))}
          className="text-white/70 hover:text-white text-xs flex items-center space-x-1"
        >
          {formData.advancedMode ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hide</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Show</span>
            </>
          )}
        </button>
      </div>
      
      {formData.advancedMode && (
        <div className="space-y-4 bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold text-sm mb-1">
                LoRA Rank
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  name="rank"
                  min="1"
                  max="128"
                  step="1"
                  value={formData.rank}
                  onChange={handleChange}
                  className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-white/70 text-xs w-8 text-right">
                  {formData.rank}
                </span>
              </div>
              <p className="text-white/50 text-xs mt-1">Controls model complexity and capacity</p>
            </div>
            
            <div>
              <label className="block text-white font-semibold text-sm mb-1">
                Optimizer
              </label>
              <select
                name="optimizer"
                value={formData.optimizer}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all"
              >
                <option value="adam" className="bg-gray-900">Adam</option>
                <option value="adamw" className="bg-gray-900">AdamW</option>
                <option value="sgd" className="bg-gray-900">SGD</option>
                <option value="lion" className="bg-gray-900">Lion</option>
              </select>
              <p className="text-white/50 text-xs mt-1">Advanced: Different optimizers affect training dynamics</p>
            </div>
          </div>
          
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-blue-300 text-xs">
                Advanced settings are recommended for experienced users only. The default values work well for most cases.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  // Render review step
  const renderReviewStep = () => (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-white font-semibold text-sm mb-3">Style Information</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <p className="text-white/50 text-xs">Name:</p>
            <p className="text-white text-sm">{formData.name}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">Type:</p>
            <p className="text-white text-sm capitalize">{formData.type}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">Category:</p>
            <p className="text-white text-sm capitalize">{formData.category}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">Visibility:</p>
            <p className="text-white text-sm">{formData.isPublic ? 'Public' : 'Private'}</p>
          </div>
          {formData.description && (
            <div className="col-span-2">
              <p className="text-white/50 text-xs">Description:</p>
              <p className="text-white text-sm">{formData.description}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-white font-semibold text-sm mb-3">Training Files</h3>
        <p className="text-white/70 text-xs mb-2">{trainingFiles.length} files selected</p>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {trainingFiles.slice(0, 12).map((file, index) => (
            <div key={index} className="relative aspect-square rounded-md overflow-hidden">
              <img 
                src={file.preview} 
                alt={`Training file ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {trainingFiles.length > 12 && (
            <div className="aspect-square rounded-md bg-white/10 flex items-center justify-center">
              <span className="text-white text-xs">+{trainingFiles.length - 12} more</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-white font-semibold text-sm mb-3">Training Configuration</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <p className="text-white/50 text-xs">Base Model:</p>
            <p className="text-white text-sm">{formData.baseModel}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">Learning Rate:</p>
            <p className="text-white text-sm">{formData.learningRate.toExponential(4)}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">Training Steps:</p>
            <p className="text-white text-sm">{formData.trainingSteps}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">Resolution:</p>
            <p className="text-white text-sm">{formData.resolution} × {formData.resolution}</p>
          </div>
          {formData.advancedMode && (
            <>
              <div>
                <p className="text-white/50 text-xs">LoRA Rank:</p>
                <p className="text-white text-sm">{formData.rank}</p>
              </div>
              <div>
                <p className="text-white/50 text-xs">Optimizer:</p>
                <p className="text-white text-sm">{formData.optimizer}</p>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-white font-semibold text-sm mb-3">Estimated Training Time</h3>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-purple-400" />
          <span className="text-white text-sm">
            {Math.round(formData.trainingSteps / 200)} - {Math.round(formData.trainingSteps / 100)} minutes
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="termsAccepted"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
          className={`
            h-4 w-4 rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-400 focus:ring-1
            ${errors.termsAccepted ? 'border-red-500' : ''}
          `}
        />
        <label htmlFor="termsAccepted" className="text-white text-sm">
          I confirm that I own the rights to these files and accept the <a href="#" className="text-purple-400 hover:underline">terms of service</a>
        </label>
      </div>
      {errors.termsAccepted && <p className="text-red-400 text-xs">{errors.termsAccepted}</p>}
    </div>
  );
  
  // Render training step
  const renderTrainingStep = () => (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm flex items-center">
            <Zap className="w-4 h-4 text-purple-400 mr-2" />
            Training Progress
          </h3>
          <div className="text-white/70 text-xs flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>Remaining: {estimatedTimeRemaining}</span>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/70 text-xs">{trainingStatus}</span>
            <span className="text-white font-semibold text-xs">{trainingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${trainingProgress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-black/30 rounded-lg p-3 h-32 overflow-y-auto font-mono text-xs">
          {trainingLogs.map((log, index) => (
            <div key={index} className="mb-1 last:mb-0">
              <span className="text-green-400">[{new Date().toLocaleTimeString()}]</span>{' '}
              <span className="text-white/80">{log}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-white font-semibold text-sm mb-3">Training Information</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <p className="text-white/50 text-xs">Style Name:</p>
            <p className="text-white text-sm">{formData.name}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">Base Model:</p>
            <p className="text-white text-sm">{formData.baseModel}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">Training Files:</p>
            <p className="text-white text-sm">{trainingFiles.length} files</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">Training Steps:</p>
            <p className="text-white text-sm">{formData.trainingSteps}</p>
          </div>
        </div>
      </div>
      
      {trainingProgress === 100 && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 text-center">
          <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-emerald-400 font-bold text-lg mb-1">Training Complete!</h3>
          <p className="text-emerald-300/80 text-sm mb-3">
            Your new style is ready to use. You can now generate content with it.
          </p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold px-6 py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Go to Styles Gallery
          </button>
        </div>
      )}
    </div>
  );
  
  // Render navigation buttons
  const renderNavButtons = () => {
    if (currentStep === 'training') {
      return (
        <div className="flex justify-end mt-6">
          {trainingProgress === 100 && (
            <button
              type="button"
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          )}
        </div>
      );
    }
    
    return (
      <div className="flex justify-between mt-6">
        {currentStep !== 'info' ? (
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
        
        <button
          type="button"
          onClick={nextStep}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <span>{currentStep === 'review' ? 'Start Training' : 'Next'}</span>
          {currentStep !== 'review' && <ChevronRight className="w-4 h-4" />}
          {currentStep === 'review' && <Zap className="w-4 h-4" />}
        </button>
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-3xl bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/20 rounded-xl p-5 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Train New Style</h2>
              <p className="text-white/60 text-xs">Create your custom AI style</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Step Indicator */}
        <div className="relative mb-4 flex-shrink-0">
          {renderStepIndicator()}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {renderStepContent()}
        </div>
        
        {/* Navigation */}
        <div className="mt-4 pt-4 border-t border-white/10 flex-shrink-0">
          {renderNavButtons()}
        </div>
      </div>
    </div>
  );
}