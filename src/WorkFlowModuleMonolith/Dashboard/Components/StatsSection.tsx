import { Cpu, Sparkles, ChevronRight } from 'lucide-react';

interface StatsSectionProps {
  items: any[];
  stats?: {
    name: string;
    value: any;
  }[];
}

export default function StatsSection({ items, stats = [] }: StatsSectionProps) {
  const mostUsedModel = stats.find(s => s.name === 'Most Used Model')?.value;
  const topModel =
    mostUsedModel && typeof mostUsedModel === 'object'
      ? Object.entries(mostUsedModel as Record<string, number>)
          .sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0]
      : 'None';

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-4 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{items.length}</h3>
              <p className="text-white/60 text-sm">Total Workflows</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{topModel}</h3>
              <p className="text-white/60 text-sm">Most Used Model</p>
            </div>
          </div>
        </div>

        <a href="/learn/workflows" className="block">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition cursor-pointer">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">Learn Workflows</h3>
                <p className="text-white/60 text-sm">View examples</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/60" />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}