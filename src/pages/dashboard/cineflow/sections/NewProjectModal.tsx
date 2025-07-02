import { useState } from 'react';
import { Film, X, Zap } from 'lucide-react';
import { CineFlowProject, AspectRatio } from '../../../../types/cineflow';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: CineFlowProject) => void;
}

const allowedRatios: AspectRatio[] = ['16:9', '9:16', '1:1', '4:3', '21:9'];

export default function NewProjectModal({ isOpen, onClose, onCreateProject }: NewProjectModalProps) {
  const [formData, setFormData] = useState<Pick<CineFlowProject, 'name' | 'description' | 'aspectRatio' | 'tags'>>({
    name: '',
    description: '',
    aspectRatio: '16:9',
    tags: []
  });

  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCreate = () => {
    const now = new Date().toISOString();
    const newProject: CineFlowProject = {
      id: `cf${Date.now()}`,
      name: formData.name,
      description: formData.description,
      aspectRatio: formData.aspectRatio,
      tags: formData.tags,
      duration: 0,
      createdAt: now,
      updatedAt: now,
      status: 'draft',
      elements: [],
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    };

    onCreateProject(newProject);
    onClose();
  };

  if (!isOpen) return null;

return (
  <div className="fixed inset-0 z-50 grid place-items-center p-2 sm:p-4">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

    <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900/95 to-black/95 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl mx-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
          <Film className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-amber-400" />
          New CineFlow
        </h2>
        <button onClick={onClose} className="p-1.5 sm:p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-white/80 text-xs sm:text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Project name"
            className="w-full bg-white/10 border border-white/20 rounded-lg sm:rounded-xl px-3 py-2 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-white/80 text-xs sm:text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description"
            className="w-full bg-white/10 border border-white/20 rounded-lg sm:rounded-xl px-3 py-2 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-white/80 text-xs sm:text-sm font-medium mb-1">Aspect Ratio</label>
          <div className="grid grid-cols-3 gap-2">
            {allowedRatios.map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setFormData({ ...formData, aspectRatio: ratio })}
                className={`py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl font-medium transition-colors ${
                  formData.aspectRatio === ratio
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-xs sm:text-sm font-medium mb-1">Tags</label>
          <div className="flex gap-2 mb-1">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add tag"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl px-3 py-1.5 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-amber-400"
            />
            <button type="button" onClick={handleAddTag} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg sm:rounded-xl text-sm">
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-1">
            {formData.tags.map((tag, index) => (
              <div key={index} className="bg-white/10 text-white/80 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                <span>{tag}</span>
                <button type="button" onClick={() => handleRemoveTag(tag)} className="text-white/60 hover:text-white">
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
        <button onClick={onClose} className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white">
          Cancel
        </button>
        <button
          onClick={handleCreate}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold px-4 py-1.5 sm:px-6 sm:py-2 rounded-lg sm:rounded-xl hover:scale-[1.02] transition-all duration-200 shadow flex items-center gap-1 text-xs sm:text-sm"
        >
          <Zap className="w-4 h-4" />
          <span>Create</span>
        </button>
      </div>
    </div>
  </div>
);
}
