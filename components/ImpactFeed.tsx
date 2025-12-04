import React, { useState, useMemo, useEffect } from 'react';
import { ImpactStory } from '../types';
import { Calendar, Heart, Play, Image as ImageIcon, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  stories: ImpactStory[];
  forceExpanded?: boolean; // New prop to force "Campaign Mode"
}

const StoryCard = React.memo<{ story: ImpactStory, index: number, forceExpanded?: boolean }>(({ story, index, forceExpanded }) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getYouTubeId = (input: string) => {
    if (!input) return null;
    let url = input;

    if (input.includes('<iframe') && input.includes('src="')) {
        const srcMatch = input.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) {
            url = srcMatch[1];
        }
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const processImageUrl = (url: string | undefined) => {
    if (!url) return undefined;
    if (url.includes('freeimage.host/i/')) {
        const parts = url.split('/').filter(Boolean);
        const id = parts[parts.length - 1];
        if (id) return `https://iili.io/${id}.jpg`;
    }
    return url;
  };

  const videoId = getYouTubeId(story.imageUrl || '');
  const isVideo = !!videoId;

  useEffect(() => {
    setHasError(false);
    if (videoId) {
        setImgSrc(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    } else {
        setImgSrc(processImageUrl(story.imageUrl) || '');
    }
  }, [story.imageUrl, videoId]);

  const handleImageError = () => {
    if (videoId && imgSrc.includes('maxresdefault')) {
        setImgSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    } else {
        setHasError(true);
    }
  };

  const handlePlay = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsPlaying(true);
  };

  const description = story.description || '';
  const shouldTruncate = description.length > 150;

  return (
     <div 
        className={`flex flex-col bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-black/30 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/10 transition-all duration-300 group border border-gray-100 dark:border-slate-700 w-full h-full ${isExpanded ? 'row-span-2' : ''}`}
     >
        {/* Media Container - Aspect Ratio 16:9 */}
        <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-slate-900 relative flex-shrink-0">
          {isPlaying && videoId ? (
             <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&origin=${window.location.origin}`}
                title={story.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
             ></iframe>
          ) : !hasError && imgSrc ? (
            <>
                <img 
                  src={imgSrc} 
                  alt={story.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  loading="lazy"
                  onError={handleImageError}
                />
                {isVideo && (
                    <div 
                        className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors cursor-pointer z-10"
                        onClick={handlePlay}
                    >
                        <div className="w-16 h-16 rounded-full bg-red-600 shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-7 h-7 text-white fill-current ml-1" />
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none"></div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 dark:opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #00629B 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
               
               <div className="relative z-10 flex flex-col items-center p-6 text-center">
                  <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-sm mb-4 border border-blue-100 dark:border-slate-600">
                     <ImageIcon className="w-8 h-8 text-blue-400 dark:text-blue-300" />
                  </div>
                  <span className="text-xs font-bold tracking-widest text-blue-900 dark:text-blue-200 uppercase mb-1">Impact Update</span>
                  <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
               </div>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow bg-white dark:bg-slate-800">
            <div className="flex-none flex items-center text-xs font-bold text-[#00629B] dark:text-blue-400 uppercase tracking-wider mb-3 bg-blue-50 dark:bg-blue-900/20 inline-flex self-start px-3 py-1 rounded-full">
                <Calendar className="w-3 h-3 mr-2" />
                {story.date}
            </div>
            
            <h3 className="flex-none text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-[#00629B] dark:group-hover:text-blue-400 transition-colors font-heading">
                {story.title}
            </h3>
            
            <div className="flex-1 relative">
                <p className={`text-gray-500 dark:text-gray-400 leading-relaxed text-sm pr-1 transition-all duration-300 ${isExpanded ? '' : 'line-clamp-4'}`}>
                    {description}
                </p>
            </div>

            <div className="flex-none mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/50">
              {shouldTruncate && (
                  <button 
                      onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(!isExpanded);
                      }}
                      className="text-xs font-bold uppercase tracking-wider text-[#00629B] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors focus:outline-none flex items-center gap-1"
                  >
                      {isExpanded ? (
                        <>Show Less <ChevronUp className="w-3 h-3" /></>
                      ) : (
                        <>Read Full Story <ChevronDown className="w-3 h-3" /></>
                      )}
                  </button>
              )}
            </div>
        </div>
     </div>
  );
});

export const ImpactFeed: React.FC<Props> = React.memo(({ stories, forceExpanded = false }) => {
  const [isAllVisible, setIsAllVisible] = useState(false);

  // If forceExpanded is true (Campaign Page), we are always "visible"
  const isVisibleState = forceExpanded || isAllVisible;

  const sortedStories = useMemo(() => {
    return [...stories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [stories]);

  if (stories.length === 0) return null;

  // Layout Logic:
  const visibleCount = 5;
  const showExpandCard = !isVisibleState && sortedStories.length > visibleCount;
  
  // If visible, show all. If not, show first 5.
  const displayedStories = isVisibleState ? sortedStories : sortedStories.slice(0, visibleCount);

  return (
    <div id="impact" className="py-24 transition-colors duration-500 bg-transparent border-t-0 border-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Only show on Homepage/Default mode. Campaign page has its own header. */}
        {!forceExpanded && (
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal">
                <div className="max-w-3xl">
                    <div className="inline-block p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 mb-4">
                        <Heart className="w-8 h-8 text-[#00629B] dark:text-blue-400 fill-current" />
                    </div>
                    <h2 className="text-4xl font-extrabold tracking-tight font-heading text-gray-900 dark:text-white">Relief in Action</h2>
                    <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                    Real stories from the ground showing the tangible impact of your generosity.
                    </p>
                </div>
                
                <div className="hidden md:block">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[#00629B] dark:text-blue-400 shadow-sm">
                        {sortedStories.length} Updates Posted
                    </span>
                </div>
            </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
           {displayedStories.map((story, index) => {
             const animationClass = (isVisibleState && index >= visibleCount) 
                ? 'animate-appear' 
                : 'reveal delay-100';

             return (
               <div key={story.id} className={`h-full ${animationClass}`}>
                  <StoryCard story={story} index={index} />
               </div>
             );
           })}

           {/* "See More" Card - Only if not expanded */}
           {showExpandCard && (
             <button
               onClick={() => setIsAllVisible(true)}
               className="group relative flex flex-col items-center justify-center h-full min-h-[400px] rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-[#00629B] dark:hover:border-blue-400 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl animate-appear w-full"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center p-8 text-center">
                   <div className="w-20 h-20 rounded-full bg-[#00629B]/10 dark:bg-blue-400/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <ArrowRight className="w-8 h-8 text-[#00629B] dark:text-blue-400" />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-heading">
                     View All Updates
                   </h3>
                   <p className="text-gray-500 dark:text-gray-400">
                     Read {sortedStories.length - visibleCount} more stories about our relief efforts.
                   </p>
                </div>
             </button>
           )}
        </div>

        {/* Collapse Button - Only show if we expanded manually (NOT forced mode) */}
        {!forceExpanded && isAllVisible && sortedStories.length > visibleCount && (
            <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button 
                    onClick={() => {
                        setIsAllVisible(false);
                        document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center px-8 py-3 rounded-full bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold text-sm shadow-md hover:shadow-lg border border-gray-200 dark:border-slate-700 hover:text-[#00629B] dark:hover:text-blue-400 transition-all"
                >
                    Show Less <ChevronUp className="w-4 h-4 ml-2" />
                </button>
            </div>
        )}

      </div>
    </div>
  );
});