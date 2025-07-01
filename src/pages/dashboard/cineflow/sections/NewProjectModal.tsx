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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900/95 to-black/95 border border-white/20 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white flex items-center">
            <Film className="w-6 h-6 mr-2 text-amber-400" />
            Create New CineFlow
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-white/80 text-sm font-semibold mb-2">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white/80 text-sm font-semibold mb-2">Project Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter project description"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-white/80 text-sm font-semibold mb-2">Aspect Ratio</label>
            <div className="flex space-x-3">
              {allowedRatios.map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setFormData({ ...formData, aspectRatio: ratio })}
                  className={`flex-1 py-2.5 rounded-xl text-center font-semibold transition-colors ${formData.aspectRatio === ratio
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                    }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-white/80 text-sm font-semibold mb-2">Tags (optional)</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-amber-400"
              />
              <button type="button" onClick={handleAddTag} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl">
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="bg-white/10 text-white/80 px-2 py-1 rounded-full text-sm flex items-center space-x-1">
                  <span>{tag}</span>
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="text-white/60 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-black font-bold px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2"
          >
            <Zap className="w-5 h-5" />
            <span>Create Project</span>
          </button>
        </div>
      </div>
    </div>
  );
}
