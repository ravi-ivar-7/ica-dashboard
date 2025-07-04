import React from 'react';
import { CanvasElementType } from '../../Types/Cineflow';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BasePropertiesPanel } from './BasePropertiesPanel';
import { TextProperties } from './TextProperties';
import { ImageProperties } from './ImageProperties';
import { VideoProperties } from './VideoProperties';
import { AudioProperties } from './AudioProperties';

interface PropertiesPanelProps {
  selectedElement: CanvasElementType | null;
  onUpdateElement: (id: string, updates: Partial<CanvasElementType>) => void;
  onDeleteElement: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}
interface PropertiesPanelProps {
  selectedElement: CanvasElementType | null;
  onUpdateElement: (id: string, updates: Partial<CanvasElementType>) => void;
  onDeleteElement: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  isCollapsed = false,
  onToggleCollapse
}) => {
  if (!selectedElement) {
    if (isCollapsed) {
      return (
        <div className="h-full bg-gray-900/80 border-l border-white/10 w-10 flex flex-col">
          <div className="p-1 border-b border-white/10 flex justify-center">
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Expand panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-white/30 text-xs writing-mode-vertical transform rotate-180">
              No selection
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full bg-gray-900/80 border-l border-white/10 p-3 flex items-center justify-center overflow-y-auto">
        <div className="flex flex-col items-center">
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors mb-4"
              title="Collapse panel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <p className="text-white/50 text-xs text-center">Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

 

  return (
    <BasePropertiesPanel
      selectedElement={selectedElement}
      onUpdateElement={onUpdateElement}
      onDeleteElement={onDeleteElement}
      onToggleCollapse={onToggleCollapse}
    >
      {selectedElement.type === 'text' && (
        <TextProperties 
          element={selectedElement} 
          onUpdateElement={onUpdateElement} 
        />
      )}
      {selectedElement.type === 'image' && (
        <ImageProperties 
          element={selectedElement} 
          onUpdateElement={onUpdateElement} 
        />
      )}
      {selectedElement.type === 'video' && (
        <VideoProperties 
          element={selectedElement} 
          onUpdateElement={onUpdateElement} 
        />
      )}
      {selectedElement.type === 'audio' && (
        <AudioProperties 
          element={selectedElement} 
          onUpdateElement={onUpdateElement} 
        />
      )}
    </BasePropertiesPanel>
  );
};

export default PropertiesPanel;