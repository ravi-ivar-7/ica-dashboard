import { Video, Sparkles, ChevronRight } from 'lucide-react';

export default function StatsSection({ projects }: { projects: any[] }) {
  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-4 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{projects.length}</h3>
              <p className="text-white/60 text-sm">Total Projects</p>
            </div>
          </div>
        </div>


        <a href="/learn/cineflow" className="block">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">Learn CineFlow</h3>
                <p className="text-white/60 text-sm">Watch tutorial</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/60" />
            </div>
          </div>
        </a>

      </div>
    </div>
  );
}