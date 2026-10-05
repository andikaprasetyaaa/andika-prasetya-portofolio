import React, { useState } from 'react';
import { GITHUB_PROJECTS } from '../data/projectsData';
import { Project } from '../types';
import { audioManager } from '../utils/audioManager';
import { Star, ExternalLink, Code2, Sparkles } from 'lucide-react';

interface StrataProjectsProps {
  theme: 'day' | 'night';
  onOpenBlueprint: (project: Project) => void;
}

export const StrataProjects: React.FC<StrataProjectsProps> = ({
  theme,
  onOpenBlueprint,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const isNight = theme === 'night';

  const categories = ['ALL', 'AI / NLP', 'Data & Analytics', 'Automation & Vision', 'E-Commerce'];

  const filteredProjects =
    selectedCategory === 'ALL'
      ? GITHUB_PROJECTS
      : GITHUB_PROJECTS.filter((p) => p.category === selectedCategory);

  const handleCategorySelect = (cat: string) => {
    audioManager.playClickSound();
    setSelectedCategory(cat);
  };

  const renderSchematicVisual = (type: Project['schematicType']) => {
    const strokeColor = isNight ? 'currentColor' : '#1e293b';
    switch (type) {
      case 'nlp':
        return (
          <svg className={`w-full h-full ${isNight ? 'text-indigo-400 opacity-80' : 'text-indigo-700 opacity-90'}`} viewBox="0 0 240 120" fill="none" stroke={strokeColor}>
            <rect x="20" y="20" width="50" height="35" strokeWidth="1.5" />
            <text x="30" y="42" fill={strokeColor} fontSize="9" fontFamily="monospace">INPUT</text>
            <line x1="70" y1="37" x2="100" y2="37" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="100" y="15" width="50" height="45" strokeWidth="1.5" />
            <text x="105" y="42" fill={strokeColor} fontSize="8" fontFamily="monospace">ENCODER</text>
            <line x1="150" y1="37" x2="180" y2="37" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="180" y="20" width="50" height="35" strokeWidth="1.5" />
            <text x="186" y="42" fill={strokeColor} fontSize="8" fontFamily="monospace">ENTAIL</text>
            <circle cx="125" cy="90" r="14" strokeWidth="1.5" />
            <text x="114" y="93" fill={strokeColor} fontSize="7" fontFamily="monospace">NLI</text>
            <line x1="125" y1="60" x2="125" y2="76" strokeWidth="1.5" />
          </svg>
        );
      case 'graph':
        return (
          <svg className={`w-full h-full ${isNight ? 'text-blue-400 opacity-80' : 'text-blue-700 opacity-90'}`} viewBox="0 0 240 120" fill="none" stroke={strokeColor}>
            <circle cx="120" cy="60" r="16" strokeWidth="1.5" />
            <text x="108" y="64" fill={strokeColor} fontSize="8" fontFamily="monospace">UFC</text>
            <circle cx="50" cy="30" r="11" strokeWidth="1.5" />
            <circle cx="190" cy="30" r="11" strokeWidth="1.5" />
            <circle cx="50" cy="90" r="11" strokeWidth="1.5" />
            <circle cx="190" cy="90" r="11" strokeWidth="1.5" />
            <line x1="60" y1="36" x2="105" y2="54" strokeWidth="1.2" />
            <line x1="180" y1="36" x2="135" y2="54" strokeWidth="1.2" />
            <line x1="60" y1="84" x2="105" y2="66" strokeWidth="1.2" />
            <line x1="180" y1="84" x2="135" y2="66" strokeWidth="1.2" />
          </svg>
        );
      case 'dashboard':
        return (
          <svg className={`w-full h-full ${isNight ? 'text-emerald-400 opacity-80' : 'text-emerald-700 opacity-90'}`} viewBox="0 0 240 120" fill="none" stroke={strokeColor}>
            <rect x="25" y="20" width="190" height="80" strokeWidth="1.5" />
            <line x1="25" y1="40" x2="215" y2="40" strokeWidth="1.5" />
            <line x1="85" y1="40" x2="85" y2="100" strokeWidth="1.5" />
            <rect x="35" y="55" width="40" height="8" fill={strokeColor} opacity="0.4" />
            <rect x="35" y="70" width="30" height="8" fill={strokeColor} opacity="0.3" />
            <polyline points="95,85 125,55 155,70 185,45 205,50" strokeWidth="2" />
          </svg>
        );
      case 'vision':
        return (
          <svg className={`w-full h-full ${isNight ? 'text-amber-400 opacity-80' : 'text-amber-700 opacity-90'}`} viewBox="0 0 240 120" fill="none" stroke={strokeColor}>
            <circle cx="120" cy="25" r="8" strokeWidth="1.5" />
            <line x1="120" y1="33" x2="120" y2="70" strokeWidth="1.5" />
            <line x1="120" y1="45" x2="85" y2="55" strokeWidth="1.5" />
            <line x1="120" y1="45" x2="155" y2="35" strokeWidth="1.5" />
            <circle cx="155" cy="35" r="4" fill={strokeColor} />
            <line x1="120" y1="70" x2="95" y2="105" strokeWidth="1.5" />
            <line x1="120" y1="70" x2="140" y2="105" strokeWidth="1.5" />
          </svg>
        );
      case 'pipeline':
        return (
          <svg className={`w-full h-full ${isNight ? 'text-yellow-400 opacity-80' : 'text-yellow-700 opacity-90'}`} viewBox="0 0 240 120" fill="none" stroke={strokeColor}>
            <rect x="20" y="45" width="40" height="30" strokeWidth="1.5" />
            <text x="25" y="63" fill={strokeColor} fontSize="7" fontFamily="monospace">SHOPIFY</text>
            <line x1="60" y1="60" x2="90" y2="60" strokeWidth="1.5" strokeDasharray="2 2" />
            <polygon points="110,40 135,60 110,80 85,60" strokeWidth="1.5" />
            <line x1="135" y1="60" x2="165" y2="60" strokeWidth="1.5" />
            <rect x="165" y="45" width="55" height="30" strokeWidth="1.5" />
            <text x="170" y="63" fill={strokeColor} fontSize="7" fontFamily="monospace">DISPATCH</text>
          </svg>
        );
      case 'pulse':
        return (
          <svg className={`w-full h-full ${isNight ? 'text-rose-400 opacity-80' : 'text-rose-700 opacity-90'}`} viewBox="0 0 240 120" fill="none" stroke={strokeColor}>
            <polyline
              points="15,60 50,60 65,25 80,95 95,45 110,75 125,55 140,60 225,60"
              strokeWidth="2"
            />
            <circle cx="80" cy="95" r="3" fill={strokeColor} className="animate-ping" />
          </svg>
        );
    }
  };

  return (
    <section
      id="strata-labs"
      className={`w-full py-24 px-6 md:px-12 relative border-t-2 transition-colors duration-500 ${
        isNight
          ? 'bg-[#101017] border-slate-800 text-slate-100'
          : 'bg-[#f8fafc] border-slate-300 text-[#0f172a]'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b ${
            isNight ? 'border-slate-800' : 'border-slate-300'
          }`}
        >
          <div>
            <div className="font-silkscreen text-xs text-[#58a038] uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-[#58a038]"></span>
              <span>STRATUM 02 // SUBTERRANEAN RESEARCH LABS [-80m to -320m]</span>
            </div>
            <h2
              className={`font-pixel text-xl md:text-3xl mt-2 ${
                isNight ? 'text-white' : 'text-[#0f172a]'
              }`}
            >
              EXCAVATED SYSTEMS &amp; GITHUB REPOSITORIES
            </h2>
          </div>
          <div
            className={`font-silkscreen text-xs ${
              isNight ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            6 VERIFIED PRODUCTION REPOSITORIES
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3.5 py-1.5 font-silkscreen text-xs uppercase border transition-all ${
                selectedCategory === cat
                  ? 'bg-[#58a038] text-black border-[#86efac] font-bold shadow-md'
                  : isNight
                  ? 'bg-black/40 text-slate-400 border-slate-800 hover:text-white hover:border-slate-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:text-black hover:border-slate-500 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`border-2 p-5 flex flex-col justify-between gap-5 transition-all duration-300 group shadow-lg ${
                isNight
                  ? 'bg-[#161622] border-slate-800 hover:border-[#58a038]'
                  : 'bg-white border-slate-300 hover:border-[#58a038] shadow-sm'
              }`}
            >
              <div className="flex flex-col gap-4">
                {/* Strata Depth Badge & Stars */}
                <div className="flex items-center justify-between font-silkscreen text-[10px]">
                  <span className="text-[#58a038] font-bold">{project.strata}</span>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span
                      className={`flex items-center gap-1 px-2 py-0.5 border font-pixel text-[9px] ${
                        isNight
                          ? 'bg-black/50 border-slate-800 text-yellow-400'
                          : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{project.starsCount}</span>
                    </span>
                    <span className={isNight ? 'text-slate-500' : 'text-slate-400'}>
                      {project.updatedAt}
                    </span>
                  </div>
                </div>

                {/* Wireframe Schematic Viewport */}
                <div
                  className={`w-full h-36 border relative overflow-hidden flex items-center justify-center p-2 transition-colors ${
                    isNight
                      ? 'bg-black/60 border-slate-800 group-hover:border-slate-700'
                      : 'bg-slate-100/70 border-slate-200 group-hover:border-slate-400'
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-80 pointer-events-none ${
                      isNight ? 'from-[#161622]' : 'from-white'
                    }`}
                  ></div>
                  {renderSchematicVisual(project.schematicType)}
                  <div
                    className={`absolute top-2 left-2 font-silkscreen text-[9px] px-2 py-0.5 border flex items-center gap-1 ${
                      isNight
                        ? 'bg-black/80 text-white border-slate-800'
                        : 'bg-white/95 text-slate-800 border-slate-300 shadow-sm'
                    }`}
                  >
                    <Code2 className="w-3 h-3 text-[#58a038]" />
                    <span>{project.category}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3
                    className={`font-pixel text-xs leading-relaxed group-hover:text-[#58a038] transition-colors break-words ${
                      isNight ? 'text-white' : 'text-[#0f172a]'
                    }`}
                  >
                    {project.name}
                  </h3>
                  <p
                    className={`font-silkscreen text-[11px] mt-2 line-clamp-3 leading-relaxed ${
                      isNight ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {project.description}
                  </p>
                </div>

                {/* Language & Stack Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span
                    className={`px-2 py-0.5 border font-silkscreen text-[9px] flex items-center gap-1 ${
                      isNight
                        ? 'bg-black/70 border-slate-800 text-white'
                        : 'bg-slate-100 border-slate-300 text-slate-800'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.langColor }}
                    ></span>
                    {project.language}
                  </span>
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className={`px-2 py-0.5 border font-silkscreen text-[9px] ${
                        isNight
                          ? 'bg-[#20202e] border-slate-800 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="font-silkscreen text-[9px] text-slate-400">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className={`flex gap-2 pt-2 border-t ${
                  isNight ? 'border-slate-800/80' : 'border-slate-200'
                }`}
              >
                <button
                  onClick={() => {
                    audioManager.playPickupSound();
                    onOpenBlueprint(project);
                  }}
                  className={`flex-1 py-2.5 font-pixel text-[9px] uppercase transition-colors flex items-center justify-center gap-1.5 border ${
                    isNight
                      ? 'bg-slate-800 hover:bg-[#58a038] text-white hover:text-black border-slate-700'
                      : 'bg-[#58a038] hover:bg-[#46822c] text-black font-bold border-[#86efac] shadow-sm'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>OPEN BLUEPRINT</span>
                </button>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audioManager.playClickSound()}
                  title="View GitHub Repository"
                  className={`p-2.5 border transition-colors flex items-center justify-center ${
                    isNight
                      ? 'bg-black/60 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                      : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-black border-slate-300 shadow-sm'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};