import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ConsentContextType {
  openConsentModal: (action: () => void) => void;
  hasConsent: () => boolean;
  clearConsent: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
};

interface ConsentProviderProps {
  children: ReactNode;
}

const CONSENT_KEY = 'openmodel_consent_v1';

export const ConsentProvider: React.FC<ConsentProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const hasConsent = useCallback(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    return consent !== null;
  }, []);

  const openConsentModal = useCallback((action: () => void) => {
    if (hasConsent()) {
      // User already has consent, execute action immediately
      action();
    } else {
      // Show modal and store the action to execute after consent
      setPendingAction(() => action);
      setIsModalOpen(true);
    }
  }, [hasConsent]);

  const handleConsentGiven = useCallback(() => {
    // Save consent to localStorage with timestamp
    const consentData = {
      timestamp: new Date().toISOString(),
      version: 1
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));

    // Execute the pending action
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }

    // Close modal
    setIsModalOpen(false);
  }, [pendingAction]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setPendingAction(null);
  }, []);

  const clearConsent = useCallback(() => {
    localStorage.removeItem(CONSENT_KEY);
  }, []);

  return (
    <ConsentContext.Provider value={{ openConsentModal, hasConsent, clearConsent }}>
      {children}
      {isModalOpen && (
        <ConsentModal 
          onConsent={handleConsentGiven}
          onClose={handleModalClose}
        />
      )}
    </ConsentContext.Provider>
  );
};

interface ConsentModalProps {
  onConsent: () => void;
  onClose: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ onConsent, onClose }) => {
  const [checkedItems, setCheckedItems] = useState({
    noImpersonation: false,
    rightsToUpload: false,
    noNSFW: false,
    responsibleUsage: false,
    termsPrivacy: false
  });

  const allChecked = Object.values(checkedItems).every(Boolean);

  const handleCheckboxChange = (key: keyof typeof checkedItems) => {
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleConfirm = () => {
    if (allChecked) {
      onConsent();
    }
  };

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Lock body scroll
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl shadow-black/50 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-3 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">Before You Create</h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white/10 backdrop-blur-xl p-2 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-white/80 text-lg leading-relaxed">
              OpenModel Studio gives you powerful AI tools to generate personal images and videos. 
              To keep the community safe and respectful, please confirm the following points:
            </p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <div className="p-6 sm:p-8">
              {/* Checkboxes */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => handleCheckboxChange('noImpersonation')}
                    className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                      checkedItems.noImpersonation
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500'
                        : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    {checkedItems.noImpersonation && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">No impersonation</h3>
                    <p className="text-white/70 leading-relaxed">
                      I will not create content meant to impersonate any real person without their explicit permission.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => handleCheckboxChange('rightsToUpload')}
                    className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                      checkedItems.rightsToUpload
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500'
                        : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    {checkedItems.rightsToUpload && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">Rights to upload</h3>
                    <p className="text-white/70 leading-relaxed">
                      All photos, videos, or prompts I provide belong to me, my company, or I have full legal rights to use them.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => handleCheckboxChange('noNSFW')}
                    className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                      checkedItems.noNSFW
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500'
                        : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    {checkedItems.noNSFW && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">No NSFW or harmful material</h3>
                    <p className="text-white/70 leading-relaxed">
                      I will not use OpenModel Studio to generate sexually explicit, hateful, violent, or otherwise disallowed content.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => handleCheckboxChange('responsibleUsage')}
                    className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                      checkedItems.responsibleUsage
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500'
                        : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    {checkedItems.responsibleUsage && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">Responsible usage</h3>
                    <p className="text-white/70 leading-relaxed">
                      I understand that any misuse may lead to suspension or a permanent ban from the platform.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => handleCheckboxChange('termsPrivacy')}
                    className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                      checkedItems.termsPrivacy
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500'
                        : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    {checkedItems.termsPrivacy && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">Terms & Privacy</h3>
                    <p className="text-white/70 leading-relaxed">
                      I have read and agree to the{' '}
                      <a href="/terms" className="text-purple-400 hover:text-purple-300 underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="/privacy" className="text-purple-400 hover:text-purple-300 underline">Privacy Policy</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 sm:p-8 border-t border-white/10 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <button
                onClick={onClose}
                className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold px-6 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!allChecked}
                className={`flex-1 font-black px-6 py-4 rounded-2xl transition-all duration-300 ${
                  allChecked
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-black hover:scale-105 shadow-lg'
                    : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Confirm & Continue</span>
                </div>
              </button>
            </div>
            
            {!allChecked && (
              <p className="text-white/50 text-sm text-center mt-4">
                Please check all boxes to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};