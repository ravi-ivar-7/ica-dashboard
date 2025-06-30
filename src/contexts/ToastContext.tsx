import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastConfig {
  message: string;
  subtext?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  icon?: React.ReactNode;
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  id?: string;
  color?: string;
}

interface Toast extends Required<Omit<ToastConfig, 'icon'>> {
  icon: React.ReactNode;
  timestamp: number;
  isPaused: boolean;
  progress: number;
}

interface ToastContextType {
  showToast: (config: ToastConfig) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Default configurations for each toast type
const defaultConfigs = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'from-emerald-500 to-green-600',
    duration: 5000
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'from-red-500 to-rose-600',
    duration: 7000
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-600',
    duration: 5000
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'from-yellow-500 to-orange-600',
    duration: 6000
  }
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const showToast = useCallback((config: ToastConfig): string => {
    const id = config.id || generateId();
    const type = config.type || 'info';
    const defaultConfig = defaultConfigs[type];
    
    const toast: Toast = {
      id,
      message: config.message,
      subtext: config.subtext || '',
      type,
      icon: config.icon || defaultConfig.icon,
      duration: config.duration || defaultConfig.duration,
      position: config.position || 'bottom-right',
      color: config.color || defaultConfig.color,
      timestamp: Date.now(),
      isPaused: false,
      progress: 0
    };

    setToasts(prev => {
      // Remove existing toast with same ID if it exists
      const filtered = prev.filter(t => t.id !== id);
      return [...filtered, toast];
    });

    return id;
  }, [generateId]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const pauseToast = useCallback((id: string) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, isPaused: true } : toast
    ));
  }, []);

  const resumeToast = useCallback((id: string) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, isPaused: false } : toast
    ));
  }, []);

  const updateProgress = useCallback((id: string, progress: number) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, progress } : toast
    ));
  }, []);

  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    if (!acc[toast.position]) {
      acc[toast.position] = [];
    }
    acc[toast.position].push(toast);
    return acc;
  }, {} as Record<string, Toast[]>);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, clearAllToasts }}>
      {children}
      
      {/* Render toast containers for each position */}
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <ToastContainer
          key={position}
          position={position as Toast['position']}
          toasts={positionToasts}
          onRemove={removeToast}
          onPause={pauseToast}
          onResume={resumeToast}
          onUpdateProgress={updateProgress}
        />
      ))}
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  position: Toast['position'];
  toasts: Toast[];
  onRemove: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  position,
  toasts,
  onRemove,
  onPause,
  onResume,
  onUpdateProgress
}) => {
  const getPositionClasses = (pos: string) => {
    const baseClasses = 'fixed z-[400] flex flex-col gap-3 p-4 pointer-events-none';
    
    switch (pos) {
      case 'top-left':
        return `${baseClasses} top-0 left-0`;
      case 'top-center':
        return `${baseClasses} top-0 left-1/2 transform -translate-x-1/2`;
      case 'top-right':
        return `${baseClasses} top-0 right-0`;
      case 'bottom-left':
        return `${baseClasses} bottom-0 left-0`;
      case 'bottom-center':
        return `${baseClasses} bottom-0 left-1/2 transform -translate-x-1/2`;
      case 'bottom-right':
        return `${baseClasses} bottom-0 right-0`;
      default:
        return `${baseClasses} bottom-0 right-0`;
    }
  };

  const shouldReverseOrder = position.startsWith('bottom');

  const orderedToasts = shouldReverseOrder 
    ? [...toasts].reverse() 
    : toasts;

  return (
    <div className={getPositionClasses(position)}>
      {orderedToasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          index={index}
          onRemove={onRemove}
          onPause={onPause}
          onResume={onResume}
          onUpdateProgress={onUpdateProgress}
        />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  index: number;
  onRemove: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({
  toast,
  index,
  onRemove,
  onPause,
  onResume,
  onUpdateProgress
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);
  const progressRef = React.useRef(0);
  const startTimeRef = React.useRef(Date.now());
  const animationRef = React.useRef<number>();

  // Show animation on mount
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss timer with progress tracking
  React.useEffect(() => {
    if (toast.duration <= 0) return;

    startTimeRef.current = Date.now();
    progressRef.current = 0;

    const updateProgressAndCheck = () => {
      if (toast.isPaused) {
        animationRef.current = requestAnimationFrame(updateProgressAndCheck);
        return;
      }

      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / toast.duration) * 100, 100);
      
      progressRef.current = progress;
      onUpdateProgress(toast.id, progress);

      if (progress >= 100) {
        handleRemove();
      } else {
        animationRef.current = requestAnimationFrame(updateProgressAndCheck);
      }
    };

    animationRef.current = requestAnimationFrame(updateProgressAndCheck);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [toast.duration, toast.isPaused, toast.id, onUpdateProgress]);

  const handleRemove = React.useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // Match exit animation duration
  }, [toast.id, onRemove]);

  const handleMouseEnter = React.useCallback(() => {
    onPause(toast.id);
  }, [toast.id, onPause]);

  const handleMouseLeave = React.useCallback(() => {
    onResume(toast.id);
    // Reset start time to account for pause duration
    startTimeRef.current = Date.now() - (progressRef.current / 100) * toast.duration;
  }, [toast.id, onResume, toast.duration]);

  return (
    <div
      className={`pointer-events-auto transform transition-all duration-300 ease-out ${
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100 scale-100'
          : toast.position.includes('right')
          ? 'translate-x-full opacity-0 scale-95'
          : toast.position.includes('left')
          ? '-translate-x-full opacity-0 scale-95'
          : 'translate-y-4 opacity-0 scale-95'
      }`}
      style={{
        marginBottom: index > 0 ? '8px' : '0',
        zIndex: 1000 - index
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden min-w-[320px] max-w-[480px]">
        {/* Background gradient accent */}
        <div className={`absolute inset-0 bg-gradient-to-r ${toast.color} opacity-5`} />
        
        {/* Progress bar */}
        {toast.duration > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
            <div
              className={`h-full bg-gradient-to-r ${toast.color} transition-all duration-100 ease-linear`}
              style={{ width: `${toast.progress}%` }}
            />
          </div>
        )}

        <div className="relative p-4 sm:p-6">
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className={`flex-shrink-0 p-2 rounded-xl bg-gradient-to-r ${toast.color} shadow-lg`}>
              <div className="text-white">
                {toast.icon}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white font-bold text-base leading-tight">
                    {toast.message}
                  </p>
                  {toast.subtext && (
                    <p className="text-white/70 text-sm mt-1 leading-relaxed">
                      {toast.subtext}
                    </p>
                  )}
                </div>

                {/* Close button */}
                <button
                  onClick={handleRemove}
                  className="flex-shrink-0 ml-3 p-1 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <X className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hover indicator */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-colors pointer-events-none" />
      </div>
    </div>
  );
};

// Global toast function for easy access
export const showToast = (config: ToastConfig): string => {
  // This will be set by the provider
  return '';
};

// Create a global instance
let globalShowToast: ((config: ToastConfig) => string) | null = null;

export const setGlobalToastFunction = (fn: (config: ToastConfig) => string) => {
  globalShowToast = fn;
};

// Export global function
export const toast = {
  show: (config: ToastConfig) => {
    if (globalShowToast) {
      return globalShowToast(config);
    }
    console.warn('Toast provider not initialized');
    return '';
  },
  success: (message: string, options?: Partial<ToastConfig>) => {
    return toast.show({ message, type: 'success', ...options });
  },
  error: (message: string, options?: Partial<ToastConfig>) => {
    return toast.show({ message, type: 'error', ...options });
  },
  info: (message: string, options?: Partial<ToastConfig>) => {
    return toast.show({ message, type: 'info', ...options });
  },
  warning: (message: string, options?: Partial<ToastConfig>) => {
    return toast.show({ message, type: 'warning', ...options });
  }
};