import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ImpactStory } from '@/types'; 
import { Calendar, Heart, Play, Image as ImageIcon, ArrowRight, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Props {
  stories: ImpactStory[];
  forceExpanded?: boolean;
}

// --- ROBUST IMAGE & VIDEO LOGIC ---

/**
 * Analyzes a raw URL string and returns the best possible preview image URL and video ID (if applicable).
 * Handles:
 * 1. Dirty HTML (iframe/img tags pasted in fields)
 * 2. Google Drive links (converts to thumbnail)
 * 3. YouTube links (extracts ID, returns thumbnail)
 * 4. FreeImage.host (converts to direct iili.io link)
 * 5. Dropbox (converts dl=0 to dl=1)
 */
const getSmartMediaDetails = (rawInput: string | undefined) => {
    if (!rawInput) return { type: 'none', src: '', videoId: null };

    let url = rawInput.trim();

    // 1. Cleanup HTML Snippets (User pasted <iframe src="..."> or <img src="...">)
    if (url.includes('<') && url.includes('>')) {
        const srcMatch = url.match(/src=["'](.*?)["']/);
        if (srcMatch && srcMatch[1]) {
            url = srcMatch[1];
        }
    }

    // 2. Detect YouTube
    // Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch) {
        const id = ytMatch[1];
        return {
            type: 'video',
            src: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`, // Try maxres first
            videoId: id
        };
    }

    // 3. Detect Google Drive
    // Supports: drive.google.com/file/d/ID/view, drive.google.com/open?id=ID
    const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([-\w]{25,})/;
    const driveMatch = url.match(driveRegex);
    if (driveMatch) {
        const id = driveMatch[1];
        // Using Google Drive Thumbnail API
        return {
            type: 'image',
            src: `https://drive.google.com/thumbnail?sz=w1200&id=${id}`,
            videoId: null
        };
    }

    // 4. FreeImage.host / iili.io Fix
    // If user links the viewer page (freeimage.host/i/ID), guess the direct link (iili.io/ID.jpg)
    if (url.includes('freeimage.host/i/')) {
        const parts = url.split('/');
        const id = parts[parts.length - 1];
        if (id && !id.includes('.')) {
            return {
                type: 'image',
                src: `https://iili.io/${id}.jpg`,
                videoId: null
            };
        }
    }

    // 5. Dropbox Fix
    if (url.includes('dropbox.com') && url.includes('dl=0')) {
        return {
            type: 'image',
            src: url.replace('dl=0', 'dl=1'),
            videoId: null
        };
    }

    // Default: Assume direct image link
    return {
        type: 'image',
        src: url,
        videoId: null
    };
};


// --- COMPONENTS ---

const StoryCard = React.memo<{ story: ImpactStory, index: number, forceExpanded?: boolean }>(({ story, index, forceExpanded }) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();
  
  // Calculate media details on mount or change
  const mediaDetails = useMemo(() => getSmartMediaDetails(story.imageUrl), [story.imageUrl]);
  const isVideo = mediaDetails.type === 'video';

  useEffect(() => {
    setHasError(false);
    setIsPlaying(false);
    if (mediaDetails.src) {
        setImgSrc(mediaDetails.src);
    }
  }, [mediaDetails]);

  // Format Date Logic: Handles "StartDate - EndDate" logic
  const formattedDate = useMemo(() => {
      const formatDate = (d: string) => {
          try {
             const date = new Date(d);
             // If invalid date, return original string
             if (isNaN(date.getTime())) return d;
             return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          } catch {
             return d;
          }
      };

      const startString = formatDate(story.date);

      if (story.endDate) {
          const endString = formatDate(story.endDate);
          // Only show range if end date is different from start date
          if (startString !== endString) {
            return `${startString} - ${endString}`;
          }
      }
      return startString;
  }, [story.date, story.endDate]);

  const handleImageError = () => {
    // If YouTube maxres fails, fallback to hqdefault
    if (isVideo && imgSrc.includes('maxresdefault')) {
        setImgSrc(`https://img.youtube.com/vi/${mediaDetails.videoId}/hqdefault.jpg`);
    } else {
        setHasError(true);
    }
  };

  const handlePlay = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsPlaying(true);
  };

  const handleCardClick = () => {
      if (!isPlaying) {
          navigate(`/impact/${story.slug}`);
      }
  };

  const description = story.description || '';

  return (
     <div 
        className={`flex flex-col bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-black/30 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/10 transition-all duration-300 group border border-gray-100 dark:border-slate-700 w-full h-full`}
     >
        {/* Media Container */}
        <div 
            className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-slate-900 relative flex-shrink-0 cursor-pointer"
            onClick={!isVideo ? handleCardClick : undefined}
        >
          {isPlaying && isVideo && mediaDetails.videoId ? (
             <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${mediaDetails.videoId}?autoplay=1&origin=${window.location.origin}`}
                title={story.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 w-full h-full z-20"
             ></iframe>
          ) : !hasError && imgSrc ? (
            <>
                <img 
                  src={imgSrc} 
                  alt={story.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  loading="lazy"
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
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
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none"></div>
            </>
          ) : (
            // Default Placeholder
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
            <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex-none flex items-center text-xs font-bold text-[#00629B] dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                    <Calendar className="w-3 h-3 mr-2" />
                    {formattedDate}
                </div>
                {story.location && (
                    <div className="flex-none flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
                        <MapPin className="w-3 h-3 mr-2" />
                        {story.location}
                    </div>
                )}
            </div>
            
            <Link to={`/impact/${story.slug}`} className="flex-none block group/title">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover/title:text-[#00629B] dark:group-hover/title:text-blue-400 transition-colors font-heading">
                    {story.title}
                </h3>
            </Link>
            
            <div className="flex-1 relative">
                <p className={`text-gray-500 dark:text-gray-400 leading-relaxed text-sm pr-1 transition-all duration-300 line-clamp-4`}>
                    {description}
                </p>
            </div>

            <div className="flex-none mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/50 flex items-center justify-between">
                <Link 
                    to={`/impact/${story.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-[#00629B] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors focus:outline-none flex items-center gap-1"
                >
                    Read Full Story <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
     </div>
  );
});

export const ImpactFeed: React.FC<Props> = React.memo(({ stories, forceExpanded = false }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // If forceExpanded is true (Campaign page), we show everything.
  // If false (Home page), we show top 5 and a link to View All.
  
  const sortedStories = useMemo(() => {
    return [...stories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [stories]);

  if (stories.length === 0) return null;

  const visibleCount = 5;
  const displayedStories = forceExpanded ? sortedStories : sortedStories.slice(0, visibleCount);
  
  // Mobile Auto-Scroll Logic (Only active in carousel mode on mobile when not expanded)
  useEffect(() => {
    if (forceExpanded || !scrollContainerRef.current) return;
    const scrollContainer = scrollContainerRef.current;
    
    const interval = setInterval(() => {
        if (isPaused) return;
        // Don't auto scroll if user is interacting or if it's not the carousel view
        if (window.innerWidth >= 768) return; 

        const scrollAmount = scrollContainer.clientWidth * 0.85; 
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        if (scrollContainer.scrollLeft >= maxScroll - 10) {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, forceExpanded]);


  return (
    <div id="impact" className="py-24 transition-colors duration-500 bg-transparent border-t-0 border-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        {!forceExpanded && (
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 reveal">
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

        {/* --- MOBILE LAYOUT (< md) --- */}
        <div className="md:hidden">
            {!forceExpanded ? (
                // Carousel Mode
                <div 
                    className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 no-scrollbar -mx-4 px-4"
                    ref={scrollContainerRef}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
                >
                    {sortedStories.slice(0, 5).map((story, index) => (
                        <div key={story.id} className="min-w-[85vw] snap-center h-full">
                            <StoryCard story={story} index={index} />
                        </div>
                    ))}
                    
                    {sortedStories.length > 5 && (
                        <div className="min-w-[50vw] snap-center h-full flex items-center">
                            <Link
                                to="/impact"
                                className="w-full h-[300px] rounded-3xl bg-white/50 dark:bg-slate-800/50 border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-center p-6"
                            >
                                <div className="w-12 h-12 rounded-full bg-[#00629B]/10 flex items-center justify-center mb-4">
                                    <ArrowRight className="w-6 h-6 text-[#00629B]" />
                                </div>
                                <span className="font-bold text-[#00629B]">View All Updates</span>
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                // Vertical Stack Mode (When Expanded/Campaign Page)
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {sortedStories.map((story, index) => (
                        <div key={story.id} className="animate-appear">
                            <StoryCard story={story} index={index} forceExpanded={forceExpanded} />
                        </div>
                    ))}
                </div>
            )}

            {!forceExpanded && (
                <div className="mt-6 text-center">
                    <Link 
                        to="/impact"
                        className="inline-flex items-center px-6 py-3 rounded-full bg-[#00629B] text-white font-bold text-sm shadow-lg shadow-blue-500/20"
                    >
                        View All Updates <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            )}
        </div>

        {/* --- DESKTOP LAYOUT (>= md) --- */}
        <div className="hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {displayedStories.map((story, index) => {
                const animationClass = (forceExpanded && index >= visibleCount) 
                    ? 'animate-appear' 
                    : 'reveal delay-100';

                return (
                <div key={story.id} className={`h-full ${animationClass}`}>
                    <StoryCard story={story} index={index} forceExpanded={forceExpanded} />
                </div>
                );
            })}

            {!forceExpanded && sortedStories.length > visibleCount && (
                <Link
                to="/impact"
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
                </Link>
            )}
            </div>
        </div>

      </div>
    </div>
  );
});